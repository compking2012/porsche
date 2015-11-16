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
var EventEmitter = require("../eventemitter");
var TouchEvent = require("./event/touchevent");
var KeyboardEvent = require("./event/keyboardevent");
var Point = require("./point");

Class.define("framework.ui.WindowManager", EventEmitter, {
    initialize: function(inputService, renderService) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._inputService = inputService;
        this._renderService = renderService;

        this._windows = [];
        this._dialog = null;

        this._redraw = false;
        this._redrawTime = 0;
        this._timer = 0;
        this._timestamp = 0;

        this._activeView = null;
        this._touchstartPoint = new Point(0, 0);
        this._lastTouchPoint = new Point(0, 0);
        this._identifier = 0;

        this._screenCanvas = this._renderService.createCanvas(this._renderService.getWidth(), this._renderService.getHeight());
        this._screenContext = this.getContext(this._screenCanvas);

        this._inputService.addEventListener("input", this._processInputEventFunc = this.processInputEvent.bind(this));
    },

    destroy: function() {
        this._touchstartPoint.destroy();
        this._touchstartPoint = null;

        this._lastTouchPoint.destroy();
        this._lastTouchPoint = null;

        this._activeView = null;

        this._screenContext = null;
        this.destroyCanvas(this._screenCanvas);
        this._screenCanvas = null;
        this._windows = null;

        this._renderService.destroy();
        this._renderService = null;

        this._inputService.removeEventListener("input", this._processTouchEventFunc);
        this._processTouchEventFunc = null;
        this._inputService.destroy();
        this._inputService = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    addWindow: function(win) {
        win.width = this._renderService.getWidth();
        win.height = this._renderService.getHeight();
        win.windowManager = this;
        this._windows.push(win);

        if (this._windows.length === 1) {
            this._mainWindow = win;
        }
    },

    showDialog: function(dialog) {
        if (this._dialog !== null) {
            return;
        }
        dialog.windowManager = this;
        this._dialog = dialog;
        this.draw();
    },

    closeDialog: function() {
        this._dialog.windowManager = null;
        this._dialog = null;
        this._mainWindow.invalidate();
    },

    getContext: function(canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

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
        return context;
    },

    draw: function() {
        if (this._redraw) {
            return;
        }

        var time = new Date().getTime();
        if (time >= this._redrawTime && time - this._redrawTime < 16) {
            return;
        }

        this._redraw = true;
        this._renderService.requestRenderFrame(function() {
            this._redraw = false;
            this._redrawTime = new Date().getTime();

            this._mainWindow.paint(this._screenContext);
            if (this._dialog !== null) {
                this._dialog.paint(this._screenContext);
            }

            if (global.FXDebugPaintFPS) {
                if (!global.FXTimestamp) {
                    global.FXTimestamp = new Date().getTime();
                    global.FXFrameCount = 0;
                }
                global.FXFrameCount++;
                var time = new Date().getTime() - global.FXTimestamp;
                if (time >= 1000) {
                    console.log("[AppFX]PaintFPS: ", Math.round(global.FXFrameCount / time * 1000));
                    global.FXFrameCount = 0;
                    global.FXTimestamp = 0;
                }
            }
            this._renderService.render();
        }.bind(this));
    },

    processInputEvent: function(type, e) {
        if (type === "touchstart" || type === "touchmove" || type === "touchend" || type === "touchcancel") {
            this.processTouchEvent(type, e);
        } else if (type === "keydown" || type === "keyup") {
            this.processKeyboardEvent(type, e);
        }
    },

    processTouchEvent: function(type, e) {
        // TODO: currently, only support single-touch, multi-touch is not supported yet.
        // TODO: only assign touches[], need plus changedTouches[] and targetTouches[]
        var touchPoints = e;

        var activeWindow = this._dialog !== null ? this._dialog : this._mainWindow;
        var view = null;
        if (type === "touchstart") {
            this._touchstartPoint.assign(touchPoints[0].x, touchPoints[0].y);
            this._lastTouchPoint.assign(touchPoints[0].x, touchPoints[0].y);
            this._touchTimestamp = new Date().getTime();
            view = activeWindow.findViewAtPoint(this._touchstartPoint);
            this._identifier = 0;
        } else if (type === "touchmove") {
            if (touchPoints[0].x === this._lastTouchPoint.x && touchPoints[0].y === this._lastTouchPoint.y) {
                return;
            }
            this._lastTouchPoint.assign(touchPoints[0].x, touchPoints[0].y);
            view = activeWindow.findViewAtPoint(this._lastTouchPoint);

            if (this._activeView !== view) {
                return;
            }
        } else if (type === "touchend") {
            view = activeWindow.findViewAtPoint(this._lastTouchPoint);
            if (this._activeView !== view) {
                // FIXME: touchcancel is incorrect
                type = "touchcancel";
            }
        }

        if (view === null) {
            return;
        }

        if (type !== "touchcancel") {
            this._activeView = view;
        }

        var x = touchPoints[0].x;
        var y = touchPoints[0].y;
        var dx = x;
        var dy = y;
        var v = this._activeView;
        while (v !== null) {
            dx -= v.left;
            dy -= v.top;
            v = v.parent;
        }
        x = dx;
        y = dy;

        var touches = [];
        var targetTouches = [];
        var changedTouches = [];
        if (type === "touchstart" || type === "touchmove") {
            touches.push({
                identifier: this._identifier,
                screenX: touchPoints[0].x,
                screenY: touchPoints[0].y,
                clientX: x,
                clientY: y,
                pageX: x,
                pageY: y,
                target: this._activeView
            });

            targetTouches.push({
                identifier: this._identifier,
                screenX: touchPoints[0].x,
                screenY: touchPoints[0].y,
                clientX: x,
                clientY: y,
                pageX: x,
                pageY: y,
                target: this._activeView
            });
        }
        changedTouches.push({
            identifier: this._identifier,
            screenX: touchPoints[0].x,
            screenY: touchPoints[0].y,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            target: this._activeView
        });

        var touchEvent = new TouchEvent({
            type: type,
            timestamp: new Date().getTime(),
            target: this._activeView,
            touches: touches,
            targetTouches: targetTouches,
            changedTouches: changedTouches
        });

        this.chainedDispatchEvent(this._activeView, touchEvent);
    },

    processKeyboardEvent: function(type, e) {
        if (this._activeView === null) {
            return;
        }

        var keyboardEvent = new KeyboardEvent({
            type: type,
            timestamp: new Date().getTime(),
            target: this._activeView,
            keyCode: e.keyCode,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            altKey: e.altKey,
            metaKey: e.metaKey
        });
        this.chainedDispatchEvent(this._activeView, keyboardEvent);
    },

    chainedDispatchEvent: function(view, event) {
        do {
            view.dispatchEvent(event.type, event);

            // FIXME: use instanceof instead
            if (event.toString() === "framework.ui.event.TouchEvent") {
                var length = event.touches.length;
                for (var i = 0; i < length; i++) {
                    event.touches[i].clientX += view.left;
                    event.touches[i].clientY += view.top;
                    event.touches[i].pageX += view.left;
                    event.touches[i].pageY += view.top;
                }

                length = event.targetTouches.length;
                for (var i = 0; i < length; i++) {
                    event.targetTouches[i].clientX += view.left;
                    event.targetTouches[i].clientY += view.top;
                    event.targetTouches[i].pageX += view.left;
                    event.targetTouches[i].pageY += view.top;
                }

                length = event.changedTouches.length;
                for (var i = 0; i < length; i++) {
                    event.changedTouches[i].clientX += view.left;
                    event.changedTouches[i].clientY += view.top;
                    event.changedTouches[i].pageX += view.left;
                    event.changedTouches[i].pageY += view.top;
                }
            }
            view = view.parent;
        } while (event.propagation && view !== null);
    }
}, module);
