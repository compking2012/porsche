define(function(require, exports, module) {

"use strict";
var Class = require("../class");
var EventEmitter = require("../eventemitter");
var TouchEvent = require("./event/touchevent");
var Point = require("./point");
var Rectangle = require("./rectangle");

Class.define("framework.ui.WindowManager", EventEmitter, {
    initialize: function(mainWindow, width, height) {
        EventEmitter.prototype.initialize.call(this);

        this._screenWidth = width;
        this._screenHeight = height;

        this._redraw = false;
        this._redrawTime = 0;
        this._timer = 0;
        this._position = new Point(0, 0);
        this._timestamp = 0;
        this._screen = new Rectangle(0, 0, this._screenWidth, this._screenHeight);

        this._timestamp = 0;
        this._canvasIdGen = 0;
        this._canvasStack = [];
        this._canvasStack.push(this.createCanvas(this._screenWidth, this._screenHeight));
        this._context = this.getContext(this._canvasStack[0]);
        this._canvasStack[0].addEventListener("touchstart", this.processRawInputEvent.bind(this));
        this._canvasStack[0].addEventListener("touchmove", this.processRawInputEvent.bind(this));
        this._canvasStack[0].addEventListener("touchend", this.processRawInputEvent.bind(this));
        this._canvasStack[0].addEventListener("touchcancel", this.processRawInputEvent.bind(this));
        this._canvasStack[0].addEventListener("click", this.processRawInputEvent.bind(this));
        this._mainWindow = mainWindow;
        this._mainWindow._windowManager = this;
        this._mainWindow.width = width;
        this._mainWindow.height = height;
    },

    destroy: function() {

    },

    createCanvas: function(width, height) {
        width = this._screenWidth;
        height = this._screenHeight;
        this._canvasIdGen++;
        var canvas = document.querySelector("canvas");
        return canvas;
    },

    destroyCanvas: function(canvas) {
    },

    getContext: function(canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, this._screenWidth/*canvas.width*/, this._screenHeight/*canvas.height*/);

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

        if (new Date().getTime() - this._redrawTime < 16) {
            return;
        }

        this._redraw = true;
        var animationFunc = null;
        this._timer = window.requestAnimationFrame(animationFunc = function() {
            this._redraw = false;
            this._redrawTime = new Date().getTime();
            this._mainWindow.paint(this._context);
            if (window.debugPaintFPS) {
                if (!window.debugTimestamp) {
                    window.debugTimestamp = new Date().getTime();
                    window.debugFrameCount = 0;
                }
                window.debugFrameCount++;
                var time = new Date().getTime() - window.debugTimestamp;
                if (time >= 1000) {
                    console.log("[Debug] PaintFPS: ", Math.round(window.debugFrameCount / time * 1000));
                    window.debugFrameCount = 0;
                    window.debugTimestamp = 0;
                }
            }
            window.requestAnimationFrame(animationFunc);
        }.bind(this));
    },

    processRawInputEvent: function(e) {
        if (e.type === "touchstart") {
            this.onTouchStart(e);
        } else if (e.type === "touchend") {
            this.onTouchEnd(e);
        } else if (e.type === "touchmove") {
            this.onTouchMove(e);
        } else if (e.type === "click") {
            this.onClick(e);
        }
    },

    onTouchStart: function(e) {
        this._position.assign(e.touches[0].clientX, e.touches[0].clientY);
        var view = this._mainWindow.findViewAtPoint(this._position);
        if (view === null) {
            return;
        }
        this._mainWindow._activeView = view;

        this.dispatchTouchEvent(e);
    },

    onTouchMove: function(e) {
        this._position.assign(e.touches[0].clientX, e.touches[0].clientY);
        if (this._mainWindow._activeView === null) {
            return;
        }

        this.dispatchTouchEvent(e);
    },

    onTouchEnd: function(e) {
        if (this._mainWindow._activeView === null) {
            return;
        }

        this.dispatchTouchEvent(e);
    },

    onClick: function(e) {
        if (this._mainWindow._activeView === null) {
            return;
        }

        var touchEvent = new TouchEvent({
            type: e.type,
            timestamp: new Date().getTime(),
            target: this._mainWindow._activeView
        });

        // TODO: currently, only support single-touch, multi-touch is not supported yet.
        // TODO: only assign touches[], need plus changedTouches[] and targetTouches[]
        var view = this._mainWindow._activeView;
        do {
            view.getCurrentOffset(touchEvent);
            view.dispatchEvent(e.type, touchEvent);
            view = view.parent;
        } while (touchEvent.propagation && view !== null);
    },

    dispatchTouchEvent: function(e) {
        var touchEvent = new TouchEvent({
            type: e.type,
            timestamp: new Date().getTime(),
            target: this._mainWindow._activeView,
            touches: [],
            changedTouches: [],
            targetTouches: []
        });

        var types = ["touches", "targetTouches", "changedTouches"];
        for (var k = 0; k < types.length; k++) {
            var length = e[types[k]].length;
            for (var i = 0; i < length; i++) {
                var touch = {
                    identifier: 0,
                    screenX: e[types[k]][i].clientX,
                    screenY: e[types[k]][i].clientY,
                    clientX: e[types[k]][i].clientX,
                    clientY: e[types[k]][i].clientY,
                    pageX: e[types[k]][i].clientX,
                    pageY: e[types[k]][i].clientY,
                    target: this._mainWindow._activeView
                };
                touchEvent[types[k]].push(touch);
            }
        }

        // TODO: currently, only support single-touch, multi-touch is not supported yet.
        // TODO: only assign touches[], need plus changedTouches[] and targetTouches[]
        var view = this._mainWindow._activeView;
        do {
            view.getCurrentOffset(touchEvent);
            view.dispatchEvent(e.type, touchEvent);
            view = view.parent;
        } while (touchEvent.propagation && view !== null);
    }
}, module);

});
