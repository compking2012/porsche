"use strict";
var Class = require("../../class");
/* global Event:true */
var Event = require("./event");

/**
 * Base event from all UI elements
 * @class UIEvent
 * @extends Event
 */
Class.define("{Framework}.ui.event.UIEvent", Event, {
    /**
     * Constructor
     * @method UIEvent#initialize
     */
    initialize: function(/*options*/) {
        Event.prototype.initialize.apply(this, arguments);

        this._propagation = true;
        this._defaultBehavior = true;
    },

    /**
     * @name UIEvent#propagation
     * @type {Boolean}
     * @description whether stop propagation
     * @private
     */
    get propagation() {
        return this._propagation;
    },

    /**
     * @name UIEvent#defaultBehavior
     * @type {Boolean}
     * @description whether is send event to system
     * @private
     */
    get defaultBehavior() {
        return this._defaultBehavior;
    },

    /**
     * Stop the propagation of this event to its parent.
     * @method UIEvent#stopPropagation
     */
    stopPropagation: function() {
        this._propagation = false;
    },

    /**
     * Prevent this event back to system.
     * @method UIEvent#preventDefault
     */
    preventDefault: function() {
        this._defaultBehavior = false;
    }
}, module);
