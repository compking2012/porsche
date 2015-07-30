define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var ImageView = require("./imageview");

/**
 * ImageButton widget
 * @class ImageButton
 * @extends Button
 */
Class.define("framework.ui.view.ImageButton", ImageView, {
    /**
     * Constructor
     * @method ImageButton#initialize
     */
    initialize: function() {
        ImageView.prototype.initialize.apply(this, arguments);
        this._normalImage = this._image;
        this._pressedSrc = null;
        this._pressedImage = null;
        this._focusedSrc = null;
        this._focusedImage = null;
        this._disabledSrc = null;
        this._disabledImage = null;

        this.addEventListener("touchstart", this.onTouchStartFunc = this.onTouchStart.bind(this));
        this.addEventListener("touchend", this.onTouchEndFunc = this.onTouchEnd.bind(this));
    },

    /**
     * Destructor
     * @method ImageButton#destroy
     */
    destroy: function() {
        this._normalImage = null;
        this._pressedImage = null;
        this._focusedImage = null;
        this._disabledImage = null;
        this.removeEventListener("touchstart", this.onTouchStartFunc);
        this.onTouchStartFunc = null;
        this.removeEventListener("touchend", this.onTouchEndFunc);
        this.onTouchEndFunc = null;
        ImageView.prototype.destroy.apply(this, arguments);
    },

    get pressedSrc() {
        return this._pressedSrc;
    },

    set pressedSrc(value) {
        if (!value) {
            return;
        }
        this._pressedSrc = value;
        var onLoadFunc = null;
        this._pressedImage = new Image();
        this._pressedImage.addEventListener("load", onLoadFunc = function() {
            this._pressedImage.removeEventListener("load", onLoadFunc);
            this.invalidate();
        }.bind(this));
        this._pressedImage.src = value;
        if (this._pressedImage.complete) {
            this._pressedImage.removeEventListener("load", onLoadFunc);
            this.invalidate();
        }
    },

    get focusedSrc() {
        return this._focusedSrc;
    },

    set focusedSrc(value) {
        if (!value) {
            return;
        }
        this._focusedSrc = value;
        var onLoadFunc = null;
        this._focusedImage = new Image();
        this._focusedImage.addEventListener("load", onLoadFunc = function() {
            this._focusedImage.removeEventListener("load", onLoadFunc);
            this.invalidate();
        }.bind(this));
        this._focusedImage.src = value;
        if (this._focusedImage.complete) {
            this._focusedImage.removeEventListener("load", onLoadFunc);
            this.invalidate();
        }
    },

    get disabledSrc() {
        return this._disabledSrc;
    },

    set disabledSrc(value) {
        if (!value) {
            return;
        }
        this._disabledSrc = value;
        var onLoadFunc = null;
        this._disabledImage = new Image();
        this._disabledImage.addEventListener("load", onLoadFunc = function() {
            this._disabledImage.removeEventListener("load", onLoadFunc);
            this.invalidate();
        }.bind(this));
        this._disabledImage.src = value;
        if (this._disabledImage.complete) {
            this._disabledImage.removeEventListener("load", onLoadFunc);
            this.invalidate();
        }
    },

    draw: function(context) {
        if (!this._enabled) {
            this._image = this._disabledImage;
        } else if (this._selected) {
            this._image = this._pressedImage;
        } else {
            this._image = this._normalImage;
        }

        if (this._image === null) {
            return;
        }
        ImageView.prototype.draw.call(this, context);
    },

    onTouchStart: function() {
        this.invalidate();
    },

    onTouchEnd: function() {
        this.invalidate();
    }
}, module);

});
