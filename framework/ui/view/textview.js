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
var View = require("./view");
var Class = require("../../class");

/**
 * TextView implements a read-only text label which can use this class to draw one or multiple lines of static text,
 * such as those you might use to identify other parts of your user interface.
 * @class TextView
 * @extends View
 */
Class.define("framework.ui.view.TextView", View, {
    /**
     * Constructor that create a text view
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
        this._baseline = "middle";
        this._color = "#FFFFFF";
        this._multiLine = false;
        this._highQuality = false;
        this._antialias = false;

        this._width = 100;
        this._height = 20;
    },

    /**
     * Destructor that destroy this text view
     * @method TextView#destroy
     */
    destroy: function() {
        this._text = null;

        View.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name TextView#text
     * @type {String}
     * @description the plain-text content that this text view is to display.
     */
    get text() {
        return this._text;
    },

    set text(value) {
        this.setProperty("text", value);
    },

    /**
     * @name TextView#fontFamily
     * @type {String}
     * @description The text font-family, such as "sans-serif".
     */
    get fontFamily() {
        return this._fontFamily;
    },

    set fontFamily(value) {
        this.setProperty("fontFamily", value);
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
        this.setProperty("fontSize", value);
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
        this.setProperty("fontWeight", value);
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
        this.setProperty("fontStyle", value);
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
        this.setProperty("align", value);
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
        this.setProperty("verticalAlign", value);
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
        this.setProperty("baseline", value);
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
        this.setProperty("color", value);
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
        this.setProperty("multiLine", value);
    },

    /**
     * Draw the text view.
     * @method TextView#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @override
     */
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

                if (this._verticalAlign === "middle") {
                    t = this._height / 2;
                } else if (this._verticalAlign === "top") {
                    t = 0;
                } else if (this._verticalAlign === "bottom") {
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