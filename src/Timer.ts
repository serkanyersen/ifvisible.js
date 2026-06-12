import { EventCallback, STATUS_ACTIVE } from "./consts";
import type { IfVisible } from "./ifvisible";

export default class Timer {
  private token: ReturnType<typeof setInterval> | undefined;

  stopped = false;

  constructor(
    private ifvisible: IfVisible,
    private seconds: number,
    private callback: EventCallback
  ) {
    this.start();

    this.ifvisible.on("statusChanged", (data) => {
      if (this.stopped === false) {
        if (data.status === STATUS_ACTIVE) {
          this.start();
        } else {
          this.pause();
        }
      }
    });
  }

  private clear(): void {
    if (this.token !== undefined) {
      clearInterval(this.token);
      this.token = undefined;
    }
  }

  private start(): void {
    this.stopped = false;
    this.clear();
    this.token = setInterval(() => this.callback({}), this.seconds * 1000);
  }

  /** Stop permanently. Auto-resume on wakeup will NOT restart a stopped timer. */
  stop(): void {
    this.stopped = true;
    this.clear();
  }

  resume(): void {
    this.start();
  }

  /**
   * Pause without marking the timer stopped, so the status-change handler
   * resumes it on the next wakeup. (In v2 this aliased stop(), so a timer
   * that went idle never auto-resumed.)
   */
  pause(): void {
    this.clear();
  }
}
