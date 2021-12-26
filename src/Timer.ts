import { STATUS_ACTIVE, EventData } from "./consts";
import type { IfVisible } from "./ifvisible";

export default class Timer {
  private token: number;

  stopped = false;

  constructor(
    private ifvisible: IfVisible,
    private seconds: number,
    private callback: (data: EventData) => void
  ) {
    this.start();

    this.ifvisible.on("statusChanged", (data: { status: string }) => {
      if (this.stopped === false) {
        if (data.status === STATUS_ACTIVE) {
          this.start();
        } else {
          this.pause();
        }
      }
    });
  }

  private start() {
    this.stopped = false;
    clearInterval(this.token);
    this.token = setInterval(this.callback, this.seconds * 1000);
  }

  stop() {
    this.stopped = true;
    clearInterval(this.token);
  }

  resume() {
    this.start();
  }

  pause() {
    this.stop();
  }
}
