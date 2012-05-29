/*global define, console */
(function(doc, undefined){
    "use strict";
    var ifvisible;
    var initialized = false;

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

    // Set the name of the hidden property and the change event for visibility

    var hidden = false, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    function init(){
        if(initialized){ return true; }

        // Set events here
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
            addEvent(document, visibilityChange, function(){
                if(document[hidden]){
                    ifvisible.blur();
                }else{
                    ifvisible.focus();
                }
            }, false);
        }

        initialized = true;
    }


    ifvisible = {

        /**
         * When User Opens the page,
         * @note: User may not be looking at it directly
         */
        focus: function(){
            console.log("focused");
        },

        /**
         * When User swicthes tabs or minimizes the window
         * @note: this may trigger when iframes are selected
         */
        blur: function(){
            console.log("blurred");
        },

        /**
         * When page is focused but user is doing nothing on the page
         */
        idle: function(){

        },

        /**
         * When user started to make interactions on the page such as:
         * mousemove, click, keypress, scroll
         * This will be called when page has focus too
         */
        wakeup: function(){

        },

        /**
         * Set an event to ifvisible object
         * @param  {string}   name     Event name such as focus, idle, blur, wakeup
         * @param  {Function} callback callback function to call ben event is fired
         * @return {object}            an object with a stop method to unbid this event
         */
        on: function(name, callback){
            init(); // Auto init on first call

        },

        /**
         * if page is visible then run this given code in given seconds intervals
         * @param  {float}   seconds  seconds to run interval
         * @param  {Function} callback callback function to run
         */
        onEvery: function (seconds, callback) {
            init(); // Auto init on first call


        },

        /**
         * ifvisible.now() return if the page is visible right now?
         * @return {boolean} true if page is visible
         */
        now: function(){
            init(); // Auto init on first call

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