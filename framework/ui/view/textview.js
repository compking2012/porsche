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
var View = require("./view");
var Class = require("../../class");

/**
 * TextView widget
 * @class TextView
 * @extends View
 */
Class.define("framework.ui.view.TextView", View, {
    /**
     * Constructor
     * @method TextView#initialize
     */
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._text = "";
        this._fontFamily = "sans-serif";
        this._fontSize = "18px";
        this._fontWeight = "normal";
        this._fontStyle = "normal";
        this._align = "left";
        this._verticalAlign = "middle";
        this._baseline = "top";
        this._color = "#FFFFFF";
        this._multiLine = false;
        this._highQuality = false;
        this._antialias = false;

        this._lineMargin = 10;

        this._width = 100;
        this._height = 20;
    },

    /**
     * Destructor
     * @method TextView#destroy
     */
    destroy: function() {

    },

    /**
     * @name TextView#text
     * @type {String}
     * @description Text content.
     */
    get text() {
        return this._text;
    },

    set text(value) {
        this._text = value;
        this.invalidate();
    },

    /**
     * @name TextView#fontFamily
     * @type {String}
     * @description The text Font-family, such as sans-serif.
     */
    get fontFamily() {
        return this._fontFamily;
    },

    set fontFamily(value) {
        this._fontFamily = value;
        this.invalidate();
    },

    /**
     * @name TextView#fontSize
     * @type {String}
     * @description The text fontSize, such as "12px".
     */
    get fontSize() {
        return this._fontSize;
    },

    set fontSize(value) {
        this._fontSize = value;
        this.invalidate();
    },

    /**
     * @name TextView#fontWeight
     * @type {String}
     * @description The text fontWeight, such as "bold".
     */
    get fontWeight() {
        return this._fontWeight;
    },

    set fontWeight(value) {
        this._fontWeight = value;
        this.invalidate();
    },

    /**
     * @name TextView#fontStyle
     * @type {String}
     * @description The text fontStyle, such as "normal".
     */
    get fontStyle() {
        return this._fontStyle;
    },

    set fontStyle(value) {
        this._fontStyle = value;
        this.invalidate();
    },

    /**
     * @name TextView#align
     * @type {String}
     * @description The text align.value text align, value is : "left", "center", "right".
     */
    get align() {
        return this._align;
    },

    set align(value) {
        this._align = value;
        this.invalidate();
    },

    /**
     * @name TextView#verticalAlign
     * @type {String}
     * @description The text verticalAlign.value text align, value is : "top", "middle", "bottom".
     */
    get verticalAlign() {
        return this._verticalAlign;
    },

    set verticalAlign(value) {
        this._verticalAlign = value;
        this.invalidate();
    },

    /**
     * @name TextView#baseLine
     * @type {String}
     * @description The text font baseline, such as "middle", "top", "bottom".
     */
    get baseline() {
        return this._baseline;
    },

    set baseline(value) {
        this._baseline = value;
        this.invalidate();
    },

    /**
     * @name TextView#lineMargin
     * @type {Number}
     * @description The line margin
     */
    get lineMargin() {
        return this._lineMargin;
    },

    set lineMargin(value) {
        this._lineMargin = value;
        this.invalidate();
    },

    /**
     * @name TextView#color
     * @type {String}
     * @description The text color.
     */
    get color() {
        return this._color;
    },

    set color(value) {
        this._color = value;
        this.invalidate();
    },

    /**
     * @name TextView#multiLine
     * @type {Boolean}
     * @description The text draw mode, one line or multiline.
     */
    get multiLine() {
        return this._multiLine;
    },

    set multiLine(value) {
        this._multiLine = value;
        this.invalidate();
    },

    draw: function(context) {
        context.save();
        context.beginPath();
        context.textDrawingMode = this._highQuality ? "path" : "glyph";
        context.antialias = "none";
        context.fillStyle = this._color;
        context.font = this._fontStyle + " " + this._fontWeight + " " + this._fontSize + " " + this._fontFamily;
        context.textAlign = this._align;

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
                if (this._align === "center") {
                    l = this._width / 2;
                } else if (this._align === "left") {
                    l = 0;
                } else if (this._align === "right") {
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
