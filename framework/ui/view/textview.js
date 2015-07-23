define(function(require, exports, module) {

"use strict";
var View = require("./view");
var Class = require("../../class");

/**
 * textview widget, place some text in it.
 * @class TextView
 * @param text {string} text value
 * @extends View
 **/
Class.define("framework.ui.view.TextView", View, {
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._text = "";
        this._fontFamily = "sans-serif";
        this._fontSize = "18px";
        this._fontWeight = "normal";
        this._fontStyle = "normal";
        this._textAlign = "center";
        this._textVAlign = "middle";
        this._baseline = "middle";
        this._color = "#ffffff";
        this._multiLine = false;
        this._highQuality = false;
        this._antialias = false;

        this._width = 100;
        this._height = 20;
    },

    /**
     * @name TextView#text
     * @type {string}
     * @description Text content.
     **/
    get text() {
        return this._text;
    },

    set text(value) {
        this._text = value;
    },

    /**
     * @name TextView#fontFamily
     * @type {string}
     * @description The text Font-family, such as sans-serif.
     **/
    get fontFamily() {
        return this._fontFamily;
    },

    set fontFamily(value) {
        this._fontFamily = value;
    },

    /**
     * @name TextView#fontSize
     * @type {string}
     * @description The text fontSize, such as "12px".
     **/
    set fontSize(value) {
        this._fontSize = value;
    },

    get fontSize() {
        return this._fontSize;
    },

    /**
     * @type {string}
     * @description The text fontWeight, such as "bold".
     * @name TextView#fontWeight
     */
    get fontWeight() {
        return this._fontWeight;
    },

    set fontWeight(value) {
        this._fontWeight = value;
    },

    /**
     * @type {string}
     * @description The text fontStyle, such as "normal".
     * @name TextView#fontStyle
     */
    get fontStyle() {
        return this._fontStyle;
    },

    set fontStyle(value) {
        this._fontStyle = value;
    },

    /**
     * @type {string}
     * @description The text align.value text align, value is : "left", "center", "right".
     * @name TextView#align
     */
    get textAlign() {
        return this._textAlign;
    },

    set textAlign(value) {
        this._textAlign = value;
    },

    /**
     * @type {string}
     * @description The text align.value text align, value is : "left", "center", "right".
     * @name TextView#align
     */
    get textVAlign() {
        return this._textVAlign;
    },

    set textVAlign(value) {
        this._textVAlign = value;
    },

    /**
     * @type {string}
     * @description The text font baseline, such as "middle", "top", "bottom".
     * @name TextView#baseLine
     */
    get baseline() {
        return this._baseline;
    },

    set baseline(value) {
        this._baseline = value;
    },

    /**
     * @name TextView#color
     * @type {string}
     * @description The text color.
     **/
    get color() {
        return this._color;
    },

    set color(value) {
        this._color = value;
    },

    /**
     * @name TextView#multiLine
     * @type {bool}
     * @description The text draw mode, one line or multiline.
     **/
    get multiLine() {
        return this._multiLine;
    },

    set multiLine(value) {
        this._multiLine = value;
    },

    draw: function(context) {
        context.save();
        context.beginPath();
        context.fillStyle = this._color;
        context.font = this._fontStyle + " " + this._fontWeight + " " + this._fontSize + " " + this._fontFamily;
        context.textAlign = this._textAlign;

        if (this.text !== null) {
            if (this._multiLine) {
                var start = 0;
                var length = 1;
                var subText = this._text.substr(start, length);
                var height = 20;

                while (height < this._height && start + length < this._text.length) {
                    while (true) {
                        if (context.measureText(subText).width < this._width) {
                            length++;
                        } else {
                            length--;
                            break;
                        }
                        if (start + length >= this._text.length) {
                            break;
                        }
                        subText = this._text.substr(start, length);
                    }
                    subText = this._text.substr(start, length);
                    context.fillText(subText, 0, height);
                    height += 20;
                    start += length;
                    length = 0;
                }
            } else {
                var l = 0;
                var t = 0;
                if (this._textAlign === "center") {
                    l = this._width / 2;
                } else if (this._textAlign === "left") {
                    l = 0;
                } else if (this._textAlign === "right") {
                    l = this._width;
                }

                if (this._baseline === "middle") {
                    t = this._height / 2;
                } else if (this._baseline === "top") {
                    t = 0;
                } else if (this._baseline === "bottom") {
                    t = this._height;
                }
                context.textBaseline = this._baseline;
                context.fillText(this._text, l, t);
            }
        }
        context.restore();
    }
}, module);

});
