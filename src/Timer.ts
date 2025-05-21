import { IfVisible, STATUS_ACTIVE } from './ifvisible';

export default class Timer {
  private token: number;

  stopped: boolean = false;

  constructor (private ifvisible: IfVisible,
    private seconds: number,
    private callback: () => void) {
    this.start();

    this.ifvisible.on('statusChanged', (data: { status: string }) => {
      if (this.stopped === false) {
        if (data.status === STATUS_ACTIVE) {
          this.start();
        } else {
          this.pause();
        }
      }
    });
  }

  private start () {
    this.stopped = false;
    window.clearInterval(this.token);
    this.token = window.setInterval(this.callback, this.seconds * 1000);
  }

  stop () {
    this.stopped = true;
    window.clearInterval(this.token);
  }

  resume () {
    this.start();
  }

  pause () {
    this.stop();
  }
}
