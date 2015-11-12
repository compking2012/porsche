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
        if (value === null) {
            this._pressedSrc = null;
            this._pressedImage = null;
        } else {
            this._pressedSrc = value;
            this._pressedImage = new Image();
            this._pressedImage.src = value;
        }
        this.invalidate();
    },

    get focusedSrc() {
        return this._focusedSrc;
    },

    set focusedSrc(value) {
        if (value === null) {
            this._focusedSrc = null;
            this._focusedImage = null;
        } else {
            this._focusedSrc = value;
            this._focusedImage = new Image();
            this._focusedImage.src = value;
        }
        this.invalidate();
    },

    get disabledSrc() {
        return this._disabledSrc;
    },

    set disabledSrc(value) {
        if (value === null) {
            this._disabledSrc = null;
            this._disabledImage = null;
        } else {
            this._disabledSrc = value;
            this._disabledImage = new Image();
            this._disabledImage.src = value;
        }
        this.invalidate();
    },

    draw: function(context) {
        var image = null;
        if (!this._enabled) {
            image = this._disabledSrc !== null ? this._disabledImage : this._image;
        } else if (this._selected) {
            image = this._pressedImage !== null ? this._pressedImage : this._image;
        } else {
            image = this._image;
        }
        if (image === null) {
            return;
        }
        this.drawImage(context, image);
    },

    onTouchStart: function() {
        this.updateImage();
    },

    onTouchEnd: function() {
        this.updateImage();
    }
}, module);
