import { addDomListener, EventEmitter } from "./EventEmitter";
import {
  EventCallback,
  IfVisibleEvent,
  STATUS_ACTIVE,
  STATUS_HIDDEN,
  STATUS_IDLE,
  Status,
} from "./consts";
import Timer from "./Timer";
import { VERSION } from "./version";

export interface IIdleInfo {
  isIdle: boolean;
  idleFor: number;
  timeLeft: number;
  timeLeftPer: number;
}

const hasDOM = typeof document !== "undefined";

export class IfVisible {
  status: Status = STATUS_ACTIVE;

  readonly VERSION = VERSION;

  /** False in non-DOM environments (SSR / Node). All methods stay safe no-ops. */
  readonly isSupported: boolean;

  private emitter = new EventEmitter();

  private disposers: Array<() => void> = [];

  private timer: ReturnType<typeof setTimeout> | undefined;

  private idleTime = 30000;

  private idleStartedTime = Date.now();

  constructor(
    private root: (Window & typeof globalThis) | undefined = hasDOM
      ? window
      : undefined,
    private doc: Document | undefined = hasDOM ? document : undefined
  ) {
    this.isSupported = !!(this.doc && this.root);

    if (!this.doc || !this.root) {
      // SSR / non-DOM: nothing to wire up; methods remain safe no-ops.
      return;
    }

    const trackChange = () => (this.doc!.hidden ? this.blur() : this.focus());
    trackChange(); // get initial status
    this.disposers.push(
      addDomListener(this.doc, "visibilitychange", trackChange)
    );

    // Page Lifecycle API: surface freeze/resume (bfcache) as first-class events.
    this.disposers.push(
      addDomListener(this.doc, "freeze", () => this.emitter.fire("freeze"))
    );
    this.disposers.push(
      addDomListener(this.doc, "resume", () => this.emitter.fire("resume"))
    );

    this.startIdleTimer();
    this.trackIdleStatus();
  }

  private startIdleTimer = (event?: Event): void => {
    // No idle tracking without a DOM (SSR / Node).
    if (!this.isSupported) return;

    // Prevents phantom mousemove events that report no movement.
    // @see https://github.com/serkanyersen/ifvisible.js/pull/37
    if (
      event instanceof MouseEvent &&
      event.movementX === 0 &&
      event.movementY === 0 &&
      event.type !== "mousedown"
    ) {
      return;
    }

    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    if (this.status === STATUS_IDLE) {
      this.wakeup();
    }

    this.idleStartedTime = Date.now();

    this.timer = setTimeout(() => {
      if (this.status === STATUS_ACTIVE || this.status === STATUS_HIDDEN) {
        this.idle();
      }
    }, this.idleTime);
  };

  private trackIdleStatus(): void {
    if (!this.doc || !this.root) return;
    this.disposers.push(
      addDomListener(this.doc, "mousemove", this.startIdleTimer),
      addDomListener(this.doc, "mousedown", this.startIdleTimer),
      addDomListener(this.doc, "keyup", this.startIdleTimer),
      addDomListener(this.doc, "touchstart", this.startIdleTimer),
      addDomListener(this.root, "scroll", this.startIdleTimer)
    );
    // When the page is focused without any other event, it should not be idle.
    this.focus(() => this.startIdleTimer());
  }

  on(event: IfVisibleEvent, callback: EventCallback): this {
    this.emitter.on(event, callback);
    return this;
  }

  off(event: IfVisibleEvent, callback?: EventCallback): this {
    this.emitter.off(event, callback);
    return this;
  }

  setIdleDuration(seconds: number): this {
    this.idleTime = seconds * 1000;
    this.startIdleTimer();
    return this;
  }

  getIdleDuration(): number {
    return this.idleTime;
  }

  getIdleInfo(): IIdleInfo {
    const now = Date.now();
    if (this.status === STATUS_IDLE) {
      return {
        isIdle: true,
        idleFor: now - this.idleStartedTime,
        timeLeft: 0,
        timeLeftPer: 100,
      };
    }
    const timeLeft = this.idleStartedTime + this.idleTime - now;
    return {
      isIdle: false,
      idleFor: now - this.idleStartedTime,
      timeLeft,
      timeLeftPer: parseFloat(
        (100 - (timeLeft * 100) / this.idleTime).toFixed(2)
      ),
    };
  }

  idle(callback?: EventCallback): this {
    if (callback) {
      this.on("idle", callback);
    } else {
      this.status = STATUS_IDLE;
      this.emitter.fire("idle");
      this.emitter.fire("statusChanged", { status: this.status });
    }
    return this;
  }

  blur(callback?: EventCallback): this {
    if (callback) {
      this.on("blur", callback);
    } else {
      this.status = STATUS_HIDDEN;
      this.emitter.fire("blur");
      this.emitter.fire("statusChanged", { status: this.status });
    }
    return this;
  }

  focus(callback?: EventCallback): this {
    if (callback) {
      this.on("focus", callback);
    } else if (this.status !== STATUS_ACTIVE) {
      this.status = STATUS_ACTIVE;
      this.emitter.fire("focus");
      this.emitter.fire("wakeup");
      this.emitter.fire("statusChanged", { status: this.status });
    }
    return this;
  }

  wakeup(callback?: EventCallback): this {
    if (callback) {
      this.on("wakeup", callback);
    } else if (this.status !== STATUS_ACTIVE) {
      this.status = STATUS_ACTIVE;
      this.emitter.fire("wakeup");
      this.emitter.fire("statusChanged", { status: this.status });
    }
    return this;
  }

  onEvery(seconds: number, callback: EventCallback): Timer {
    return new Timer(this, seconds, callback);
  }

  now(check?: Status): boolean {
    if (check !== undefined) {
      return this.status === check;
    }
    return this.status === STATUS_ACTIVE;
  }

  /**
   * Detach every DOM listener and clear all registered handlers and timers.
   * Call this when tearing down (e.g. SPA route unmount) to avoid leaks.
   */
  destroy(): void {
    this.disposers.forEach((dispose) => dispose());
    this.disposers = [];
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.emitter.clear();
  }
}
