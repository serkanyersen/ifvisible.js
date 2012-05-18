/*global define */
(function(doc, undefined){
    "use strict";

    var initialized = false;

    function init(){
        if(initialized){ return true; }


        // Set events here
        
        initialized = true;
    }


    var ifvisible = {

        /**
         * When User Opens the page,
         * @note: User may not be looking at it directly
         */
        focus: function(){

        },

        /**
         * When User swicthes tabs or minimizes the window
         * @note: this may trigger when iframes are selected
         */
        blur: function(){

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