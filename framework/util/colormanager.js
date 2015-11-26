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
var Class = require("../class");
var YObject = require("../yobject");
var GradientParser = require("./gradient-parser/gradientparser");

Class.define("framework.util.ColorManager", YObject, {
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);


    },

    destroy: function() {

        YObject.prototype.destroy.apply(this, arguments);
    },

    getColorObject: function(color) {
        if (/^linear\-gradient/.test(color)) {
            return this.processLinearGradientColorObject(color);
        } else if (/^radial\-gradient/.test(color)) {
            return this.processRadialGradientColorObject(color);
        } else if (/^conic\-gradient/.test(color)) {
            return this.processConicGradientColorObject(color);
        } else if (/^url/.test(color)) {
            return this.processImageColorObject(color);
        } else {
            // Solid color
            return null;
        }
    },

    getColor: function(context, width, height, color, colorObject) {
        if (/^linear\-gradient/.test(color)) {
            return this.processLinearGradientColor(context, width, height, color, colorObject);
        } else if (/^radial\-gradient/.test(color)) {
            return this.processRadialGradientColor(context, width, height, color, colorObject);
        } else if (/^conic\-gradient/.test(color)) {
            return this.processConicGradientColor(context, width, height, color, colorObject);
        } else if (/^url/.test(color)) {
            return this.processImageColor(context, width, height, color, colorObject);
        } else {
            // Solid color
            return color;
        }
    },

    processLinearGradientColorObject: function(color) {
        var linear = GradientParser.parse(color)[0];
        if (linear.orientation === undefined) {
            linear.orientation = {type: "angular", value: 180};
        }

        var colorStops = linear.colorStops;
        var length = colorStops.length;

        if (colorStops[0].length === undefined) {
            colorStops[0].length = {type: "%", value: 0};
        }
        if (colorStops[length - 1].length === undefined) {
            colorStops[length - 1].length = {type: "%", value: 100};
        }
        var i = 1;
        while (i < length - 1) {
            var colorStop = colorStops[i];
            var j = 1;
            if (colorStop.length === undefined) {
                j = i;
                var startValue = parseFloat(colorStops[i - 1].length.value);
                while (j < length) {
                    if (colorStops[j].length !== undefined) {
                        var lastValue = parseFloat(colorStops[j].length.value);
                        var delta = (lastValue - startValue) / (j - i + 1);
                        for (var k = i; k < j; k++) {
                            colorStops[k].length = {type: "%", value: startValue + delta * (k - i + 1)};
                        }
                        break;
                    }
                    j++;
                }
            }
            i += j;
        }

        for (var i = 0; i < length; i++) {
            var colorStop = colorStops[i];
            if (colorStop.type === "hex") {
                colorStop.value = "#" + colorStop.value;
            } else {
                colorStop.value = colorStop.value;
            }
        }
        return linear;
    },

    processRadialGradientColorObject: function(color) {
        var radial = GradientParser.parse(color)[0];
        if (radial.orientation === undefined) {
            radial.orientation = {type: "position", value: "center"};
        }

        var colorStops = radial.colorStops;
        return radial;
    },

    processConicGradientColorObject: function(color) {
        var conic = GradientParser.parse(color)[0];

        var colorStops = conic.colorStops;
        for (var i = 0; i < colorStops.length; i++) {
            var colorStop = colorStops[i];
            // var parts = colorStop.value.match(/^(.+?)(?:\s+([\d.]+)(%|deg|turn)?)?(?:\s+([\d.]+)(%|deg|turn)?)?\s*$/);
            var colorValue = colorStop.value;
            if (colorStop.type === "hex") {
                colorValue = "#" + colorValue;
            } else {
                colorValue = colorValue;
            }

            // if (parts[2]) {
            //     var unit = parts[3];

            //     if (unit === "%" || parts[2] === "0" && !unit) {
            //         this.offset = parts[2] / 100;
            //     }
            //     else if (unit === "turn") {
            //         this.offset = +parts[2];
            //     }
            //     else if (unit === "deg") {
            //         this.offset = parts[2] / 360;
            //     }
            // }

            // if (parts[4]) {
            //     this.next = new ConicalGradient.ColorStop(gradient, parts[1] + " " + parts[4] + parts[5]);
            // }


            // if (colorStops[i].next) {
            //     colorStops.splice(i + 1, 0, colorStops[i].next);
            //     i++;
            // }
        }

        // Normalize stops
        // Add dummy first stop or set first stop’s position to 0 if it doesn’t have one
        var colorStop = colorStops[0];
        if (colorStop.length === undefined) {
            colorStop.length = {type: "%", value: 0};
        } else if (colorStop.length.value > 0) {
            var first = {
                length: {
                    type: "%",
                    value: 0
                },
                color: colorStop.color
            };
            if (colorStop.next) {
                first.next = colorStop.next;
            }
            colorStops.unshift(first);
        }
        // Add dummy last stop or set first stop’s position to 100% if it doesn’t have one
        colorStop = colorStops[colorStops.length - 1];
        if (colorStop.length === undefined) {
            colorStop.length = {type: "%", value: 100};
        } else if (colorStop.length.value < 1) {
            var last = {
                length: {
                    type: "%",
                    value: 100
                },
                color: colorStop.color
            };
            colorStops.push(last);
        }

        colorStops.forEach(function(stop, i) {
            if (stop.length === undefined) {
                // Evenly space color stops with no position
                for (var j = i + 1; this[j]; j++) {
                    if (this[j].length !== undefined) {
                        stop.length = {type: "%", value: this[i - 1].length.value + (this[j].length.value - this[i - 1].length.value) / (j - i + 1)};
                        break;
                    }
                }
            } else if (i > 0) {
                // Normalize color stops whose position is smaller than the position of the stop before them
                stop.length = {type: "%", value: Math.max(stop.length.value, this[i - 1].length.value)};
            }
            if (stop.type === "hex") {
                stop.value = "#" + stop.value;
            } else {
                stop.value = stop.value;
            }
        }, colorStops);

        return conic;
    },

    processImageColorObject: function(color) {
        var group = color.match(/^url\(([\w|\.|\/|\-]+)\)\s+(\w+)/);
        var url = group[1];
        var image = new Image();
        image.src = url;
        return image;
    },

    processLinearGradientColor: function(context, width, height, color, colorObject) {
        var linear = colorObject;
        var orientationValue = linear.orientation.value;
        if (linear.orientation.type === "directional") {
            switch (orientationValue) {
                case "left":
                    orientationValue = -90;
                    break;
                case "right":
                    orientationValue = 90;
                    break;
                case "top":
                    orientationValue = 0;
                    break;
                case "bottom":
                    orientationValue = 180;
                    break;
                case "left top":
                case "top left":
                    orientationValue = -Math.atan(width / height) * 180 / Math.PI;
                    break;
                case "left bottom":
                case "bottom left":
                    orientationValue = -Math.atan(width / height) * 180 / Math.PI - 90;
                    break;
                case "right top":
                case "top right":
                    orientationValue = Math.atan(width / height) * 180 / Math.PI;
                    break;
                case "right bottom":
                case "bottom right":
                    orientationValue = Math.atan(width / height) * 180 / Math.PI + 90;
                    break;
                default:
                    orientationValue = 90;
            }
        } else if (linear.orientation.value === "angular") {
            var angle = parseFloat(orientationValue) % 360;
            if (angle > 180) {
                angle = angle - 360;
            } else if (angle < -180) {
                angle = 360 + angle;
            }
            orientationValue = angle;
        }

        var startX, startY, endX, endY;
        var k = Math.tan((orientationValue - 90) / 180 * Math.PI);
        if (orientationValue % 90 !== 0) {
            var powk = Math.pow(k, 2);
            startX = (powk * width - k * height) / (powk + 1) / 2;
            startY = -startX / k;
            endX = (powk * width + 2 * width + k * height) / (powk + 1) / 2;
            endY = -endX / k + height + width / k;
        } else if (orientationValue === 0) {
            startX = 0;
            startY = height;
            endX = 0;
            endY = 0;
        } else if (orientationValue === 90) {
            startX = 0;
            startY = 0;
            endX = width;
            endY = 0;
        } else if (orientationValue === -90) {
            startX = width;
            startY = 0;
            endX = 0;
            endY = 0;
        } else if (orientationValue === -180 || orientationValue === 180) {
            startX = width;
            startY = 0;
            endX = 0;
            endY = height;
        }

        var gradient = context.createLinearGradient(startX, startY, endX, endY);
        var colorStops = linear.colorStops;
        var length = colorStops.length;
        for (var i = 0; i < length; i++) {
            var colorStop = colorStops[i];
            gradient.addColorStop(colorStop.length.value / 100, colorStop.value);
        }
        return gradient;
    },

    processRadialGradientColor: function(context, width, height, color, colorObject) {
        var radial = colorObject;
        return null;
    },

    processConicGradientColor: function(context, width, height, color, colorObject) {
        var conic = colorObject;
        var orientationValue = conic.orientation.value;
        var x, y;
        switch (orientationValue) {
            case "left top":
            case "top left":
                x = 0;
                y = 0;
                break;
            case "left bottom":
            case "bottom left":
                x = 0;
                y = height;
                break;
            case "right top":
            case "top right":
                x = width;
                y = 0;
                break;
            case "right bottom":
            case "bottom right":
                x = width;
                y = height;
                break;
            case "center":
                x = width / 2;
                y = height / 2;
                break;
            default:
                x = width / 2;
                y = height / 2;
        }
        var gradient = context.createConicalGradient(x, y, Math.max(width, height) * Math.sqrt(2) / 2);
        var colorStops = conic.colorStops;
        var length = colorStops.length;
        for (var i = 0; i < length; i++) {
            var colorStop = colorStops[i];
            gradient.addColorStop(colorStop.length.value / 100, colorStop.value);
        }
        return gradient;
    },

    processImageColor: function(context, width, height, color, colorObject) {
        var group = color.match(/^url\(([\w|\.|\/|\-]+)\)\s+(\w+)/);
        var repeat = group[2];
        var pattern = context.createPattern(colorObject, repeat);
        return pattern;
    }
}, module);

});