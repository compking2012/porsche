"use strict";
var Class = require("../../class");
var Input = require("./input");
var Util = require("./util");

/**
 * TouchInput
 */
Class.define("{Framework}.ui.gesture.SingleTouchInput", Input, {
    initialize: function(/*manager*/) {
        Input.prototype.initialize.apply(this, arguments);

        this._started = false;
        this._manager.view.addEventListener("touchstart", this.handleTouchStartFunc = this.handleTouchStart.bind(this));
        this._manager.view.addEventListener("touchmove", this.handleTouchMoveFunc = this.handleTouchMove.bind(this));
        this._manager.view.addEventListener("touchend", this.handleTouchEndFunc = this.handleTouchEnd.bind(this));
    },

    destroy: function() {
        this._manager.view.removeEventListener("touchstart", this.handleTouchStartFunc);
        this.handleTouchStartFunc = null;
        this._manager.view.removeEventListener("touchmove", this.handleTouchMoveFunc);
        this.handleTouchMoveFunc = null;
        this._manager.view.removeEventListener("touchend", this.handleTouchEndFunc);
        this.handleTouchEndFunc = null;

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

    handleTouchEnd: function(e) {
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
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
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
