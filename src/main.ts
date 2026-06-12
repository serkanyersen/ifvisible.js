import { IfVisible } from "./ifvisible";

export { IfVisible } from "./ifvisible";
export { EventEmitter } from "./EventEmitter";
export { default as Timer } from "./Timer";
export { VERSION } from "./version";
export {
  STATUS_ACTIVE,
  STATUS_IDLE,
  STATUS_HIDDEN,
} from "./consts";
export type {
  Status,
  IfVisibleEvent,
  EventData,
  EventCallback,
} from "./consts";
export type { IIdleInfo } from "./ifvisible";

/**
 * Default singleton, bound to the current document.
 *
 * Construction is SSR-safe: in a non-DOM environment `IfVisible` wires up
 * nothing and every method is a safe no-op (`isSupported === false`), so
 * importing this module on the server never throws.
 */
export const ifvisible: IfVisible = new IfVisible();

export default ifvisible;
