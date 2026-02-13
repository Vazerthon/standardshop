import { db, id } from "@/lib/db";
import { formatDistanceToNow, max } from "date-fns";

interface TaskCompletion {
  id: string;
  completedAt: Date;
  note?: string;
}
interface Task {
  id: string;
  title: string;
  frequency: number;
  description?: string;
  completions: TaskCompletion[];
  daysSinceLastCompletion?: number;
  daysUntilNextDue?: number;
  distanceSinceLastCompletionLabel?: string;
}

const distanceSinceLastCompletion = (
  completions: TaskCompletion[],
): { label: string; days: number } | undefined => {
  if (!completions || completions.length === 0) return undefined;
  const mostRecentCompletionDate = max(
    completions.map((item) => item.completedAt).filter(Boolean) as Date[],
  );
  return {
    label: formatDistanceToNow(mostRecentCompletionDate, { addSuffix: true }),
    days: Math.floor(
      (Date.now() - mostRecentCompletionDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  };
};

const mapTasksWithCompletions = (data: any): Task[] =>
  data?.tasks.map((item: any): Task => {
    const { label, days } =
      distanceSinceLastCompletion(item?.completions) || {};

    return {
      id: item.id,
      title: item?.title,
      frequency: item?.frequency,
      description: item?.description,
      daysSinceLastCompletion: days,
      daysUntilNextDue:
        item?.frequency && days !== undefined
          ? item.frequency - days
          : undefined,
      distanceSinceLastCompletionLabel: label,
      completions:
        item?.completions?.map((historyItem: any) => ({
          id: historyItem.id,
          completedAt: new Date(historyItem.completedAt),
          note: historyItem.note,
        })) || [],
    };
  }) || [];

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
    title: string,
    description: string,
    frequency: number,
    owner: string,
  ) => {
    const taskId = id();

    db.transact([
      db.tx.tasks[taskId]
        .update({ title, description, frequency })
        .link({ owner }),
    ]);
  };
};
