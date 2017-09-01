(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
const ifvisible_1 = __webpack_require__(3);
// decide between self vs global depending on the environment
const root = typeof self === "object" && self.self === self && self ||
    typeof global === "object" && global.global === global && global ||
    this;
exports.ifvisible = new ifvisible_1.IfVisible(root, document);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __webpack_require__(4);
const Timer_1 = __webpack_require__(5);
exports.STATUS_ACTIVE = "active";
exports.STATUS_IDLE = "idle";
exports.STATUS_HIDDEN = "hidden";
// declare var __VERSION__: string;
let DOC_HIDDEN;
let VISIBILITY_CHANGE_EVENT = void 0;
exports.IE = (function () {
    let undef, v = 3, div = document.createElement("div"), all = div.getElementsByTagName("i");
    while (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
        all[0])
        ;
    return v > 4 ? v : undef;
}());
class IfVisible {
    constructor(root, doc) {
        this.root = root;
        this.doc = doc;
        this.status = exports.STATUS_ACTIVE;
        this.VERSION = "2.0.11";
        this.timers = [];
        this.idleTime = 30000;
        this.isLegacyModeOn = false;
        // Find correct browser events
        if (this.doc.hidden !== void 0) {
            DOC_HIDDEN = "hidden";
            VISIBILITY_CHANGE_EVENT = "visibilitychange";
        }
        else if (this.doc["mozHidden"] !== void 0) {
            DOC_HIDDEN = "mozHidden";
            VISIBILITY_CHANGE_EVENT = "mozvisibilitychange";
        }
        else if (this.doc["msHidden"] !== void 0) {
            DOC_HIDDEN = "msHidden";
            VISIBILITY_CHANGE_EVENT = "msvisibilitychange";
        }
        else if (this.doc["webkitHidden"] !== void 0) {
            DOC_HIDDEN = "webkitHidden";
            VISIBILITY_CHANGE_EVENT = "webkitvisibilitychange";
        }
        if (DOC_HIDDEN === void 0) {
            this.legacyMode();
        }
        else {
            const trackChange = () => {
                if (this.doc[DOC_HIDDEN]) {
                    this.blur();
                }
                else {
                    this.focus();
                }
            };
            trackChange(); // get initial status
            Events_1.default.dom(this.doc, VISIBILITY_CHANGE_EVENT, trackChange);
        }
        this.startIdleTimer();
        this.trackIdleStatus();
    }
    legacyMode() {
        // it's already on
        if (this.isLegacyModeOn) {
            return;
        }
        let BLUR_EVENT = "blur";
        let FOCUS_EVENT = "focus";
        if (exports.IE < 9) {
            BLUR_EVENT = "focusout";
        }
        Events_1.default.dom(this.root, BLUR_EVENT, () => {
            console.log("blurred");
            return this.blur();
        });
        Events_1.default.dom(this.root, FOCUS_EVENT, () => {
            return this.focus();
        });
        this.isLegacyModeOn = true;
    }
    startIdleTimer(event) {
        // Prevents Phantom events.
        // @see https://github.com/serkanyersen/ifvisible.js/pull/37
        if (event instanceof MouseEvent && event.movementX === 0 && event.movementY === 0) {
            return;
        }
        this.timers.map(clearTimeout);
        this.timers.length = 0; // clear the array
        if (this.status === exports.STATUS_IDLE) {
            this.wakeup();
        }
        this.idleStartedTime = +(new Date());
        this.timers.push(setTimeout(() => {
            if (this.status === exports.STATUS_ACTIVE || this.status === exports.STATUS_HIDDEN) {
                return this.idle();
            }
        }, this.idleTime));
    }
    trackIdleStatus() {
        Events_1.default.dom(this.doc, "mousemove", this.startIdleTimer.bind(this));
        Events_1.default.dom(this.doc, "mousedown", this.startIdleTimer.bind(this));
        Events_1.default.dom(this.doc, "keyup", this.startIdleTimer.bind(this));
        Events_1.default.dom(this.doc, "touchstart", this.startIdleTimer.bind(this));
        Events_1.default.dom(this.root, "scroll", this.startIdleTimer.bind(this));
        // When page is focus without any event, it should not be idle.
        this.focus(this.startIdleTimer.bind(this));
    }
    on(event, callback) {
        Events_1.default.attach(event, callback);
        return this;
    }
    off(event, callback) {
        Events_1.default.remove(event, callback);
        return this;
    }
    setIdleDuration(seconds) {
        this.idleTime = seconds * 1000;
        this.startIdleTimer();
        return this;
    }
    getIdleDuration() {
        return this.idleTime;
    }
    getIdleInfo() {
        let now = +(new Date());
        let res;
        if (this.status === exports.STATUS_IDLE) {
            res = {
                isIdle: true,
                idleFor: now - this.idleStartedTime,
                timeLeft: 0,
                timeLeftPer: 100
            };
        }
        else {
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
    idle(callback) {
        if (callback) {
            this.on("idle", callback);
        }
        else {
            this.status = exports.STATUS_IDLE;
            Events_1.default.fire("idle");
            Events_1.default.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }
    blur(callback) {
        if (callback) {
            this.on("blur", callback);
        }
        else {
            this.status = exports.STATUS_HIDDEN;
            Events_1.default.fire("blur");
            Events_1.default.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }
    focus(callback) {
        if (callback) {
            this.on("focus", callback);
        }
        else if (this.status !== exports.STATUS_ACTIVE) {
            this.status = exports.STATUS_ACTIVE;
            Events_1.default.fire("focus");
            Events_1.default.fire("wakeup");
            Events_1.default.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }
    wakeup(callback) {
        if (callback) {
            this.on("wakeup", callback);
        }
        else if (this.status !== exports.STATUS_ACTIVE) {
            this.status = exports.STATUS_ACTIVE;
            Events_1.default.fire("wakeup");
            Events_1.default.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    }
    onEvery(seconds, callback) {
        return new Timer_1.default(this, seconds, callback);
    }
    now(check) {
        if (check !== void 0) {
            return this.status === check;
        }
        else {
            return this.status === exports.STATUS_ACTIVE;
        }
    }
}
exports.IfVisible = IfVisible;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Events;
(function (Events) {
    const store = {};
    let setListener;
    function attach(event, callback) {
        if (!store[event]) {
            store[event] = [];
        }
        store[event].push(callback);
    }
    Events.attach = attach;
    function fire(event, args = []) {
        if (store[event]) {
            store[event].forEach((callback) => {
                callback(...args);
            });
        }
    }
    Events.fire = fire;
    function remove(event, callback) {
        if (!callback) {
            delete store[event];
        }
        if (store[event]) {
            store[event] = store[event].filter((savedCallback) => {
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
            else if (typeof element["attachEvent"] === "function") {
                setListener = function (el, ev, fn) {
                    return el.attachEvent("on" + ev, fn, false);
                };
            }
            else {
                setListener = function (el, ev, fn) {
                    return el["on" + ev] = fn;
                };
            }
        }
        return setListener(element, event, callback);
    }
    Events.dom = dom;
})(Events = exports.Events || (exports.Events = {}));
exports.default = Events;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ifvisible_1 = __webpack_require__(3);
class Timer {
    constructor(ifvisible, seconds, callback) {
        this.ifvisible = ifvisible;
        this.seconds = seconds;
        this.callback = callback;
        this.stopped = false;
        this.start();
        this.ifvisible.on("statusChanged", (data) => {
            if (this.stopped === false) {
                if (data.status === ifvisible_1.STATUS_ACTIVE) {
                    this.start();
                }
                else {
                    this.pause();
                }
            }
        });
    }
    start() {
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
exports.default = Timer;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxYjNiNWM1ZTc1YWQ3ODY5NWViMSIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9pZnZpc2libGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0V2ZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVGltZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsMkNBQXdDO0FBR3hDLDZEQUE2RDtBQUM3RCxNQUFNLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSTtJQUN0RCxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksTUFBTTtJQUNoRSxJQUFJLENBQUM7QUFFTCxpQkFBUyxHQUFHLElB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SSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLHlCQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUs7UUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sSUFBSTtRQUNQLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLE1BQU07UUFDVCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVNLEtBQUs7UUFDUixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBdENELHdCQXNDQyIsImZpbGUiOiJpZnZpc2libGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFiM2I1YzVlNzVhZDc4Njk1ZWIxIiwiaW1wb3J0IHsgSWZWaXNpYmxlIH0gZnJvbSBcIi4vaWZ2aXNpYmxlXCI7XG5cbmRlY2xhcmUgdmFyIGdsb2JhbDogYW55O1xuLy8gZGVjaWRlIGJldHdlZW4gc2VsZiB2cyBnbG9iYWwgZGVwZW5kaW5nIG9uIHRoZSBlbnZpcm9ubWVudFxuY29uc3Qgcm9vdCA9IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XG4gICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XG4gICAgICAgICAgICAgdGhpcztcblxuZXhwb3J0IGNvbnN0IGlmdmlzaWJsZSA9IG5ldyBJZlZpc2libGUocm9vdCwgZG9jdW1lbnQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4udHMiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEV2ZW50cyBmcm9tIFwiLi9FdmVudHNcIjtcbmltcG9ydCBUaW1lciBmcm9tIFwiLi9UaW1lclwiO1xuXG5leHBvcnQgY29uc3QgU1RBVFVTX0FDVElWRSA9IFwiYWN0aXZlXCI7XG5leHBvcnQgY29uc3QgU1RBVFVTX0lETEUgPSBcImlkbGVcIjtcbmV4cG9ydCBjb25zdCBTVEFUVVNfSElEREVOID0gXCJoaWRkZW5cIjtcbi8vIGRlY2xhcmUgdmFyIF9fVkVSU0lPTl9fOiBzdHJpbmc7XG5sZXQgRE9DX0hJRERFTjogc3RyaW5nO1xubGV0IFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5UOiBzdHJpbmcgPSB2b2lkIDA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRsZUluZm8ge1xuICAgIGlzSWRsZTogYm9vbGVhbjtcbiAgICBpZGxlRm9yOiBudW1iZXI7XG4gICAgdGltZUxlZnQ6IG51bWJlcjtcbiAgICB0aW1lTGVmdFBlcjogbnVtYmVyO1xufVxuXG5leHBvcnQgY29uc3QgSUUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCB1bmRlZixcbiAgICAgICAgdiA9IDMsXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgIGFsbCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlcIik7XG5cbiAgICB3aGlsZSAoXG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBcIjwhLS1baWYgZ3QgSUUgXCIgKyAoKyt2KSArIFwiXT48aT48L2k+PCFbZW5kaWZdLS0+XCIsXG4gICAgICAgIGFsbFswXVxuICAgICk7XG5cbiAgICByZXR1cm4gdiA+IDQgPyB2IDogdW5kZWY7XG59KCkpO1xuXG5leHBvcnQgY2xhc3MgSWZWaXNpYmxlIHtcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmcgPSBTVEFUVVNfQUNUSVZFO1xuICAgIHB1YmxpYyBWRVJTSU9OID0gXCIyLjAuMTFcIjtcbiAgICBwcml2YXRlIHRpbWVyczogbnVtYmVyW10gPSBbXTtcbiAgICBwcml2YXRlIGlkbGVUaW1lOiBudW1iZXIgPSAzMDAwMDtcbiAgICBwcml2YXRlIGlkbGVTdGFydGVkVGltZTogbnVtYmVyO1xuICAgIHByaXZhdGUgaXNMZWdhY3lNb2RlT24gPSBmYWxzZTtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb290LCBwcml2YXRlIGRvYykge1xuICAgICAgICAvLyBGaW5kIGNvcnJlY3QgYnJvd3NlciBldmVudHNcbiAgICAgICAgaWYgKHRoaXMuZG9jLmhpZGRlbiAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBET0NfSElEREVOID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5UID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kb2NbXCJtb3pIaWRkZW5cIl0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwibW96SGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwibW96dmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZG9jW1wibXNIaWRkZW5cIl0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwibXNIaWRkZW5cIjtcbiAgICAgICAgICAgIFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5UID0gXCJtc3Zpc2liaWxpdHljaGFuZ2VcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRvY1tcIndlYmtpdEhpZGRlblwiXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBET0NfSElEREVOID0gXCJ3ZWJraXRIaWRkZW5cIjtcbiAgICAgICAgICAgIFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5UID0gXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRE9DX0hJRERFTiA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICB0aGlzLmxlZ2FjeU1vZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWNrQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvY1tET0NfSElEREVOXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyYWNrQ2hhbmdlKCk7IC8vIGdldCBpbml0aWFsIHN0YXR1c1xuICAgICAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQsIHRyYWNrQ2hhbmdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0SWRsZVRpbWVyKCk7XG4gICAgICAgIHRoaXMudHJhY2tJZGxlU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgbGVnYWN5TW9kZSgpIHtcbiAgICAgICAgLy8gaXQncyBhbHJlYWR5IG9uXG4gICAgICAgIGlmICh0aGlzLmlzTGVnYWN5TW9kZU9uKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGxldCBCTFVSX0VWRU5UID0gXCJibHVyXCI7XG4gICAgICAgIGxldCBGT0NVU19FVkVOVCA9IFwiZm9jdXNcIjtcblxuICAgICAgICBpZiAoSUUgPCA5KSB7XG4gICAgICAgICAgICBCTFVSX0VWRU5UID0gXCJmb2N1c291dFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLnJvb3QsIEJMVVJfRVZFTlQsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmx1cnJlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJsdXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLnJvb3QsIEZPQ1VTX0VWRU5ULCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb2N1cygpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlzTGVnYWN5TW9kZU9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGFydElkbGVUaW1lcihldmVudD86IEV2ZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnRzIFBoYW50b20gZXZlbnRzLlxuICAgICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zZXJrYW55ZXJzZW4vaWZ2aXNpYmxlLmpzL3B1bGwvMzdcbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5tb3ZlbWVudFggPT09IDAgJiYgZXZlbnQubW92ZW1lbnRZID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRpbWVycy5tYXAoY2xlYXJUaW1lb3V0KTtcbiAgICAgICAgdGhpcy50aW1lcnMubGVuZ3RoID0gMDsgLy8gY2xlYXIgdGhlIGFycmF5XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSURMRSkge1xuICAgICAgICAgICAgdGhpcy53YWtldXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lID0gKyhuZXcgRGF0ZSgpKTtcblxuICAgICAgICB0aGlzLnRpbWVycy5wdXNoKHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfQUNUSVZFIHx8IHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSElEREVOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWRsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLmlkbGVUaW1lKSk7XG4gICAgfVxuXG4gICAgdHJhY2tJZGxlU3RhdHVzKCkge1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcIm1vdXNlbW92ZVwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcIm1vdXNlZG93blwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcImtleXVwXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwidG91Y2hzdGFydFwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMucm9vdCwgXCJzY3JvbGxcIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgLy8gV2hlbiBwYWdlIGlzIGZvY3VzIHdpdGhvdXQgYW55IGV2ZW50LCBpdCBzaG91bGQgbm90IGJlIGlkbGUuXG4gICAgICAgIHRoaXMuZm9jdXModGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgRXZlbnRzLmF0dGFjaChldmVudCwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBFdmVudHMucmVtb3ZlKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldElkbGVEdXJhdGlvbihzZWNvbmRzOiBudW1iZXIpOiBJZlZpc2libGUge1xuICAgICAgICB0aGlzLmlkbGVUaW1lID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgICAgIHRoaXMuc3RhcnRJZGxlVGltZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0SWRsZUR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkbGVUaW1lO1xuICAgIH1cblxuICAgIGdldElkbGVJbmZvKCk6IElkbGVJbmZvIHtcbiAgICAgICAgbGV0IG5vdyA9ICsobmV3IERhdGUoKSk7XG4gICAgICAgIGxldCByZXM6IElkbGVJbmZvO1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFNUQVRVU19JRExFKSB7XG4gICAgICAgICAgICByZXMgPSB7XG4gICAgICAgICAgICAgICAgaXNJZGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlkbGVGb3I6IG5vdyAtIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0UGVyOiAxMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGltZUxlZnQgPSAodGhpcy5pZGxlU3RhcnRlZFRpbWUgKyB0aGlzLmlkbGVUaW1lKSAtIG5vdztcbiAgICAgICAgICAgIHJlcyA9IHtcbiAgICAgICAgICAgICAgICBpc0lkbGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlkbGVGb3I6IG5vdyAtIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0LFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0UGVyOiBwYXJzZUZsb2F0KCgxMDAgLSAodGltZUxlZnQgKiAxMDAgLyB0aGlzLmlkbGVUaW1lKSkudG9GaXhlZCgyKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBpZGxlKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiaWRsZVwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJpZGxlXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7IHN0YXR1czogdGhpcy5zdGF0dXMgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJsdXIoY2FsbGJhY2s/OiAoZGF0YTogYW55KSA9PiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub24oXCJibHVyXCIsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU1RBVFVTX0hJRERFTjtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwiYmx1clwiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwic3RhdHVzQ2hhbmdlZFwiLCBbeyBzdGF0dXM6IHRoaXMuc3RhdHVzIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb2N1cyhjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcImZvY3VzXCIsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyAhPT0gU1RBVFVTX0FDVElWRSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBTVEFUVVNfQUNUSVZFO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJmb2N1c1wiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwid2FrZXVwXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7IHN0YXR1czogdGhpcy5zdGF0dXMgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHdha2V1cChjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcIndha2V1cFwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09IFNUQVRVU19BQ1RJVkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU1RBVFVTX0FDVElWRTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwid2FrZXVwXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7IHN0YXR1czogdGhpcy5zdGF0dXMgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRXZlcnkoc2Vjb25kczogbnVtYmVyLCBjYWxsYmFjazogRnVuY3Rpb24pOiBUaW1lciB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZXIodGhpcywgc2Vjb25kcywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIG5vdyhjaGVjaz86IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoY2hlY2sgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBjaGVjaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0FDVElWRTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pZnZpc2libGUudHMiLCJleHBvcnQgbmFtZXNwYWNlIEV2ZW50cyB7XG4gICAgY29uc3Qgc3RvcmUgPSB7fTtcbiAgICBsZXQgc2V0TGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaChldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKCFzdG9yZVtldmVudF0pIHtcbiAgICAgICAgICAgIHN0b3JlW2V2ZW50XSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHN0b3JlW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gZmlyZShldmVudDogc3RyaW5nLCBhcmdzID0gW10pIHtcbiAgICAgICAgaWYgKHN0b3JlW2V2ZW50XSkge1xuICAgICAgICAgICAgc3RvcmVbZXZlbnRdLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW1vdmUoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICBkZWxldGUgc3RvcmVbZXZlbnRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdG9yZVtldmVudF0pIHtcbiAgICAgICAgICAgIHN0b3JlW2V2ZW50XSA9IHN0b3JlW2V2ZW50XS5maWx0ZXIoKHNhdmVkQ2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sgIT09IHNhdmVkQ2FsbGJhY2s7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb20oZWxlbWVudDogYW55LCBldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKCFzZXRMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHNldExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBldiwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnRbXCJhdHRhY2hFdmVudFwiXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoXCJvblwiICsgZXYsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxbXCJvblwiICsgZXZdID0gZm47XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50cztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9FdmVudHMudHMiLCJpbXBvcnQgeyBJZlZpc2libGUsIFNUQVRVU19BQ1RJVkUgfSBmcm9tIFwiLi9pZnZpc2libGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xuICAgIHByaXZhdGUgdG9rZW46IG51bWJlcjtcbiAgICBzdG9wcGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlmdmlzaWJsZTogSWZWaXNpYmxlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc2Vjb25kczogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcblxuICAgICAgICB0aGlzLmlmdmlzaWJsZS5vbihcInN0YXR1c0NoYW5nZWRcIiwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcHBlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09IFNUQVRVU19BQ1RJVkUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudG9rZW4pO1xuICAgICAgICB0aGlzLnRva2VuID0gc2V0SW50ZXJ2YWwodGhpcy5jYWxsYmFjaywgdGhpcy5zZWNvbmRzICogMTAwMCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc3VtZSgpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1RpbWVyLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==