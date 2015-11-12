"use strict";
var Class = require("../../class");
var View = require("./view");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Switch widget
 * @class Switch
 * @extends View
 */
Class.define("CompositeView.ui.view.Switch", View, {
    initialize: function () {
        View.prototype.initialize.apply(this, arguments);

        this._disabledImageSrc = global.AppFXRootPath + "/resources/switchdisabled.png";
        this._disabledImage = new Image();
        this._offImageSrc = global.AppFXRootPath + "/resources/switchoff.png";
        this._offImage = new Image();
        this._onImageSrc = global.AppFXRootPath + "/resources/switchon.png";
        this._onImage = new Image();
        this._image = this._onImage;

        // FIXME: should support addEventListener insteadof onload event.
        this._onImage.onload = function() {
            this._onImage.onload = null;
            this._offImage.onload = function() {
                this._offImage.onload = null;
                this._disabledImage.onload = function() {
                    this._disabledImage.onload = null;

                    this.value = true;
                }.bind(this);
                this._disabledImage.src = this._disabledImageSrc;
            }.bind(this);
            this._offImage.src = this._offImageSrc;
        }.bind(this);
        this._onImage.src = this._onImageSrc;

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("tap", this._onTapFunc = this.onTap.bind(this));
    },

    destroy: function() {
        this._disabledImageSrc = null;
        this._disabledImage.onload = null;
        this._disabledImage = null;

        this._offImageSrc = null;
        this._offImage.onload = null;
        this._offImage = null;

        this._onImageSrc = null;
        this._onImage.onload = null;
        this._onImage = null;

        this._image = null;

        this.removeGestureRecognizer(this._tapRecognizer);
        this.removeEventListener("tap", this._onTapFunc);
        this._onTapFunc = null;

        View.prototype.destroy.apply(this, arguments);
    },

    get value() {
        return this._value;
    },

    set value(value) {
        var oldValue = this._value;
        if (oldValue === value) {
            return;
        }
        this._value = value;
        this.dispatchEvent("propertychange", "value", oldValue, value);
        this.updateImage();
    },

    set enabled(value) {
        var oldValue = this._enabled;
        if (oldValue === value) {
            return;
        }
        this._enabled = value;
        this.dispatchEvent("propertychange", "enabled", oldValue, value);
        this.updateImage();
    },

    onTap: function(/*e*/) {
        this.value = !this._value;
        this.invalidate();
    },

    updateImage: function() {
        if (!this._enabled) {
            this._image = this._disabledImage;
        } else {
            if (this._value) {
                this._image = this._onImage;
            } else {
                this._image = this._offImage;
            }
        }
        this.invalidate();
    },

    draw: function(context) {
        context.drawImage(this._image, (this._width - this._image.width) / 2, (this._height - this._image.height) / 2, this._image.width, this._image.height);
    }
}, module);
