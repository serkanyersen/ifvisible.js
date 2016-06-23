const STATUS_ACTIVE = "active";
const STATUS_IDLE = "idle";
const STATUS_HIDDEN = "hidden";

let DOC_HIDDEN: string;
let VISIBILITY_CHANGE_EVENT: string = void 0;
declare var __VERSION__: string;

export namespace Events {
    const store = {};
    let setListener: Function;

    export function attach(event: string, callback: Function) {
        if (!store[event]) {
            store[event] = [];
        }

        store[event].push(callback);
    }

    export function fire(event: string, args?: any[]) {
        if (store[event]) {
            store[event].forEach((callback) => {
                callback(...args);
            });
        }
    }

    export function remove(event: string, callback: Function) {
        if (store[event]) {
            store[event] = store[event].filter((savedCallback) => {
                return callback !== savedCallback;
            });
        }
    }

    export function dom(element: any, event: string, callback: Function) {
        if (!setListener) {
            if (element.addEventListener) {
                setListener = function (el, ev, fn) {
                    return el.addEventListener(ev, fn, false);
                };
            } else if (typeof element["attachEvent"] === "function") {
                setListener = function (el, ev, fn) {
                    return el.attachEvent("on" + ev, fn, false);
                };
            } else {
                setListener = function (el, ev, fn) {
                    return el["on" + ev] = fn;
                };
            }
        }
        return setListener(element, event, callback);
    }

}

export class Timer {
    private token: number;
    stopped: boolean = false;

    constructor(private ifvisible: IfVisible,
        private seconds: number,
        private callback: Function) {
        this.start();

        this.ifvisible.on("statusChanged", (data: any) => {
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

    public stop() {
        this.stopped = true;
        clearInterval(this.token);
    }

    public resume() {
        this.start();
    }

    public pause() {
        this.stop();
    }
}

if (document.hidden !== void 0) {
    DOC_HIDDEN = "hidden";
    VISIBILITY_CHANGE_EVENT = "visibilitychange";
} else if (document["mozHidden"] !== void 0) {
    DOC_HIDDEN = "mozHidden";
    VISIBILITY_CHANGE_EVENT = "mozvisibilitychange";
} else if (document.msHidden !== void 0) {
    DOC_HIDDEN = "msHidden";
    VISIBILITY_CHANGE_EVENT = "msvisibilitychange";
} else if (document["webkitHidden"] !== void 0) {
    DOC_HIDDEN = "webkitHidden";
    VISIBILITY_CHANGE_EVENT = "webkitvisibilitychange";
}

export const IE = (function () {
    let undef,
        v = 3,
        div = document.createElement("div"),
        all = div.getElementsByTagName("i");

    while (
        div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
        all[0]
    );

    return v > 4 ? v : undef;
}());

export interface IdleInfo {
    isIdle: boolean;
    idleFor: number;
    timeLeft: number;
    timeLeftPer: number;
}

export class IfVisible {
    public status: string;
    private idleTime: number;
    private idleStartedTime: number;
    public VERSION = __VERSION__;


    constructor() {
        let BLUR_EVENT = "blur";
        let FOCUS_EVENT = "focus";

        if (DOC_HIDDEN === void 0) {
            if (IE < 9) {
                BLUR_EVENT = "focusout";
            }
            Events.dom(window, BLUR_EVENT, () => {
                return this.blur();
            });
            Events.dom(window, FOCUS_EVENT, () => {
                return this.focus();
            });
        } else {
            Events.dom(document, VISIBILITY_CHANGE_EVENT, () => {
                if (document[DOC_HIDDEN]) {
                    return this.blur();
                } else {
                    return this.focus();
                }
            });
        }
        this.trackIdleStatus();
    }

    trackIdleStatus() {
        let timer: number;
        let wakeUp = () => {
            clearTimeout(timer);
            if (this.status !== STATUS_ACTIVE) {
                this.wakeup();
            }

            this.idleStartedTime = +(new Date());
            timer = setTimeout(() => {
                if (this.status === STATUS_ACTIVE) {
                    return this.idle();
                }
            }, this.idleTime);
        };

        wakeUp();
        Events.dom(document, "mousemove", wakeUp);
        Events.dom(document, "keyup", wakeUp);
        Events.dom(document, "touchstart", wakeUp);
        Events.dom(window, "scroll", wakeUp);
        this.focus(wakeUp);
        this.wakeup(wakeUp);
    }

    on(event: string, callback: (data: any) => any): IfVisible {
        Events.attach(event, callback);
        return this;
    }

    off(event: string, callback?: any): IfVisible {
        Events.remove(event, callback);
        return this;
    }

    setIdleDuration(seconds: number): IfVisible {
        this.idleTime = seconds * 1000;
        return this;
    }

    getIdleDuration(): number {
        return this.idleTime;
    }

    getIdleInfo(): IdleInfo {
        let now = +(new Date());
        let res: IdleInfo;
        if (this.status === STATUS_IDLE) {
            res = {
                isIdle: true,
                idleFor: now - this.idleStartedTime,
                timeLeft: 0,
                timeLeftPer: 100
            };
        } else {
            let timeLeft = (this.idleStartedTime + this.idleTime) - now;
            res = {
                isIdle: false,
                idleFor: now - this.idleStartedTime,
                timeLeft,
                timeLeftPer: parseFloat((100 - (timeLeft * 100 / this.idleTime)).toFixed(2))
            };
        }
        return res;
    }

    idle(callback?: (data: any) => any): IfVisible {
        if (callback) {
            this.on("idle", callback);
        } else {
            this.status = STATUS_IDLE;
            Events.fire("idle");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }

    blur(callback?: (data: any) => any): IfVisible {
        if (callback) {
            this.on("blur", callback);
        } else {
            this.status = STATUS_HIDDEN;
            Events.fire("blur");
            Events.fire("idle");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }

    focus(callback?: (data: any) => any): IfVisible {
        if (callback) {
            this.on("focus", callback);
        } else {
            this.status = STATUS_ACTIVE;
            Events.fire("focus");
            Events.fire("wakeup");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }

    wakeup(callback?: (data: any) => any): IfVisible {
        if (callback) {
            this.on("wakeup", callback);
        } else {
            this.status = STATUS_ACTIVE;
            Events.fire("wakeup");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }

    onEvery(seconds: number, callback: Function): Timer {
        return new Timer(this, seconds, callback);
    }

    now(check?: string): boolean {
        if (check !== void 0) {
            return this.status === check;
        } else {
            return this.status === STATUS_ACTIVE;
        }
    }
}

export function exporter(root, factory) {
    if (typeof root.define === "function" && root.define.amd) {
        return root.define(function() {
            return factory();
        });
    } else if (typeof root.module === "object" && typeof root.module.exports === "object") {
        // return root.module.exports = factory();
        let exp = factory();
        root.exports.__esModule = true;
        root.exports = exp;
        root.exports["default"] = exp;
    } else {
        // put it in the global
        return root.ifvisible = factory();
    }
}
