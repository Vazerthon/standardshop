import { differenceInDays } from "date-fns";
import { db } from "@/lib/db";
import { ShoppingListItem } from "./useShoppingList";

// Number of days considered "recent" for extra scoring boosts.
const RECENT_WINDOW_DAYS = 180;
// Controls how quickly recency impact fades as purchases get older.
const RECENCY_DECAY_DAYS = 90;
// Controls how quickly frequency impact fades for older purchase events.
const FREQUENCY_DECAY_DAYS = 120;
// Extra weight applied to recency when a purchase falls in the recent window.
const RECENT_EVENT_MULTIPLIER = 2.25;
// Extra weight applied to frequency when a purchase falls in the recent window.
const RECENT_FREQUENCY_MULTIPLIER = 1.75;
// Reminder appears once a meaningful fraction of the expected cadence has elapsed.
const DUE_START_RATIO = 0.75;
// Recently purchased items stay hidden for part of their expected cadence.
const COOLDOWN_RATIO = 0.7;
const MIN_COOLDOWN_DAYS = 2;
const MIN_INTERVAL_DAYS = 1;
const MAX_INTERVAL_SAMPLES = 8;

// Relative contribution of each scoring dimension to the final recommendation score.
const SCORE_WEIGHTS = {
  urgency: 0.5,
  confidence: 0.25,
  trend: 0.2,
  seasonality: 0.05,
} as const;

export interface ShoppingRecommendationOptions {
  scoreThreshold?: number;
  now?: Date;
}

interface PurchaseEvent {
  checkedAt: Date;
  quantity: number;
}

interface RawScore {
  recency: number;
  frequency: number;
  seasonality: number;
}

interface RecommendationCandidate {
  itemId: string;
  name: string;
  quantity: number;
  score: RawScore;
  cadence: CadenceModel;
}

interface CadenceModel {
  daysSinceLastPurchase: number;
  typicalIntervalDays: number | null;
  dueStartDays: number | null;
  cooldownDays: number;
  confidence: number;
  urgency: number;
  eligible: boolean;
}

const normalize = (value: number, maxValue: number) => {
  if (maxValue <= 0) return 0;
  return value / maxValue;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const standardDeviation = (values: number[]): number => {
  if (values.length <= 1) return 0;

  const mean = average(values);
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
};

const median = (values: number[]): number => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const circularMonthDistance = (monthA: number, monthB: number) => {
  const diff = Math.abs(monthA - monthB);
  return Math.min(diff, 12 - diff);
};

const seasonalityScore = (events: PurchaseEvent[], now: Date): number => {
  if (events.length < 2) return 0;

  const monthCounts = new Array<number>(12).fill(0);
  const years = new Set<number>();

  for (const event of events) {
    monthCounts[event.checkedAt.getMonth()] += 1;
    years.add(event.checkedAt.getFullYear());
  }

  const dominantMonthCount = Math.max(...monthCounts);
  const dominantMonth = monthCounts.indexOf(dominantMonthCount);
  const concentration = dominantMonthCount / events.length;

  if (concentration < 0.34) return 0;

  const distance = circularMonthDistance(now.getMonth(), dominantMonth);
  const proximityByDistance = [1, 0.8, 0.4];
  const monthProximity = proximityByDistance[distance] ?? 0;

  if (monthProximity === 0) return 0;

  const yearsCovered = years.size;
  const eventsPerYear = yearsCovered > 0 ? events.length / yearsCovered : events.length;
  const isAnnualPattern = yearsCovered >= 2 && eventsPerYear <= 1.4;

  if (isAnnualPattern) {
    return Math.min(1, concentration * 1.25) * monthProximity;
  }

  return concentration * 0.75 * monthProximity;
};

const scoreHistory = (events: PurchaseEvent[], now: Date): RawScore => {
  let recency = 0;
  let frequency = 0;

  for (const event of events) {
    const ageInDays = Math.max(0, differenceInDays(now, event.checkedAt));
    const recencyDecay = Math.exp(-ageInDays / RECENCY_DECAY_DAYS);
    const frequencyDecay = Math.exp(-ageInDays / FREQUENCY_DECAY_DAYS);
    const recentMultiplier = ageInDays <= RECENT_WINDOW_DAYS ? RECENT_EVENT_MULTIPLIER : 1;
    const recentFrequencyMultiplier =
      ageInDays <= RECENT_WINDOW_DAYS ? RECENT_FREQUENCY_MULTIPLIER : 1;

    recency += recencyDecay * recentMultiplier;
    frequency += frequencyDecay * recentFrequencyMultiplier;
  }

  return {
    recency,
    frequency,
    seasonality: seasonalityScore(events, now),
  };
};

const buildCadenceModel = (events: PurchaseEvent[], now: Date): CadenceModel => {
  if (events.length === 0) {
    return {
      daysSinceLastPurchase: 0,
      typicalIntervalDays: null,
      dueStartDays: null,
      cooldownDays: MIN_COOLDOWN_DAYS,
      confidence: 0,
      urgency: 0,
      eligible: false,
    };
  }

  const sortedEvents = [...events].sort(
    (a, b) => a.checkedAt.getTime() - b.checkedAt.getTime(),
  );
  const lastPurchase = sortedEvents[sortedEvents.length - 1].checkedAt;
  const daysSinceLastPurchase = Math.max(0, differenceInDays(now, lastPurchase));

  if (sortedEvents.length < 2) {
    return {
      daysSinceLastPurchase,
      typicalIntervalDays: null,
      dueStartDays: null,
      cooldownDays: MIN_COOLDOWN_DAYS,
      confidence: 0,
      urgency: 0,
      eligible: false,
    };
  }

  const allIntervals = sortedEvents
    .slice(1)
    .map((event, index) =>
      Math.max(
        MIN_INTERVAL_DAYS,
        differenceInDays(event.checkedAt, sortedEvents[index].checkedAt),
      ),
    );

  const recentIntervals = allIntervals.slice(-MAX_INTERVAL_SAMPLES);
  const typicalIntervalDays = median(recentIntervals);
  const dueStartDays = Math.max(
    MIN_INTERVAL_DAYS,
    Math.floor(typicalIntervalDays * DUE_START_RATIO),
  );
  const cooldownDays = Math.max(
    MIN_COOLDOWN_DAYS,
    Math.floor(typicalIntervalDays * COOLDOWN_RATIO),
  );
  const variability =
    average(recentIntervals) > 0
      ? standardDeviation(recentIntervals) / average(recentIntervals)
      : 1;
  const stability = clamp(1 - variability, 0, 1);
  const volume = clamp(recentIntervals.length / 4, 0, 1);
  const confidence = clamp(volume * 0.6 + stability * 0.4, 0, 1);
  const eligible =
    daysSinceLastPurchase >= dueStartDays &&
    daysSinceLastPurchase >= cooldownDays;
  const urgency = eligible
    ? Math.max(
        0.15,
        clamp(
          (daysSinceLastPurchase - dueStartDays) /
            Math.max(MIN_INTERVAL_DAYS, typicalIntervalDays * 0.5),
          0,
          1,
        ),
      )
    : 0;

  return {
    daysSinceLastPurchase,
    typicalIntervalDays,
    dueStartDays,
    cooldownDays,
    confidence,
    urgency,
    eligible,
  };
};

const averageQuantity = (events: PurchaseEvent[]) => {
  if (events.length === 0) return 1;

  const total = events.reduce((sum, event) => sum + event.quantity, 0);
  return Math.max(1, Math.round(total / events.length));
};

const mapPurchaseEvents = (shopListItems: ShoppingListItem[]): PurchaseEvent[] =>
  (shopListItems || [])
    .map((shopListItem: ShoppingListItem) => {
      const checkedAt = toDate(shopListItem?.checkedAt);
      if (!checkedAt) return null;

      const quantity =
        typeof shopListItem?.quantity === "number" && shopListItem.quantity > 0
          ? shopListItem.quantity
          : 1;

      return {
        checkedAt,
        quantity,
      } as PurchaseEvent;
    })
    .filter(Boolean) as PurchaseEvent[];

const toShoppingListItems = (
  candidates: RecommendationCandidate[],
  scoreThreshold: number,
): ShoppingListItem[] => {
  const eligibleCandidates = candidates.filter((candidate) => candidate.cadence.eligible);
  if (eligibleCandidates.length === 0) return [];

  const maxRecency = Math.max(
    ...eligibleCandidates.map((candidate) => candidate.score.recency),
  );
  const maxFrequency = Math.max(
    ...eligibleCandidates.map((candidate) => candidate.score.frequency),
  );
  const maxSeasonality = Math.max(
    ...eligibleCandidates.map((candidate) => candidate.score.seasonality),
  );

  return eligibleCandidates
    .map((candidate) => {
      const recency = normalize(candidate.score.recency, maxRecency);
      const frequency = normalize(candidate.score.frequency, maxFrequency);
      const seasonality = normalize(candidate.score.seasonality, maxSeasonality);
      const trend = recency * 0.45 + frequency * 0.55;

      const totalScore =
        candidate.cadence.urgency * SCORE_WEIGHTS.urgency +
        candidate.cadence.confidence * SCORE_WEIGHTS.confidence +
        trend * SCORE_WEIGHTS.trend +
        seasonality * SCORE_WEIGHTS.seasonality;

      return {
        ...candidate,
        totalScore,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .filter((candidate) =>  candidate.totalScore > (scoreThreshold ?? 0))
    .map((candidate, index) => ({
      id: `rec-${candidate.itemId}`,
      itemId: candidate.itemId,
      name: candidate.name,
      quantity: candidate.quantity,
      sortOrder: index + 1,
      checkedAt: null,
    }));
};

export const useShoppingRecommendations = (
  options: ShoppingRecommendationOptions = {},
) => {
  const scoreThreshold = options.scoreThreshold ?? 0;
  const now = options.now ?? new Date();

  const {
    isLoading: isHistoryLoading,
    error: historyError,
    data: historyData,
  } = db.useQuery({
    items: {
      shopListItems: {
        $: {
          where: {
            checkedAt: { $isNull: false },
          },
        },
      },
    },
  });

  const {
    isLoading: isUncheckedLoading,
    error: uncheckedError,
    data: uncheckedData,
  } = db.useQuery({
    shopListItems: {
      $: {
        where: {
          checkedAt: { $isNull: true },
          deletedAt: { $isNull: true },
        },
      },
      item: {},
    },
  });

  const excludedItemIds = new Set<string>(
    (uncheckedData?.shopListItems || [])
      .map((shopListItem: any) => shopListItem?.item?.id)
      .filter(Boolean),
  );

  const candidates: RecommendationCandidate[] = (historyData?.items || [])
    .map((item: any) => {
      if (!item?.id || !item?.name || excludedItemIds.has(item.id)) {
        return null;
      }

      const events = mapPurchaseEvents(item?.shopListItems || []);
      if (events.length === 0) {
        return null;
      }

      return {
        itemId: item.id,
        name: item.name,
        quantity: averageQuantity(events),
        score: scoreHistory(events, now),
        cadence: buildCadenceModel(events, now),
      } as RecommendationCandidate;
    })
    .filter(Boolean) as RecommendationCandidate[];

  return {
    recommendations: toShoppingListItems(candidates, scoreThreshold),
    loading: isHistoryLoading || isUncheckedLoading,
    error: (historyError || uncheckedError) as Error | null,
  };
};
