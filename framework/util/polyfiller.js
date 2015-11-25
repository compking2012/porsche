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
            this.polyfillContextRoundRect(context);
            this.polyfillContextDrawLine(context);
            this.polyfillContextConicalGradient(context);
        },

        polyfillContextRoundRect: function(context) {
            if (context.constructor.prototype.roundRect === undefined) {
                context.constructor.prototype.roundRect = function(x, y, width, height, radius) {
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

        polyfillContextDrawLine: function(context) {
            if (context.constructor.prototype.drawLine === undefined) {
                context.constructor.prototype.drawLine = function(coord) {
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
            if (context.constructor.prototype.createConicalGradient === undefined) {
                function ConicalGradient(x0, y0) {
                    this._x0 = x0;
                    this._y0 = y0;
                    this._colorStops = [];
                }

                context.constructor.prototype.createConicalGradient = function(x0, y0) {
                    ConicalGradient.prototype.addColorStop = function(offset, color) {
                        var colorStop = color + " " + offset;
                        this._colorStops.push(colorStop);
                    };

                    ConicalGradient.prototype.normalizeColorStops = function() {
                        for (var i = 0; i < this._colorStops.length; i++) {
                            if (this._colorStops[i]) {
                                var stop = this._colorStops[i] = new ConicalGradient.ColorStop(this, this._colorStops[i]);

                                if (stop.next) {
                                    this._colorStops.splice(i + 1, 0, stop.next);
                                    i++;
                                }
                            }
                            else {
                                this.stops.splice(i, 1);
                                i--;
                            }
                        }

                        // Normalize stops
                        // Add dummy first stop or set first stop’s position to 0 if it doesn’t have one
                        if (this._colorStops[0].offset === undefined) {
                            this._colorStops[0].offset = 0;
                        } else if (this._colorStops[0].offset > 0) {
                            var first = this._colorStops[0].clone();
                            first.offset = 0;
                            this._colorStops.unshift(first);
                        }
                        // Add dummy last stop or set first stop’s position to 100% if it doesn’t have one
                        if (this._colorStops[this._colorStops.length - 1].offset === undefined) {
                            this._colorStops[this._colorStops.length - 1].offset = 1;
                        } else if (!this.repeating && this._colorStops[this._colorStops.length - 1].offset < 1) {
                            var last = this._colorStops[this._colorStops.length - 1].clone();
                            last.offset = 1;
                            this._colorStops.push(last);
                        }

                        this._colorStops.forEach(function(stop, i) {
                            if (stop.offset === undefined) {
                                // Evenly space color stops with no position
                                for (var j = i + 1; this[j]; j++) {
                                    if (this[j].offset !== undefined) {
                                        stop.offset = this[i - 1].offset + (this[j].offset - this[i - 1].offset) / (j - i + 1);
                                        break;
                                    }
                                }
                            } else if (i > 0) {
                                // Normalize color stops whose position is smaller than the position of the stop before them
                                stop.offset = Math.max(stop.offset, this[i - 1].offset);
                            }
                        }, this._colorStops);

                    };

                    return new ConicalGradient(x0, y0);
                };

                ConicalGradient.ColorStop = function(gradient, stop) {
                    this.gradient = gradient;

                    if (stop) {
                        var parts = stop.match(/^(.+?)(?:\s+([\d.]+)(%|deg|turn)?)?(?:\s+([\d.]+)(%|deg|turn)?)?\s*$/);

                        this.color = ConicalGradient.ColorStop.colorToRGBA(parts[1]);

                        if (parts[2]) {
                            var unit = parts[3];

                            if (unit === "%" || parts[2] === "0" && !unit) {
                                this.offset = parts[2] / 100;
                            }
                            else if (unit === "turn") {
                                this.offset = +parts[2];
                            }
                            else if (unit === "deg") {
                                this.offset = parts[2] / 360;
                            }
                        }

                        if (parts[4]) {
                            this.next = new ConicalGradient.ColorStop(gradient, parts[1] + " " + parts[4] + parts[5]);
                        }
                    }
                };

                ConicalGradient.ColorStop.prototype.clone = function() {
                    var ret = new ConicalGradient.ColorStop(this.gradient);
                    ret.color = this.color;
                    ret.offset = this.offset;

                    return ret;
                };

                ConicalGradient.ColorStop.prototype.toString = function() {
                    return "rgba(" + this.color.join(", ") + ") " + this.offset * 100 + "%";
                };

                ConicalGradient.ColorStop.colorToRGBA = function(color) {
                    if (!Array.isArray(color)) {
                        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                        var hex = color.replace(shorthandRegex, function(m, r, g, b) {
                            return r + r + g + g + b + b;
                        });

                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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

                // fillStyle property
                var fillStylePd = Object.getOwnPropertyDescriptor(context.constructor.prototype, "fillStyle");
                var fillStyleSetFunc = fillStylePd.set;
                var fillStyleGetFunc = fillStylePd.get;
                fillStylePd.set = function(value) {
                    if (value instanceof ConicalGradient) {
                        this._fillStyle = value;
                    } else {
                        this._fillStyle = undefined;
                        fillStyleSetFunc.apply(this, arguments);
                    }
                };
                fillStylePd.get = function() {
                    if (this._fillStyle && this._fillStyle instanceof ConicalGradient) {
                        return this._fillStyle;
                    } else {
                        fillStyleGetFunc.apply(this, arguments);
                    }
                };
                Object.defineProperty(context.constructor.prototype, "fillStyle", fillStylePd);

                // fillRect method
                var fillRectPd = Object.getOwnPropertyDescriptor(context.constructor.prototype, "fillRect");
                var fillRectFunc = fillRectPd.value;
                fillRectPd.value = function() {
                    if (this._fillStyle && this._fillStyle instanceof ConicalGradient) {
                        var conic = this._fillStyle;
                        conic.normalizeColorStops();
                        var size = 320;
                        var radius = size * Math.sqrt(2) / 2;
                        var x = size / 2;
                        var stopIndex = 0; // The index of the current color
                        var stop = conic._colorStops[stopIndex];
                        var prevStop;
                        var diff;
                        var sameColor;
                        var theta;
                        var deg = Math.PI / 180;
                        var epsilon = 0.00001;

                        // Transform coordinate system so that angles start from the top left, like in CSS
                        this.translate(size / 2, size / 2);
                        this.rotate(-90 * deg);
                        this.translate(-size / 2, -size / 2);

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
                            this.fillStyle = "rgba(" + interpolated.join(",") + ")";
                            this.beginPath();
                            this.moveTo(x, x);
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
                            this.arc(x, x, radius, arc >= 2 * deg ? angle : angle - 0.02, endAngle);

                            this.closePath();
                            this.fill();
                        }
                    } else {
                        fillRectFunc.apply(this, arguments);
                    }
                };
                Object.defineProperty(context.constructor.prototype, "fillRect", fillRectPd);
            }
        }
    }
}, module);
