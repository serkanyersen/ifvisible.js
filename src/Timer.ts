import { IfVisible, STATUS_ACTIVE } from './ifvisible';

export default class Timer {
  private token: number;

  stopped: boolean = false;

  constructor (private ifvisible: IfVisible,
    private seconds: number,
    private callback: Function) {
    this.start();

    this.ifvisible.on('statusChanged', (data: any) => {
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
    clearInterval(this.token);
    this.token = setInterval(this.callback, this.seconds * 1000);
  }

  stop () {
    this.stopped = true;
    clearInterval(this.token);
  }

  resume () {
    this.start();
  }

  pause () {
    this.stop();
  }
}
