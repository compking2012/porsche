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
        this._offImageSrc = global.AppFXRootPath + "/resources/switchoff.png";
        this._onImageSrc = global.AppFXRootPath + "/resources/switchon.png";
        this._image = new Image();

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("tap", this._onTapFunc = this.onTap.bind(this));

        this.value = false;
    },

    destroy: function() {
        this._disabledImageSrc = null;
        this._offImageSrc = null;
        this._onImageSrc = null;
        this._image.onload = null;
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
        this.value = !this.value;
        this.invalidate();
    },

    updateImage: function() {
        // FIXME: should support addEventListener insteadof onload event.
        this._image.onload = function() {
            this._image.onload = null;
            this.invalidate();
        }.bind(this);
        if (!this._enabled) {
            this._image.src = this._disabledImageSrc;
        } else {
            if (this._value) {
                this._image.src = this._onImageSrc;
            } else {
                this._image.src = this._offImageSrc;
            }
        }
    },

    draw: function(context) {
        context.drawImage(this._image, (this._width - this._image.width) / 2, (this._height - this._image.height) / 2, this._image.width, this._image.height);
    }
}, module);
