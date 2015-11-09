"use strict";
var Class = require("../../class");
var View = require("./view");
var TapRecognizer = require("../gesture/taprecognizer");
var Canvas = require("canvas/lib/canvas");
var fs = require("fs");

/**
 * Switch widget
 * @class Switch
 * @extends View
 */
Class.define("CompositeView.ui.view.Switch", View, {
    initialize: function () {
        View.prototype.initialize.apply(this, arguments);

        this._disabledSrc = "/framework/resources/switchdisabled.png";
        this._disabledImage = null;
        this._offSrc = "/framework/resources/switchoff.png";
        this._offImage = null;
        this._onSrc = "/framework/resources/switchon.png";
        this._onImage = null;
        this._value = false;
        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("tap", this._onTapFunc = this.onTap.bind(this));
    },

    destroy: function() {
        this._disabledImage = null;
        this._offImage = null;
        this._onImage = null;
        this.removeGestureRecognizer(this._tapRecognizer);
        this.removeEventListener("tap", this._onTapFunc);
        this._onTapFunc = null;

        View.prototype.destroy.apply(this, arguments);
    },

    get value() {
        return this._value;
    },

    set value(value) {
        this._value = value;
        this.invalidate();
    },

    onTap: function(/*e*/) {
        this._value = !this._value;
        this.invalidate();
    },

    draw: function(context) {
        if (!this._enabled) {
            if (this._disabledSrc) {
                if (this._disabledImage === null) {
                    this._disabledImage = new Canvas.Image();
                    this._disabledImage.src = fs.readFileSync(this._disabledSrc);
                }
                context.drawImage(this._disabledImage, (this._width - this._disabledImage.width) / 2, (this._height - this._disabledImage.height) / 2, this._disabledImage.width, this._disabledImage.height);
                return;
            }
        }

        if (this._value) {
            if (this._onSrc) {
                if (this._onImage === null) {
                    this._onImage = new Canvas.Image();
                    this._onImage.src = fs.readFileSync(this._onSrc);
                }
                context.drawImage(this._onImage, (this._width - this._onImage.width) / 2, (this._height - this._onImage.height) / 2, this._onImage.width, this._onImage.height);
                return;
            }
        } else {
            if (this._offSrc) {
                if (this._offImage === null) {
                    this._offImage = new Canvas.Image();
                    this._offImage.src = fs.readFileSync(this._offSrc);
                }
                context.drawImage(this._offImage, (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                return;
            }
        }
    }
}, module);
