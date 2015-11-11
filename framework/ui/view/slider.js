"use strict";
var Class = require("../../class");
var ProgressView = require("./progressview");
var Rectangle = require("../rectangle");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Slider
 * @class Slider
 * @extends ProgressView
 */
Class.define("framework.ui.view.Slider", ProgressView, {
    initialize: function() {
        ProgressView.prototype.initialize.apply(this, arguments);

        this._defaultThumbSrc = global.AppFXRootPath + "/resources/sliderthumb.png";
        this._thumbImage = new Image();
        this._thumbRect = new Rectangle();
        this._continuous = true;

        this.addEventListener("touchstart", this.onTouchStartFunc = this.onTouchStart.bind(this));
        this.addEventListener("touchmove", this.onTouchMoveFunc = this.onTouchMove.bind(this));
        this.addEventListener("touchend", this.onTouchEndFunc = this.onTouchEnd.bind(this));
        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("tap", this._onTapFunc = this.onTap.bind(this));

        this.thumb = this._defaultThumbSrc;
    },

    destroy: function() {
        this._thumbImage.onload = null;
        this._thumbImage = null;

        this._thumbRect.destroy();
        this._thumbRect = null;

        this.removeEventListener("touchstart", this.onTouchStartFunc);
        this.onTouchStartFunc = null;
        this.removeEventListener("touchmove", this.onTouchMoveFunc);
        this.onTouchMoveFunc = null;
        this.removeEventListener("touchend", this.onTouchEndFunc);
        this.onTouchEndFunc = null;
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;
        this.removeEventListener("tap", this._onTapFunc);
        this._onTapFunc = null;

        ProgressView.prototype.destroy.apply(this, arguments);
    },

    get thumb() {
        return this._thumbImage.src;
    },

    set thumb(value) {
        if (value === null) {
            this._thumbImage.src = this._defaultThumbSrc;
        } else {
            // FIXME: should support addEventListener insteadof onload event.
            this._thumbImage.onload = function() {
                this._thumbImage.onload = null;
                this.invalidate();
            }.bind(this);
            this._thumbImage.src = value;
        }
    },

    get continuous() {
        return this._continuous;
    },

    set continuous(value) {
        this._continuous = value;
        this.invalidate();
    },

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
        if (/^linear\-gradient/.test(this._background)) {
            var linear = this._backgroundObject;
            var colorStopStart = linear[0].colorStops[0];
            var colorStopEnd = linear[0].colorStops[1];
            var gradient = context.createLinearGradient(0, 0, this._width - this._thumbImage.width, this._height);
            gradient.addColorStop(0, colorStopStart.type === "hex" ? "#" + colorStopStart.value : colorStopStart.value);
            gradient.addColorStop(1, colorStopEnd.type === "hex" ? "#" + colorStopEnd.value : colorStopEnd.value);
            context.strokeStyle = gradient;
        } else if (/^radial\-gradient/.test(this._background)) {
            var radial = this._backgroundObject;
            // context.strokeStyle = null;
        } else {
            context.strokeStyle = this._background;
        }
        context.stroke();
        context.restore();
    },

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
        if (/^linear\-gradient/.test(this._foreground)) {
            var linear = this._foregroundObject;
            var colorStopStart = linear[0].colorStops[0];
            var colorStopEnd = linear[0].colorStops[1];
            var gradient = context.createLinearGradient(0, 0, this._width, this._height);
            gradient.addColorStop(0, colorStopStart.type === "hex" ? "#" + colorStopStart.value : colorStopStart.value);
            gradient.addColorStop(1, colorStopEnd.type === "hex" ? "#" + colorStopEnd.value : colorStopEnd.value);
            context.strokeStyle = gradient;
        } else if (/^radial\-gradient/.test(this._foreground)) {
            var radial = this._foregroundObject;
            // context.strokeStyle = null;
        } else {
            context.strokeStyle = this._foreground;
        }
        context.stroke();
        context.restore();

        this.drawThumb(context);
    },

    drawThumb: function(context) {
        context.save();
        var w = this._thumbImage.width;
        var h = this._thumbImage.height;
        var x = (this._width - w) * this._value;
        var y = this._height / 2 - h / 2;
        context.drawImage(this._thumbImage, x, y, w, h);
        context.restore();
    },

    onTouchStart: function(e) {
        var x = e.targetTouches[0].pageX;
        var y = e.targetTouches[0].pageY;
        var w = this._thumbImage.width;
        var h = this._thumbImage.height;
        var halfHeight = this._height / 2;
        var tx = (this._width - w) * this._value + w / 2;
        var ty = halfHeight - h / 2;
        this._thumbRect.assign(tx, ty, w, h);
        if (this._thumbRect.containsXY(x, y)) {
            this._dragging = true;
            this.invalidate();
        }
    },

    onTouchMove: function(e) {
        var x = e.targetTouches[0].pageX;
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

    onTouchEnd: function(e) {
        this._lastX = e.changedTouches[0].pageX;
        this._lastY = e.changedTouches[0].pageY;
        if (this._dragging) {
            this._dragging = false;
            if (!this._continuous) {
                this.dispatchEvent("change", this._value);
            }
            this.invalidate();
        }
    },

    onTap: function(/*e*/) {
        var x = this._lastX;
        var y = this._lastY;
        var w = this._thumbImage.width;
        var h = this._thumbImage.height;
        var halfHeight = this._height / 2;
        var tx = (this._width - w) * this._value + w / 2;
        var ty = halfHeight - h / 2;
        this._thumbRect.assign(tx, ty, w, h);
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
    }
}, module);
