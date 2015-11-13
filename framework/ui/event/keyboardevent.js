"use strict";
var Class = require("../../class");
var InputEvent = require("./inputevent");

/**
 * Keyboard event
 * @class KeyboardEvent
 * @extends InputEvent
 */
Class.define("framework.ui.event.KeyboardEvent", InputEvent, {
    /**
     * Constructor
     * @method KeyboardEvent#initialize
     */
    initialize: function(options) {
        InputEvent.prototype.initialize.apply(this, arguments);

        this._keyCode = options.keyCode !== undefined ? options.keyCode : 0;
    },

    destroy: function() {
        InputEvent.prototype.destroy.apply(this, arguments);
    },

    get keyCode() {
        return this._keyCode;
    }
}, module);
