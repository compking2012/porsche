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
var Class = require("../../class");
var Input = require("./input");

/**
 * @class MouseInput
 * @private
 */
Class.define("framework.ui.gesture.MouseInput", Input, {
    initialize: function(/*manager*/) {
        Input.prototype.initialize.apply(this, arguments);

        this._allow = true; // used by Input.TouchMouse to disable mouse events
        this._pressed = false; // mousedown state
        this._manager.view.addEventListener("mousedown", this._handleMouseDownFunc = this.handleMouseDown.bind(this));
        this._manager.view.addEventListener("mousemove", this._handleMouseMoveFunc = this.handleMouseMove.bind(this));
        this._manager.view.addEventListener("mouseup", this._handleMouseUpFunc = this.handleMouseUp.bind(this));
    },

    destroy: function() {
        this._manager.view.removeEventListener("mousedown", this._handleMouseDownFunc);
        this._handleMouseDownFunc = null;
        this._manager.view.removeEventListener("mousemove", this._handleMouseMoveFunc);
        this._handleMouseMoveFunc = null;
        this._manager.view.removeEventListener("mouseup", this._handleMouseUpFunc);
        this._handleMouseUpFunc = null;

        Input.prototype.destroy.apply(this, arguments);
    },

    static: {
        MOUSE_INPUT_MAP: {
            mousedown: Input.INPUT_START,
            mousemove: Input.INPUT_MOVE,
            mouseup: Input.INPUT_END
        }
    },

    handleMouseDown: function(e) {
        this.handleMouseEvent(e);
    },

    handleMouseMove: function(e) {
        this.handleMouseEvent(e);
    },

    handleMouseUp: function(e) {
        this.handleMouseEvent(e);
    },

    handleMouseEvent: function(ev) {
        var eventType = this.constructor.MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & this.constructor.INPUT_START && ev.button === 0) {
            this._pressed = true;
        }

        if (eventType & this.constructor.INPUT_MOVE && ev.button !== 0) {
            eventType = this.constructor.INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this._pressed || !this._allow) {
            return;
        }

        if (eventType & this.constructor.INPUT_END) {
            this._pressed = false;
        }

        console.log(eventType === Input.INPUT_START ? "INPUT_START" : 
            eventType === Input.INPUT_MOVE ? "INPUT_MOVE" : 
            eventType === Input.INPUT_END ? "INPUT_END" : "UNKNOWN");

        this.handleInputEvent(eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: this.constructor.INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
}, module);

});