var STATUS_ACTIVE = 'active';
var STATUS_IDLE = 'idle';
var STATUS_HIDDEN = 'hidden';
var DOC_HIDDEN;
var VISIBILITY_CHANGE_EVENT = void 0;
var Events;
(function (Events) {
    var store = {};
    var setListener;
    function attach(event, callback) {
        if (!store[event]) {
            store[event] = [];
        }
        store[event].push(callback);
    }
    Events.attach = attach;
    function fire(event, args) {
        if (store[event]) {
            store[event].forEach(function (callback) {
                callback.apply(void 0, args);
            });
        }
    }
    Events.fire = fire;
    function remove(event, callback) {
        if (store[event]) {
            store[event] = store[event].filter(function (savedCallback) {
                return callback !== savedCallback;
            });
        }
    }
    Events.remove = remove;
    function dom(element, event, callback) {
        if (!setListener) {
            if (element.addEventListener) {
                setListener = function (el, ev, fn) {
                    return el.addEventListener(ev, fn, false);
                };
            }
            else if (typeof element['attachEvent'] === 'function') {
                setListener = function (el, ev, fn) {
                    return el.attachEvent('on' + ev, fn, false);
                };
            }
            else {
                setListener = function (el, ev, fn) {
                    return el['on' + ev] = fn;
                };
            }
        }
        return setListener(element, event, callback);
    }
    Events.dom = dom;
})(Events || (Events = {}));
var Timer = (function () {
    function Timer(ifvisible, seconds, callback) {
        var _this = this;
        this.ifvisible = ifvisible;
        this.seconds = seconds;
        this.callback = callback;
        this.stopped = false;
        this.start();
        this.ifvisible.on('statusChanged', function (data) {
            if (_this.stopped === false) {
                if (data.status === STATUS_ACTIVE) {
                    _this.start();
                }
                else {
                    _this.pause();
                }
            }
        });
    }
    Timer.prototype.start = function () {
        this.stopped = false;
        clearInterval(this.token);
        this.token = setInterval(this.callback, this.seconds * 1000);
    };
    Timer.prototype.stop = function () {
        this.stopped = true;
        clearInterval(this.token);
    };
    Timer.prototype.resume = function () {
        this.start();
    };
    Timer.prototype.pause = function () {
        this.stop();
    };
    return Timer;
})();
if (document.hidden !== void 0) {
    DOC_HIDDEN = "hidden";
    VISIBILITY_CHANGE_EVENT = "visibilitychange";
}
else if (document['mozHidden'] !== void 0) {
    DOC_HIDDEN = "mozHidden";
    VISIBILITY_CHANGE_EVENT = "mozvisibilitychange";
}
else if (document.msHidden !== void 0) {
    DOC_HIDDEN = "msHidden";
    VISIBILITY_CHANGE_EVENT = "msvisibilitychange";
}
else if (document['webkitHidden'] !== void 0) {
    DOC_HIDDEN = "webkitHidden";
    VISIBILITY_CHANGE_EVENT = "webkitvisibilitychange";
}
var IE = (function () {
    var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
    while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0])
        ;
    return v > 4 ? v : undef;
}());
var IfVisible = (function () {
    function IfVisible() {
        var _this = this;
        var BLUR_EVENT = 'blur';
        var FOCUS_EVENT = 'focus';
        if (DOC_HIDDEN === void 0) {
            if (IE < 9) {
                BLUR_EVENT = "focusout";
            }
            Events.dom(window, BLUR_EVENT, function () {
                return _this.blur();
            });
            Events.dom(window, "focus", function () {
                return _this.focus();
            });
        }
        else {
            Events.dom(document, VISIBILITY_CHANGE_EVENT, function () {
                if (document[DOC_HIDDEN]) {
                    return _this.blur();
                }
                else {
                    return _this.focus();
                }
            });
        }
        this.trackIdleStatus();
    }
    IfVisible.prototype.trackIdleStatus = function () {
        var _this = this;
        var timer;
        var wakeUp = function () {
            clearTimeout(timer);
            if (_this.status !== STATUS_ACTIVE) {
                _this.wakeup();
            }
            _this.idleStartedTime = +(new Date());
            timer = setTimeout(function () {
                if (_this.status === STATUS_ACTIVE) {
                    return _this.idle();
                }
            }, _this.idleTime);
        };
        wakeUp();
        Events.dom(document, "mousemove", wakeUp);
        Events.dom(document, "keyup", wakeUp);
        Events.dom(document, "touchstart", wakeUp);
        Events.dom(window, "scroll", wakeUp);
        this.focus(wakeUp);
        this.wakeup(wakeUp);
    };
    IfVisible.prototype.on = function (event, callback) {
        Events.attach(event, callback);
        return this;
    };
    IfVisible.prototype.off = function (event, callback) {
        Events.remove(event, callback);
        return this;
    };
    IfVisible.prototype.setIdleDuration = function (seconds) {
        this.idleTime = seconds * 1000;
        return this;
    };
    IfVisible.prototype.getIdleDuration = function () {
        return this.idleTime;
    };
    IfVisible.prototype.getIdleInfo = function () {
        var now = +(new Date());
        var res;
        if (this.status === STATUS_IDLE) {
            res = {
                isIdle: true,
                idleFor: now - this.idleStartedTime,
                timeLeft: 0,
                timeLeftPer: 100
            };
        }
        else {
            var timeLeft = (this.idleStartedTime + this.idleTime) - now;
            res = {
                isIdle: false,
                idleFor: now - this.idleStartedTime,
                timeLeft: timeLeft,
                timeLeftPer: parseFloat((100 - (timeLeft * 100 / this.idleTime)).toFixed(2))
            };
        }
        return res;
    };
    IfVisible.prototype.idle = function (callback) {
        if (callback) {
            this.on('idle', callback);
        }
        else {
            this.status = STATUS_IDLE;
            Events.fire('idle');
            Events.fire('statusChanged', [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.blur = function (callback) {
        if (callback) {
            this.on('blur', callback);
        }
        else {
            this.status = STATUS_HIDDEN;
            Events.fire('blur');
            Events.fire('idle');
            Events.fire('statusChanged', [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.focus = function (callback) {
        if (callback) {
            this.on('focus', callback);
        }
        else {
            this.status = STATUS_ACTIVE;
            Events.fire('focus');
            Events.fire('wakeup');
            Events.fire('statusChanged', [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.wakeup = function (callback) {
        if (callback) {
            this.on('wakeup', callback);
        }
        else {
            this.status = STATUS_ACTIVE;
            Events.fire('wakeup');
            Events.fire('statusChanged', [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.onEvery = function (seconds, callback) {
        return new Timer(this, seconds, callback);
    };
    IfVisible.prototype.now = function (check) {
        if (check !== void 0) {
            return this.status === check;
        }
        else {
            return this.status === STATUS_ACTIVE;
        }
    };
    return IfVisible;
})();
// What should have been ↴
// export default new IfVisible();
// What it is ↴
function exports(root, factory) {
    if (typeof root.define === 'function' && root.define.amd) {
        return root.define(function () {
            return factory();
        });
    }
    else if (typeof root.module === 'object' && typeof root.module.exports === 'object') {
        // return root.module.exports = factory();
        var exp = factory();
        root.exports.__esModule = true;
        root.exports = exp;
        root.exports["default"] = exp;
    }
    else {
        // put it in the global
        return root.ifvisible = factory();
    }
}
exports(this, function () {
    return new IfVisible();
});
