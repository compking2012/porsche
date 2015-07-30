define(function(require, exports, module) {

"use strict";
var Class = require("./class");
var YObject = require("./yobject");

/**
 * Event emitter
 * @class EventEmitter
 * @extends YObject
 */
Class.define("framework.EventEmitter", YObject, {
    /**
     * Constructor
     * @method EventEmitter#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);
        this.events = {};
    },

    /**
     * Destructor
     * @method EventEmitter#destroy
     */
    destroy: function() {
        for (var key in this.events) {
            if (this.events.hasOwnProperty(key)) {
                this.removeEventListener(this.events[key]);
            }
        }
        this.events = null;
        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * Invoke each of the listeners in order with the supplied arguments.
     * @param {String} event - event name
     * @param {...*} argN - the supplied arguments
     * @method EventEmitter#dispatchEvent
     */
    dispatchEvent: function(event) {
        if (!this.events[event]) {
            return;
        }

        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var handlers = this.events[event] instanceof Array ? this.events[event] : [this.events[event]];
        for (var k = 0; k < handlers.length; k++) {
            handlers[k].apply(this, args);
        }
    },

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param {String} event - event name
     * @param {function} listener - a listener for the specified event
     * @method EventEmitter#addEventListener
     */
    addEventListener: function(event, handler) {
        if (!handler instanceof Function) {
            return;
        }

        if (!this.events[event]) {
            this.events[event] = handler;
        }
        else if (this.events[event] instanceof Array) {
            this.events[event].push(handler);
        }
        else {
            this.events[event] = [this.events[event], handler];
        }
    },

    /**
     * Remove a listener from the listener array for the specified event.
     * @param {String} event - event name
     * @param {function} listener - a listener for the specified event
     * @method EventEmitter#removeEventListener
     */
    removeEventListener: function(event, handler) {
        if (!this.events[event]) {
            return;
        }

        if (!handler) {
            delete this.events[event];
        }
        else if (this.events[event] === handler) {
            delete this.events[event];
        }
        else if (this.events[event] instanceof Array) {
            var handlers = this.events[event];
            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
            if (handlers.length === 1) {
                this.events[event] = handlers[0];
            }
        }
    },

    /**
     * Removes all listeners, or those of the specified event.
     * @param {String} [event] - event name
     * @method EventEmitter#removeAllEventListeners
     */
    removeAllEventListeners: function(event) {
        for (var key in this.events) {
            if (this.events.hasOwnProperty(key)) {
                if (event && event === key) {
                    this.removeEventListener(this.events[key]);
                }
            }
        }
    },

    /**
     * Alias of addEventListener
     * @method EventEmitter#emit
     */
    emit: function(event) {
        this.dispatchEvent.call(this, event);
    },

    /**
     * Alias of addEventListener
     * @method EventEmitter#addListener
     */
    addListener: function(event, handler) {
        this.addEventListener.call(this, event, handler);
    },

    /**
     * Alias of removeEventListener
     * @method EventEmitter#removeListener
     */
    removeListener: function(event, handler) {
        this.removeEventListener.call(this, event, handler);
    },

    /**
     * Alias of addEventListener
     * @method EventEmitter#on
     */
    on: function(event, handler) {
        this.addEventListener.call(this, event, handler);
    },

    /**
     * Alias of removeEventListener
     * @method EventEmitter#off
     */
    off: function(event, handler) {
        this.removeEventListener.call(this, event, handler);
    }
}, module);

});
