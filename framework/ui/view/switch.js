define(function(require, exports, module) {
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
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Switch is a two-state toggle switch widget that can select between two options.
 * The user may drag the "thumb" back and forth to choose the selected option, or simply tap to toggle as if it were a checkbox.
 * @class Switch
 * @extends View
 */
Class.define("CompositeView.ui.view.Switch", View, {
    /**
     * Constructor that create a switch
     * @method Switch#initialize
     */
    initialize: function () {
        View.prototype.initialize.apply(this, arguments);

        this.setImageSrcs();
        this._disabledImage = new Image();
        this._offImage = new Image();
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

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("tap", this._onTapFunc = this.onTap.bind(this));

        this._onImage.src = this._onImageSrc;
    },

    /**
     * Destructor that destroy a switch
     * @method Switch#destroy
     */
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

    /**
     * @name Switch#value
     * @type {Boolean}
     * @description this value indicates the state of this switch.
     */
    get value() {
        return this._value;
    },

    set value(value) {
        this.setProperty("value", value, function() {
            this.updateImage();
        }.bind(this));
    },

    /**
     * @name Switch#enabled
     * @type {Boolean}
     * @description enabled state of this switch, true if this switch is enabled, false otherwise.
     */
    get enabled() {
        return this._enabled;
    },

    set enabled(value) {
        this.setProperty("enabled", value, function() {
            this.updateImage();
        }.bind(this));
    },

    /**
     * Handle the tap event processing.
     * @method Switch#onTap
     * @param {GestureEvent} e - the gesture event info.
     * @protected
     */
    onTap: function(/*e*/) {
        this.value = !this._value;
    },

    /**
     * Draw the switch.
     * @method Switch#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
    draw: function(context) {
        context.drawImage(this._image, (this._width - this._image.width) / 2, (this._height - this._image.height) / 2, this._image.width, this._image.height);
    },

    /**
     * Specifiy the urls of the image state, including on, off and disabled
     * @method Switch#setImageSrcs
     * @protected
     */
    setImageSrcs: function() {
        this._disabledImageSrc = global.AppFXRootPath + "/resources/switchdisabled.png";
        this._offImageSrc = global.AppFXRootPath + "/resources/switchoff.png";
        this._onImageSrc = global.AppFXRootPath + "/resources/switchon.png";
    },

    /**
     * Update the thumb image
     * @method Switch#updateImage
     * @private
     */
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
    }
}, module);

});