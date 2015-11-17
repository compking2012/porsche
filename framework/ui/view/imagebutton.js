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
var ImageView = require("./imageview");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * ImageButton widget
 * @class ImageButton
 * @extends ImageView
 */
Class.define("framework.ui.view.ImageButton", ImageView, {
    /**
     * Constructor
     * @method ImageButton#initialize
     */
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        this._pressedImageSrc = null;
        this._pressedImage = null;
        this._focusedImageSrc = null;
        this._focusedImage = null;
        this._disabledImageSrc = null;
        this._disabledImage = null;

        this.addEventListener("touchstart", this.onTouchStartFunc = this.onTouchStart.bind(this));
        this.addEventListener("touchend", this.onTouchEndFunc = this.onTouchEnd.bind(this));
        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
    },

    /**
     * Destructor
     * @method ImageButton#destroy
     */
    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer = null;

        this._pressedImageSrc = null;
        if (this._pressedImage !== null) {
            this._pressedImage.onload = null;
            this._pressedImage = null;
        }

        this._focusedImageSrc = null;
        if (this._focusedImage !== null) {
            this._focusedImage.onload = null;
            this._focusedImage = null;
        }

        this._disabledImageSrc = null;
        if (this._disabledImage !== null) {
            this._disabledImage.onload = null;
            this._disabledImage = null;
        }

        this.removeEventListener("touchstart", this.onTouchStartFunc);
        this.onTouchStartFunc = null;
        this.removeEventListener("touchend", this.onTouchEndFunc);
        this.onTouchEndFunc = null;

        this.super.destroy.apply(this, arguments);
    },

    get pressedImageSrc() {
        return this._pressedImageSrc;
    },

    set pressedImageSrc(value) {
        if (value === null) {
            this._pressedImageSrc = null;
            this._pressedImage = null;
        } else {
            this._pressedImageSrc = value;
            this._pressedImage = new Image();
            // FIXME: should support addEventListener insteadof onload event.
            this._pressedImage.onload = function() {
                this._pressedImage.onload = null;
                this.invalidate();
            }.bind(this);
            this._pressedImage.src = this._pressedImageSrc;
        }
    },

    get focusedImageSrc() {
        return this._focusedSrc;
    },

    set focusedImageSrc(value) {
        if (value === null) {
            this._focusedImageSrc = null;
            this._focusedImage = null;
            this.invalidate();
        } else {
            this._focusedImageSrc = value;
            this._focusedImage = new Image();
            // FIXME: should support addEventListener insteadof onload event.
            this._focusedImage.onload = function() {
                this._focusedImage.onload = null;
                this.invalidate();
            }.bind(this);
            this._focusedImage.src = this._focusedImageSrc;
        }
    },

    get disabledImageSrc() {
        return this._disabledSrc;
    },

    set disabledImageSrc(value) {
        if (value === null) {
            this._disabledImageSrc = null;
            this._disabledImage = null;
            this.invalidate();
        } else {
            this._disabledImageSrc = value;
            this._disabledImage = new Image();
            // FIXME: should support addEventListener insteadof onload event.
            this._disabledImage.onload = function() {
                this._disabledImage.onload = null;
                this.invalidate();
            }.bind(this);
            this._disabledImage.src = this._disabledImageSrc;
        }
    },

    onTouchStart: function() {
        this.invalidate();
    },

    onTouchEnd: function() {
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

        this.drawImage(context, image);
    }
}, module);
