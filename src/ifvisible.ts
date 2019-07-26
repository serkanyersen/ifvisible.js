import { Events } from './Events';
import Timer from './Timer';

export const STATUS_ACTIVE = 'active';
export const STATUS_IDLE = 'idle';
export const STATUS_HIDDEN = 'hidden';
// declare var __VERSION__: string;
let DOC_HIDDEN: string;
let VISIBILITY_CHANGE_EVENT: string;

export interface IIdleInfo {
  isIdle: boolean;
  idleFor: number;
  timeLeft: number;
  timeLeftPer: number;
}

// eslint-disable-next-line func-names
export const IE = (function () {
  let undef;
  let v = 3;
  const div = document.createElement('div');
  const all = div.getElementsByTagName('i');

  // eslint-disable-next-line no-cond-assign
  while (
    // eslint-disable-next-line no-plusplus, no-sequences
    div.innerHTML = `<!--[if gt IE ${++v}]><i></i><![endif]-->`,
    all[0]
  );

  return v > 4 ? v : undef;
}());

export class IfVisible {
  status: string = STATUS_ACTIVE;

  VERSION = '2.0.11';

  private timers: number[] = [];

  private idleTime: number = 30000;

  private idleStartedTime: number;

  private isLegacyModeOn = false;


  constructor (private root, private doc) {
    // Find correct browser events
    if (this.doc.hidden !== undefined) {
      DOC_HIDDEN = 'hidden';
      VISIBILITY_CHANGE_EVENT = 'visibilitychange';
    } else if (this.doc.mozHidden !== undefined) {
      DOC_HIDDEN = 'mozHidden';
      VISIBILITY_CHANGE_EVENT = 'mozvisibilitychange';
    } else if (this.doc.msHidden !== undefined) {
      DOC_HIDDEN = 'msHidden';
      VISIBILITY_CHANGE_EVENT = 'msvisibilitychange';
    } else if (this.doc.webkitHidden !== undefined) {
      DOC_HIDDEN = 'webkitHidden';
      VISIBILITY_CHANGE_EVENT = 'webkitvisibilitychange';
    }

    if (DOC_HIDDEN === undefined) {
      this.legacyMode();
    } else {
      const trackChange = () => {
        if (this.doc[DOC_HIDDEN]) {
          this.blur();
        } else {
          this.focus();
        }
      };
      trackChange(); // get initial status
      Events.dom(this.doc, VISIBILITY_CHANGE_EVENT, trackChange);
    }
    this.startIdleTimer();
    this.trackIdleStatus();
  }

  legacyMode () {
    // it's already on
    if (this.isLegacyModeOn) { return; }

    let BLUR_EVENT = 'blur';
    const FOCUS_EVENT = 'focus';

    if (IE < 9) {
      BLUR_EVENT = 'focusout';
    }

    Events.dom(this.root, BLUR_EVENT, () => {
      return this.blur();
    });

    Events.dom(this.root, FOCUS_EVENT, () => {
      return this.focus();
    });

    this.isLegacyModeOn = true;
  }

  startIdleTimer (event?: Event) {
    // Prevents Phantom events.
    // @see https://github.com/serkanyersen/ifvisible.js/pull/37
    if (event instanceof MouseEvent && event.movementX === 0 && event.movementY === 0) {
      return;
    }

    this.timers.map(clearTimeout);
    this.timers.length = 0; // clear the array

    if (this.status === STATUS_IDLE) {
      this.wakeup();
    }

    this.idleStartedTime = +(new Date());

    this.timers.push(setTimeout(() => {
      if (this.status === STATUS_ACTIVE || this.status === STATUS_HIDDEN) {
        return this.idle();
      }
    }, this.idleTime));
  }

  trackIdleStatus () {
    Events.dom(this.doc, 'mousemove', this.startIdleTimer.bind(this));
    Events.dom(this.doc, 'mousedown', this.startIdleTimer.bind(this));
    Events.dom(this.doc, 'keyup', this.startIdleTimer.bind(this));
    Events.dom(this.doc, 'touchstart', this.startIdleTimer.bind(this));
    Events.dom(this.root, 'scroll', this.startIdleTimer.bind(this));
    // When page is focus without any event, it should not be idle.
    this.focus(this.startIdleTimer.bind(this));
  }

  on (event: string, callback: (data: any) => any): IfVisible {
    Events.attach(event, callback);
    return this;
  }

  off (event: string, callback?: any): IfVisible {
    Events.remove(event, callback);
    return this;
  }

  setIdleDuration (seconds: number): IfVisible {
    this.idleTime = seconds * 1000;
    this.startIdleTimer();
    return this;
  }

  getIdleDuration (): number {
    return this.idleTime;
  }

  getIdleInfo (): IIdleInfo {
    const now = +(new Date());
    let res: IIdleInfo;
    if (this.status === STATUS_IDLE) {
      res = {
        isIdle: true,
        idleFor: now - this.idleStartedTime,
        timeLeft: 0,
        timeLeftPer: 100,
      };
    } else {
      const timeLeft = (this.idleStartedTime + this.idleTime) - now;
      res = {
        isIdle: false,
        idleFor: now - this.idleStartedTime,
        timeLeft,
        timeLeftPer: parseFloat((100 - (timeLeft * 100 / this.idleTime)).toFixed(2)),
      };
    }
    return res;
  }

  idle (callback?: (data: any) => any): IfVisible {
    if (callback) {
      this.on('idle', callback);
    } else {
      this.status = STATUS_IDLE;
      Events.fire('idle');
      Events.fire('statusChanged', [{ status: this.status }]);
    }
    return this;
  }

  blur (callback?: (data: any) => any): IfVisible {
    if (callback) {
      this.on('blur', callback);
    } else {
      this.status = STATUS_HIDDEN;
      Events.fire('blur');
      Events.fire('statusChanged', [{ status: this.status }]);
    }
    return this;
  }

  focus (callback?: (data: any) => any): IfVisible {
    if (callback) {
      this.on('focus', callback);
    } else if (this.status !== STATUS_ACTIVE) {
      this.status = STATUS_ACTIVE;
      Events.fire('focus');
      Events.fire('wakeup');
      Events.fire('statusChanged', [{ status: this.status }]);
    }
    return this;
  }

  wakeup (callback?: (data: any) => any): IfVisible {
    if (callback) {
      this.on('wakeup', callback);
    } else if (this.status !== STATUS_ACTIVE) {
      this.status = STATUS_ACTIVE;
      Events.fire('wakeup');
      Events.fire('statusChanged', [{ status: this.status }]);
    }
    return this;
  }

  onEvery (seconds: number, callback: Function): Timer {
    return new Timer(this, seconds, callback);
  }

  now (check?: string): boolean {
    if (check !== undefined) {
      return this.status === check;
    }
    return this.status === STATUS_ACTIVE;
  }
}
