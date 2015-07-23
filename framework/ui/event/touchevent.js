define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var InputEvent = require("./inputevent");

/**
 * Base event from user touch
 * @class TouchEvent
 * @extends InputEvent
 */
Class.define("framework.ui.event.TouchEvent", InputEvent, {
    initialize: function(options) {
        InputEvent.prototype.initialize.apply(this, arguments);
        this._touches = options.touches !== undefined ? options.touches : [];
        this._targetTouches = [];
        this._changedTouches = [];
    },

    /**
     * @name TouchEvent#touches
     * @type {Touch[]}
     * @description A list of touches for every point of contact currently touching the surface.
     * @readonly
     */
    get touches() {
        return this._touches;
    },

    /**
     * @name TouchEvent#targetTouches
     * @type {Touch[]}
     * @description A list of touches for every point of contact that is touching the surface and started on the element that is the target of the current event.
     * @readonly
     */
    get targetTouches() {
        return this._targetTouches;
    },

    /**
     * @name TouchEvent#changedTouches
     * @type {Touch[]}
     * @description A list of touches for every point of contact which contributed to the event.
     * @readonly
     */
    get changedTouches() {
        return this._changedTouches;
    }
}, module);

});
