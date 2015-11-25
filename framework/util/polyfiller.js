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
            if (context.roundRect === undefined) {
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

            if (context.drawLine === undefined) {
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

            if (context.createConicalGradient === undefined) {

                var pd = Object.getOwnPropertyDescriptor(context.constructor.prototype, "fillStyle");
                var fillStyleSetFunc = pd.set;
                var fillStyleGetFunc = pd.get;
                pd.set = function() {
                    fillStyleSetFunc.apply(this, arguments);
                };
                pd.get = function() {
                    fillStyleGetFunc.apply(this, arguments);
                };
                Object.defineProperty(context.constructor.prototype, "fillStyle", pd);

                context.constructor.prototype.createConicalGradient = function(x0, y0) {
                    function ConicalGradient(x0, y0) {
                        this._x0 = x0;
                        this._y0 = y0;
                    }

                    ConicalGradient.prototype.addColorStop = function() {
                    };

                    return new ConicalGradient(x0, y0);
                };

            }
        }
    }
}, module);
