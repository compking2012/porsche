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
var Point = require("../point");

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
        this.super.initialize.call(this);

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
        this._selection = {start: -1, end: -1};

        this._cursor = false;
        this._cursorPos = 0;
        this._cursorInterval = null;
        this._selectionStartPoint = new Point(0, 0);
        this._selectionLastPoint = new Point(0, 0);
        this._wasOver = false;

        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer());
        this.addEventListener("touchstart", this._onTouchStartFunc = this.onTouchStart.bind(this));
        this.addEventListener("touchmove", this._onTouchMoveFunc = this.onTouchMove.bind(this));
        this.addEventListener("touchend", this._onTouchEndCancelFunc = this.onTouchEndCancel.bind(this));
        this.addEventListener("touchcancel", this._onTouchEndCancelFunc);
        this.addEventListener("keydown", this._onKeyDownFunc = this.onKeyDown.bind(this));
        this.addEventListener("keyup", this._onKeyUpFunc = this.onKeyUp.bind(this));
    },

    destroy: function() {
        this.removeGestureRecognizer(this._tapRecognizer);
        this._tapRecognizer.destroy();
        this._tapRecognizer = null;

        this.removeEventListener("touchstart", this._onTouchStartFunc);
        this._onTouchStartFunc = null;

        this.removeEventListener("touchmove", this._onTouchMoveFunc);
        this._onTouchMoveFunc = null;

        this.removeEventListener("touchend", this._onTouchEndCancelFunc);
        this.removeEventListener("touchcancel", this._onTouchEndCancelFunc);
        this._onTouchEndCancelFunc = null;

        this.removeEventListener("keydown", this._onKeyDownFunc);
        this._onKeyDownFunc = null;

        this.removeEventListener("keyup", this._onKeyUpFunc);
        this._onKeyUpFunc = null;

        this._selectionStartPoint.destroy();
        this._selectionStartPoint = null;

        this._selectionLastPoint.destroy();
        this._selectionLastPoint = null;

        this.super.destroy.call(this);
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
        this._cursorPos = this._text.length;
        this.invalidate();
    },

    get placeholder() {
        return this._placeholder;
    },

    set placeholder(value) {
        this._placeholder = value;
        this.invalidate();
    },

    onTouchStart: function(e) {
        var x = e.targetTouches[0].pageX;
        var y = e.targetTouches[0].pageY;

        this.focus();
        // start the selection drag if inside the input
        if (this._focused) {
            this._selectionStartPoint.assign(x, y);
            this.invalidate();
        }
    },

    onTouchMove: function(e) {
        var x = e.targetTouches[0].pageX;
        var y = e.targetTouches[0].pageY;

        if (this._focused) {
            this._selectionLastPoint.assign(x, y);
            this.invalidate();
        }
    },

    onTouchEndCancel: function(/*e*/) {
        if (this._focused) {
            this._selectionStartPoint.assign(-1, -1);
            this._selectionLastPoint.assign(-1, -1);
            this.invalidate();
        }
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
                cursorVal = false;
            } else if (e.keyCode === 9) {
                // Pressed Tab key
                cursorVal = false;
                // this.blur();
                // var obj = global.textFields[this._inputIndex + 1];
                // if (obj !== undefined) {
                //     setTimeout(function() {
                //         return obj.focus();
                //     }.bind(this), 1);
                // }
            } else if (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) {
                // Pressed Ctrl/Cmd+A to selection all
                this.selectText(0, this._text.length);
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

        // remove focus from all other inputs
        for (var i = 0; i < global.textFields.length; i++) {
            if (global.textFields[i].focused) {
                global.textFields[i].blur();
            }
        }

        this._focused = true;
        this._selection.start = -1;
        this._selection.end = -1;
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
        this._selection.start = -1;
        this._selection.end = -1;
        this._cursor = false;
        this.invalidate();
    },

    selectText: function(start, end) {
        this._selection.start = start;
        this._selection.end = end;
        this.invalidate();
    },

    removeSelectedText: function() {
        if (this._selection.start >= 0) {
            // clear the selected contents
            var start = this._selection.start;
            var end = this._selection.end;
            this._text = this._text.substr(0, start) + this._text.substr(end);
            this._cursorPos = start;
            this._selection.start = 0;
            this._selection.end = 0;
        }
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
        // Draw background
        context.save();
        context.fillStyle = this._background;
        context.roundRect(0, 0, this._width, this._height, this._borderRadius);
        context.fill();

        // Draw border
        context.fillStyle = this._borderColor;
        context.roundRect(0, 0, this._width, this._height, this._borderRadius);
        context.fill();
        context.restore();

        // Draw placeholder
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
        // Draw text
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

        // Draw selection
        if (this._selectionStartPoint.x >= 0 && this._selectionStartPoint.y >= 0 && this._selectionLastPoint.x >= 0 && this._selectionLastPoint.y >= 0) {
            for (var i = 0; i < text.length - 1; i++) {
                var w1 = context.measureText(text.substr(0, i)).width;
                var w2 = context.measureText(text.substr(0, i + 1)).width;
                if (w1 <= this._selectionStartPoint.x && w2 >= this._selectionStartPoint.x) {
                    this._selection.start = i;
                }
                if (w1 <= this._selectionLastPoint.x && w2 >= this._selectionLastPoint.x) {
                    this._selection.end = i;
                }
            }
        }

        if (this._selection.start >= 0) {
            var paddingBorder = this._padding + this._borderWidth;
            var selectOffset = context.measureText(text.substring(0, this._selection.start)).width;
            var selectWidth = context.measureText(text.substring(this._selection.start, this._selection.end)).width;
            context.fillStyle = this._selectionColor;
            context.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, this._height);
        }

        // Draw cursor
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
