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

/**
 * Text view which can place some rich text.
 * @class RichTextView
 * @extends TextView
 */
Class.define("framework.ui.view.RichTextView", TextView, {
    /**
     * Constructor that create a view
     * @method RichTextView#initialize
     * @param textValue {String} the text string that shows
     */
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        this._baseline = "bottom";
        this.savedClasses = [];
        this._isAdaptive = false;
    },

    destroy: function() {
        this.savedClasses = null;
        
        this.super.destroy.apply(this, arguments);
    },

    /**
     * @name RichTextView#isAdaptive
     * @type {Boolean}
     * @description Whether to automatic calculate the height of the view.
     */
    get isAdaptive() {
        return this._isAdaptive;
    },

    set isAdaptive(value) {
        this._isAdaptive = value;
    },

    /**
     * @method RichtextView#defineClass
     * @param {String} id - the id of new defined class
     * @param {Object} definition - the property of the new defined class, such as { _fontStyle: "normal", _fontSize: "28px", _fontColor: "#FF0000", _fontFamily: "default", _fontWeight: "bold" }
     * @description Define a new text class
     */
    defineClass: function(id, definition) {
        if (typeof (definition) != "object") {
            return false;
        }
        this.savedClasses[id] = definition;
        return true;
    },

    /**
     * @method RichtextView#getClass
     * @param {String} id - the id of defined class
     * @description Get the specific definition of the given id
     * @private
     */
    getClass: function(id) {
        if (this.savedClasses[id] !== undefined) {
            return this.savedClasses[id];
        }
    },

    /**
     * @method RichtextView#isEmpty
     * @param {String} the value to be checked
     * @description Check if the given value is empty
     * @private
     */
    isEmpty: function (str) {
        // Remove white spaces.
        str = str.replace(/^\s+|\s+$/, '');
        return str.length == 0;
    },


    draw: function(context) {
        context.save();
        context.beginPath();
        context.font = this.fontWeight + " " + this.fontStyle + this.fontSize + " " + this.fontFamily; 
        var match = this.text.match(/<\s*br\s*\/>|<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>|<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>|[^<]+/g);
        var proFont = [];
        var proText, properties, property, propertyName, propertyValue;
        var classDefinition;
        var proX, splittedText;
        var LinesHeight = this.getLinesHeight(match, context);
        if (this._isAdaptive === true) {
            var adaptiveHeight = 0;
            for (var i = 0; i< LinesHeight.length; i++) {
                adaptiveHeight += LinesHeight[i] + this._lineMargin;
            }
            if(adaptiveHeight !== this.height) {
                this.height = adaptiveHeight;
                this._timer = setTimeout(function() {
                    clearTimeout(this._timer);
                    this.invalidate();
                }.bind(this), 1);
                context.restore();
                return;
            }
        }
        var innerMatch = null;
        var x = 0, y = LinesHeight[0] + this._lineMargin;
        var printLines = 0;
        var textLines = [];
        for(var i = 0; match != null && i < match.length; i++){
            proFont.fontStyle = this.fontStyle;
            proFont.fontWeight = this.fontWeight;
            proFont.fontSize = this.fontSize;
            proFont.fontFamily = this.fontFamily;
            proFont.fontColor = this.color;
            if (/<\s*style=/i.test(match[i])) {
                innerMatch = match[i].match(/<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>/);
                properties = innerMatch[1].split(";");
                this.setStyleProperties(properties, proFont);
                proText = innerMatch[2];
            }else if (/<\s*class=/i.test(match[i])) {
                innerMatch = match[i].match(/<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>/);
                classDefinition = this.getClass(innerMatch[1]);
                this.setClassProperties(classDefinition, proFont);
                proText = innerMatch[2];
            }else if (/<\s*br\s*\/>/i.test(match[i])) {
                printLines++;
                y += LinesHeight[printLines] + this._lineMargin;
                x = 0;
                continue;
            }else {
                proText = match[i];
            }
            context.font = proFont.fontWeight + " " + proFont.fontStyle + " " + proFont.fontSize + " " + proFont.fontFamily;
            context.fillStyle = proFont.fontColor;
            context.textBaseline = this._baseline; 
            context.textAlign = this._align; 
            proText = proText.replace(/\s*\n\s*/g, " ");
            textLines = [];
            if (context.measureText(proText).width + x + this._x > this.width) {
                splittedText = this.trim(proText).split("");
                if (splittedText.length == 1) {
                    textLines.push({text: this.trim(proText) + " ", linebreak: true});
                } else {
                    proX = x;
                    var line=0;
                    textLines[line] = {text: undefined, linebreak: false};
                    var lineWidth = context.measureText("-").width;
                    var pattern = /[a-z|A-Z|0-9]/;
                    for (var k = 0; k < splittedText.length; k++) {
                        splittedText[k] += "";
                        var curPos = context.measureText(splittedText[k]).width + proX + this._x;
                        if (curPos <= this.width) {
                            if(pattern.test(splittedText[k]) && k < splittedText.length-1 && pattern.test(splittedText[k+1]) && curPos + context.measureText(splittedText[k+1]).width > this.width) {
                                if (curPos + lineWidth <= this.width) {
                                    if (textLines[line].text == undefined) {
                                        textLines[line].text = splittedText[k] + "-";
                                    } else {
                                        textLines[line].text += splittedText[k] + "-";
                                    }
                                    line++;
                                    textLines[line] = {text: undefined, linebreak:true};
                                    proX = 0;
                                }else {
                                    if (k >= 1 && splittedText[k-1] !== " ") {
                                        textLines[line].text += "-";
                                    }
                                    if(textLines[line].text != undefined) {
                                        line++;
                                    }
                                    proX = 0;
                                    textLines[line] = {text: splittedText[k], linebreak:true};
                                    proX += context.measureText(splittedText[k]).width;
                                }
                            }else {
                                if (textLines[line].text == undefined) {
                                    textLines[line].text = splittedText[k];
                                } else {
                                    textLines[line].text += splittedText[k];
                                }
                                proX += context.measureText(splittedText[k]).width;
                            }
                        }else {
                            proX = 0;
                            if(textLines[line].text != undefined) {
                                line++;
                            }
                            textLines[line] = {text: splittedText[k], linebreak: true};
                            proX += context.measureText(splittedText[k]).width;
                        }
                    }
                }
            }
            if (textLines.length == 0) {
                textLines.push({text: this.trim(proText) + " ", linebreak: false}); 
            }
            for (var n = 0; n < textLines.length; n++) {
                if(textLines[n].linebreak) {
                    printLines++;
                    y += parseInt(LinesHeight[printLines] + this._lineMargin);
                    x = 0;
                }
                context.fillText(textLines[n].text, x, y);
                x += context.measureText(textLines[n].text).width;
            }
        }
        context.restore();
    },

    setStyleProperties: function(properties, proFont) {
        var propertyName, propertyValue;
        for (var j = 0; j < properties.length; j++) {
            var property = properties[j].split(":");
            if (this.isEmpty(property[0]) || this.isEmpty(property[1])) {
            // wrong property Name or value, jump to the next loop and continue
                continue;
            }
            propertyName = this.trim(property[0]);
            propertyValue = this.trim(property[1]);
            switch (propertyName) {
                case "font-family":
                    proFont.fontFamily = propertyValue;
                    break;
                case "font-weight":
                    proFont.fontWeight = propertyValue;
                    break;
                case "font-size":
                    proFont.fontSize = propertyValue;
                    break;
                case "font-style":
                    proFont.fontStyle = propertyValue;
                    break;
                case "color":
                    if (this.isHex(propertyValue)) {
                        proFont.fontColor = propertyValue;
                    }
                    break;
            }
        }
    },


    setClassProperties: function(classDefinition, proFont) {
        for (var attribute in classDefinition) {
            switch(attribute) {
                case "_fontFamily":
                    proFont.fontFamily = classDefinition[attribute];
                    break;
                case "_fontWeight":
                    proFont.fontWeight = classDefinition[attribute];
                    break;
                case "_fontSize":
                    proFont.fontSize = classDefinition[attribute];
                    break;
                case "_fontStyle":
                    proFont.fontStyle = classDefinition[attribute];
                    break;
                case "_fontColor":
                    if (this.isHex(classDefinition[attribute])) {
                        proFont.fontColor = classDefinition[attribute];
                    }
                    break;
            }
        }
    },

    getLinesHeight: function(match, context) {
        var maxLineheight = Number(this.fontSize.substr(0, this.fontSize.length - 2));
        var x = 0, proX, y, innerMatch = null;
        var textLines = [];
        var LinesHeight = [], linesNum = 0;
        var proFont = [], proText, properties, splittedText, classDefinition;
        context.save();
        for (var i=0; match != null && i < match.length; i++) {
            proFont.fontStyle = this.fontStyle;
            proFont.fontWeight = this.fontWeight;
            proFont.fontSize = this.fontSize;
            proFont.fontFamily = this.fontFamily;
            proFont.fontColor = this.color;
            if (/<\s*style=/i.test(match[i])) {
                innerMatch = match[i].match(/<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>/);
                properties = innerMatch[1].split(";");
                this.setStyleProperties(properties, proFont);
                proText = innerMatch[2];
            }else if (/<\s*class=/i.test(match[i])) {
                innerMatch = match[i].match(/<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>/);
                classDefinition = this.getClass(innerMatch[1]);
                this.setClassProperties(classDefinition, proFont);
                proText = innerMatch[2];
            }else if (/<\s*br\s*\/>/i.test(match[i])) {
                linesNum++;
                maxLineheight = Number(this.fontSize.substr(0, this.fontSize.length - 2)); 
                LinesHeight[linesNum] = maxLineheight;
                x = 0;
                continue;
            }else {
                // Text without special style.
                proText = match[i];
            }
            if (maxLineheight <  Number(proFont.fontSize.substr(0, proFont.fontSize.length - 2))) {
                maxLineheight = Number(proFont.fontSize.substr(0, proFont.fontSize.length - 2));
                LinesHeight[linesNum] =  maxLineheight;
            }
            context.font = proFont.fontWeight + " " + proFont.fontStyle + proFont.fontSize + " " + proFont.fontFamily;
            context.fillStyle = proFont.fontColor;
            context.textBaseline = this._baseline;
            context.textAlign = this._align;
            textLines = [];
            LinesHeight[linesNum] = maxLineheight;
            proText = proText.replace(/\s*\n\s*/g, " ");
            var lineWidth = context.measureText("-").width;
            var pattern = /[a-z|A-Z|0-9]/;
            if (context.measureText(proText).width + this._x + x > this.width) {
                splittedText = this.trim(proText).split("");
                if (splittedText.length == 1) {
                    textLines.push({text: this.trim(proText) + " ", linebreak: true});
                    LinesHeight[linesNum] = maxLineheight;
                    linesNum++;
                    maxLineheight = Number(proFont.fontSize.substr(0, proFont.fontSize.length - 2)); 
                } else {
                    proX = x;
                    var line=0;
                    textLines[line] = {text: undefined, linebreak: false};
                    for (var k = 0; k < splittedText.length; k++) {
                        splittedText[k] += "";
                        var curPos = context.measureText(splittedText[k]).width + proX + this._x;
                        if (curPos <= this.width) {
                            if(pattern.test(splittedText[k]) && k < splittedText.length-1 && pattern.test(splittedText[k+1]) && curPos + context.measureText(splittedText[k+1]).width > this.width) {
                                if (curPos + lineWidth <= this.width) {
                                    if (textLines[line].text == undefined) {
                                        textLines[line].text = splittedText[k] + "-";
                                    } else {
                                        textLines[line].text += splittedText[k] + "-";
                                    }
                                    LinesHeight[linesNum] = maxLineheight;
                                    textLines[line] = {text: splittedText[k], linebreak: true};
                                    LinesHeight[linesNum] = maxLineheight;
                                    proX += context.measureText(splittedText[k]).width;
                                } else {
                                    if (k >= 1 && splittedText[k-1] !== " ") {
                                        textLines[line].text += "-";
                                    }
                                }
                                proX = 0;
                                linesNum++;
                                maxLineheight = Number(proFont.fontSize.substr(0, proFont.fontSize.length - 2));
                                LinesHeight[linesNum] = maxLineheight;
                                if(textLines[line].text != undefined) {
                                    line++;
                                }
                                textLines[line] = {text: splittedText[k], linebreak:true};
                                proX += context.measureText(splittedText[k]).width;
                            }else {
                                if (textLines[line].text == undefined) {
                                    textLines[line].text = splittedText[k];
                                } else {
                                    textLines[line].text += splittedText[k];
                                }
                                proX += context.measureText(splittedText[k]).width;
                            }
                        }else {
                            proX = 0;
                            LinesHeight[linesNum] = maxLineheight;
                            linesNum++;
                            if(textLines[line].text != undefined) {
                                line++;
                                maxLineheight = Number(proFont.fontSize.substr(0, proFont.fontSize.length - 2));
                            }
                            textLines[line] = {text: splittedText[k], linebreak: true};
                            LinesHeight[linesNum] = maxLineheight;
                            proX += context.measureText(splittedText[k]).width;
                        }
                    }
                }
            }
            if (textLines.length == 0) { 
                textLines.push({text: this.trim(proText) + " ", linebreak: false}); 
            }
            for (var n = 0; n < textLines.length; n++) {
                if(textLines[n].linebreak) {
                    x = 0;
                }
                x += context.measureText(textLines[n].text).width;
            }
        }
        context.restore();
        return LinesHeight;
    },


    isHex: function(hex) {
        return (/^(#[a-fA-F0-9]{3,6})$/i.test(hex));
    },

    /**
     * A simple function clear whitespaces.
     */
    trim: function (str) {
        var ws, i;
        str = str.replace(/^\s\s*/, '');
        ws = /\s/;
        i = str.length;
        while (ws.test(str.charAt(--i))) {
            continue;
        }
        return str.slice(0, i + 1);
    },

}, module);
