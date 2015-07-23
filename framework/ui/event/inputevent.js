define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var UIEvent = require("./uievent");

/**
 * Base event for input
 * @class InputEvent
 * @extends UIEvent
 */
Class.define("framework.ui.event.InputEvent", UIEvent, {
    initialize: function(/*options*/) {
        UIEvent.prototype.initialize.apply(this, arguments);
        this._ctrlKey = false;
        this._altKey = false;
        this._shiftKey = false;
        this._metaKey = false;
    },

    /**
     * Get the state of the Ctrl key.
     * @method InputEvent#ctrlKey
     * @type {Boolean}
     * @description true if the Ctrl key modifier is activated; otherwise false.
     **/
    get ctrlKey() {
        return this._ctrlKey;
    },

    /**
     * Get the state of the Alt key.
     * @method InputEvent#altKey
     * @type {Boolean}
     **/
    get altKey() {
        return this._altKey;
    },

    /**
     * Get the state of the Shift key.
     * @method InputEvent#shiftKey
     * @type {Boolean}
     * @description true if the Shift key modifier is activated; otherwise false.
     **/
    get shiftKey() {
        return this._shiftKey;
    },

    /**
     * Get the state of the Meta key.
     * @method InputEvent#metaKey
     * @type {Boolean}
     * @description true if the meta (Meta) key modifier is activated; otherwise false. On some platforms this attribute may map to a differently-named key modifier.
     **/
    get metaKey() {
        return this._metaKey;
    }
}, module);

});
