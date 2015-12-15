define(function(require, exports, module) {
/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

"use strict";
var Class = require("./class");
var YObject = require("./yobject");

/**
 * The base class for event-based object which can listen some events as well as emit some ones.
 * Note that this class is never used to instantiate directly.
 * Instead, instantiate a subclass of this class.
 * @class EventEmitter
 * @extends YObject
 * @abstract
 */
Class.define("framework.EventEmitter", YObject, {
    /**
     * Constructor to use when creating an event-emitter based object.
     * @method EventEmitter#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._events = {};
    },

    /**
     * Destructor to use when need to destroy this object manually.
     * @method EventEmitter#destroy
     */
    destroy: function() {
        this.removeAllEventListeners();
        this._events = null;

        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * Invoke each of the listeners in order with the supplied arguments.
     * @param {String} event - event name
     * @param {...*} argN - the supplied arguments
     * @method EventEmitter#dispatchEvent
     */
    dispatchEvent: function(event) {
        if (!this._events[event]) {
            return;
        }

        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var handlers = this._events[event] instanceof Array ? this._events[event] : [this._events[event]];
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

        if (!this._events[event]) {
            this._events[event] = handler;
        } else if (this._events[event] instanceof Array) {
            this._events[event].push(handler);
        } else {
            this._events[event] = [this._events[event], handler];
        }
    },

    /**
     * Remove a listener from the listener array for the specified event.
     * @param {String} event - event name
     * @param {function} listener - a listener for the specified event
     * @method EventEmitter#removeEventListener
     */
    removeEventListener: function(event, handler) {
        if (!this._events[event]) {
            return;
        }

        if (this._events[event] === handler) {
            delete this._events[event];
        } else if (this._events[event] instanceof Array) {
            var handlers = this._events[event];
            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
            if (handlers.length === 1) {
                this._events[event] = handlers[0];
            }
        }
    },

    /**
     * Removes all listeners, or those of the specified event.
     * @param {String} [event] - event name
     * @method EventEmitter#removeAllEventListeners
     */
    removeAllEventListeners: function(event) {
        if (event) {
            delete this._events[event];
        } else {
            this._events = {};
        }
    },

    /**
     * Alias of addEventListener.
     * @method EventEmitter#emit
     */
    emit: function(/*event*/) {
        this.dispatchEvent.apply(this, arguments);
    },

    /**
     * Alias of addEventListener.
     * @method EventEmitter#addListener
     */
    addListener: function(/*event, handler*/) {
        this.addEventListener.apply(this, arguments);
    },

    /**
     * Alias of removeEventListener.
     * @method EventEmitter#removeListener
     */
    removeListener: function(/*event, handler*/) {
        this.removeEventListener.apply(this, arguments);
    },

    /**
     * Alias of addEventListener.
     * @method EventEmitter#on
     */
    on: function(/*event, handler*/) {
        this.addEventListener.apply(this, arguments);
    },

    /**
     * Alias of removeEventListener.
     * @method EventEmitter#off
     */
    off: function(/*event, handler*/) {
        this.removeEventListener.apply(this, arguments);
    },

    /**
     * Creates and returns a copy of this event emitter.
     * @method EventEmitter#clone
     * @return {EventEmitter} a copy of this event emitter.
     */
    clone: function() {
        var clone = YObject.prototype.clone.call(this);
        for (var event in this._events) {
            if (this._events.hasOwnProperty(event)) {
                if (this._events[event] instanceof Array) {
                    var length = this._events[event].length;
                    for (var i = 0; i < length; i++) {
                        clone.addEventListener(event, this._events[event][i]);
                    }
                } else {
                    clone.addEventListener(event, this._events[event]);
                }
            }
        }
        return clone;
    }
}, module);

});