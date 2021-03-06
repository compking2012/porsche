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
var View = require("./view");

/**
 * Image view that displays an arbitrary image, such as an icon.
 * The ImageView class can load images from various sources (such as local or online resources),
 * takes care of computing its measurement from the image so that it can be used in any layout,
 * and provides various display options such as scaling and tinting.
 * @class ImageView
 * @param {string} src image path
 * @extends View
 **/
Class.define("framework.ui.view.ImageView", View, {
    /**
     * Constructor that create a image view
     * @method ImageView#initialize
     */
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._image = new Image();
        this._offsetX = 0;
        this._offsetY = 0;
        this._scaleType = "fitcenter";
    },

    /**
     * Destructor that destroy this image view
     * @method ImageView#destroy
     */
    destroy: function() {
        this._image = null;

        View.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ImageView#src
     * @type {String}
     * @description the image url, which indicates a local path currently.
     * Note that once you set this value, the image loading process will start asynchronously.
     */
    get src() {
        return this._src;
    },

    set src(value) {
        this.setProperty("src", value, function() {
            if (value === null) {
                this._src = null;
                this._image = null;
            } else {
                this._src = value;
                // FIXME: should support addEventListener insteadof onload event.
                this._image.onload = function() {
                    this._image.onload = null;
                    this.invalidate();
                }.bind(this);
                this._image.src = this._src;
            }
        }.bind(this));
    },

    /**
     * @name ImageView#scaleType
     * @type {String}
     * @description the desired scaling mode, such as "matrix", "fitxy", "fitstart", "fitend",
     * fitcenter", "center", "centercrop" and "centerinside"
     */
    get scaleType() {
        return this._scaleType;
    },

    set scaleType(value) {
        this.setProperty("scaleType", value);
    },

    /**
     * @name ImageView#offsetX
     * @type {Number}
     * @description offsetX
     * @private
     */
    get offsetX() {
        return this._offsetX;
    },

    set offsetX(value) {
        this._offsetX = value;
    },

    /**
     * @name ImageView#offsetY
     * @type {Number}
     * @description offsetY
     * @private
     */
    get offsetY() {
        return this._offsetY;
    },

    set offsetY(value) {
        this._offsetY = value;
    },

    /**
     * Draw the image view.
     * @method ImageView#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        this.drawImage(context, this._image);
    },

    /**
     * Draw the image.
     * @method TextView#drawImage
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    drawImage: function(context, image) {
        if (this._scaleType === "matrix") {
            context.drawImage(image, 0, 0);
        } else if (this._scaleType === "fitxy") {
            context.drawImage(image, 0, 0, this._width, this._height);
        } else if (this._scaleType === "fitstart" || this._scaleType === "fitend" || this._scaleType === "fitcenter") {
            var dw = image.width;
            var dh = image.height;
            var rw = this._width / dw;
            var rh = this._height / dh;
            var r = Math.min(rw, rh);
            var width = dw * r;
            var height = dh * r;

            var x = 0;
            var y = 0;
            switch (this._scaleType) {
                case "fitstart":
                    x = 0;
                    y = 0;
                    break;
                case "fitend":
                    x = this._width - width;
                    y = this._height - height;
                    break;
                case "fitcenter":
                    x = (this._width - width) / 2;
                    y = (this._height - height) / 2;
                    break;
            }
            context.drawImage(image, x, y, width, height);
        } else if (this._scaleType === "center") {
            var dw = image.width;
            var dh = image.height;
            var x = (this._width - dw) / 2;
            var y = (this._height - dw) / 2;
            context.drawImage(image, x, y, dw, dh);
        } else if (this._scaleType === "centercrop") {
            var r = 0;
            var x = 0;
            var y = 0;
            var dw = image.width;
            var dh = image.height;
            var vw = this._width;
            var vh = this._height;
            if (dw * vh > vw * dh) {
                r = vh / dh; 
                x = (vw - dw * r) / 2;
            } else {
                r = vw / dw;
                y = (vh - dh * r) / 2;
            }
            context.drawImage(image, x, y, dw * r, dh * r);
        } else if (this._scaleType === "centerinside") {
            var r = 0;
            var dw = image.width;
            var dh = image.height;
            var vw = this._width;
            var vh = this._height;
            if (dw <= vw && dh <= vh) {
                r = 1;
            } else {
                r = Math.min(vw / dw, vh / dh);
            }
            var x = (vw - dw * r) / 2;
            var y = (vh - dh * r) / 2;
            context.drawImage(image, x, y, dw * r, dh * r);
        }
    }
}, module);
