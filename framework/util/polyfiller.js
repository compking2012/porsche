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

Class.define("framework.ui.util.Polyfiller", YObject, {
    static: {
        polyfillContext: function(context) {
            if (global.CanvasRenderingContext2D === undefined) {
                global.CanvasRenderingContext2D = context.constructor;
            }
            this.polyfillContextRoundRect(context);
            this.polyfillContextDrawLine(context);
            this.polyfillContextConicalGradient(context);
        },

        polyfillContextRoundRect: function(/*context*/) {
            if (global.CanvasRenderingContext2D.prototype.roundRect === undefined) {
                global.CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                    if (radius === undefined) {
                        return;
                    }
                    this.beginPath();
                    this.moveTo(x + radius, y);
                    this.lineTo(x + width - radius, y);
                    this.quadraticCurveTo(x + width, y, x + width, y + radius);
                    this.lineTo(x + width, y + height - radius);
                    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                    this.lineTo(x + radius, y + height);
                    this.quadraticCurveTo(x, y + height, x, y + height - radius);
                    this.lineTo(x, y + radius);
                    this.quadraticCurveTo(x, y, x + radius, y);
                    this.closePath();

                    return this;
                };
            }
        },

        polyfillContextDrawLine: function(/*context*/) {
            if (global.CanvasRenderingContext2D.prototype.drawLine === undefined) {
                global.CanvasRenderingContext2D.prototype.drawLine = function(coord) {
                    this.save();
                    this.beginPath();

                    if (coord.attr.type === "dashed") {
                        this.setLineDash([coord.attr.dashWidth, coord.attr.spaceWidth]);
                    }
                    this.moveTo(coord.startX, coord.startY);
                    this.lineTo(coord.endX, coord.endY);
                    this.lineWidth = coord.thick;
                    this.strokeStyle = coord.color;
                    this.stroke();
                    this.restore();

                    return this;
                };
            }
        },

        polyfillContextConicalGradient: function(context) {
            if (global.CanvasRenderingContext2D.prototype.createConicalGradient === undefined) {
                var ConicalGradient = function(x0, y0) {
                    this._x0 = x0;
                    this._y0 = y0;
                    this._colorStops = [];
                };

                global.CanvasRenderingContext2D.prototype.createConicalGradient = function(x0, y0, r) {
                    ConicalGradient.prototype.addColorStop = function(offset, color) {
                        color = this.colorToRGBA(color);

                        this._colorStops.push({offset: offset, color: color});
                    };

                    ConicalGradient.prototype.colorToRGBA = function(color) {
                        return this.hexToRGBA(this.namedToHex(color) || color);
                    };

                    ConicalGradient.prototype.hexToRGBA = function(color) {
                        if (!Array.isArray(color)) {
                            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                            var hex = color.replace(shorthandRegex, function(m, r, g, b) {
                                return r + r + g + g + b + b;
                            });

                            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                            if (result === null) {
                                return color;
                            }
                            color = "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ")";

                            var rgba = color.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/);

                            if (rgba) {
                                rgba.shift();
                                rgba = rgba.map(function(a) {
                                    return +a;
                                });
                                rgba[3] = isNaN(rgba[3]) ? 1 : rgba[3];
                            }

                            return rgba || [0, 0, 0, 0];
                        }

                        return color;
                    };

                    ConicalGradient.prototype.namedToHex = function(color) {
                        color = color.toLowerCase();
                        var namedColor = {
                            aliceblue: "#f0f8ff",
                            antiquewhite: "#faebd7",
                            aqua: "#00ffff",
                            aquamarine: "#7fffd4",
                            azure: "#f0ffff",
                            beige: "#f5f5dc",
                            bisque: "#ffe4c4",
                            black: "#000000",
                            blanchedalmond: "#ffebcd",
                            blue: "#0000ff",
                            blueviolet: "#8a2be2",
                            brown: "#a52a2a",
                            burlywood: "#deb887",
                            cadetblue: "#5f9ea0",
                            chartreuse: "#7fff00",
                            chocolate: "#d2691e",
                            coral: "#ff7f50",
                            cornflowerblue: "#6495ed",
                            cornsilk: "#fff8dc",
                            crimson: "#dc143c",
                            cyan: "#00ffff",
                            darkblue: "#00008b",
                            darkcyan: "#008b8b",
                            darkgoldenrod: "#b8860b",
                            darkgray: "#a9a9a9",
                            darkgrey: "#a9a9a9",
                            darkgreen: "#006400",
                            darkkhaki: "#bdb76b",
                            darkmagenta: "#8b008b",
                            darkolivegreen: "#556b2f",
                            darkorange: "#ff8c00",
                            darkorchid: "#9932cc",
                            darkred: "#8b0000",
                            darksalmon: "#e9967a",
                            darkseagreen: "#8fbc8f",
                            darkslateblue: "#483d8b",
                            darkslategray: "#2f4f4f",
                            darkslategrey: "#2f4f4f",
                            darkturquoise: "#00ced1",
                            darkviolet: "#9400d3",
                            deeppink: "#ff1493",
                            deepskyblue: "#00bfff",
                            dimgray: "#696969",
                            dimgrey: "#696969",
                            dodgerblue: "#1e90ff",
                            firebrick: "#b22222",
                            floralwhite: "#fffaf0",
                            forestgreen: "#228b22",
                            fuchsia: "#ff00ff",
                            gainsboro: "#dcdcdc",
                            ghostwhite: "#f8f8ff",
                            gold: "#ffd700",
                            goldenrod: "#daa520",
                            gray: "#808080",
                            grey: "#808080",
                            green: "#008000",
                            greenyellow: "#adff2f",
                            honeydew: "#f0fff0",
                            hotpink: "#ff69b4",
                            indianred: "#cd5c5c",
                            indigo: "#4b0082",
                            ivory: "#fffff0",
                            khaki: "#f0e68c",
                            lavender: "#e6e6fa",
                            lavenderblush: "#fff0f5",
                            lawngreen: "#7cfc00",
                            lemonchiffon: "#fffacd",
                            lightblue: "#add8e6",
                            lightcoral: "#f08080",
                            lightcyan: "#e0ffff",
                            lightgoldenrodyellow: "#fafad2",
                            lightgray: "#d3d3d3",
                            lightgrey: "#d3d3d3",
                            lightgreen: "#90ee90",
                            lightpink: "#ffb6c1",
                            lightsalmon: "#ffa07a",
                            lightseagreen: "#20b2aa",
                            lightskyblue: "#87cefa",
                            lightslategray: "#778899",
                            lightslategrey: "#778899",
                            lightsteelblue: "#b0c4de",
                            lightyellow: "#ffffe0",
                            lime: "#00ff00",
                            limegreen: "#32cd32",
                            linen: "#faf0e6",
                            magenta: "#ff00ff",
                            maroon: "#800000",
                            mediumaquamarine: "#66cdaa",
                            mediumblue: "#0000cd",
                            mediumorchid: "#ba55d3",
                            mediumpurple: "#9370d8",
                            mediumseagreen: "#3cb371",
                            mediumslateblue: "#7b68ee",
                            mediumspringgreen: "#00fa9a",
                            mediumturquoise: "#48d1cc",
                            mediumvioletred: "#c71585",
                            midnightblue: "#191970",
                            mintcreaz: "#f5fffa",
                            mistyrose: "#ffe4e1",
                            moccasin: "#ffe4b5",
                            navajowhite: "#ffdead",
                            navy: "#000080",
                            oldlace: "#fdf5e6",
                            olive: "#808000",
                            olivedrab: "#6b8e23",
                            orange: "#ffa500",
                            orangered: "#ff4500",
                            orchid: "#da70d6",
                            palegoldenrod: "#eee8aa",
                            palegreen: "#98fb98",
                            paleturquoise: "#afeeee",
                            palevioletred: "#d87093",
                            papayawhip: "#ffefd5",
                            peachpuff: "#ffdab9",
                            peru: "#cd853f",
                            pink: "#ffc0cb",
                            plum: "#dda0dd",
                            powderblue: "#b0e0e6",
                            purple: "#800080",
                            red: "#ff0000",
                            rosybrown: "#bc8f8f",
                            royalblue: "#4169e1",
                            saddlebrown: "#8b4513",
                            salmon: "#fa8072",
                            sandybrown: "#f4a460",
                            seagreen: "#2e8b57",
                            seashell: "#fff5ee",
                            sienna: "#a0522d",
                            silver: "#c0c0c0",
                            skyblue: "#87ceeb",
                            slateblue: "#6a5acd",
                            slategray: "#708090",
                            slategrey: "#708090",
                            snow: "#fffafa",
                            springgreen: "#00ff7f",
                            steelblue: "#4682b4",
                            tan: "#d2b48c",
                            teal: "#008080",
                            thistle: "#d8bfd8",
                            tomato: "#ff6347",
                            turquoise: "#40e0d0",
                            violet: "#ee82ee",
                            wheat: "#f5deb3",
                            white: "#ffffff",
                            whitesmoke: "#f5f5f5",
                            yellow: "#ffff00",
                            yellowgreen: "#9acd32"
                        };
                        var result = namedColor[color];
                        if (result === undefined) {
                            return null;
                        } else {
                            return result.toUpperCase();
                        }
                    };

                    return new ConicalGradient(x0, y0);
                };

                var conicDraw = function(context, x, y, width, height) {
                    var conic = context._fillStyle;
                    var radius = Math.max(width, height) * Math.sqrt(2) / 2;
                    var centerX = x + width / 2;
                    var centerY = y + height / 2;
                    var stopIndex = 0; // The index of the current color
                    var stop = conic._colorStops[stopIndex];
                    var prevStop;
                    var diff;
                    var sameColor;
                    var theta;
                    var deg = Math.PI / 180;
                    var epsilon = 0.00001;

                    // Transform coordinate system so that angles start from the top left, like in CSS
                    context.translate(width / 2, height / 2);
                    context.rotate(-90 * deg);
                    context.translate(-width / 2, -height / 2);

                    for (var i = 0; i < 360; i += 0.5) {
                        if (i / 360 + epsilon >= stop.offset) {
                            // Switch color stop
                            do {
                                prevStop = stop;

                                stopIndex++;
                                stop = conic._colorStops[stopIndex];
                            } while (stop && stop !== prevStop && stop.offset === prevStop.offset);

                            if (!stop) {
                                break;
                            }

                            // sameColor = prevStop.color + "" === stop.color + "" && prevStop !== stop;
                            sameColor = prevStop.color === stop.color;

                            diff = prevStop.color.map(function(c, i) {
                                return stop.color[i] - c;
                            });
                        }

                        var t = (i / 360 - prevStop.offset) / (stop.offset - prevStop.offset);

                        var interpolated = sameColor ? stop.color : diff.map(function(d, i) {
                            var ret = d * t + prevStop.color[i];

                            return i < 3 ? ret & 255 : ret;
                        });

                        // Draw a series of arcs, 1deg each
                        context.fillStyle = "rgba(" + interpolated.join(",") + ")";
                        context.beginPath();
                        context.moveTo(centerX, centerY);
                        var angle = Math.min(360 * deg, i * deg);

                        if (sameColor) {
                            theta = 360 * (stop.offset - prevStop.offset);

                            i += theta - 0.5;
                        }
                        else {
                            theta = 0.5;
                        }
                        var endAngle = angle + theta * deg;
                        endAngle = Math.min(360 * deg, endAngle);

                        // 0.02: To prevent moire
                        var arc = endAngle - angle;
                        context.arc(centerX, centerY, radius, arc >= 2 * deg ? angle : angle - 0.02, endAngle);

                        context.closePath();
                        context.fill();
                    }
                };
                // fillStyle property
                var fillStylePd = Object.getOwnPropertyDescriptor(global.CanvasRenderingContext2D.prototype, "fillStyle");
                if (fillStylePd !== undefined) {
                    var fillStyleGetFunc = fillStylePd.get;
                    var fillStyleSetFunc = fillStylePd.set;
                    fillStylePd.get = function() {
                        if (this._fillStyle && this._fillStyle instanceof ConicalGradient) {
                            return this._fillStyle;
                        } else {
                            fillStyleGetFunc.apply(this, arguments);
                        }
                    };
                    fillStylePd.set = function(value) {
                        if (value instanceof ConicalGradient) {
                            this._fillStyle = value;
                        } else {
                            this._fillStyle = undefined;
                            fillStyleSetFunc.apply(this, arguments);
                        }
                    };
                    Object.defineProperty(global.CanvasRenderingContext2D.prototype, "fillStyle", fillStylePd);
                }

                // fillRect method
                var fillRectPd = Object.getOwnPropertyDescriptor(global.CanvasRenderingContext2D.prototype, "fillRect");
                var fillRectFunc = fillRectPd.value;
                fillRectPd.value = function(x, y, width, height) {
                    if (this._fillStyle && this._fillStyle instanceof ConicalGradient) {
                        conicDraw(this, x, y, width, height);
                    } else {
                        fillRectFunc.apply(this, arguments);
                    }
                };
                Object.defineProperty(global.CanvasRenderingContext2D.prototype, "fillRect", fillRectPd);
            }
        }
    }
}, module);
