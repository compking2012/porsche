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
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");
var Rectangle = require("../../graphics/rectangle");
var Matrix = require("../../graphics/matrix");
var ColorManager = require("../../util/colormanager");
var GestureManager = require("../gesture/gesturemanager");
var TransitionManager = require("../transition/transitionmanager");

/**
 * This class represents the basic building block for user interface components.
 * A view occupies a rectangular area on the screen and is responsible for drawing and event handling.
 * View is the base class for all UI elements, which are used to create interactive UI components (buttons, text views, etc.).
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

        this._backBuffer = null;
        this._backBufferContext = null;
        this._offsetLeft = 0;
        this._offsetTop = 0;

        this._touchRegion = null;

        // Private members
        this._selected = false;
        this._focused = false;

        this._matrix = new Matrix();
        this._dirty = false;
        this._dirtyRect = new Rectangle(0, 0, 0, 0);
        this._boundRect = new Rectangle(0, 0, 0, 0);

        this._colorManager = new ColorManager();
        this._gestureManager = new GestureManager(this);
        this._transitionManager = new TransitionManager(this);
        this._layoutManager = global.app.layoutManager;

        this.addEventListener("mousedown", this._onMouseDownFunc = this.onMouseDown.bind(this));
        this.addEventListener("mousemove", this._onMouseMoveFunc = this.onMouseMove.bind(this));
        this.addEventListener("mouseup", this._onMouseUpFunc = this.onMouseUp.bind(this));

        this.addEventListener("touchstart", this._onTouchStartFunc = this.onTouchStart.bind(this));
        this.addEventListener("touchmove", this._onTouchMoveFunc = this.onTouchMove.bind(this));
        this.addEventListener("touchend", this._onTouchEndFunc = this.onTouchEnd.bind(this));
        this.addEventListener("touchcancel", this._onTouchCancelFunc = this.onTouchCancel.bind(this));
    },

    /**
     * Destructor that destroy this view
     * @method View#destroy
     */
    destroy: function() {
        this._layoutManager = null;

        this._transitionManager.destroy();
        this._transitionManager = null;

        this._colorManager.destroy();
        this._colorManager = null;

        this._gestureManager.destroy();
        this._gestureManager = null;

        this._matrix.destroy();
        this._matrix = null;

        this._dirtyRect.destroy();
        this._dirtyRect = null;

        this._boundRect.destroy();
        this._boundRect = null;

        this.removeEventListener("mousedown", this._onMouseDownFunc);
        this._onMouseDownFunc = null;
        this.removeEventListener("mousemove", this._onMouseMoveFunc);
        this._onMouseMoveFunc = null;
        this.removeEventListener("mouseup", this._onMouseUpFunc);
        this._onMouseUpFunc = null;

        this.removeEventListener("touchstart", this._onTouchStartFunc);
        this._onTouchStartFunc = null;
        this.removeEventListener("touchmove", this._onTouchMoveFunc);
        this._onTouchMoveFunc = null;
        this.removeEventListener("touchend", this._onTouchEndFunc);
        this._onTouchEndFunc = null;
        this.removeEventListener("touchcancel", this._onTouchCancelFunc);
        this._onTouchCancelFunc = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name View#id
     * @type {String}
     * @description unique identifier of this view.
     */
    get id() {
        return this._id;
    },

    set id(value) {
        this.setProperty("id", value);
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
        value = Number(value);
        this.setProperty("left", value, function() {
            this.relayout(false);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("top", value, function() {
            this.relayout(false);
        }.bind(this));
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
        value = Number(value);
        // FIXME
        this.setProperty("bottom", value, function() {
            this.relayout(false);
        }.bind(this));
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
        value = Number(value);
        // FIXME
        this.setProperty("right", value, function() {
            this.relayout(false);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("width", value, function() {
            this.relayout(true);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("height", value, function() {
            this.relayout(true);
        }.bind(this));
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
        this.setProperty("background", value, function() {
            this._backgroundObject = this._colorManager.getColorObject(value);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("opacity", value);
    },

    /**
     * @name View#enabled
     * @type {Boolean}
     * @description enabled state of this view, true if this view is enabled, false otherwise.
     */
    get enabled() {
        return this._enabled;
    },

    set enabled(value) {
        value = Boolean(value);
        this.setProperty("enabled", value);
    },

    /**
     * @name View#visibility
     * @type {String}
     * @description visibility state of this view, such as "visible", "hidden" or "none".
     * "visible" means view is visible on screen and this is the default value;
     * "hidden" means view is not displayed, but taken into account during layout (space is left for it);
     * "none" means view is completely hidden, as if the view had not been added.
     */
    get visibility() {
        return this._visibility;
    },

    set visibility(value) {
        this.setProperty("visibility", value);
    },

    /**
     * @name View#parent
     * @type {View}
     * @readonly
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
        value = Number(value);
        this.setProperty("translationX", value, function() {
            this._matrix.translate(value, this._translationY);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("translationY", value, function() {
            this._matrix.translate(this._translationX, value);
        }.bind(this));
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
        value = Number(value);
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
        value = Number(value);
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
        value = Number(value);
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
        value = Number(value);
        this.setProperty("rotationZ", value, function() {
            this._matrix.rotate(value);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("scaleX", value, function() {
            this._matrix.scale(value, this._scaleY);
        }.bind(this));
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
        value = Number(value);
        this.setProperty("scaleY", value, function() {
            this._matrix.scale(this._scaleX, value);
        }.bind(this));
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
     * @description the x location of the point around which the view is rotated and scaled. By default, the origin point is centered on the object.
     */
    get originX() {
        return this._originX;
    },

    set originX(value) {
        value = Number(value);
        this.setProperty("originX", value, function() {
            this._matrix.at(value, this._originY);
        }.bind(this));
    },

    /**
     * @name View#originY
     * @type {Number}
     * @description the y location of the point around which the view is rotated and scaled. By default, the origin point is centered on the object.
     */
    get originY() {
        return this._originY;
    },

    set originY(value) {
        value = Number(value);
        this.setProperty("originY", value, function() {
            this._matrix.at(this._originX, value);
        }.bind(this));
    },

    /**
     * @name View#origin
     * @type {Object}
     * @description the x and y location of the point around which the view is rotated and scaled. By default, the origin point is centered on the object.
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
        value.x = Number(value.x);
        value.y = Number(value.y);
        this._originX = value.x;
        this._originY = value.y;
        this._matrix.at(this._originX, this._originY);
        this.dispatchEvent("propertychange", "origin", oldValue, value);
        this.invalidate();
    },

    /**
     * @name View#scrollX
     * @type {Number}
     * @description the scrolled left position of this view.
     * This is the left edge of the displayed part of your view.
     * You do not need to draw any pixels farther left, since those are outside of the frame of your view on screen.
     */
    get scrollX() {
        return this._scrollX;
    },

    set scrollX(value) {
        value = Number(value);
        this.setProperty("scrollX", value);
    },

    /**
     * @name View#scrollY
     * @type {Number}
     * @description the scrolled top position of this view.
     * This is the top edge of the displayed part of your view.
     * You do not need to draw any pixels above it, since those are outside of the frame of your view on screen.
     */
    get scrollY() {
        return this._scrollY;
    },

    set scrollY(value) {
        value = Number(value);
        this.setProperty("scrollY", value);
    },

    /**
     * @name View#touchRegion
     * @type {Rectangle[] || null}
     * @description one or more rectangles which represent several areas that can be used to extend the touch area.
     * If omitted and left as null, it means the default touch area which is the bound of this view.
     */
    get touchRegion() {
        return this._touchRegion;
    },

    set touchRegion(value) {
        this.setProperty("touchRegion", value);
    },

    /**
     * @name View#focused
     * @type {Boolean}
     * @description indicating whether this view has focus itself, or is the ancestor of the view that has focus.
     */
    get focused() {
        return this._focused;
    },

    set focused(value) {
        value = Boolean(value);
        this.setProperty("focused", value);
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

    /**
     * Add a gesture recognizer to this view in order to recognize the specified gesture,
     * such as tap, longpress, pan and rotation etc.
     * @method View#addGestureRecognizer
     * @param {GestureRecognizer} gestureRecognizer - the gesture recognizer
     */
    addGestureRecognizer: function(gestureRecognizer) {
        this._gestureManager.add(gestureRecognizer);
    },

    /**
     * Remove a gesture recognizer from this view
     * @method View#removeGestureRecognizer
     * @param {GestureRecognizer} gestureRecognizer - the gesture recognizer
     */
    removeGestureRecognizer: function(gestureRecognizer) {
        this._gestureManager.remove(gestureRecognizer);
    },

    /**
     * Add transition to this view.
     * @method View#addTransition
     * @param {Transition} transition - the transition.
     */
    addTransition: function(transition) {
        this._transitionManager.add(transition);
    },

    /**
     * Remove transition from this view.
     * @method View#removeTransition
     * @param {Transition} transition - the transition.
     */
    removeTransition: function(transition) {
        this._transitionManager.remove(transition);
    },

    /**
     * Load content from the layout xml.
     * @method View#loadContent
     */
    loadContent: function(layoutFile) {
        if (layoutFile === undefined) {
            layoutFile = this.className;
        }
        this._layoutManager.loadContent(this, layoutFile);
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
     * @param {Number} width - view's width value
     * @param {Number} height - view's height value
     * @deprecated
     */
    setSize: function(width, height) {
        this._width = width;
        this._height = height;
        this.invalidate();
    },

    /**
     * Handle the mouse down event processing.
     * @method View#onMouseDown
     * @param {MouseEvent} e - the mouse event info
     * @protected
     */
    onMouseDown: function(/*e*/) {
        this._selected = true;
    },

    /**
     * Handle the mouse move event processing.
     * @method View#onMouseMove
     * @param {MouseEvent} e - the mouse event info.
     * @protected
     */
    onMouseMove: function(/*e*/) {
    },

    /**
     * Handle the mouse up event processing.
     * @method View#onMouseUp
     * @param {MouseEvent} e - the mouse event info.
     * @protected
     */
    onMouseUp: function(/*e*/) {
        this._selected = false;
    },

    /**
     * Handle the touch start event processing.
     * @method View#onTouchStart
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchStart: function(/*e*/) {
        this._selected = true;
    },

    /**
     * Handle the touch move event processing.
     * @method View#onTouchMove
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchMove: function(/*e*/) {
    },

    /**
     * Handle the touch end event processing.
     * @method View#onTouchEnd
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchEnd: function(/*e*/) {
        this._selected = false;
    },

    /**
     * Handle the touch cancel event processing.
     * @method View#onTouchCancel
     * @param {TouchEvent} e - the touch event info.
     * @protected
     */
    onTouchCancel: function(/*e*/) {
    },

    /**
     * Implement this to do your drawing.
     * @method View#draw
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     * @abstract
     */
    draw: function(/*context*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Override and implement this to do your background drawing.
     * @method View#drawBackground
     * @param {Context} context - the canvas context to which the view is rendered
     * @protected
     */
    drawBackground: function(context) {
        if (this._background !== "") {
            context.save();
            context.fillStyle = this._colorManager.getColor(context, this._width, this._height, this._background, this._backgroundObject);
            context.fillRect(0, 0, this._width, this._height);
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

        if (context !== null) {
            context.restore();
        }

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
        this.processHardwareAcceleration(context);

        if (this._visibility !== "visible") {
            return false;
        }

        if (!this._dirty) {
            return false;
        }

        if (context !== null) {
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
        } else {
            context = this._backBufferContext;
        }

        this.drawBackground(context);
        this.draw(context);

        this.viewDebug(context);
        return true;
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
        if (this._left <= point.x && point.x <= this._left + this._width &&
            this._top <= point.y && point.y <= this._top + this._height) {
            return true;
        }

        if (this._touchRegion !== null) {
            var length = this._touchRegion.length;
            for (var i = 0; i < length; i++) {
                var rect = this._touchRegion[i];
                if (rect.containsXY(point.x - this._left, point.y - this._top)) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Find the view at the point.
     * @method View#findViewAtPoint
     * @param {Point} point - the point
     * @return {View} return this view if it contains the specified point,
     * otherwise null.
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
        this._dirtyRect.assign(this._boundRect.left, this._boundRect.top, this._boundRect.right, this._boundRect.bottom);

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
        this._dirtyRect.assign(this._boundRect.left, this._boundRect.top, this._boundRect.right, this._boundRect.bottom);
    },

    /**
     * [getBounds description]
     * @return {[type]} [description]
     * @private
     */
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

        this._boundRect.assign(boundLeft, boundTop, boundRight, boundBottom);
        return this._boundRect;
    },

    /**
     * Process hardware acceleration
     * @method View#processHardwareAcceleration
     * @param {Context} context - the canvas context to which the view is rendered.
     * @private
     */
    processHardwareAcceleration: function(context) {
        if (context !== null) {
            if (this._backBuffer !== null) {
                this.getWindow().windowManager.destroyBackBuffer(this._backBuffer);
                this._backBuffer = null;
                this._backBufferContext = null;
            }
        } else {
            if (this._backBuffer === null) {
                this._backBuffer = this.getWindow().windowManager.createBackBuffer(this._width, this._height);
                this._backBufferContext = this.getWindow().windowManager.getBackBufferContext(this._backBuffer);
            } else {
                if (this._backBuffer.width !== this._width || this._backBuffer.height !== this._height) {
                    this.getWindow().windowManager.destroyBackBuffer(this._backBuffer);
                    this._backBuffer = this.getWindow().windowManager.createBackBuffer(this._width, this._height);
                    this._backBufferContext = this.getWindow().windowManager.getBackBufferContext(this._backBuffer);
                }
            }
        }
    },

    /**
     * @name View#backBuffer
     * @type {Canvas}
     * @description the back buffer.
     * @readonly
     * @private
     */
    get backBuffer() {
        return this._backBuffer;
    },

    /**
     * @name View#offsetLeft
     * @type {Number}
     * @description the offset left.
     * @private
     */
    get offsetLeft() {
        return this._offsetLeft;
    },

    set offsetLeft(value) {
        this._offsetLeft = value;
    },

    /**
     * @name View#offsetTop
     * @type {Number}
     * @description the offset top.
     * @private
     */
    get offsetTop() {
        return this._offsetTop;
    },

    set offsetTop(value) {
        this._offsetTop = value;
    },

    /**
     * Save the absolute position and size info
     * @method View#saveAbsoluteInfo
     * @private
     */
    saveAbsoluteInfo: function() {
        if (!this._hasLayout) {
            this._absoluteLeft = this._left;
            this._absoluteTop = this._top;
            this._absoluteWidth = this._width;
            this._absoluteHeight = this._height;
            this._hasLayout = true;
        }
    },

    /**
     * Restore the absolute position and size info
     * @method View#resetToNoLayout
     * @private
     */
    resetToNoLayout: function() {
        if (this._hasLayout) {
            this._left = this._absoluteLeft;
            this._top = this._absoluteTop;
            this._width = this._absoluteWidth;
            this._height = this._absoluteHeight;
            this._hasLayout = false;
        }
    },

    /**
     * Relayout
     * @method View#relayout
     * @param {View} self - this view
     * @protected
     */
    relayout: function(/*self*/) {
        if (this._parent !== null) {
            this._parent.needRelayout = true;
        }
    },

    /**
     * Set the view property which will assign value to the private attribute,
     * invoke the callback, dispatch corresponding event and make the view invalidated
     * @method View#setProperty
     * @param {String} property - the property name
     * @param {*} value - the new value
     * @param {Function} callback - the immediate action callback before assigning new value.
     * @protected
     */
    setProperty: function(property, value, callback) {
        var oldValue = this["_" + property];
        if (oldValue === value) {
            return;
        }

        this._transitionManager.setProperty(property, oldValue, value, function() {
            if (callback) {
                callback();
            }

            this["_" + property] = value;
            this.invalidate();

            this.dispatchEvent("propertychange", property, oldValue, value);
        }.bind(this));
    },

    /**
     * View debug
     * @method View#viewDebug
     * @param {Context} context - the canvas context to which the view is rendered
     * @private
     */
    viewDebug: function(context) {
        if (global.AppFXDebugDirtyRect) {
            context.strokeStyle = "#FFFFFF";
            context.lineWidth = 3;
            context.strokeRect(this._dirtyRect.left, this._dirtyRect.top, this._dirtyRect.width, this._dirtyRect.height);
            console.log("[AppFX]dirtyRect: ", this.toString(), this._dirtyRect.toString());
        }
    }
}, module);
