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
            // Linear gradient
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
        } else if (/^radial\-gradient/.test(color)) {
            // Radial gradient
            var radial = GradientParser.parse(color);
            return radial;
        } else if (/^conic\-gradient/.test(color)) {
            // Conical gradient
            var conical = GradientParser.parse(color);
            return null;
        } else if (/^url/.test(color)) {
            // Background image
            var group = color.match(/^url\(([\w|\.|\/|\-]+)\)\s+(\w+)/);
            var url = group[1];
            var image = new Image();
            image.src = url;
            return image;
        } else {
            // Solid color
            return null;
        }
    },

    getColor: function(context, width, height, color, colorObject) {
        if (/^linear\-gradient/.test(color)) {
            // Linear gradient
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
        } else if (/^radial\-gradient/.test(color)) {
            // Radial gradient
            var radial = this._backgroundObject;
            return radial;
        } else if (/^conical\-gradient/.test(color)) {
            // Conical gradient
            var conical = this._backgroundObject;
            return conical;
        } else if (/^url/.test(color)) {
            // Background image
            var group = color.match(/^url\(([\w|\.|\/|\-]+)\)\s+(\w+)/);
            var repeat = group[2];
            var pattern = context.createPattern(colorObject, repeat);
            return pattern;
        } else {
            // Solid color
            return color;
        }
    }
}, module);
