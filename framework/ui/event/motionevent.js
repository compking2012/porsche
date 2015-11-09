"use strict";
var Class = require("../class");
var UIEvent = require("./uievent");

/**
 * Gesture Event
 * @class GestureEvent
 * @extends UIEvent
 */
Class.define("{Framework}.ui.event.MotionEvent", UIEvent, {
    /**
     * Constructor
     * @method Motion#initialize
     */
    initialize: function(/*options*/) {
        UIEvent.prototype.initialize.apply(this, arguments);
    }
}, module);
