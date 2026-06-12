import { EventCallback, EventData } from "./consts";

/**
 * A tiny per-instance event emitter.
 *
 * In v2 the event store was a module-level singleton, so every `IfVisible`
 * instance shared one global event registry (see KNOW-32 / KNOW-13). In v3
 * each `IfVisible` owns its own emitter, so instances are fully isolated.
 */
export class EventEmitter {
  private store = new Map<string, Set<EventCallback>>();

  on(event: string, callback: EventCallback): void {
    let listeners = this.store.get(event);
    if (!listeners) {
      listeners = new Set();
      this.store.set(event, listeners);
    }
    listeners.add(callback);
  }

  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.store.delete(event);
      return;
    }
    this.store.get(event)?.delete(callback);
  }

  fire(event: string, data?: EventData): void {
    // Clone to a stable array so handlers that detach themselves mid-fire
    // don't disturb iteration.
    const listeners = this.store.get(event);
    if (!listeners) return;
    Array.from(listeners).forEach((callback) => callback(data ?? {}));
  }

  clear(): void {
    this.store.clear();
  }
}

/**
 * Attach a DOM listener and return a disposer that removes it.
 * Legacy `attachEvent`/`onX` fallbacks are gone — every supported browser
 * has `addEventListener`.
 */
export function addDomListener(
  target: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}
