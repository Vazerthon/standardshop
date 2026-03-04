#!/usr/bin/env node

/**
 * One-off script to convert a Supatask export JSON file into the
 * import format used by standardshop (see import-tasks-example.json).
 *
 * Usage:
 *   node convert-supatask-export.mjs <input.json> [output.json]
 *
 * If output is omitted the result is written to stdout.
 */

import { readFileSync, writeFileSync } from "node:fs";

// ── Frequency mapping ──────────────────────────────────────────────

const FREQ_MAP = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

// ── Helpers ────────────────────────────────────────────────────────

/** Turn a date-only string like "2024-08-14" into a full ISO timestamp. */
function toISO(dateStr) {
  if (!dateStr) return undefined;
  // Already has a time component
  if (dateStr.includes("T")) return dateStr;
  return `${dateStr}T00:00:00Z`;
}

// ── Main ───────────────────────────────────────────────────────────

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node convert-supatask-export.mjs <input.json> [output.json]");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputPath, "utf-8"));
const exportedAt = raw.exportedAt; // fallback deletedAt for soft-deleted tasks

const converted = {
  tasks: raw.tasks.map((task) => {
    const out = { title: task.title };

    // Map frequency (skip for "one off")
    const freqDays = FREQ_MAP[task.frequency];
    if (freqDays !== undefined) {
      out.frequency = freqDays;
    }

    // Soft-deleted task → use exportedAt as deletedAt timestamp
    if (task.deleted) {
      out.deletedAt = exportedAt;
    }

    // Convert completions – only keep entries where complete === true
    const completions = (task.completion ?? [])
      .filter((c) => c.complete)
      .map((c) => {
        const entry = { completedAt: toISO(c.completed_at) };
        if (c.note != null && c.note !== "") {
          entry.note = c.note;
        }
        return entry;
      });

    out.completions = completions;

    return out;
  }),
};

const json = JSON.stringify(converted, null, 2);

const outputPath = process.argv[3];
if (outputPath) {
  writeFileSync(outputPath, json + "\n", "utf-8");
  console.log(`Wrote ${converted.tasks.length} tasks to ${outputPath}`);
} else {
  process.stdout.write(json + "\n");
}
