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
 * Image button that displays a button with an image (instead of text) that can be pressed or clicked by the user.
 * By default, an ImageButton looks like a regular Button, with the standard button background
 * that changes color during different button states.
 * @class ImageButton
 * @extends ImageView
 */
Class.define("framework.ui.view.ImageButton", ImageView, {
    /**
     * Constructor that create a image button
     * @method ImageButton#initialize
     */
    initialize: function() {
        ImageView.prototype.initialize.apply(this, arguments);

        this._pressedImageSrc = null;
        this._pressedImage = null;
        this._focusedImageSrc = null;
        this._focusedImage = null;
        this._disabledImageSrc = null;
        this._disabledImage = null;

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
    },

    /**
     * Destructor that destroy this image button
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

        ImageView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ImageButton#pressedImageSrc
     * @type {String}
     * @description the pressed state's image url, which indicates a local path currently.
     * Note that once you set this value, the image loading process will start asynchronously.
     */
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

    /**
     * @name ImageButton#focusedImageSrc
     * @type {String}
     * @description the focused state's image url, which indicates a local path currently.
     * Note that once you set this value, the image loading process will start asynchronously.
     */
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

    /**
     * @name ImageButton#disabledImageSrc
     * @type {String}
     * @description the disabled state's image url, which indicates a local path currently.
     * Note that once you set this value, the image loading process will start asynchronously.
     */
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

    /**
     * Handle the mouse down event processing
     * @method ImageButton#onMouseDown
     * @param {MouseEvent} e - the mouse event info
     * @protected
     */
    onMouseDown: function(e) {
        ImageView.prototype.onMouseDown.call(this, e);

        this.invalidate();
    },

    /**
     * Handle the mouse up event processing
     * @method ImageButton#onMouseUp
     * @param {MouseEvent} e - the mouse event info
     * @private
     */
    onMouseUp: function(e) {
        ImageView.prototype.onMouseUp.call(this, e);

        this.invalidate();
    },

    /**
     * Handle the touch start event processing
     * @method ImageButton#onTouchStart
     * @param {TouchEvent} e - the touch event info
     * @private
     */
    onTouchStart: function(e) {
        ImageView.prototype.onTouchStart.call(this, e);

        this.invalidate();
    },

    /**
     * Handle the touch end event processing
     * @method ImageButton#onTouchEnd
     * @param {TouchEvent} e - the touch event info
     * @private
     */
    onTouchEnd: function(e) {
        ImageView.prototype.onTouchEnd.call(this, e);

        this.invalidate();
    },

    /**
     * Handle the touch cancel event processing
     * @method ImageButton#onTouchCancel
     * @param {TouchEvent} e - the touch event info
     * @private
     */
    onTouchCancel: function(e) {
        ImageView.prototype.onTouchCancel.call(this, e);

        this.invalidate();
    },

    /**
     * Draw the image button.
     * @method ImageButton#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
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
