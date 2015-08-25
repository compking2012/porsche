define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");
var Rectangle = require("../rectangle");
var Point = require("../point");
var Matrix = require("../matrix");
var GradientParser = require("../../util/gradientparser");

/**
 * Base view for all UI elements
 * @class View
 * @extends EventEmitter
 */
Class.define("framework.ui.view.View", EventEmitter, {
    /**
     * Constructor that create a view
     * @method View#initialize
     */
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);
        this._parent = null;
        this._id = "";
        this._enabled = true;
        this._elevation = 0;

        this._left = 0;
        this._top = 0;
        this._width = 0;
        this._height = 0;

        this._background = "";
        this._opacity = 1;
        this._visibility = "visible";

        this._translationX = 0;
        this._translationY = 0;
        this._translationZ = 0;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = 0;
        this._originY = 0;

        this._hardwareAccelerated = false;

        this._selected = false;
        this._focused = false;

        this._matrix = new Matrix();
        this._dirty = false;
        this._dirtyRect = new Rectangle(0, 0, 0, 0);
        this._boundRect = new Rectangle(0, 0, 0, 0);
        this._touchstartPoint = new Point(0, 0);
        this._lastTouchPoint = new Point(0, 0);
        this._clickTheshold = 250;
        this._moveTheshold = 15;

        this._canvasArray = [];
        this._contextArray = [];

        this._eventOffsetX = 0;
        this._eventOffsetY = 0;

        this.addEventListener("touchstart", this.handleTouchStartFunc = this.handleTouchStart.bind(this));
        this.addEventListener("touchmove", this.handleTouchMoveFunc = this.handleTouchMove.bind(this));
        this.addEventListener("touchend", this.handleTouchEndFunc = this.handleTouchEnd.bind(this));
    },

    /**
     * Destructor that destroy a view
     * @method View#destroy
     */
    destroy: function() {
        this._matrix.destroy();
        this._matrix = null;
        this._dirtyRect.destroy();
        this._dirtyRect = null;
        this._boundRect.destroy();
        this._boundRect = null;
        this._touchstartPoint.destroy();
        this._touchstartPoint = null;
        this.removeEventListener("touchstart", this.handleTouchStartFunc);
        this.handleTouchStartFunc = null;
        this.removeEventListener("touchmove", this.handleTouchMoveFunc);
        this.handleTouchMoveFunc = null;
        this.removeEventListener("touchend", this.handleTouchEndFunc);
        this.handleTouchEndFunc = null;
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name View#id
     * @type {String}
     * @description identifier
     */
    get id() {
        return this._id;
    },

    set id(value) {
        this._id = value;
    },

    /**
     * @name View#left
     * @type {Number}
     * @description left position of this view relative to its parent.
     */
    get left() {
        return this._left;
    },

    set left(value) {
        this._left = value;
        this.invalidate();
    },

    /**
     * @name View#top
     * @type {Number}
     * @description top position of this view relative to its parent.
     */
    get top() {
        return this._top;
    },

    set top(value) {
        this._top = value;
        this.invalidate();
    },

    /**
     * @name View#bottom
     * @type {Number}
     * @description bottom position of this view relative to its parent.
     */
    get bottom() {
        return this._top + this._height;
    },

    set bottom(value) {
        this._top = value - this._height;
        this.invalidate();
    },

    /**
     * @name View#right
     * @type {Number}
     * @description right position of this view relative to its parent.
     */
    get right() {
        return this._left + this._width;
    },

    set right(value) {
        this._left = value - this._width;
        this.invalidate();
    },

    /**
     * @name View#elevation
     * @type {Number}
     * @description base elevation of this view relative to its parent.
     * @private
     */
    get elevation() {
        return this._elevation;
    },

    set elevation(value) {
        this._elevation = value;
    },

    /**
     * @name View#width
     * @type {Number}
     * @description width of this view, in pixels.
     */
    get width() {
        return this._width;
    },

    set width(value) {
        this._width = value;
        this.invalidate();
    },

    /**
     * @name View#height
     * @type {Number}
     * @description height of this view, in pixels.
     */
    get height() {
        return this._height;
    },

    set height(value) {
        this._height = value;
        this.invalidate();
    },

    /**
     * @name View#background
     * @type {String}
     * @description the background color, gradient or image for this view.
     */
    get background() {
        return this._background;
    },

    set background(value) {
        this._background = value;
        if (/^linear\-gradient/.test(this._background)) {
            var linear = GradientParser.parse(this._background);
            this._backgroundObject = linear;
        } else if (/^radial\-gradient/.test(this._background)) {
            var radial = GradientParser.parse(this._background);
            console.log("radial:", radial);
            this._backgroundObject = null;
        } else if (/^conic\-gradient/.test(this._background)) {
            // var conical = GradientParser.parse(this._background);
            this._backgroundObject = null;
        } else if (/^url/.test(this._background)) {
            var group = this._background.match(/^url\(([\w|\.|\/|\-]+)\)\s+(\w+)/);
            var url = group[1];
            var image = new Image();
            image.src = url;
            this._backgroundObject = image;
        } else {
            this._backgroundObject = null;
        }
        this.invalidate();
    },

    /**
     * @name View#opacity
     * @type {Number}
     * @description opacity of the view, from 0 to 1, where 0 means the view is completely transparent and 1 means the view is completely opaque.
     */
    get opacity() {
        return this._opacity;
    },

    set opacity(value) {
        this._opacity = value;
        this.invalidate();
    },

    /**
     * @name View#enabled
     * @type {Boolean}
     * @description enabled state of this view, True if this view is enabled, false otherwise.
     */
    get enabled() {
        return this._enabled;
    },

    set enabled(value) {
        this._enabled = value;
        this.invalidate();
    },

    /**
     * @name View#visibility
     * @type {String}
     * @description visibility state of this view, such as "visible", "hiden" or "none".
     */
    get visibility() {
        return this._visibility;
    },

    set visibility(value) {
        this._visibility = value;
        this.invalidate();
    },

    /**
     * @name View#parent
     * @type {View}
     * @readOnly
     * @description parent of this view.
     */
    get parent() {
        return this._parent;
    },

    set parent(value) {
        this._parent = value;
        this.invalidate();
    },

    /**
     * @name View#translationX
     * @type {Number}
     * @description the x-axis translation of this view relative to its left position.
     */
    get translationX() {
        return this._translationX;
    },

    set translationX(value) {
        this._translationX = value;
        this._matrix.translate(this._translationX, this._translationY);
        this.invalidate();
    },

    /**
     * @name View#translationY
     * @type {Number}
     * @description the y-axis translation of this view relative to its left position.
     */
    get translationY() {
        return this._translationY;
    },

    set translationY(value) {
        this._translationY = value;
        this._matrix.translate(this._translationX, this._translationY);
        this.invalidate();
    },

    /**
     * @name View#translationZ
     * @type {Number}
     * @description the z-axis translation of this view relative to its left position.
     * @private
     */
    get translationZ() {
        return this._translationZ;
    },

    set translationZ(value) {
        this._translationZ = value;
    },

    /**
     * @name View#translation
     * @type {Object}
     * @description the x-axis, y-axis, z-axis translation of this view relative to its left position.
     * @private
     */
    get translation() {
        return {
            x: this._translationX,
            y: this._translationY,
            z: this._translationZ
        };
    },

    set translation(value) {
        this._translationX = value.x;
        this._translationY = value.y;
        this._translationZ = value.z;
        this._matrix.translate(this._translationX, this._translationY);
        this.invalidate();
    },

    /**
     * @name View#rotationX
     * @type {Number}
     * @description the degrees that the view is rotated around the x-axis through the origin point.
     * @private
     */
    get rotationX() {
        return this._rotationX;
    },

    set rotationX(value) {
        this._rotationX = value;
    },

    /**
     * @name View#rotationY
     * @type {Number}
     * @description the degrees that the view is rotated around the y-axis through the origin point.
     * @private
     */
    get rotationY() {
        return this._rotationY;
    },

    set rotationY(value) {
        this._rotationY = value;
    },

    /**
     * @name View#rotationZ
     * @type {Number}
     * @description the degrees that the view is rotated around the z-axis through the origin point.
     */
    get rotationZ() {
        return this._rotationZ;
    },

    set rotationZ(value) {
        this._rotationZ = value;
        this._matrix.rotate(this._rotationZ);
        this.invalidate();
    },

    /**
     * @name View#rotation
     * @type {Object}
     * @description the X, Y, Z degrees that the view is rotated through the origin point.
     * @private
     */
    get rotation() {
        return {
            x: this._rotationX,
            y: this._rotationY,
            z: this._rotationZ
        };
    },

    set rotation(value) {
        this._rotationX = value.x;
        this._rotationY = value.y;
        this._rotationZ = value.z;
        this._matrix.rotate(this._rotationZ);
        this.invalidate();
    },

    /**
     * @name View#scaleX
     * @type {Number}
     * @description the amount that the view is scaled in x-axis around the origin point, as a proportion of the view's unscaled width.
     * @default 1.0
     */
    get scaleX() {
        return this._scaleX;
    },

    set scaleX(value) {
        this._scaleX = value;
        this._matrix.scale(this._scaleX, this._scaleY);
        this.invalidate();
    },

    /**
     * @name View#scaleY
     * @type {Number}
     * @description the amount that the view is scaled in y-axis around the origin point, as a proportion of the view's unscaled height.
     * @default 1.0
     */
    get scaleY() {
        return this._scaleY;
    },

    set scaleY(value) {
        this._scaleY = value;
        this._matrix.scale(this._scaleX, this._scaleY);
        this.invalidate();
    },

    /**
     * @name View#scale
     * @type {Object}
     * @description the amount that the view is scaled in x-axis and y-axis around the origin point, as a proportion of the view's unscaled width and height.
     * @default {1.0, 1.0}
     */
    get scale() {
        return {
            x: this._scaleX,
            y: this._scaleY
        };
    },

    set scale(value) {
        this._scaleX = value.x;
        this._scaleY = value.y;
        this._matrix.scale(this._scaleX, this._scaleY);
        this.invalidate();
    },

    /**
     * @name View#originX
     * @type {Number}
     * @description Get the x location of the point around which the view is rotated and scaled. By default, the origin point is centered on the object.
     */
    get originX() {
        return this._originX;
    },

    set originX(value) {
        this._originX = value;
        this._matrix.at(this._originX, this._originY);
        this.invalidate();
    },

    /**
     * @name View#originY
     * @type {Number}
     * @description Get the y location of the point around which the view is rotated and scaled. By default, the origin point is centered on the object.
     */
    get originY() {
        return this._originY;
    },

    set originY(value) {
        this._originY = value;
        this._matrix.at(this._originX, this._originY);
        this.invalidate();
    },

    /**
     * @name View#origin
     * @type {Object}
     * @description Get the x and y location of the point around which the view is rotated and scaled. By default, the origin point is centered on the object.
     */
    get origin() {
        return {
            x: this._originX,
            y: this._originY
        };
    },

    set origin(value) {
        this._originX = value.x;
        this._originY = value.y;
        this._matrix.at(this._originX, this._originY);
        this.invalidate();
    },

    /**
     * Remove this view from its parent.
     * @method View#removeFromParent
     */
    removeFromParent: function() {
        if (this._parent !== null) {
            this._parent.removeChild(this);
            this.invalidate();
        }
        this._parent = null;
    },

    /**
     * Change this view's z order in the tree, and make it on top of other sibling views.
     * @method View#bringToFront
     */
    bringToFront: function() {
        if (this._parent !== null) {
            this._parent.bringChildToFront(this);
            this.invalidate();
        }
    },

    /**
     * Change this view's z order in the tree, and make it on bottom of other sibling views.
     * @method View#sendToBack
     */
    sendToBack: function() {
        if (this._parent !== null) {
            this._parent.sendChildToBack(this);
            this.invalidate();
        }
    },

    // FIXME: remove later
    get uiServer() {
        if (this.getRoot()._windowManager) {
            return this.getRoot()._windowManager._uiServer;
        } else {
            return null;
        }
    },

    /**
     * @name View#hardwareAccelerated
     * @type {Boolean}
     * @description Flag indicating whether the view's rendering should be hardware accelerated if possible.
     */
    get hardwareAccelerated() {
        return this._hardwareAccelerated;
    },

    set hardwareAccelerated(value) {
        this._hardwareAccelerated = value;
    },

    /**
     * Set left and top in one function
     * @method View#setPosition
     * @param {Number} left view's left value
     * @param {Number} top view's top value
     * @deprecated
     */
    setPosition: function(left, top) {
        this._left = left;
        this._top = top;
        this.invalidate();
    },

    /**
     * Set width and height in one function
     * @method View#setSize
     * @param {Number} width view's width value
     * @param {Number} height view's height value
     * @deprecated
     */
    setSize: function(width, height) {
        this._width = width;
        this._height = height;
        this.invalidate();
    },

    /**
     * Implement this to do your drawing.
     * @method View#draw
     * @param {Context} context - the canvas context to which the View is rendered
     * @abstract
     */
    draw: function(/*context*/) {
        // Implemented by sub view
    },

    /**
     * Override and implement this to do your background drawing.
     * @method View#drawBackground
     * @param {Context} context - the canvas context to which the View is rendered
     * @override
     */
    drawBackground: function(context) {
        if (this._background !== "") {
            context.save();
            if (/^linear\-gradient/.test(this._background)) {
                var linear = this._backgroundObject;
                var colorStopStart = linear[0].colorStops[0];
                var colorStopEnd = linear[0].colorStops[1];
                var gradient = context.createLinearGradient(0, 0, this._width, this._height);
                gradient.addColorStop(0, colorStopStart.type === "hex" ? "#" + colorStopStart.value : colorStopStart.value);
                gradient.addColorStop(1, colorStopEnd.type === "hex" ? "#" + colorStopEnd.value : colorStopEnd.value);
                context.fillStyle = gradient;
                context.fillRect(0, 0, this._width, this._height);
            } else if (/^radial\-gradient/.test(this._background)) {
                var radial = this._backgroundObject;
                // context.fillStyle = null;
                context.fillRect(0, 0, this._width, this._height);
            } else if (/^conic\-gradient/.test(this._background)) {
                var conic = this._backgroundObject;
            } else if (/^url/.test(this._background)) {
                var group = this._background.match(/^url\(([\w|\.|\/|\-]+)\)\s+(\w+)/);
                var repeat = group[2];
                var pattern = context.createPattern(this._backgroundObject, repeat);
                context.fillStyle = pattern;
                context.fillRect(0, 0, this._width, this._height);
            } else {
                context.fillStyle = this._background;
                context.fillRect(0, 0, this._width, this._height);
            }
            context.restore();
        }
    },

    /**
     * Paint the view itself.
     * @method View#paint
     * @param {Context} context - the canvas context to which it is rendered
     * @protected
     */
    paint: function(context) {
        if (!this.paintSelf(context)) {
            return;
        }

        if (this._hardwareAccelerated) {
            context = this._contextArray[0];
        }

        context.restore();

        this._dirty = false;
        this._dirtyRect.empty();
    },

    /**
     * Paint the view self, including background and foreground.
     * @method View#paintSelf
     * @param {Context} context - the canvas context to which it is rendered
     * @protected
     */
    paintSelf: function(context) {
        if (this._visibility !== "visible") {
            return false;
        }

        if (!this._dirty) {
            return false;
        }

        if (this._hardwareAccelerated) {
            if (this._canvasArray && this._contextArray.length === 0) {
                var windowManager = this.getRoot()._windowManager;
                this._canvasArray.push(windowManager.createCanvas(this._width, this._height));
                this._contextArray.push(windowManager.getContext(this._canvasArray[0]));
            }
        } else {
            if (this._canvasArray) {
                // FIXME
                var length = this._contextArray.length;
                for (var i = 0; i < length; i++) {
                    this.getRoot()._windowManager.deleteCanvas(this._canvasArray[i]);
                }
                this._canvasArray = [];
                this._contextArray = [];
            }
        }

        if (this._hardwareAccelerated) {
            var matrix = context.getMatrix();
            context = this._contextArray[0];
            context.setTransform(matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.x0, matrix.y0);
            context.clearRect(0, 0, this.width, this.height);
        }

        context.save();

        context.globalAlpha = this._opacity;
        context.translate(this._originX, this._originY);
        context.translate(this._translationX, this._translationY);
        context.scale(this._scaleX, this._scaleY);
        context.rotate(this._rotationZ);
        context.translate(-this._originX, -this._originY);

        context.beginPath();
        context.rect(0, 0, this._width, this._height);
        context.clip();

        this.drawBackground(context);
        this.draw(context);

        this.viewDebug(context);
        return true;
    },

    viewDebug: function(context) {
        if (this.debugDirtyRect) {
            context.strokeStyle = "#FFFFFF";
            context.lineWidth = 3;
            context.strokeRect(this._dirtyRect.left, this._dirtyRect.top, this._dirtyRect.width, this._dirtyRect.height);
            console.log("[Debug] dirtyRect: ", this.toString(), this._dirtyRect.toString());
        }
    },

    /**
     * Calculate the point whether in the view.
     * @method View#containsPoint
     * @param {Point} point the point in put
     * @return {Boolen} whether point in the view region
     * @protected
     */
    containsPoint: function(point) {
        // FIXME: consider transform 2d cases
        return this._left <= point.x && point.x <= this._left + this._width &&
            this._top <= point.y && point.y <= this._top + this._height;
    },

    /**
     * Find the view at the point.
     * @method View#findViewAtPoint
     * @param {Point} point the point in put
     * @return {View} return the view which point in the view and it has the max zOrder
     * @protected
     */
    findViewAtPoint: function(point) {
        if (this._parent) {
            this._eventOffsetX = this._parent._eventOffsetX + this._left;
            this._eventOffsetY = this._parent._eventOffsetY + this._top;
        }
        if (this._visibility !== "visible") {
            return null;
        }

        if (!this.containsPoint(point)) {
            return null;
        }
        return this;
    },

    /**
     * Gets the root view of this item.
     * @method View#getRoot
     * @return {View} the root view
     * @private
     */
    getRoot: function() {
        if (this.parent === null) {
            return this;
        }
        return this.parent.getRoot();
    },

    /**
     * Mark the area defined by dirty as needing to be drawn.
     * @method View#invalidate
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
     */
    invalidate: function(rect) {
        if (rect === undefined) {
            rect = this._boundRect.clone();
        }
        this.invalidateInternal(rect);
    },

    /**
     * Mark the area defined internally by dirty as needing to be drawn.
     * @method View#invalidateInternal
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @private
     */
    invalidateInternal: function(/*rect*/) {
        this._dirty = true;
        this._dirtyRect.assign(this._boundRect.left, this._boundRect.top, this._boundRect.width, this._boundRect.height);

        if (this._parent !== null) {
            this._parent.invalidateChild(this, this._dirtyRect);
        }
    },

    /**
     * Set this view dirty.
     * @method View#setDirty
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
     */
    setDirty: function(/*rect*/) {
        this._dirty = true;
        this._dirtyRect.assign(this._boundRect.left, this._boundRect.top, this._boundRect.width, this._boundRect.height);
    },

    getBounds: function() {
        var left = 0;
        var top = 0;
        var width = this._width;
        var height = this._height;

        // Translate
        var translationX = this._translationX;
        var translationY = this._translationY;
        left += translationX;
        top += translationY;

        var originX = this._originX + translationX;
        var originY = this._originY + translationY;

        // Scale
        var scaleX = this._scaleX;
        var scaleY = this._scaleY;
        left = (left - originX) * scaleX + originX;
        top = (top - originY) * scaleY + originY;
        width *= scaleX;
        height *= scaleY;

        // Rotate
        var rotationZ = this._rotationZ;
        var cos = Math.cos(rotationZ);
        var sin = Math.sin(rotationZ);

        var deltaX = left - originX;
        var deltaY = top - originY;
        var deltaX2 = deltaX + width;
        var deltaY2 = deltaY + height;
        var deltaXcos = deltaX * cos;
        var deltaXsin = deltaX * sin;
        var deltaYcos = deltaY * cos;
        var deltaYsin = deltaY * sin;
        var deltaX2cos = deltaX2 * cos;
        var deltaX2sin = deltaX2 * sin;
        var deltaY2cos = deltaY2 * cos;
        var deltaY2sin = deltaY2 * sin;

        var p0x = deltaXcos - deltaYsin + originX;
        var p0y = deltaXsin + deltaYcos + originY;
        var p1x = deltaX2cos - deltaYsin + originX;
        var p1y = deltaX2sin + deltaYcos + originY;
        var p2x = deltaXcos - deltaY2sin + originX;
        var p2y = deltaYsin + deltaY2cos + originY;
        var p3x = deltaX2cos - deltaY2sin + originX;
        var p3y = deltaX2sin + deltaY2cos + originY;

        var boundLeft = Math.floor(Math.min(p0x, Math.min(p1x, Math.min(p2x, p3x))));
        var boundTop = Math.floor(Math.min(p0y, Math.min(p1y, Math.min(p2y, p3y))));
        var boundRight = Math.ceil(Math.max(p0x, Math.max(p1x, Math.max(p2x, p3x))));
        var boundBottom = Math.ceil(Math.max(p0y, Math.max(p1y, Math.max(p2y, p3y))));

        var boundWidth = boundRight - boundLeft;
        var boundHeight = boundBottom - boundTop;

        this._boundRect.assign(boundLeft, boundTop, boundWidth, boundHeight);
        return this._boundRect;
    },

    /**
     * Handle the touch start event processing
     * @method View#onTouchStart
     * @param {TouchEvent} e the touch event info
     * @private
     */
    handleTouchStart: function(e) {
        this._selected = true;
        this._touchstartPoint.assign(e.touches[0].screenX, e.touches[0].screenY);
        this._touchTimestamp = new Date().getTime();
    },

    /**
     * Handle the touch move event processing
     * @method View#onTouchMove
     * @param {TouchEvent} e the touch event info
     * @private
     */
    handleTouchMove: function(e) {
        this._lastTouchPoint.assign(e.touches[0].screenX, e.touches[0].screenY);
    },

    /**
     * Handle the touch end event processing
     * @method View#onTouchEnd
     * @param {TouchEvent} e the touch event info
     * @private
     */
    handleTouchEnd: function(e) {
        if (this._selected &&
            Math.abs(this._touchstartPoint.x - this._lastTouchPoint.x) < this._moveTheshold &&
            Math.abs(this._touchstartPoint.y - this._lastTouchPoint.y) < this._moveTheshold) {
            var now = new Date().getTime();
            if (now - this._touchTimestamp <= this._clickTheshold) {
                this.dispatchEvent("click", e);
            }
        } else {
            this.dispatchEvent("touchcancel", e);
        }
        this._selected = false;
    },

    /**
     * Gets the current offset of touch point
     * @method View#getCurrentOffset
     * @param {TouchEvent} touchEvent the touch event info
     * @private
     */
    getCurrentOffset: function(touchEvent) {
        var length = touchEvent.touches.length;
        for (var i = 0; i < length; i++) {
            touchEvent.touches[i].clientX = touchEvent.touches[i].screenX - this._eventOffsetX;
            touchEvent.touches[i].clientY = touchEvent.touches[i].screenY - this._eventOffsetY;
        }
    }
}, module);

});
