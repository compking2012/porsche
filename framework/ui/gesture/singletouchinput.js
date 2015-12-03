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
var Util = require("./util");

/**
 * @class SingleTouchInput
 * @private
 */
Class.define("framework.ui.gesture.SingleTouchInput", Input, {
    initialize: function(/*manager*/) {
        Input.prototype.initialize.apply(this, arguments);

        this._started = false;
        this._manager.view.addEventListener("touchstart", this._handleTouchStartFunc = this.handleTouchStart.bind(this));
        this._manager.view.addEventListener("touchmove", this._handleTouchMoveFunc = this.handleTouchMove.bind(this));
        this._manager.view.addEventListener("touchend", this._handleTouchEndCancelFunc = this.handleTouchEndCancel.bind(this));
        this._manager.view.addEventListener("touchcancel", this._handleTouchEndCancelFunc);
    },

    destroy: function() {
        this._manager.view.removeEventListener("touchstart", this._handleTouchStartFunc);
        this._handleTouchStartFunc = null;
        this._manager.view.removeEventListener("touchmove", this._handleTouchMoveFunc);
        this._handleTouchMoveFunc = null;
        this._manager.view.removeEventListener("touchend", this._handleTouchEndCancelFunc);
        this._manager.view.removeEventListener("touchcancel", this._handleTouchEndCancelFunc);
        this._handleTouchEndCancelFunc = null;

        Input.prototype.destroy.apply(this, arguments);
    },

    static: {
        SINGLE_TOUCH_INPUT_MAP: {
            touchstart: Input.INPUT_START,
            touchmove: Input.INPUT_MOVE,
            touchend: Input.INPUT_END,
            touchcancel: Input.INPUT_CANCEL
        }
    },

    handleTouchStart: function(e) {
        this.handleTouchEvent(e);
    },

    handleTouchMove: function(e) {
        this.handleTouchEvent(e);
    },

    handleTouchEndCancel: function(e) {
        this.handleTouchEvent(e);
    },

    handleTouchEvent: function(ev) {
        var type = this.constructor.SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === Input.INPUT_START) {
            this._started = true;
        }

        if (!this._started) {
            return;
        }

        var touches = this.normalizeSingleTouches(ev, type);

        // when done, reset the started state
        if (type & (this.constructor.INPUT_END | this.constructor.INPUT_CANCEL) && touches[0].length === touches[1].length) {
            this._started = false;
        }

        this.handleInputEvent(type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: this.constructor.INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    },

    /**
     * @method TouchInput#normalizeSingleTouches
     * @param {Object} ev
     * @param {Number} type flag
     * @return {undefined|Array} [all, changed]
     */
    normalizeSingleTouches: function(ev, type) {
        var all = Util.toArray(ev.touches);
        var changed = Util.toArray(ev.changedTouches);

        if (type & (this.constructor.INPUT_END | this.constructor.INPUT_CANCEL)) {
            all = Util.uniqueArray(all.concat(changed), "identifier", true);
        }

        return [all, changed];
    }
}, module);
