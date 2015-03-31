// Generated by CoffeeScript 1.9.1

/*Copyright (c) 2013 Serkan Yersen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(function() {
        return factory();
      });
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.ifvisible = factory();
    }
  })(this, function() {
    var S4, _i, _len, _ref, _results, addCustomEvent, addEvent, all, blur, cgid, check, customEvent, div, doc, ev, evt, fireCustomEvent, fireEvent, guid, hidden, idleStartedTime, idleTime, ie, ifvisible, init, initialized, listeners, now, paused, res, setListener, status, t, timer, trackIdleStatus, undef, v, visibilityChange, wakeUp;
    paused = void 0;
    timer = void 0;
    wakeUp = void 0;
    evt = void 0;
    setListener = void 0;
    all = void 0;
    check = void 0;
    div = void 0;
    undef = void 0;
    v = void 0;
    S4 = void 0;
    addCustomEvent = void 0;
    cgid = void 0;
    fireCustomEvent = void 0;
    guid = void 0;
    listeners = void 0;
    blur = void 0;
    now = void 0;
    res = void 0;
    t = void 0;
    ev = void 0;
    _i = void 0;
    _len = void 0;
    _ref = void 0;
    _results = void 0;
    ifvisible = {};
    doc = document;
    initialized = false;
    status = "active";
    idleTime = 60000;
    idleStartedTime = false;
    customEvent = (function() {
      var removeCustomEvent;
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      guid = function() {
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
      };
      listeners = {};
      cgid = '__ceGUID';
      addCustomEvent = function(obj, event, callback) {
        obj[cgid] = undefined;
        if (!obj[cgid]) {
          obj[cgid] = "ifvisible.object.event.identifier";
        }
        if (!listeners[obj[cgid]]) {
          listeners[obj[cgid]] = {};
        }
        if (!listeners[obj[cgid]][event]) {
          listeners[obj[cgid]][event] = [];
        }
        return listeners[obj[cgid]][event].push(callback);
      };
      fireCustomEvent = function(obj, event, memo) {
        var j, len, ref, results;
        if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
          ref = listeners[obj[cgid]][event];
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            ev = ref[j];
            results.push(ev(memo || {}));
          }
          return results;
        }
      };
      removeCustomEvent = function(obj, event, callback) {
        var cl, i, j, len, ref;
        if (callback) {
          if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
            ref = listeners[obj[cgid]][event];
            for (i = j = 0, len = ref.length; j < len; i = ++j) {
              cl = ref[i];
              if (cl === callback) {
                listeners[obj[cgid]][event].splice(i, 1);
                return cl;
              }
            }
          }
        } else {
          if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
            return delete listeners[obj[cgid]][event];
          }
        }
      };
      return {
        add: addCustomEvent,
        remove: removeCustomEvent,
        fire: fireCustomEvent
      };
    })();
    addEvent = (function() {
      setListener = false;
      return function(el, ev, fn) {
        if (!setListener) {
          if (el.addEventListener) {
            setListener = function(el, ev, fn) {
              return el.addEventListener(ev, fn, false);
            };
          } else if (el.attachEvent) {
            setListener = function(el, ev, fn) {
              return el.attachEvent('on' + ev, fn, false);
            };
          } else {
            setListener = function(el, ev, fn) {
              return el['on' + ev] = fn;
            };
          }
        }
        return setListener(el, ev, fn);
      };
    })();
    fireEvent = function(element, event) {
      if (doc.createEventObject) {
        return element.fireEvent('on' + event, evt);
      } else {
        evt = doc.createEvent('HTMLEvents');
        evt.initEvent(event, true, true);
        return !element.dispatchEvent(evt);
      }
    };
    ie = (function() {
      undef = void 0;
      v = 3;
      div = doc.createElement("div");
      all = div.getElementsByTagName("i");
      check = function() {
        return (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->", all[0]);
      };
      while (check()) {
        continue;
      }
      if (v > 4) {
        return v;
      } else {
        return undef;
      }
    })();
    hidden = false;
    visibilityChange = void 0;
    if (typeof doc.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof doc.mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof doc.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof doc.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    trackIdleStatus = function() {
      timer = false;
      wakeUp = function() {
        clearTimeout(timer);
        if (status !== "active") {
          ifvisible.wakeup();
        }
        idleStartedTime = +(new Date());
        return timer = setTimeout(function() {
          if (status === "active") {
            return ifvisible.idle();
          }
        }, idleTime);
      };
      wakeUp();
      addEvent(doc, "mousemove", wakeUp);
      addEvent(doc, "keyup", wakeUp);
      addEvent(window, "scroll", wakeUp);
      return ifvisible.focus(wakeUp);
    };
    init = function() {
      if (initialized) {
        return true;
      }
      if (hidden === false) {
        blur = "blur";
        if (ie < 9) {
          blur = "focusout";
        }
        addEvent(window, blur, function() {
          return ifvisible.blur();
        });
        addEvent(window, "focus", function() {
          return ifvisible.focus();
        });
      } else {
        addEvent(doc, visibilityChange, function() {
          if (doc[hidden]) {
            return ifvisible.blur();
          } else {
            return ifvisible.focus();
          }
        }, false);
      }
      initialized = true;
      return trackIdleStatus();
    };
    ifvisible = {
      setIdleDuration: function(seconds) {
        return idleTime = seconds * 1000;
      },
      getIdleDuration: function() {
        return idleTime;
      },
      getIdleInfo: function() {
        now = +(new Date());
        res = {};
        if (status === "idle") {
          res.isIdle = true;
          res.idleFor = now - idleStartedTime;
          res.timeLeft = 0;
          res.timeLeftPer = 100;
        } else {
          res.isIdle = false;
          res.idleFor = now - idleStartedTime;
          res.timeLeft = (idleStartedTime + idleTime) - now;
          res.timeLeftPer = (100 - (res.timeLeft * 100 / idleTime)).toFixed(2);
        }
        return res;
      },
      focus: function(callback) {
        if (typeof callback === "function") {
          return this.on("focus", callback);
        }
        status = "active";
        customEvent.fire(this, "focus");
        customEvent.fire(this, "wakeup");
        return customEvent.fire(this, "statusChanged", {
          status: status
        });
      },
      blur: function(callback) {
        if (typeof callback === "function") {
          return this.on("blur", callback);
        }
        status = "hidden";
        customEvent.fire(this, "blur");
        customEvent.fire(this, "idle");
        return customEvent.fire(this, "statusChanged", {
          status: status
        });
      },
      idle: function(callback) {
        if (typeof callback === "function") {
          return this.on("idle", callback);
        }
        status = "idle";
        customEvent.fire(this, "idle");
        return customEvent.fire(this, "statusChanged", {
          status: status
        });
      },
      wakeup: function(callback) {
        if (typeof callback === "function") {
          return this.on("wakeup", callback);
        }
        status = "active";
        trackIdleStatus();
        customEvent.fire(this, "wakeup");
        return customEvent.fire(this, "statusChanged", {
          status: status
        });
      },
      on: function(name, callback) {
        init();
        return customEvent.add(this, name, callback);
      },
      off: function(name, callback) {
        init();
        return customEvent.remove(this, name, callback);
      },
      onEvery: function(seconds, callback) {
        init();
        paused = false;
        if (callback) {
          t = setInterval(function() {
            if (status === "active" && paused === false) {
              return callback();
            }
          }, seconds * 1000);
        }
        return {
          stop: function() {
            return clearInterval(t);
          },
          pause: function() {
            return paused = true;
          },
          resume: function() {
            return paused = false;
          },
          code: t,
          callback: callback
        };
      },
      now: function() {
        init();
        return status === "active";
      }
    };
    return ifvisible;
  });

}).call(this);

//# sourceMappingURL=ifvisible.js.map
