import { db, id } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

export interface TaskCompletion {
  id: string;
  completedAt: Date;
  note?: string;
}
export interface Task {
  id: string;
  title: string;
  frequencyDays?: number;
  description?: string;
  completions: TaskCompletion[];
  daysSinceLastCompletion?: number;
  minutesSinceLastCompletion?: number;
  daysUntilNextDue?: number;
  distanceSinceLastCompletionLabel?: string;
  completedInLast10Minutes?: boolean;
  mostRecentCompletion?: TaskCompletion;
}

const distanceSinceLastCompletion = (
  mostRecent: TaskCompletion | undefined,
): { label: string; days: number; minutes: number } | undefined => {
  if (!mostRecent) return undefined;
  const mostRecentCompletionDate = new Date(mostRecent.completedAt);

  if (!mostRecentCompletionDate) return undefined;

  return {
    label: formatDistanceToNow(mostRecentCompletionDate, { addSuffix: true }),
    days: Math.floor(
      (Date.now() - mostRecentCompletionDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
    minutes: Math.floor(
      (Date.now() - mostRecentCompletionDate.getTime()) / (1000 * 60),
    ),
  };
};

const completedInLast10Minutes = (mostRecent: TaskCompletion | undefined) => {
  if (!mostRecent) return false;
  const completedAt = new Date(mostRecent.completedAt);
  const now = new Date();
  const diffInMinutes = (now.getTime() - completedAt.getTime()) / 60000;
  return diffInMinutes < 10;
};

const getMostRecentCompletion = (
  completions: TaskCompletion[],
): TaskCompletion | undefined => {
  if (!completions || completions.length === 0) return undefined;
  return completions.reduce((latest, current) =>
    current.completedAt > latest.completedAt ? current : latest,
  );
};

const mapTasksWithCompletions = (data: any): Task[] =>
  data?.tasks.map((item: any): Task => {
    const mostRecentCompletion = getMostRecentCompletion(item?.completions);

    const { label, days, minutes } =
      distanceSinceLastCompletion(mostRecentCompletion) || {};

    return {
      id: item.id,
      title: item?.title,
      frequencyDays: item?.frequency,
      description: item?.description,
      daysSinceLastCompletion: days,
      minutesSinceLastCompletion: minutes,
      daysUntilNextDue:
        item?.frequency && days !== undefined
          ? item.frequency - days
          : undefined,
      distanceSinceLastCompletionLabel: label,
      completions:
        item?.completions
          ?.filter((historyItem: any) => !historyItem.deletedAt)
          .map((historyItem: any) => ({
            id: historyItem.id,
            completedAt: new Date(historyItem.completedAt),
            note: historyItem.note,
          })) || [],
      completedInLast10Minutes: completedInLast10Minutes(mostRecentCompletion),
      mostRecentCompletion,
    };
  }) || [];

export type TaskTabKey =
  | "all"
  | "overdue"
  | "frequent"
  | "weekly"
  | "monthly"
  | "monthlyPlus"
  | "yearlyPlus"
  | "oneOff";

export interface TaskTab {
  key: TaskTabKey;
  label: string;
  filter: (task: Task) => boolean;
}

export const TASK_TABS: TaskTab[] = [
  { key: "all", label: "All", filter: () => true },
  {
    key: "overdue",
    label: "Overdue",
    filter: (t) => t.daysUntilNextDue !== undefined && t.daysUntilNextDue < 0,
  },
  {
    key: "frequent",
    label: "Frequent",
    filter: (t) =>
      t.frequencyDays !== undefined &&
      t.frequencyDays > 0 &&
      t.frequencyDays < 7,
  },
  {
    key: "weekly",
    label: "Weekly",
    filter: (t) =>
      t.frequencyDays !== undefined &&
      t.frequencyDays >= 7 &&
      t.frequencyDays < 30,
  },
  {
    key: "monthly",
    label: "Monthly",
    filter: (t) => t.frequencyDays === 30,
  },
  {
    key: "monthlyPlus",
    label: "Monthly+",
    filter: (t) =>
      t.frequencyDays !== undefined &&
      t.frequencyDays > 30 &&
      t.frequencyDays < 365,
  },
  {
    key: "yearlyPlus",
    label: "Yearly+",
    filter: (t) => t.frequencyDays !== undefined && t.frequencyDays >= 365,
  },
  {
    key: "oneOff",
    label: "One off",
    filter: (t) => t.frequencyDays === undefined || t.frequencyDays === 0,
  },
];

/** Sort by urgency: most overdue first, nulls (no due date) last */
const sortByUrgency = (a: Task, b: Task): number => {
  const aDue = a.daysUntilNextDue;
  const bDue = b.daysUntilNextDue;
  if (aDue === undefined && bDue === undefined)
    return a.title.localeCompare(b.title);
  if (aDue === undefined) return 1;
  if (bDue === undefined) return -1;
  return aDue - bDue;
};

export const getFilteredTasks = (tasks: Task[], tabKey: TaskTabKey): Task[] => {
  const tab = TASK_TABS.find((t) => t.key === tabKey);
  if (!tab) return tasks;
  return tasks.filter(tab.filter).sort(sortByUrgency);
};

export const getTabCounts = (tasks: Task[]): Record<TaskTabKey, number> => {
  const counts = {} as Record<TaskTabKey, number>;
  for (const tab of TASK_TABS) {
    counts[tab.key] = tasks.filter(tab.filter).length;
  }
  return counts;
};

export const useTasks = () => {
  const { isLoading, error, data } = db.useQuery({
    tasks: {
      $: {
        where: {
          deletedAt: { $isNull: true },
        },
        order: { title: "asc" },
      },
      completions: {
        $: {
          where: {
            deletedAt: { $isNull: true },
          },
          order: { completedAt: "desc" },
        },
      },
    },
  });

  return {
    tasks: mapTasksWithCompletions(data),
    loading: isLoading,
    error: error as Error | null,
  };
};

export const useUpsertTask = () => {
  return (
    owner: string,
    title: string,
    description?: string,
    frequency?: number,
    taskId?: string,
  ) => {
    const taskIdToUse = taskId || id();

    db.transact([
      db.tx.tasks[taskIdToUse]
        .update({ title, description, frequency })
        .link({ owner }),
    ]);
  };
};

export const useMarkTaskAsCompleted = () => {
  return (taskId: string, owner: string) => {
    db.transact([
      db.tx.taskCompletions[id()]
        .update({
          completedAt: new Date(),
        })
        .link({ owner })
        .link({ task: taskId }),
    ]);
  };
};

export const useUpdateTaskCompletion = () => {
  return ({ id, completedAt, note }: TaskCompletion) => {
    db.transact([
      db.tx.taskCompletions[id].update({
        completedAt,
        note,
      }),
    ]);
  };
};

export const useDeleteTaskCompletion = () => {
  return (completionId: string) => {
    db.transact(
      db.tx.taskCompletions[completionId].update({
        deletedAt: new Date(),
      }),
    );
  };
};
