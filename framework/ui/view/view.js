"use strict";
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");
var Rectangle = require("../rectangle");
var Matrix = require("../matrix");
var GradientParser = require("../../util/gradientparser");
var GestureManager = require("../gesture/gesturemanager");
var fs = require("fs");

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

        // Properties
        this._parent = null;
        this._id = "";
        this._enabled = true;
        this._elevation = 0;

        this._left = 0;
        this._top = 0;
        this._width = 0;
        this._height = 0;

        this._absoluteLeft = 0;
        this._absoluteTop = 0;
        this._absoluteWidth = 0;
        this._absoluteHeight = 0;

        this._hasLayout = false;

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

        this._scrollX = 0;
        this._scrollY = 0;

        this._hardwareAccelerated = false;
        this._bitmapBuffer = null;
        this._bitmapBufferContext = null;

        this._touchRegion = null;

        // Private members
        this._selected = false;
        this._focused = false;

        this._matrix = new Matrix();
        this._dirty = false;
        this._dirtyRect = new Rectangle(0, 0, 0, 0);
        this._boundRect = new Rectangle(0, 0, 0, 0);

        this._gestureManager = new GestureManager(this);

        this.addEventListener("touchstart", this.handleTouchStartFunc = this.handleTouchStart.bind(this));
        this.addEventListener("touchmove", this.handleTouchMoveFunc = this.handleTouchMove.bind(this));
        this.addEventListener("touchend", this.handleTouchEndCancelFunc = this.handleTouchEndCancel.bind(this));
        this.addEventListener("touchcancel", this.handleTouchEndCancelFunc);
    },

    /**
     * Destructor that destroy a view
     * @method View#destroy
     */
    destroy: function() {
        this._gestureManager.destroy();
        this._gestureManager = null;
        this._matrix.destroy();
        this._matrix = null;
        this._dirtyRect.destroy();
        this._dirtyRect = null;
        this._boundRect.destroy();
        this._boundRect = null;
        this.removeEventListener("touchstart", this.handleTouchStartFunc);
        this.handleTouchStartFunc = null;
        this.removeEventListener("touchmove", this.handleTouchMoveFunc);
        this.handleTouchMoveFunc = null;
        this.removeEventListener("touchend", this.handleTouchEndCancelFunc);
        this.removeEventListener("touchcancel", this.handleTouchEndCancelFunc);
        this.handleTouchEndCancelFunc = null;
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
        var oldValue = this._id;
        if (oldValue === value) {
            return;
        }
        this._id = value;
        this.dispatchEvent("propertychange", "id", oldValue, value);
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
        var oldValue = this._left;
        if (oldValue === value) {
            return;
        }
        this._left = value;
        this.relayout(false);
        this.dispatchEvent("propertychange", "left", oldValue, value);
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
        var oldValue = this._top;
        if (oldValue === value) {
            return;
        }
        this._top = value;
        this.relayout(false);
        this.dispatchEvent("propertychange", "top", oldValue, value);
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
        var oldValue = this._top + this._height;
        if (oldValue === value) {
            return;
        }
        this._top = value - this._height;
        this.relayout(false);
        this.dispatchEvent("propertychange", "bottom", oldValue, value);
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
        var oldValue = this._left + this._width;
        if (oldValue === value) {
            return;
        }
        this._left = value - this._width;
        this.relayout(false);
        this.dispatchEvent("propertychange", "right", oldValue, value);
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
        var oldValue = this._width;
        if (oldValue === value) {
            return;
        }
        this._width = value;
        this.relayout(true);
        this.dispatchEvent("propertychange", "width", oldValue, value);
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
        var oldValue = this._height;
        if (oldValue === value) {
            return;
        }
        this._height = value;
        this.relayout(true);
        this.dispatchEvent("propertychange", "height", oldValue, value);
        this.invalidate();
    },

    /**
     * @name View#background
     * @type {string}
     * @description the background color, gradient or image for this view.
     */
    get background() {
        return this._background;
    },

    set background(value) {
        var oldValue = this._background;
        if (oldValue === value) {
            return;
        }
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
        this.dispatchEvent("propertychange", "background", oldValue, value);
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
        var oldValue = this._opacity;
        if (oldValue === value) {
            return;
        }
        this._opacity = value;
        this.dispatchEvent("propertychange", "opacity", oldValue, value);
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
        var oldValue = this._enabled;
        if (oldValue === value) {
            return;
        }
        this._enabled = value;
        this.dispatchEvent("propertychange", "enabled", oldValue, value);
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
        var oldValue = this._visibility;
        if (oldValue === value) {
            return;
        }
        this._visibility = value;
        this.dispatchEvent("propertychange", "visibility", oldValue, value);
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
        var oldValue = this._translationX;
        if (oldValue === value) {
            return;
        }
        this._translationX = value;
        this._matrix.translate(this._translationX, this._translationY);
        this.dispatchEvent("propertychange", "translationX", oldValue, value);
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
        var oldValue = this._translationY;
        if (oldValue === value) {
            return;
        }
        this._translationY = value;
        this._matrix.translate(this._translationX, this._translationY);
        this.dispatchEvent("propertychange", "translationY", oldValue, value);
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
        var oldValue = this._rotationZ;
        if (oldValue === value) {
            return;
        }
        this._rotationZ = value;
        this._matrix.rotate(this._rotationZ);
        this.dispatchEvent("propertychange", "rotationZ", oldValue, value);
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
        var oldValue = this._scaleX;
        if (oldValue === value) {
            return;
        }
        this._scaleX = value;
        this._matrix.scale(this._scaleX, this._scaleY);
        this.dispatchEvent("propertychange", "scaleX", oldValue, value);
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
        var oldValue = this._scaleY;
        if (oldValue === value) {
            return;
        }
        this._scaleY = value;
        this._matrix.scale(this._scaleX, this._scaleY);
        this.dispatchEvent("propertychange", "scaleY", oldValue, value);
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
        var oldValue = {x: this._scaleX, y: this._scaleY};
        if (oldValue.x === this._scaleX && oldValue.y === this._scaleY) {
            return;
        }
        this._scaleX = value.x;
        this._scaleY = value.y;
        this._matrix.scale(this._scaleX, this._scaleY);
        this.dispatchEvent("propertychange", "scale", oldValue, value);
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
        var oldValue = this._originX;
        if (oldValue === value) {
            return;
        }
        this._originX = value;
        this._matrix.at(this._originX, this._originY);
        this.dispatchEvent("propertychange", "originX", oldValue, value);
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
        var oldValue = this._originY;
        if (oldValue === value) {
            return;
        }
        this._originY = value;
        this._matrix.at(this._originX, this._originY);
        this.dispatchEvent("propertychange", "originY", oldValue, value);
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
        var oldValue = {x: this._originX, y: this._originY};
        if (oldValue.x === this._originX && oldValue.y === this._originY) {
            return;
        }
        this._originX = value.x;
        this._originY = value.y;
        this._matrix.at(this._originX, this._originY);
        this.dispatchEvent("propertychange", "origin", oldValue, value);
        this.invalidate();
    },

    get scrollX() {
        return this._scrollX;
    },

    set scrollX(value) {
        var oldValue = this._scrollX;
        if (oldValue === value) {
            return;
        }
        this._scrollX = value;
        this.dispatchEvent("propertychange", "scrollX", oldValue, value);
        this.invalidate();
    },

    get scrollY() {
        return this._scrollY;
    },

    set scrollY(value) {
        var oldValue = this._scrollY;
        if (oldValue === value) {
            return;
        }
        this._scrollY = value;
        this.dispatchEvent("propertychange", "scrollY", oldValue, value);
        this.invalidate();
    },

    get touchRegion() {
        return this._touchRegion;
    },

    set touchRegion(value) {
        this._touchRegion = value;
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
        this.processHardwareAcceleration();
    },

    /**
     * Remove this view from its parent.
     * @method View#removeFromParent
     */
    removeFromParent: function() {
        if (this._parent !== null) {
            this.dispatchEvent("willremove");
            this._parent.removeChild(this);
            this.dispatchEvent("removed");
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

    addGestureRecognizer: function(gestureRecognizer) {
        this._gestureManager.add(gestureRecognizer);
    },

    removeGestureRecognizer: function(gestureRecognizer) {
        this._gestureManager.remove(gestureRecognizer);
    },

    saveAbsoluteInfo: function() {
        if (!this._hasLayout) {
            this._absoluteLeft = this._left;
            this._absoluteTop = this._top;
            this._absoluteWidth = this._width;
            this._absoluteHeight = this._height;
            this._hasLayout = true;
        }
    },

    resetToNoLayout: function() {
        if (this._hasLayout) {
            this._left = this._absoluteLeft;
            this._top = this._absoluteTop;
            this._width = this._absoluteWidth;
            this._height = this._absoluteHeight;
            this._hasLayout = false;
        }
    },

    relayout: function(self) {
        if (this._parent !== null) {
            this._parent.needRelayout = true;
        }
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
            } else if (/^conical\-gradient/.test(this._background)) {
                var conical = this._backgroundObject;
                // TODO: support conical gradient
                var r1 = 251, g1 = 27, b1 = 84;
                var r2 = 57, g2 = 3, b2 = 18;
                var cx = this._width / 2;
                var cy = this._height / 2;
                for (var i = 0; i < 360; i += 0.1) {
                    var rad = i * 2 * Math.PI / 360;
                    var p = i / 360;
                    var r = parseInt(r2 * p + r1 * (1 - p));
                    var g = parseInt(g2 * p + g1 * (1 - p));
                    var b = parseInt(b2 * p + b1 * (1 - p));
                    context.strokeStyle = "rgb(" + r + "," + g + "," + b +")"; //"hsla(" + i + ", 100%, 50%, 1.0)";
                    context.beginPath();
                    context.moveTo(cx, cy);
                    context.lineTo(cx + cx * Math.cos(rad), cy + cy * Math.sin(rad));
                    context.stroke();
                }
                console.log("conical");
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
            context = this._bitmapBufferContext;
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
        if (global.AppFXDebugDirtyRect) {
            context.strokeStyle = "#FFFFFF";
            context.lineWidth = 3;
            context.strokeRect(this._dirtyRect.left, this._dirtyRect.top, this._dirtyRect.width, this._dirtyRect.height);
            console.log("[AppFX]dirtyRect: ", this.toString(), this._dirtyRect.toString());
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
        if (this._visibility !== "visible") {
            return null;
        }

        if (!this.containsPoint(point)) {
            return null;
        }
        return this;
    },

    /**
     * Gets the root window of this view.
     * @method View#getWindow
     * @return {Window} the root window
     * @private
     */
    getWindow: function() {
        if (this._parent === null) {
            return this;
        }
        return this._parent.getWindow();
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
    handleTouchStart: function(/*e*/) {
        this._selected = true;
    },

    /**
     * Handle the touch move event processing
     * @method View#onTouchMove
     * @param {TouchEvent} e the touch event info
     * @private
     */
    handleTouchMove: function(/*e*/) {
    },

    /**
     * Handle the touch end or touch cancel event processing
     * @method View#onTouchEndCancel
     * @param {TouchEvent} e the touch event info
     * @private
     */
    handleTouchEndCancel: function(/*e*/) {
        this._selected = false;
    },

    processHardwareAcceleration: function() {
        if (!this._hardwareAccelerated) {
            this.getWindow().windowManager.destroyCanvas(this._bitmapBuffer);
            this._bitmapBuffer = null;
        } else {
            if (this._bitmapBuffer.width !== this._width || this._bitmapBuffer.height !== this._height) {
                this.getWindow().windowManager.destroyCanvas(this._bitmapBuffer);
                this._bitmapBuffer = this.getWindow().windowManager.createCanvas(this._width, this._height);
                this._bitmapBufferContext = this.getWindow().windowManager.getContext(this._bitmapBuffer);
            }
        }
    }
}, module);
