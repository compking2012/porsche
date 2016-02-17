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
var MouseEvent = require("./event/mouseevent");
var KeyboardEvent = require("./event/keyboardevent");
var Point = require("../graphics/point");
var Mat = require("../graphics/mat");

Class.define("framework.ui.WindowManager", EventEmitter, {
    initialize: function(inputService, renderService) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._inputService = inputService;
        this._renderService = renderService;

        this._windows = [];
        this._mainWindow = null;
        this._dialog = null;

        this._redraw = false;
        this._redrawTime = 0;
        this._timer = 0;
        this._timestamp = 0;

        this._activeView = null;
        this._touchstartPoint = new Point(0, 0);
        this._lastTouchPoint = new Point(0, 0);
        this._mousedownPoint = new Point(0, 0);
        this._lastMousePoint = new Point(0, 0);
        this._identifier = 0;

        this._renderCallback = null;

        if (!global.hardwareAccelerated) {
            this._screenCanvas = this._renderService.createCanvas(this._renderService.getWidth(), this._renderService.getHeight());
            this._screenContext = this._renderService.getContext(this._screenCanvas);
        } else {
            this._screenCanvas = this._renderService.createWebGLCanvas(this._renderService.getWidth(), this._renderService.getHeight());
            this._screenContext = this._renderService.getWebGLContext(this._screenCanvas);
        }

        this._inputService.addEventListener("input", this._processInputEventFunc = this.processInputEvent.bind(this));
    },

    destroy: function() {
        this._touchstartPoint.destroy();
        this._touchstartPoint = null;

        this._lastTouchPoint.destroy();
        this._lastTouchPoint = null;

        this._mousedownPoint.destroy();
        this._mousedownPoint = null;

        this._lastMousePoint.destroy();
        this._lastMousePoint = null;

        this._activeView = null;

        var length = this._windows.length;
        for (var i = 0; i < length; i++) {
            this._windows[i].destroy();
        }
        this._windows = null;
        this._mainWindow = null;

        this._screenContext = null;
        if (!global.hardwareAccelerated) {
            this._renderService.destroyCanvas(this._screenCanvas);
        } else {
            this._renderService.destroyWebGLCanvas(this._screenCanvas);
        }
        this._screenCanvas = null;

        this._renderCallback = null;

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
        win.invalidate();
    },

    showDialog: function(dialog) {
        if (this._dialog !== null) {
            return;
        }
        dialog.width = this._renderService.getWidth();
        dialog.height = this._renderService.getHeight();
        dialog.windowManager = this;
        this._dialog = dialog;
        this.draw();
    },

    closeDialog: function() {
        this._dialog.windowManager = null;
        this._dialog = null;
        this._mainWindow.invalidate();
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
        this._renderService.requestRenderFrame(this._renderCallback = function() {
            this._redraw = false;
            this._redrawTime = new Date().getTime();

            if (!global.hardwareAccelerated) {
                this._mainWindow.paint(this._screenContext);
                if (this._dialog !== null) {
                    this._dialog.paint(this._screenContext);
                }
            } else {
                this._mainWindow.paint(null);
                if (this._dialog !== null) {
                    this._dialog.paint(null);
                }

                this.renderScreen(this._mainWindow);
                if (this._dialog !== null) {
                    this.renderScreen(this._dialog);
                }
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

    createBackBuffer: function(width, height) {
        return this._renderService.createBackBuffer(width, height);
    },

    getBackBufferContext: function(canvas) {
        return this._renderService.getBackBufferContext(canvas);
    },

    destroyBackBuffer: function(canvas) {
        this._renderService.destroyBackBuffer(canvas);
    },

    renderScreen: function(rootView) {
        var renderQueue = [rootView];
        var view = renderQueue.shift();
        while (view !== undefined) {
            this.renderRect(view);
            if (view.children !== undefined) {
                for (var i = 0; i < view.children.length; i++) {
                    var child = view.children[i];
                    child.offsetLeft += view.offsetLeft;
                    child.offsetTop += view.offsetLeft;
                    renderQueue.unshift(child);
                }
            }
            view = renderQueue.shift();
        }
        this._screenContext.flush();
    },

    renderRect: function(view) {
        var left = view.offsetLeft;
        var top = view.offsetTop;
        var right = left + view.width;
        var bottom = top + view.height;
        var width = this._screenCanvas.width;
        var height = this._screenCanvas.height;
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var context = this._screenContext;
        left -= halfWidth;
        right -= halfWidth;
        top -= halfHeight;
        bottom -= halfHeight;
        var position = [
            left / width, bottom / height, 0.0,
            right / width, bottom / height, 0.0,
            left / width, top / height, 0.0,
            right / width, top / height, 0.0
        ];
        var vboPosition = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, vboPosition);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(position), context.STATIC_DRAW);
        context.enableVertexAttribArray(context.attPosition);
        context.vertexAttribPointer(context.attPosition, context.attPositionStride, context.FLOAT, false, 0, 0);

        // var color = [
        //     1.0, 1.0, 1.0, 1.0,
        //     1.0, 1.0, 1.0, 1.0,
        //     1.0, 1.0, 1.0, 1.0,
        //     1.0, 1.0, 1.0, 1.0
        // ];
        // var vboColor = context.createBuffer();
        // context.bindBuffer(context.ARRAY_BUFFER, vboColor);
        // context.bufferData(context.ARRAY_BUFFER, new Float32Array(color), context.STATIC_DRAW);
        // context.enableVertexAttribArray(context.attColor);
        // context.vertexAttribPointer(context.attColor, context.attColorStride, context.FLOAT, false, 0, 0);

        var textureCoord = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];
        var vboTextureCoord = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, vboTextureCoord);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(textureCoord), context.STATIC_DRAW);
        context.enableVertexAttribArray(context.attTextureCoord);
        context.vertexAttribPointer(context.attTextureCoord, context.attTextureCoordStride, context.FLOAT, false, 0, 0);

        var index = [
            0, 1, 2,
            3, 2, 1
        ];
        var iboIndex = context.createBuffer();
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, iboIndex);
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Int16Array(index), context.STATIC_DRAW);

        var m = new Mat();
        var mMatrix = m.identity(m.create());
        var vMatrix = m.identity(m.create());
        var pMatrix = m.identity(m.create());
        var mvpMatrix = m.identity(m.create());

        m.lookAt([0, 1, 1.21], [0, 0, 0], [0, 1, 0], vMatrix);
        m.perspective(45, width / height, 0.1, 100, pMatrix);

        // m.translate(mMatrix, [view.translationX / width, -view.translationY / height, view.translationZ / 100], mMatrix);
        m.rotate(mMatrix, view.rotationX, [-1, 0, 0], mMatrix);
        // m.rotate(mMatrix, view.rotationY, [0, -1, 0], mMatrix);
        // m.rotate(mMatrix, view.rotationZ, [0, 0, -1], mMatrix);
        // m.scale(mMatrix, [view.scaleX, view.scaleY, 1], mMatrix);

        m.multiply(pMatrix, vMatrix, mvpMatrix);
        m.multiply(mvpMatrix, mMatrix, mvpMatrix);

        var texture = context.createTexture();
        context.bindTexture(context.TEXTURE_2D, texture);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, view.backBuffer);
        context.bindTexture(context.TEXTURE_2D, null);

        var mvpMatrixUniform = context.getUniformLocation(context.program, "mvpMatrix");
        var textureUniform = context.getUniformLocation(context.program, "texture");

        context.bindTexture(context.TEXTURE_2D, texture);
        context.uniformMatrix4fv(mvpMatrixUniform, false, mvpMatrix);
        context.uniform1i(textureUniform, 0);
        context.drawElements(context.TRIANGLES, index.length, context.UNSIGNED_SHORT, 0);
        context.bindTexture(context.TEXTURE_2D, null);

        view.offsetLeft = 0;
        view.offsetTop = 0;
    },

    processInputEvent: function(type, e) {
        if (this._mainWindow === null) {
            return;
        }

        if (type === "touchstart" || type === "touchmove" || type === "touchend" || type === "touchcancel") {
            this.processTouchEvent(type, e);
        } else if (type === "mousedown" || type === "mousemove" || type === "mouseup") {
            this.processMouseEvent(type, e);
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
        } else if (type === "touchend") {
            view = activeWindow.findViewAtPoint(this._lastTouchPoint);
            if (this._activeView !== view) {
                // FIXME: touchcancel is incorrect
                type = "touchcancel";
            }
        }

        if (type !== "touchcancel") {
            if (view === null) {
                return;
            }
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

    processMouseEvent: function(type, e) {
        var mousePoint = e;

        var activeWindow = this._dialog !== null ? this._dialog : this._mainWindow;
        var view = null;
        if (type === "mousedown") {
            this._mousedownPoint.assign(mousePoint.x, mousePoint.y);
            this._lastMousePoint.assign(mousePoint.x, mousePoint.y);
            this._mouseTimestamp = new Date().getTime();
            view = activeWindow.findViewAtPoint(this._mousedownPoint);
        } else if (type === "mousemove") {
            if (mousePoint.x === this._lastMousePoint.x && mousePoint.y === this._lastMousePoint.y) {
                return;
            }
            this._lastMousePoint.assign(mousePoint.x, mousePoint.y);
            view = activeWindow.findViewAtPoint(this._lastMousePoint);
        } else if (type === "mouseup") {
            view = activeWindow.findViewAtPoint(this._lastMousePoint);
        }

        if (view === null) {
            return;
        }
        this._activeView = view;

        var x = mousePoint.x;
        var y = mousePoint.y;
        var button = mousePoint.button;
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

        var mouseEvent = new MouseEvent({
            type: type,
            timestamp: new Date().getTime(),
            target: this._activeView,
            button: button,
            screenX: mousePoint.x,
            screenY: mousePoint.y,
            clientX: x,
            clientY: y
        });

        this.chainedDispatchEvent(this._activeView, mouseEvent);
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

            if (event instanceof TouchEvent) {
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
