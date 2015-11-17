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
 * TouchInput
 */
Class.define("framework.ui.gesture.TouchInput", Input, {
    initialize: function(/*manager*/) {
        this.super.initialize();

        this._targetIds = {};
        this._manager.view.addEventListener("touchstart", this.handleTouchStartFunc = this.handleTouchStart.bind(this));
        this._manager.view.addEventListener("touchmove", this.handleTouchMoveFunc = this.handleTouchMove.bind(this));
        this._manager.view.addEventListener("touchend", this.handleTouchEndFunc = this.handleTouchEnd.bind(this));
    },

    destroy: function() {
        this._targetIds = null;

        this._manager.view.removeEventListener("touchstart", this.handleTouchStartFunc);
        this.handleTouchStartFunc = null;
        this._manager.view.removeEventListener("touchmove", this.handleTouchMoveFunc);
        this.handleTouchMoveFunc = null;
        this._manager.view.removeEventListener("touchend", this.handleTouchEndFunc);
        this.handleTouchEndFunc = null;

        this.super.destroy();
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

    handleTouchEnd: function(e) {
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
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
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
