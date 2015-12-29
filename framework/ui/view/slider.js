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
var ProgressView = require("./progressview");
var Rectangle = require("../../graphics/rectangle");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Slider is a visual control used to select a single value from a continuous range of values.
 * Sliders are always displayed as horizontal bars.
 * An indicator, or thumb, notes the current value of the slider and can be moved by the user to change the setting.
 * @class Slider
 * @extends ProgressView
 */
Class.define("framework.ui.view.Slider", ProgressView, {
    /**
     * Constructor that create a slider view
     * @method Slider#initialize
     */
    initialize: function() {
        ProgressView.prototype.initialize.apply(this, arguments);

        this._defaultThumbSrc = global.AppFXRootPath + "/resources/sliderthumb.png";
        this._thumbImage = new Image();
        this._thumbRect = new Rectangle(0, 0, 0, 0);
        this._continuous = true;

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("tap", this._onTapFunc = this.onTap.bind(this));

        this.thumb = this._defaultThumbSrc;
    },

    /**
     * Destructor that destroy a slider view
     * @method Slider#destroy
     */
    destroy: function() {
        this._thumbImage.onload = null;
        this._thumbImage = null;

        this._thumbRect.destroy();
        this._thumbRect = null;

        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;
        this.removeEventListener("tap", this._onTapFunc);
        this._onTapFunc = null;

        ProgressView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Slider#thumb
     * @type {String}
     * @description the thumb image url that provides the normal state of this slider.
     */
    get thumb() {
        return this._thumbImage.src;
    },

    set thumb(value) {
        this.setProperty("thumb", value, function() {
            // FIXME: should support addEventListener insteadof onload event.
            this._thumbImage.onload = function() {
                this._thumbImage.onload = null;
                this.invalidate();
            }.bind(this);

            if (value === null) {
                this._thumbImage.src = this._defaultThumbSrc;
            } else {

                this._thumbImage.src = value;
            }
        }.bind(this));
    },

    /**
     * @name Slider#continuous
     * @type {Boolean}
     * @description the value indicating whether changes in the sliders value generate continuous update events.
     */
    get continuous() {
        return this._continuous;
    },

    set continuous(value) {
        this._setProperty("continuous", value);
    },

    /**
     * Handle the mouse down event processing.
     * @method Slider#onMouseDown
     * @param {MouseEvent} e - the mouse event info
     * @protected
     */
    onMouseDown: function(e) {
        this.processInputStart(e.clientX, e.clientY);
    },

    /**
     * Handle the mouse move event processing.
     * @method Slider#onMouseMove
     * @param {MouseEvent} e - the mouse event info.
     * @protected
     */
    onMouseMove: function(e) {
        this.processInputMove(e.clientX, e.clientY);
    },

    /**
     * Handle the mouse up event processing.
     * @method Slider#onMouseUp
     * @param {MouseEvent} e - the mouse event info.
     * @protected
     */
    onMouseUp: function(e) {
        this.processInputEnd(e.clientX, e.clientY);
    },

    /**
     * Handle the touch start event processing.
     * @method Slider#onTouchStart
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchStart: function(e) {
        this.processInputStart(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    },

    /**
     * Handle the touch move event processing.
     * @method Slider#onTouchMove
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchMove: function(e) {
        this.processInputMove(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    },

    /**
     * Handle the touch end event processing.
     * @method Slider#onTouchEnd
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchEnd: function(e) {
        this.processInputEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    },

    /**
     * Handle the touch cancel event processing.
     * @method Slider#onTouchCancel
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchCancel: function(e) {
        this.onTouchEnd(e);
    },

    onTap: function(/*e*/) {
        var x = this._lastX;
        var y = this._lastY;
        var w = this._thumbImage.width;
        var h = this._thumbImage.height;
        var halfHeight = this._height / 2;
        var tx = (this._width - w) * this._value + w / 2;
        var ty = halfHeight - h / 2;
        this._thumbRect.assign(tx, ty, tx + w, ty + h);
        if (!this._thumbRect.containsXY(x, y)) {
            var value = (x - w / 2) / (this._width - w);
            if (value < 0) {
                value = 0;
            } else if (value > 1) {
                value = 1;
            }
            this._value = value;
            this.dispatchEvent("change", this._value);
            this.invalidate();
        }
    },

    /**
     * Draw the background of the slider.
     * @method Slider#drawBackground
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawBackground: function(context) {
        var halfHeight = this._height / 2;
        var w = this._thumbImage.width;
        var dw = w / 2;

        context.save();
        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.moveTo(dw, halfHeight);
        context.lineTo(this._width - dw, halfHeight);
        context.strokeStyle = this._colorManager.getColor(context, this._width, this._height, this._background, this._backgroundObject);
        context.stroke();
        context.restore();
    },

    /**
     * Draw the slider.
     * @method Slider#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        if (this._value === 0) {
            this.drawThumb(context);
        }
        var halfHeight = this._height / 2;
        var w = this._thumbImage.width;
        var dw = w / 2;

        context.save();
        context.lineCap = "round";
        context.lineWidth = this._lineWidth;
        context.beginPath();
        context.moveTo(dw, halfHeight);
        context.lineTo((this._width - w) * this._value + dw, halfHeight);
        context.strokeStyle = this._colorManager.getColor(context, this._width, this._height, this._color, this._colorObject);
        context.stroke();
        context.restore();

        this.drawThumb(context);
    },

    /**
     * Draw the thumb of this slider.
     * @method Slider#drawThumb
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawThumb: function(context) {
        context.save();
        var w = this._thumbImage.width;
        var h = this._thumbImage.height;
        var x = (this._width - w) * this._value;
        var y = this._height / 2 - h / 2;
        context.drawImage(this._thumbImage, x, y, w, h);
        context.restore();
    },


    /**
     * Process both the mouse down and touch start event.
     * @method Slider#processInputStart
     * @param {Number} x - the x-axis value
     * @param {Number} y - the y-axis value
     * @private
     */
    processInputStart: function(x, y) {
        var w = this._thumbImage.width;
        var h = this._thumbImage.height;
        var halfHeight = this._height / 2;
        var tx = (this._width - w) * this._value + w / 2;
        var ty = halfHeight - h / 2;
        this._thumbRect.assign(tx, ty, tx + w, ty + h);
        if (this._thumbRect.containsXY(x, y)) {
            this._dragging = true;
            this.invalidate();
        }
    },

    /**
     * Process both the mouse move and touch move event.
     * @method Slider#processInputMove
     * @param {Number} x - the x-axis value
     * @param {Number} y - the y-axis value
     * @private
     */
    processInputMove: function(x/*, y*/) {
        if (this._dragging) {
            var w = this._thumbImage.width;
            var value = (x - w / 2) / (this._width - w);
            if (value < 0) {
                value = 0;
            } else if (value > 1) {
                value = 1;
            }
            this._value = value;
            if (this._continuous) {
                this.dispatchEvent("change", this._value);
            }
            this.invalidate();
        }
    },

    /**
     * Process both the mouse up and touch end/cancel event.
     * @method Slider#processInputEnd
     * @param {Number} x - the x-axis value
     * @param {Number} y - the y-axis value
     * @private
     */
    processInputEnd: function(x, y) {
        this._lastX = x;
        this._lastY = y;
        if (this._dragging) {
            this._dragging = false;
            if (!this._continuous) {
                this.dispatchEvent("change", this._value);
            }
            this.invalidate();
        }
    }
}, module);
