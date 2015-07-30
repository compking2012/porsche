define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var View = require("./view");

/**
 * Switch widget
 * @class Switch
 * @extends View
 */
Class.define("framework.ui.view.Switch", View, {
    initialize: function () {
        View.prototype.initialize.apply(this, arguments);
        this._disabledSrc = "/framework/resources/switchdisabled.png";
        this._disabledImage = null;
        this._offSrc = "/framework/resources/switchoff.png";
        this._offImage = null;
        this._onSrc = "/framework/resources/switchon.png";
        this._onImage = null;
        this._value = false;
        this.addEventListener("click", this.onClickFunc = this.onClick.bind(this));
    },

    destroy: function() {
        this._disabledImage = null;
        this._offImage = null;
        this._onImage = null;
        this.removeEventListener("click", this.onClickFunc);
        this.onClickFunc = null;
        View.prototype.destroy.apply(this, arguments);
    },

    get value() {
        return this._value;
    },

    set value(value) {
        this._value = value;
        this.invalidate();
    },

    onClick: function(/*e*/) {
        this._value = !this._value;
        this.invalidate();
    },

    draw: function(context) {
        if (!this._enabled) {
            if (this._disabledSrc) {
                if (this._disabledImage === null) {
                    var onLoadFunc = null;
                    this._disabledImage = new Image();
                    this._disabledImage.addEventListener("load", onLoadFunc = function() {
                        this._disabledImage.removeEventListener("load", onLoadFunc);
                        context.drawImage(this._disabledImage, (this._width - this._disabledImage.width) / 2, (this._height - this._disabledImage.height) / 2, this._disabledImage.width, this._disabledImage.height);
                    }.bind(this));
                    this._disabledImage.src = this._disabledSrc;
                    if (this._disabledImage.complete) {
                        this._disabledImage.removeEventListener("load", onLoadFunc);
                        context.drawImage(this._disabledImage, (this._width - this._disabledImage.width) / 2, (this._height - this._disabledImage.height) / 2, this._disabledImage.width, this._disabledImage.height);
                    }
                } else {
                    context.drawImage(this._disabledImage, (this._width - this._disabledImage.width) / 2, (this._height - this._disabledImage.height) / 2, this._disabledImage.width, this._disabledImage.height);
                }
                return;
            }
        }

        if (this._value) {
            if (this._onSrc) {
                if (this._onImage === null) {
                    var onLoadFunc = null;
                    this._onImage = new Image();
                    this._onImage.addEventListener("load", onLoadFunc = function() {
                        this._onImage.removeEventListener("load", onLoadFunc);
                        context.drawImage(this._onImage, (this._width - this._onImage.width) / 2, (this._height - this._onImage.height) / 2, this._onImage.width, this._onImage.height);
                    }.bind(this));
                    this._onImage.src = this._onSrc;
                    if (this._onImage.complete) {
                        this._onImage.removeEventListener("load", onLoadFunc);
                        context.drawImage(this._onImage, (this._width - this._onImage.width) / 2, (this._height - this._onImage.height) / 2, this._onImage.width, this._onImage.height);
                    }
                } else {
                    context.drawImage(this._onImage, (this._width - this._onImage.width) / 2, (this._height - this._onImage.height) / 2, this._onImage.width, this._onImage.height);
                }
                return;
            }
        } else {
            if (this._offSrc) {
                if (this._offImage === null) {
                    var onLoadFunc = null;
                    this._offImage = new Image();
                    this._offImage.addEventListener("load", onLoadFunc = function() {
                        this._offImage.removeEventListener("load", onLoadFunc);
                        console.log("Flag 1:", (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                        context.drawImage(this._offImage, (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                    }.bind(this));
                    this._offImage.src = this._offSrc;
                    if (this._offImage.complete) {
                        this._offImage.removeEventListener("load", onLoadFunc);
                        console.log("Flag 2:", (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                        context.drawImage(this._offImage, (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                    }
                } else {
                    console.log("Flag 3:", (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                    context.drawImage(this._offImage, (this._width - this._offImage.width) / 2, (this._height - this._offImage.height) / 2, this._offImage.width, this._offImage.height);
                }
                return;
            }
        }
    }
}, module);

});
