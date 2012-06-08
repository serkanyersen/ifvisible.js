/*global define, console */
(function(doc, undefined){
    // Use strict rules for proper coding
    "use strict";
    
    /**
     * Export Object
     * @type {Object}
     */
    var ifvisible;

    /**
     * flag to prevent multiple initializations
     * @type {Boolean}
     */
    var initialized = false;
    /**
     * Current status, may contain "active", "idle", "hidden"
     * @type {String}
     */
    var status = "active";

    /**
     * Handle Custom Object events
     * @return {Object} add and fire methods to handle custom events
     */
    var customEvent = (function(){
        /**
         * Create a synthetic GUID
         */
        function S4()   { return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
        function guid() { return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()); }

        /**
         * Event listeners
         * @type {Object}
         */
        var listeners = {};
        /**
         * Add a custom event to a given object
         * @param {Object}   obj      Object to add custom events
         * @param {string}   event    name of the custom event
         * @param {Function} callback callback function to run when event is fired
         */
        var addCustomEvent = function(obj, event, callback){
            if(!obj.__customEventGUID){
                obj.__customEventGUID = guid();
            }

            if(!listeners[obj.__customEventGUID]){
                listeners[obj.__customEventGUID] = {};
            }

            if(!listeners[obj.__customEventGUID][event]){
                listeners[obj.__customEventGUID][event] = [];
            }
            
            listeners[obj.__customEventGUID][event].push(callback);
        };
        /**
         * Trigger the custom event on given object
         * @param  {Object} obj   Object to trigger the event
         * @param  {string} event name of the event to trigger
         * @param  {object} memo  a custom argument to send triggered event
         */
        var fireCustomEvent = function (obj, event, memo) {
            if(obj.__customEventGUID){
                if(listeners[obj.__customEventGUID]){
                    if(listeners[obj.__customEventGUID][event]){
                        var evts = listeners[obj.__customEventGUID][event];
                        for(var i=0; i < evts.length; i++){
                            var e = evts[i](memo || {});
                        }
                    }
                }
            }
        
        };

        /**
         * Export methods
         */
        return {
            add: addCustomEvent,
            fire: fireCustomEvent
        };
    })();

    /**
     * CrossBrowser efent attachement
     * @param  {DomElement}   el Dom Element to attach the event
     * @param  {string}   ev name of the event with on prefix
     * @param  {Function} fn callback function to run when event is fired
     */
    var addEvent = (function () {
        var setListener;
        
        return function (el, ev, fn) {
            if (!setListener) {
                if (el.addEventListener) {
                    setListener = function (el, ev, fn) {
                        el.addEventListener(ev, fn, false);
                    };
                } else if (el.attachEvent) {
                    setListener = function (el, ev, fn) {
                        el.attachEvent('on' + ev, fn);
                    };
                } else {
                    setListener = function (el, ev, fn) {
                        el['on' + ev] =  fn;
                    };
                }
            }
            setListener(el, ev, fn);
        };
    }());

    /**
     * Trigger any HTML events
     * @param  {DomElement} element Dom Element to trigger events on
     * @param  {string} event   event name to trigger
     * @return {boolean}   if dispached or not
     */
    var fireEvent = function (element, event){
        var evt;
        if (document.createEventObject){
            // dispatch for IE
            evt = document.createEventObject();
            return element.fireEvent('on'+event,evt);
        } else{
            // dispatch for firefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    };

    /**
     * Get the IE version
     * @return {Number|Undefined} version number of IE or undefined
     */
    var ie = (function(){

        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );
        
        return v > 4 ? v : undef;
        
    }());


    // Set the name of the hidden property and the change event for visibility checks
    var hidden = false, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        // Standarts
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        // For Gecko browsers
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        // For MSIE
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        // Webkit browsers
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    /**
     * Track if the page is idle or not
     */
    function trackIdleStatus(){
        var timer = false;
        var wakeUp = function(){
            clearTimeout(timer);
            if(status !== "active"){
                ifvisible.wakeup();
            }
            timer = setTimeout(function(){
                ifvisible.idle();
            }, 10000);
        };

        addEvent(document, "mousemove", wakeUp);
        addEvent(window, "scroll", wakeUp);
    }

    /**
     * Initialize the module
     * @constructor
     */
    function init(){
        
        if(initialized){ return true; }

        // If hidden is false the use the legacy methods
        if(hidden === false){
            var blur = "blur";
            if(ie < 9){
                blur = "focusout";
            }

            addEvent(window, blur, function(){
                ifvisible.blur();
            });

            addEvent(window, "focus", function(){
                ifvisible.focus();
            });
        }else{
            // add HTML5 visibility events
            addEvent(document, visibilityChange, function(){
                if(document[hidden]){
                    ifvisible.blur();
                }else{
                    ifvisible.focus();
                }
            }, false);
        }
        trackIdleStatus();
        //Set method to be initialized
        initialized = true;
    }


    /**
     * Methods to be exported
     * @type {Object}
     */
    ifvisible = {
        /**
         * When User Opens the page,
         * @note: User may not be looking at it directly
         */
        focus: function(){
            status = 'active';
            customEvent.fire(this, "focus");
            customEvent.fire(this, "statusChanged", {status:status});
        },

        /**
         * When User swicthes tabs or minimizes the window
         * @note: this may trigger when iframes are selected
         */
        blur: function(){
            status = 'hidden';
            customEvent.fire(this, "blur");
            customEvent.fire(this, "statusChanged", {status:status});
        },

        /**
         * When page is focused but user is doing nothing on the page
         */
        idle: function(){
            status = 'idle';
            customEvent.fire(this, "idle");
            customEvent.fire(this, "statusChanged", {status:status});
        },

        /**
         * When user started to make interactions on the page such as:
         * mousemove, click, keypress, scroll
         * This will be called when page has focus too
         */
        wakeup: function(){
            status = 'active';
            customEvent.fire(this, "wakeup");
            customEvent.fire(this, "statusChanged", {status:status});
        },

        /**
         * Set an event to ifvisible object
         * @param  {string}   name     Event name such as focus, idle, blur, wakeup
         * @param  {Function} callback callback function to call ben event is fired
         * @return {object}            an object with a stop method to unbid this event
         */
        on: function(name, callback){
            init(); // Auto init on first call
            
            customEvent.add(this, name, callback);
        },

        /**
         * if page is visible then run this given code in given seconds intervals
         * @param  {float}   seconds  seconds to run interval
         * @param  {Function} callback callback function to run
         */
        onEvery: function (seconds, callback) {
            init(); // Auto init on first call

            var t = setInterval(function(){
                if(status == 'active'){
                    var ret = callback || callback();
                }
            }, seconds * 1000);

            return {
                stop: function(){
                    clearInterval(t);
                },
                code: t,
                callback: callback
            };
        },

        /**
         * ifvisible.now() return if the page is visible right now?
         * @return {boolean} true if page is visible
         */
        now: function(){
            init(); // Auto init on first call
            return status;
        }
    };


    // If there is a Require JS kind of library use it othervise
    // place it on the window
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return ifvisible;
        });
    } else window.ifvisible = ifvisible;

})(document);