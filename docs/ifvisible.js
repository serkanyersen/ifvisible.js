(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/Events.ts":
/*!***********************!*\
  !*** ./src/Events.ts ***!
  \***********************/
/*! no static exports found */
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

/***/ "./src/Timer.ts":
/*!**********************!*\
  !*** ./src/Timer.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ifvisible_1 = __webpack_require__(/*! ./ifvisible */ "./src/ifvisible.ts");
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


/***/ }),

/***/ "./src/ifvisible.ts":
/*!**************************!*\
  !*** ./src/ifvisible.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __webpack_require__(/*! ./Events */ "./src/Events.ts");
const Timer_1 = __webpack_require__(/*! ./Timer */ "./src/Timer.ts");
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

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
const ifvisible_1 = __webpack_require__(/*! ./ifvisible */ "./src/ifvisible.ts");
// decide between self vs global depending on the environment
const root = typeof self === "object" && self.self === self && self ||
    typeof global === "object" && global.global === global && global ||
    this;
exports.ifvisible = new ifvisible_1.IfVisible(root, document);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/main.ts */"./src/main.ts");


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9FdmVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1RpbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9pZnZpc2libGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNB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LFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUMvQjthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxxQkFBYSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQWEsQ0FBQztZQUM1QixnQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixnQkFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFlLEVBQUUsUUFBa0I7UUFDdkMsT0FBTyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYztRQUNkLElBQUksS0FBSyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUM7U0FDaEM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxxQkFBYSxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztDQUNKO0FBcE1ELDhCQW9NQzs7Ozs7Ozs7Ozs7Ozs7O0FDbk9ELGlGQUF3QztBQUd4Qyw2REFBNkQ7QUFDN0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUk7SUFDdEQsT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU07SUFDaEUsSUFBSSxDQUFDO0FBRUwsaUJBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDIiwiZmlsZSI6ImlmdmlzaWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbn0gY2F0Y2ggKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcbiIsImV4cG9ydCBuYW1lc3BhY2UgRXZlbnRzIHtcbiAgICBjb25zdCBzdG9yZSA9IHt9O1xuICAgIGxldCBzZXRMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gYXR0YWNoKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICBpZiAoIXN0b3JlW2V2ZW50XSkge1xuICAgICAgICAgICAgc3RvcmVbZXZlbnRdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc3RvcmVbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBmaXJlKGV2ZW50OiBzdHJpbmcsIGFyZ3MgPSBbXSkge1xuICAgICAgICBpZiAoc3RvcmVbZXZlbnRdKSB7XG4gICAgICAgICAgICBzdG9yZVtldmVudF0uZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZShldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGRlbGV0ZSBzdG9yZVtldmVudF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0b3JlW2V2ZW50XSkge1xuICAgICAgICAgICAgc3RvcmVbZXZlbnRdID0gc3RvcmVbZXZlbnRdLmZpbHRlcigoc2F2ZWRDYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayAhPT0gc2F2ZWRDYWxsYmFjaztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRvbShlbGVtZW50OiBhbnksIGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICBpZiAoIXNldExpc3RlbmVyKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldiwgZm4sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudFtcImF0dGFjaEV2ZW50XCJdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbCwgZXYsIGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudChcIm9uXCIgKyBldiwgZm4sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbCwgZXYsIGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbFtcIm9uXCIgKyBldl0gPSBmbjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRMaXN0ZW5lcihlbGVtZW50LCBldmVudCwgY2FsbGJhY2spO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzO1xuIiwiaW1wb3J0IHsgSWZWaXNpYmxlLCBTVEFUVVNfQUNUSVZFIH0gZnJvbSBcIi4vaWZ2aXNpYmxlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyIHtcbiAgICBwcml2YXRlIHRva2VuOiBudW1iZXI7XG4gICAgc3RvcHBlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBpZnZpc2libGU6IElmVmlzaWJsZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNlY29uZHM6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG5cbiAgICAgICAgdGhpcy5pZnZpc2libGUub24oXCJzdGF0dXNDaGFuZ2VkXCIsIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3BwZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSBTVEFUVVNfQUNUSVZFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRva2VuKTtcbiAgICAgICAgdGhpcy50b2tlbiA9IHNldEludGVydmFsKHRoaXMuY2FsbGJhY2ssIHRoaXMuc2Vjb25kcyAqIDEwMDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdG9wKCkge1xuICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXN1bWUoKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cbn1cbiIsImltcG9ydCBFdmVudHMgZnJvbSBcIi4vRXZlbnRzXCI7XG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vVGltZXJcIjtcblxuZXhwb3J0IGNvbnN0IFNUQVRVU19BQ1RJVkUgPSBcImFjdGl2ZVwiO1xuZXhwb3J0IGNvbnN0IFNUQVRVU19JRExFID0gXCJpZGxlXCI7XG5leHBvcnQgY29uc3QgU1RBVFVTX0hJRERFTiA9IFwiaGlkZGVuXCI7XG4vLyBkZWNsYXJlIHZhciBfX1ZFUlNJT05fXzogc3RyaW5nO1xubGV0IERPQ19ISURERU46IHN0cmluZztcbmxldCBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVDogc3RyaW5nID0gdm9pZCAwO1xuXG5leHBvcnQgaW50ZXJmYWNlIElkbGVJbmZvIHtcbiAgICBpc0lkbGU6IGJvb2xlYW47XG4gICAgaWRsZUZvcjogbnVtYmVyO1xuICAgIHRpbWVMZWZ0OiBudW1iZXI7XG4gICAgdGltZUxlZnRQZXI6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IElFID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdW5kZWYsXG4gICAgICAgIHYgPSAzLFxuICAgICAgICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgICBhbGwgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpXCIpO1xuXG4gICAgd2hpbGUgKFxuICAgICAgICBkaXYuaW5uZXJIVE1MID0gXCI8IS0tW2lmIGd0IElFIFwiICsgKCsrdikgKyBcIl0+PGk+PC9pPjwhW2VuZGlmXS0tPlwiLFxuICAgICAgICBhbGxbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIHYgPiA0ID8gdiA6IHVuZGVmO1xufSgpKTtcblxuZXhwb3J0IGNsYXNzIElmVmlzaWJsZSB7XG4gICAgcHVibGljIHN0YXR1czogc3RyaW5nID0gU1RBVFVTX0FDVElWRTtcbiAgICBwdWJsaWMgVkVSU0lPTiA9IFwiMi4wLjExXCI7XG4gICAgcHJpdmF0ZSB0aW1lcnM6IG51bWJlcltdID0gW107XG4gICAgcHJpdmF0ZSBpZGxlVGltZTogbnVtYmVyID0gMzAwMDA7XG4gICAgcHJpdmF0ZSBpZGxlU3RhcnRlZFRpbWU6IG51bWJlcjtcbiAgICBwcml2YXRlIGlzTGVnYWN5TW9kZU9uID0gZmFsc2U7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdCwgcHJpdmF0ZSBkb2MpIHtcbiAgICAgICAgLy8gRmluZCBjb3JyZWN0IGJyb3dzZXIgZXZlbnRzXG4gICAgICAgIGlmICh0aGlzLmRvYy5oaWRkZW4gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZG9jW1wibW96SGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIm1vekhpZGRlblwiO1xuICAgICAgICAgICAgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRvY1tcIm1zSGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIm1zSGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kb2NbXCJ3ZWJraXRIaWRkZW5cIl0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwid2Via2l0SGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERPQ19ISURERU4gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgdGhpcy5sZWdhY3lNb2RlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0cmFja0NoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kb2NbRE9DX0hJRERFTl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibHVyKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0cmFja0NoYW5nZSgpOyAvLyBnZXQgaW5pdGlhbCBzdGF0dXNcbiAgICAgICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5ULCB0cmFja0NoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydElkbGVUaW1lcigpO1xuICAgICAgICB0aGlzLnRyYWNrSWRsZVN0YXR1cygpO1xuICAgIH1cblxuICAgIGxlZ2FjeU1vZGUoKSB7XG4gICAgICAgIC8vIGl0J3MgYWxyZWFkeSBvblxuICAgICAgICBpZiAodGhpcy5pc0xlZ2FjeU1vZGVPbikgeyByZXR1cm47IH1cblxuICAgICAgICBsZXQgQkxVUl9FVkVOVCA9IFwiYmx1clwiO1xuICAgICAgICBsZXQgRk9DVVNfRVZFTlQgPSBcImZvY3VzXCI7XG5cbiAgICAgICAgaWYgKElFIDwgOSkge1xuICAgICAgICAgICAgQkxVUl9FVkVOVCA9IFwiZm9jdXNvdXRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5yb290LCBCTFVSX0VWRU5ULCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJsdXJyZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ibHVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5yb290LCBGT0NVU19FVkVOVCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pc0xlZ2FjeU1vZGVPbiA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhcnRJZGxlVGltZXIoZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICAvLyBQcmV2ZW50cyBQaGFudG9tIGV2ZW50cy5cbiAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc2Vya2FueWVyc2VuL2lmdmlzaWJsZS5qcy9wdWxsLzM3XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQubW92ZW1lbnRYID09PSAwICYmIGV2ZW50Lm1vdmVtZW50WSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50aW1lcnMubWFwKGNsZWFyVGltZW91dCk7XG4gICAgICAgIHRoaXMudGltZXJzLmxlbmd0aCA9IDA7IC8vIGNsZWFyIHRoZSBhcnJheVxuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0lETEUpIHtcbiAgICAgICAgICAgIHRoaXMud2FrZXVwKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkbGVTdGFydGVkVGltZSA9ICsobmV3IERhdGUoKSk7XG5cbiAgICAgICAgdGhpcy50aW1lcnMucHVzaChzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0FDVElWRSB8fCB0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0hJRERFTikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlkbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5pZGxlVGltZSkpO1xuICAgIH1cblxuICAgIHRyYWNrSWRsZVN0YXR1cygpIHtcbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgXCJtb3VzZW1vdmVcIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgXCJtb3VzZWRvd25cIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgXCJrZXl1cFwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcInRvdWNoc3RhcnRcIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLnJvb3QsIFwic2Nyb2xsXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIC8vIFdoZW4gcGFnZSBpcyBmb2N1cyB3aXRob3V0IGFueSBldmVudCwgaXQgc2hvdWxkIG5vdCBiZSBpZGxlLlxuICAgICAgICB0aGlzLmZvY3VzKHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIEV2ZW50cy5hdHRhY2goZXZlbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrPzogYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgRXZlbnRzLnJlbW92ZShldmVudCwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRJZGxlRHVyYXRpb24oc2Vjb25kczogbnVtYmVyKTogSWZWaXNpYmxlIHtcbiAgICAgICAgdGhpcy5pZGxlVGltZSA9IHNlY29uZHMgKiAxMDAwO1xuICAgICAgICB0aGlzLnN0YXJ0SWRsZVRpbWVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldElkbGVEdXJhdGlvbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pZGxlVGltZTtcbiAgICB9XG5cbiAgICBnZXRJZGxlSW5mbygpOiBJZGxlSW5mbyB7XG4gICAgICAgIGxldCBub3cgPSArKG5ldyBEYXRlKCkpO1xuICAgICAgICBsZXQgcmVzOiBJZGxlSW5mbztcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSURMRSkge1xuICAgICAgICAgICAgcmVzID0ge1xuICAgICAgICAgICAgICAgIGlzSWRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpZGxlRm9yOiBub3cgLSB0aGlzLmlkbGVTdGFydGVkVGltZSxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdDogMCxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdFBlcjogMTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRpbWVMZWZ0ID0gKHRoaXMuaWRsZVN0YXJ0ZWRUaW1lICsgdGhpcy5pZGxlVGltZSkgLSBub3c7XG4gICAgICAgICAgICByZXMgPSB7XG4gICAgICAgICAgICAgICAgaXNJZGxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpZGxlRm9yOiBub3cgLSB0aGlzLmlkbGVTdGFydGVkVGltZSxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdCxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdFBlcjogcGFyc2VGbG9hdCgoMTAwIC0gKHRpbWVMZWZ0ICogMTAwIC8gdGhpcy5pZGxlVGltZSkpLnRvRml4ZWQoMikpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgaWRsZShjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcImlkbGVcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBTVEFUVVNfSURMRTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwiaWRsZVwiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwic3RhdHVzQ2hhbmdlZFwiLCBbeyBzdGF0dXM6IHRoaXMuc3RhdHVzIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBibHVyKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiYmx1clwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19ISURERU47XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcImJsdXJcIik7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcInN0YXR1c0NoYW5nZWRcIiwgW3sgc3RhdHVzOiB0aGlzLnN0YXR1cyB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9jdXMoY2FsbGJhY2s/OiAoZGF0YTogYW55KSA9PiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub24oXCJmb2N1c1wiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09IFNUQVRVU19BQ1RJVkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU1RBVFVTX0FDVElWRTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwiZm9jdXNcIik7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcIndha2V1cFwiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwic3RhdHVzQ2hhbmdlZFwiLCBbeyBzdGF0dXM6IHRoaXMuc3RhdHVzIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3YWtldXAoY2FsbGJhY2s/OiAoZGF0YTogYW55KSA9PiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub24oXCJ3YWtldXBcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBTVEFUVVNfQUNUSVZFKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcIndha2V1cFwiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwic3RhdHVzQ2hhbmdlZFwiLCBbeyBzdGF0dXM6IHRoaXMuc3RhdHVzIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkV2ZXJ5KHNlY29uZHM6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogVGltZXIge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRoaXMsIHNlY29uZHMsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBub3coY2hlY2s/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNoZWNrICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gY2hlY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZlZpc2libGUgfSBmcm9tIFwiLi9pZnZpc2libGVcIjtcblxuZGVjbGFyZSB2YXIgZ2xvYmFsOiBhbnk7XG4vLyBkZWNpZGUgYmV0d2VlbiBzZWxmIHZzIGdsb2JhbCBkZXBlbmRpbmcgb24gdGhlIGVudmlyb25tZW50XG5jb25zdCByb290ID0gdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcbiAgICAgICAgICAgICB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiICYmIGdsb2JhbC5nbG9iYWwgPT09IGdsb2JhbCAmJiBnbG9iYWwgfHxcbiAgICAgICAgICAgICB0aGlzO1xuXG5leHBvcnQgY29uc3QgaWZ2aXNpYmxlID0gbmV3IElmVmlzaWJsZShyb290LCBkb2N1bWVudCk7XG4iXSwic291cmNlUm9vdCI6IiJ9