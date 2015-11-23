/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/
/**
 * Copyright (c) 2011 Pere Monfort Pàmies (http://www.pmphp.net)
 * Official site: http://www.canvastext.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";
var Class = require("../../class");
var TextView = require("./textview");

/**
 * Text view which can place some rich text.
 * @class RichTextView
 * @extends TextView
 */
Class.define("framework.ui.view.RichTextView", TextView, {
    /**
     * Constructor that create a view
     * @method RichTextView#initialize
     */
    initialize: function() {
        TextView.prototype.initialize.apply(this, arguments);

        this._savedClasses = [];
        this._lineHeight = 16;
        this._textShadow = null;
    },

    destroy: function() {
        TextView.prototype.destroy.apply(this, arguments);
    },

    get lineHeight() {
        return this._lineHeight;
    },

    set lineHeight(value) {
        this._lineHeight = value;
        this.invalidate();
    },

    get textShadow() {
        return this._textShadow;
    },

    set textShadow(value) {
        this._textShadow = value;
        this.invalidate();
    },

    /**
     * Save a new class definition.
     */
    defineClass: function(id, definition) {
        // A simple check.
        if (typeof definition !== "object") {
            throw "Invalid class.";
        }
        // Another simple check.
        if (this.isEmpty(id)) {
            throw "You must specify a Class Name.";
        }

        // Save it.
        this._savedClasses[id] = definition;
    },

    /**
     * Returns a saved class.
     */
    getClass: function(id) {
        if (this._savedClasses[id] !== undefined) {
            return this._savedClasses[id];
        }
    },

    draw: function(context) {
        var textInfo = {text: this._text, x: 0, y: 0};
        // Save the textInfo into separated vars to work more comfortably.
        var text = this._text;
        var x = textInfo.x;
        var y = textInfo.y;
        // Needed vars for automatic line break;
        var splittedText;
        var xAux;
        var textLines = [];
        var boxWidth = this._width;
        // Declaration of needed vars.
        var proFont = [];
        var properties, property, propertyName, propertyValue;
        var classDefinition, proColor, proText, proShadow;

        // The main regex. Looks for <style>, <class> or <br /> tags.
        var match = text.match(/<\s*br\s*\/>|<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>|<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>|[^<]+/g);
        var innerMatch = null;

        // Let's draw something for each match found.
        for (var i = 0; i < match.length; i++) {
            // Save the current context.
            context.save();

            // Default color
            proColor = this._color;
            // Default font
            proFont.style = this._fontStyle;
            proFont.weight = this._fontWeight;
            proFont.size = this._fontSize;
            proFont.family = this._fontFamily;

            // Default shadow
            proShadow = this._textShadow || undefined;

            // Check if current fragment is an style tag.
            if (/<\s*style=/i.test(match[i])) {
                // Looks the attributes and text inside the style tag.
                innerMatch = match[i].match(/<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>/);

                // innerMatch[1] contains the properties of the attribute.
                properties = innerMatch[1].split(";");

                // Apply styles for each property.
                for (var j = 0; j < properties.length; j++) {
                    // Each property have a value. We split them.
                    property = properties[j].split(":");
                    // A simple check.
                    if (this.isEmpty(property[0]) || this.isEmpty(property[1])) {
                        // Wrong property name or value. We jump to the
                        // next loop.
                        continue;
                    }
                    // Again, save it into friendly-named variables to work comfortably.
                    propertyName = property[0];
                    propertyValue = property[1];

                    switch (propertyName) {
                    case "font":
                        proFont = propertyValue;
                        break;
                    case "font-family":
                        proFont.family = propertyValue;
                        break;
                    case "font-weight":
                        proFont.weight = propertyValue;
                        break;
                    case "font-size":
                        proFont.size = propertyValue;
                        break;
                    case "font-style":
                        proFont.style = propertyValue;
                        break;
                    case "text-shadow":
                        proShadow = this.trim(propertyValue);
                        proShadow = proShadow.split(" ");
                        if (proShadow.length !== 4) {
                            proShadow = null;
                        }
                        break;
                    case "color":
                        if (this.isHex(propertyValue)) {
                            proColor = propertyValue;
                        }
                        break;
                    }
                }
                proText = innerMatch[2];
            } else if (/<\s*class=/i.test(match[i])) { // Check if current fragment is a class tag.
                // Looks the attributes and text inside the class tag.
                innerMatch = match[i].match(/<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>/);

                classDefinition = this.getClass(innerMatch[1]);
                /*
                 * Loop the class properties.
                 */
                for (var attribute in classDefinition) {
                    switch (attribute) {
                    case "font":
                        proFont = classDefinition[attribute];
                        break;
                    case "fontFamily":
                        proFont.family = classDefinition[attribute];
                        break;
                    case "fontWeight":
                        proFont.weight = classDefinition[attribute];
                        break;
                    case "fontSize":
                        proFont.size = classDefinition[attribute];
                        break;
                    case "fontStyle":
                        proFont.style = classDefinition[attribute];
                        break;
                    case "fontColor":
                        if (this.isHex(classDefinition[attribute])) {
                            proColor = classDefinition[attribute];
                        }
                        break;
                    case "textShadow":
                        proShadow = this.trim(classDefinition[attribute]);
                        proShadow = proShadow.split(" ");
                        if (proShadow.length !== 4) {
                            proShadow = null;
                        }
                        break;
                    }
                }
                proText = innerMatch[2];
            } else if (/<\s*br\s*\/>/i.test(match[i])) {
                // Check if current fragment is a line break.
                y += this._lineHeight * 1.5;
                x = textInfo.x;
                continue;
            } else {
                // Text without special style.
                proText = match[i];
            }

            // Set the text Baseline
            context.textBaseline = this._baseline;
            // Set the text align
            context.textAlign = this._align;
            // Font styles.
            if (proFont instanceof Array) {
                context.font = proFont.style + " " + proFont.weight + " " + proFont.size + " " + proFont.family;
            } else {
                context.font = proFont;
            }
            context.font = proFont;
            // Set the color.
            context.fillStyle = proColor;
            // Set the Shadow.
            if (proShadow !== undefined) {
                context.shadowOffsetX = proShadow[0].replace("px", "");
                context.shadowOffsetY = proShadow[1].replace("px", "");
                context.shadowBlur = proShadow[2].replace("px", "");
                context.shadowColor = proShadow[3].replace("px", "");
            }

            // Reset textLines;
            textLines = [];
            // Clear javascript code line breaks.
            proText = proText.replace(/\s*\n\s*/g, " ");

            // Automatic Line break
            if (boxWidth !== undefined) {

                // If returns true, it means we need a line break.
                if (this.checkLineBreak(context, proText, boxWidth + textInfo.x, x)) {
                    // Split text by words.
                    splittedText = this.trim(proText).split(" ");

                    // If there's only one word we don't need to make more checks.
                    if (splittedText.length === 1) {
                        textLines.push({text: this.trim(proText) + " ", linebreak: true});
                    } else {
                        // Reset vars.
                        xAux = x;
                        var line = 0;
                        textLines[line] = {text: undefined, linebreak: false};

                        // Loop words.
                        for (var k = 0; k < splittedText.length; k++) {
                            splittedText[k] += " ";
                            // Check if the current text fits into the current line.
                            if (!this.checkLineBreak(context, splittedText[k], boxWidth + textInfo.x, xAux)) {
                                // Current text fit into the current line. So we save it
                                // to the current textLine.
                                if (textLines[line].text === undefined) {
                                    textLines[line].text = splittedText[k];
                                } else {
                                    textLines[line].text += splittedText[k];
                                }

                                xAux += context.measureText(splittedText[k]).width;
                            } else {
                                // Current text doesn't fit into the current line.
                                // We are doing a line break, so we reset xAux
                                // to initial x value.
                                xAux = textInfo.x;
                                if (textLines[line].text !== undefined) {
                                    line++;
                                }

                                textLines[line] = {text: splittedText[k], linebreak: true};
                                xAux += context.measureText(splittedText[k]).width;
                            }
                        }
                    }
                }
            }

            // if textLines.length == 0 it means we doesn't need a linebreak.
            if (textLines.length === 0) {
                textLines.push({text: this.trim(proText) + " ", linebreak: false});
            }

            // Let's draw the text
            for (var n = 0; n < textLines.length; n++) {
                // Start a new line.
                if (textLines[n].linebreak) {
                    y += this._lineHeight;
                    x = textInfo.x;
                }
                context.fillText(textLines[n].text, x, y);
                // Increment X position based on current text measure.
                x += context.measureText(textLines[n].text).width;
            }

            context.restore();
        }
    },

    /**
     * Check if a line break is needed.
     */
    checkLineBreak: function(context, text, boxWidth, x) {
        return context.measureText(text).width + x > boxWidth;
    },

    /**
     * A simple function to validate a Hex code.
     */
    isHex: function(hex) {
        return /^(#[a-fA-F0-9]{3,6})$/i.test(hex);
    },

    /**
     * A simple function to check if the given value is a number.
     */
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    /**
     * A simple function to check if the given value is empty.
     */
    isEmpty: function(str) {
        // Remove white spaces.
        str = str.replace(/^\s+|\s+$/, "");
        return str.length === 0;
    },

    /**
     * A simple function clear whitespaces.
     */
    trim: function(str) {
        var ws, i;
        str = str.replace(/^\s\s*/, "");
        ws = /\s/;
        i = str.length;
        while (ws.test(str.charAt(--i))) {
            continue;
        }
        return str.slice(0, i + 1);
    }
}, module);
