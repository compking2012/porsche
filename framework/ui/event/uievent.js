define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
/* global Event:true */
var Event = require("./event");

/**
 * Base event from all UI elements
 * @class UIevent
 * @extends Event
 */
Class.define("framework.ui.event.UIEvent", Event, {
    initialize: function(/*options*/) {
        Event.prototype.initialize.apply(this, arguments);
        this._propagation = true;
        this._defaultBehavior = true;
    },

    /**
     * @type {bool}
     * @description whether stop propagation
     * @name Event#propagation
     * @private
     */
    get propagation() {
        return this._propagation;
    },

    /**
     * @type {bool}
     * @description whether is send event to system
     * @name Event#preventDefault
     * @private
     */
    get defaultBehavior() {
        return this._defaultBehavior;
    },

    /**
     * @description Stop the propagation of this event to its parent.
     * @method UIevent#stopPropagation
     */
    stopPropagation: function() {
        this._propagation = false;
    },

    /**
     * @description Prevent this event back to system.
     * @method UIevent#preventDefault
     */
    preventDefault: function() {
        this._defaultBehavior = false;
    }
}, module);

});
