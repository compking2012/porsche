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
var Util = require("./util");

/**
 * @class TouchInput
 * @private
 */
Class.define("framework.ui.gesture.TouchInput", Input, {
    initialize: function(/*manager*/) {
        Input.prototype.initialize.apply(this, arguments);

        this._targetIds = {};
        this._manager.view.addEventListener("touchstart", this._handleTouchStartFunc = this.handleTouchStart.bind(this));
        this._manager.view.addEventListener("touchmove", this._handleTouchMoveFunc = this.handleTouchMove.bind(this));
        this._manager.view.addEventListener("touchend", this._handleTouchEndCancelFunc = this.handleTouchEndCancel.bind(this));
        this._manager.view.addEventListener("touchcancel", this._handleTouchEndCancelFunc);
    },

    destroy: function() {
        this._targetIds = null;

        this._manager.view.removeEventListener("touchstart", this._handleTouchStartFunc);
        this._handleTouchStartFunc = null;
        this._manager.view.removeEventListener("touchmove", this._handleTouchMoveFunc);
        this._handleTouchMoveFunc = null;
        this._manager.view.removeEventListener("touchend", this._handleTouchEndCancelFunc);
        this._manager.view.removeEventListener("touchcancel", this._handleTouchEndCancelFunc);
        this._handleTouchEndFunc = null;

        Input.prototype.destroy.apply(this, arguments);
    },

    static: {
        TOUCH_INPUT_MAP: {
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
        var type = this.constructor.TOUCH_INPUT_MAP[ev.type];
        var touches = this.getTouches(ev, type);
        if (!touches) {
            return;
        }

        this.handleInputEvent(type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: this.constructor.INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    },

    /**
     * @method TouchInput#getTouches
     * @param {Object} ev
     * @param {Number} type flag
     * @return {undefined|Array} [all, changed]
     * @private
     */
    getTouches: function(ev, type) {
        var allTouches = Util.toArray(ev.touches);

        // when there is only one touch, the process can be simplified
        if (type & (this.constructor.INPUT_START | this.constructor.INPUT_MOVE) && allTouches.length === 1) {
            this._targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }

        var i,
            targetTouches,
            changedTouches = Util.toArray(ev.changedTouches),
            changedTargetTouches = [],
            target = this._target;

        // get target touches from touches
        targetTouches = allTouches.filter(function(touch) {
            return Util.hasParent(touch.target, target);
        }.bind(this));

        // collect touches
        if (type === this.constructor.INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                this._targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }

        // filter changed touches to only contain touches that exist in the collected target ids
        i = 0;
        while (i < changedTouches.length) {
            if (this._targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }

            // cleanup removed touches
            if (type & (this.constructor.INPUT_END | this.constructor.INPUT_CANCEL)) {
                delete this._targetIds[changedTouches[i].identifier];
            }
            i++;
        }

        if (!changedTargetTouches.length) {
            return;
        }

        return [
            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
            Util.uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true),
            changedTargetTouches
        ];
    }
}, module);

});