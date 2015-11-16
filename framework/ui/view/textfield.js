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
var TextView = require("./textview");
var TapRecognizer = require("../gesture/taprecognizer");

/**
 * Text field.
 * @class TextField
 * @extends TextView
 */
Class.define("framework.ui.view.TextField", TextView, {
    /**
     * Constructor that create a view
     * @constructor
     */
    initialize: function() {
        TextView.prototype.initialize.apply(this, arguments);

        if (!global.hasOwnProperty("textFields")) {
            global.textFields = [];
        }
        global.textFields.push(this);

        this._readonly = false;
        this._maxlength = 0;
        this._padding = 0;
        this._alignCenter = false;
        this._borderWidth = 1;
        this._borderColor = "#959595";
        this._borderRadius = 3;
        this._selectionColor = "rgba(179, 212, 253, 0.8)";
        this._inputIndex = global.textFields.length - 1;
        this._color = "#000000";
        this._background = "#FFFFFF";
        this._cursorColor = "#0000FF";
        this._placeholderColor = "#BFBEBD";
        this._placeholder = "";

        this._cursor = false;
        this._cursorPos = 0;
        this._cursorInterval = null;
        this._selection = [0, 0];
        this._wasOver = false;

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("touchstart", this._onTouchStartFunc = this.onTouchStart.bind(this));
        this.addEventListener("keydown", this._onKeyDownFunc = this.onKeyDown.bind(this));
        this.addEventListener("keyup", this._onKeyUpFunc = this.onKeyUp.bind(this));
    },

    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this.removeEventListener("touchstart", this._onTouchStartFunc = this.onTouchStart.bind(this));
        this.removeEventListener("keydown", this._onKeyDownFunc = this.onKeyDown.bind(this));
        this.removeEventListener("keyup", this._onKeyUpFunc = this.onKeyUp.bind(this));
        this._tapRecognizer = null;

        TextView.prototype.destroy.apply(this, arguments);
    },

    get placeholder() {
        return this._placeholder;
    },

    set placeholder(value) {
        this._placeholder = value;
        this.invalidate();
    },

    onTouchStart: function(/*e*/) {
        this.focus();
    },

    onKeyDown: function(e) {
        if (this._focused) {
            // e.preventDefault();
            var cursorVal = true;
            if (e.keyCode === 8) {
                // Pressed Backspace key
                if (this._cursorPos > 0) {
                    this._text = this._text.substr(0, this._cursorPos - 1) + this._text.substr(this._cursorPos, this._text.length);
                    this._cursorPos--;
                }
            } else if (e.keyCode === 46) {
                // Pressed Delete key
                if (this._cursorPos < this._text.length) {
                    this._text = this._text.substr(0, this._cursorPos) + this._text.substr(this._cursorPos + 1, this._text.length);
                }
            } else if (e.keyCode === 37) {
                // Pressed Left arrow key
                if (this._cursorPos > 0) {
                    this._cursorPos--;
                }
            } else if (e.keyCode === 39) {
                // Pressed Right arrow key
                if (this._cursorPos < this._text.length) {
                    this._cursorPos++;
                }
            } else if (e.keyCode === 13) {
                // Pressed Enter key
                var textFields = global.textFields;
                var length = textFields.length;
                for (var i = 0; i < length; i++) {
                    var input = textFields[i];
                    if (input.type === "submit") {
                        cursorVal = false;
                        this.blur();
                        input.focus();
                        break;
                    }
                }
            } else if (e.keyCode === 9) {
                // Pressed Tab key
                cursorVal = false;
                this.blur();
                var obj = global.textFields[this._inputIndex + 1];
                if (obj !== undefined) {
                    setTimeout(function() {
                        return obj.focus();
                    }.bind(this), 1);
                }
            } else {
                // Pressed other keys
                var key = this.mapKeyPressToActualCharacter(e.shiftKey, e.keyCode);
                if (key !== null) {
                    this._text = this._text.substr(0, this._cursorPos) + key + this._text.substr(this._cursorPos, this._text.length);
                    this._cursorPos++;
                }
            }
            this._cursor = cursorVal;
            this.invalidate();
        }
    },

    onKeyUp: function(e) {
        this.invalidate();
    },

    /**
     * Place focus on the text field, placing the cursor
     * either at the end of the text or where the user clicked.
     */
    focus: function() {
        if (this._focused) {
            return;
        }

        this._focused = true;
        this._cursor = true;

        if (this._cursorInterval !== null) {
            clearInterval(this._cursorInterval);
            this._cursorInterval = null;
        }
        this._cursorInterval = setInterval(function() {
            this._cursor = !this._cursor;
            this.invalidate();
        }.bind(this), 500);

        this.invalidate();
    },

    /**
     * Removes focus from the CanvasInput box.
     */
    blur: function() {
        this._focused = false;
        if (this._cursorInterval !== null) {
            clearInterval(this._cursorInterval);
            this._cursorInterval = null;
        }
        this._cursor = false;
        this.invalidate();
    },

    mapKeyPressToActualCharacter: function(isShiftKey, characterCode) {
        if (characterCode === 27 || characterCode === 8 || characterCode === 9 || characterCode === 20 || characterCode === 16 || characterCode === 17 || characterCode === 91 || characterCode === 13 || characterCode === 92 || characterCode === 18) {
            return null;
        }
        if (typeof isShiftKey !== "boolean" || typeof characterCode !== "number") {
            return null;
        }
        var characterMap = [];
        characterMap[192] = "~";
        characterMap[49] = "!";
        characterMap[50] = "@";
        characterMap[51] = "#";
        characterMap[52] = "$";
        characterMap[53] = "%";
        characterMap[54] = "^";
        characterMap[55] = "&";
        characterMap[56] = "*";
        characterMap[57] = "(";
        characterMap[48] = ")";
        characterMap[109] = "_";
        characterMap[107] = "+";
        characterMap[219] = "{";
        characterMap[221] = "}";
        characterMap[220] = "|";
        characterMap[59] = ":";
        characterMap[222] = "\"";
        characterMap[188] = "<";
        characterMap[190] = ">";
        characterMap[187] = "+";
        characterMap[191] = "?";
        characterMap[32] = " ";

        var character = "";
        if (isShiftKey) {
            if (characterCode >= 65 && characterCode <= 90) {
                character = String.fromCharCode(characterCode);
            } else {
                character = characterMap[characterCode];
            }
        } else {
            if (characterCode >= 65 && characterCode <= 90) {
                character = String.fromCharCode(characterCode).toLowerCase();
            } else {
                if (characterCode === 188) {
                    character = ",";
                } else if (characterCode === 190) {
                    character = ".";
                } else {
                    character = String.fromCharCode(characterCode);
                }
            }
        }
        return character;
    },

    drawBackground: function(context) {
        context.save();
        context.fillStyle = this._background;
        context.roundRect(0, 0, this._width, this._height, this._borderRadius);
        context.fill();

        context.fillStyle = this._borderColor;
        context.roundRect(0, 0, this._width, this._height, this._borderRadius);
        context.fill();
        context.restore();

        if (!this._focused && this._text === "") {
            context.beginPath();
            context.textDrawingMode = this._highQuality ? "path" : "glyph";
            context.antialias = "none";
            context.fillStyle = this._placeholderColor;
            context.font = this._fontStyle + " " + this._fontWeight + " " + this._fontSize + " " + this._fontFamily;
            context.textBaseline = this._baseline;

            var textHeight = parseInt(this._fontSize);
            var offset = this._padding;
            var textX = offset;
            var textY = 0;
            if (this._verticalAlign === "middle") {
                textY = this._height - textHeight;
            } else if (this._verticalAlign === "top") {
                textY = this._height / 2 - textHeight / 2;
            } else if (this._verticalAlign === "bottom") {
                textY = this._height - textHeight / 2;
            }
            context.fillText(this._placeholder, textX, textY);
        }
    },

    draw: function(context) {
        context.save();
        context.beginPath();
        context.textDrawingMode = this._highQuality ? "path" : "glyph";
        context.antialias = "none";
        context.fillStyle = this._color;
        context.font = this._fontStyle + " " + this._fontWeight + " " + this._fontSize + " " + this._fontFamily;
        context.textBaseline = this._baseline;

        var text = this._type === "password" && this._text !== this._placeholder ? this._text.replace(/./g, "\u25CF") : this._text;
        var textWidth = context.measureText(text).width;
        var textHeight = parseInt(this._fontSize);
        var offset = this._padding;
        var ratio = textWidth / (this._width - this._padding);
        if (ratio > 1) {
            text = text.substr(-1 * Math.floor(text.length / ratio));
        } else if (this._center) {
            offset = this._width / 2 - textWidth / 2;
        }
        var textX = offset;
        var textY = 0;
        if (this._verticalAlign === "middle") {
            textY = this._height - textHeight;
        } else if (this._verticalAlign === "top") {
            textY = this._height / 2 - textHeight / 2;
        } else if (this._verticalAlign === "bottom") {
            textY = this._height - textHeight / 2;
        }
        context.fillText(text, textX, textY);

        if (this._cursor) {
            context.fillStyle = this._cursorColor;
            var cursorOffset = context.measureText(text.substring(0, this._cursorPos)).width;
            if (this._center) {
                cursorOffset += offset - this._padding;
            }
            context.fillRect(this._padding + cursorOffset, this._padding, 1, this._height - 2 * this._padding);
        }
        context.restore();
    }
}, module);