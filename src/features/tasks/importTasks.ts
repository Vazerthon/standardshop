import { db, id } from "@/lib/db";

// ── Import file shape ──────────────────────────────────────────────

export interface ImportCompletion {
  completedAt: string;
  note?: string;
  deletedAt?: string;
}

export interface ImportTask {
  title: string;
  description?: string;
  frequency?: number;
  deletedAt?: string;
  completions?: ImportCompletion[];
}

export interface TaskImportFile {
  tasks: ImportTask[];
}

// ── Validation ─────────────────────────────────────────────────────

export type ValidationResult =
  | { valid: true; data: TaskImportFile }
  | { valid: false; errors: string[] };

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

export function validateImportFile(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      valid: false,
      errors: ['Import file must be a JSON object with a "tasks" array.'],
    };
  }

  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.tasks)) {
    return {
      valid: false,
      errors: ['Import file must contain a "tasks" array.'],
    };
  }

  const tasks = obj.tasks as unknown[];

  if (tasks.length === 0) {
    return {
      valid: false,
      errors: ['The "tasks" array must contain at least one task.'],
    };
  }

  tasks.forEach((task, i) => {
    const prefix = `tasks[${i}]`;

    if (typeof task !== "object" || task === null || Array.isArray(task)) {
      errors.push(`${prefix}: must be an object.`);
      return;
    }

    const t = task as Record<string, unknown>;

    // title – required non-empty string
    if (typeof t.title !== "string" || t.title.trim() === "") {
      errors.push(`${prefix}.title: required non-empty string.`);
    }

    // description – optional string
    if (t.description !== undefined && typeof t.description !== "string") {
      errors.push(`${prefix}.description: must be a string.`);
    }

    // frequency – optional non-negative number
    if (t.frequency !== undefined) {
      if (
        typeof t.frequency !== "number" ||
        t.frequency < 0 ||
        !Number.isFinite(t.frequency)
      ) {
        errors.push(`${prefix}.frequency: must be a non-negative number.`);
      }
    }

    // deletedAt – optional valid date string
    if (t.deletedAt !== undefined) {
      if (!isValidDateString(t.deletedAt)) {
        errors.push(`${prefix}.deletedAt: must be a valid date string.`);
      }
    }

    // completions – optional array
    if (t.completions !== undefined) {
      if (!Array.isArray(t.completions)) {
        errors.push(`${prefix}.completions: must be an array.`);
        return;
      }

      (t.completions as unknown[]).forEach((comp, j) => {
        const cPrefix = `${prefix}.completions[${j}]`;

        if (typeof comp !== "object" || comp === null || Array.isArray(comp)) {
          errors.push(`${cPrefix}: must be an object.`);
          return;
        }

        const c = comp as Record<string, unknown>;

        // completedAt – required valid date string
        if (!isValidDateString(c.completedAt)) {
          errors.push(`${cPrefix}.completedAt: required valid date string.`);
        }

        // note – optional string
        if (c.note !== undefined && typeof c.note !== "string") {
          errors.push(`${cPrefix}.note: must be a string.`);
        }

        // deletedAt – optional valid date string
        if (c.deletedAt !== undefined) {
          if (!isValidDateString(c.deletedAt)) {
            errors.push(`${cPrefix}.deletedAt: must be a valid date string.`);
          }
        }
      });
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: obj as unknown as TaskImportFile };
}

// ── Import summary ─────────────────────────────────────────────────

export interface ImportSummary {
  totalTasks: number;
  deletedTasks: number;
  totalCompletions: number;
  deletedCompletions: number;
}

export function getImportSummary(data: TaskImportFile): ImportSummary {
  let totalCompletions = 0;
  let deletedCompletions = 0;
  let deletedTasks = 0;

  for (const task of data.tasks) {
    if (task.deletedAt) deletedTasks++;
    for (const comp of task.completions ?? []) {
      totalCompletions++;
      if (comp.deletedAt) deletedCompletions++;
    }
  }

  return {
    totalTasks: data.tasks.length,
    deletedTasks,
    totalCompletions,
    deletedCompletions,
  };
}

// ── Execute import ─────────────────────────────────────────────────

export async function executeImport(
  data: TaskImportFile,
  userId: string,
): Promise<void> {
  const ops: Parameters<typeof db.transact>[0] = [];

  for (const task of data.tasks) {
    const taskId = id();

    const taskFields: Record<string, unknown> = {
      title: task.title,
    };
    if (task.description !== undefined)
      taskFields.description = task.description;
    if (task.frequency !== undefined) taskFields.frequency = task.frequency;
    if (task.deletedAt !== undefined)
      taskFields.deletedAt = new Date(task.deletedAt);

    ops.push(db.tx.tasks[taskId].update(taskFields).link({ owner: userId }));

    for (const comp of task.completions ?? []) {
      const compFields: Record<string, unknown> = {
        completedAt: new Date(comp.completedAt),
      };
      if (comp.note !== undefined) compFields.note = comp.note;
      if (comp.deletedAt !== undefined)
        compFields.deletedAt = new Date(comp.deletedAt);

      ops.push(
        db.tx.taskCompletions[id()]
          .update(compFields)
          .link({ owner: userId })
          .link({ task: taskId }),
      );
    }
  }

  // Single atomic transaction – if any operation fails, nothing is persisted
  await db.transact(ops);
}
