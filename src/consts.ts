export const STATUS_ACTIVE = "active";
export const STATUS_IDLE = "idle";
export const STATUS_HIDDEN = "hidden";

export type Status =
  | typeof STATUS_ACTIVE
  | typeof STATUS_IDLE
  | typeof STATUS_HIDDEN;

/**
 * Every event ifvisible can emit.
 *
 * - `focus` / `blur`    — page became visible / hidden
 * - `idle` / `wakeup`   — user went idle / became active again
 * - `statusChanged`     — any status transition (carries the new status)
 * - `freeze` / `resume` — Page Lifecycle API: page frozen (bfcache) / resumed
 */
export type IfVisibleEvent =
  | "focus"
  | "blur"
  | "idle"
  | "wakeup"
  | "statusChanged"
  | "freeze"
  | "resume";

export type EventData = {
  status?: Status;
};

export type EventCallback = (data: EventData) => void;
