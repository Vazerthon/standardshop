import { db } from "@/lib/db";
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

const mapTasksWithHistory = (data: any): Task[] =>
  data?.tasks.map((item: any): Task => {
    const { label, days } =
      distanceSinceLastCompletion(item?.completions) || {};
    return {
      id: item.id,
      title: item?.title,
      frequency: item?.frequency,
      description: item?.description,
      daysSinceLastCompletion: days,
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
        order: { title: "asc" },
        where: {
          deletedAt: { $isNull: true },
        },
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

  const tasks = mapTasksWithHistory(data).filter(
    (task) => task.history.length > 0,
  );

  return {
    tasks,
    loading: isLoading,
    error: error as Error | null,
  };
};
