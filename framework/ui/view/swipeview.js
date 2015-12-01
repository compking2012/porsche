define(function(require, exports, module) {
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
var CompositeView = require("./compositeview");
var CubicBezier = require("../animation/cubicbezier");
var PanRecognizer = require("../gesture/panrecognizer");

/**
 * Swipe view that can swipe between some child views by user.
 * @class SwipeView
 * @extends CompositeView
 **/
Class.define("framework.ui.view.SwipeView", CompositeView, {
    /**
     * Constructor that create a swipe view.
     * @method SwipeView#initialize
     */
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.addGestureRecognizer(this._panRecognizer = new PanRecognizer({threshold: 10}));
        this.addEventListener("panstart", this._onPanStartFunc = this.onPanStart.bind(this));
        this.addEventListener("panmove", this._onPanMoveFunc = this.onPanMove.bind(this));
        this.addEventListener("panend", this._onPanEndFunc = this.onPanEnd.bind(this));
        this.addEventListener("pancancel", this._onPanCancelFunc = this.onPanCancel.bind(this));

        this._orientation = "horizontal";
        this._currentIndex = 0;
        this._indicator = null;
        this._nextIndex = -1;
        this._duration = 250;
        this._beziers = CubicBezier.easeOut();
        this._autoTimer = null;
    },

    /**
     * Destructor that destroy this swipe view.
     * @method SwipeView#destroy
     */
    destroy: function() {
        this.stopAutoSwipe();

        if (this._indicator !== null) {
            this._indicator.destroy();
            this._indicator = null;
        }

        this._beziers.destroy();
        this._beziers = null;

        this.removeEventListener("panstart", this._onPanStartFunc);
        this._onPanStartFunc = null;

        this.removeEventListener("panmove", this._onPanMoveFunc);
        this._onPanMoveFunc = null;

        this.removeEventListener("panend", this._onPanEndFunc);
        this._onPanEndFunc = null;
        this.removeEventListener("pancancel", this._onPanCancelFunc);
        this._onPanCancelFunc = null;

        this.removeGestureRecognizer(this._panRecognizer);
        this._panRecognizer.destroy();
        this._panRecognizer = null;

        CompositeView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name SwipeView#currentIndex
     * @type {Number}
     * @description the current index of the child views in this swipe view.
     */
    get currentIndex() {
        return this._currentIndex;
    },

    set currentIndex(value) {
        if (value < 0 || value >= this._children.length) {
            return;
        }
        this.setProperty("currentIndex", value);
    },

    /**
     * @name SwipeView#orientation
     * @type {String}
     * @description the orientation of this swipe view, either "horizontal" or "vertical".
     */
    get orientation() {
        return this._orientation;
    },

    set orientation(value) {
        this.setProperty("orientation", value);
    },

    /**
     * @name SwipeView#indicator
     * @type {Indicator}
     * @description The associated indicator.
     */
    get indicator() {
        return this._indicator;
    },

    set indicator(value) {
        this.setProperty("indicator", value, function() {
            this.removeIndicator();
            value.associatedView = this;
        }.bind(this));
    },

    /**
     * Add a view to this swipe view.
     * @method SwipeView#addChild
     * @param {View} view - sub child view to be added.
     */
    addChild: function(view) {
        view.width = this._width;
        view.height = this._height;
        if (this._children.length > 0) {
            view.visibility = "gone";
        }

        CompositeView.prototype.addChild.call(this, view);
    },

    /**
     * Insert a child view to this swipe view by the specified position.
     * @method SwipeView#insertChild
     * @param {View} view - the child view to insert.
     * @param {Number} index - the position to insert the child.
     */
    insertChild: function(view) {
        view.width = this._width;
        view.height = this._height;
        if (this._children.length > 0) {
            view.visibility = "gone";
        }

        CompositeView.prototype.insertChild.call(this, view);
    },

    /**
     * Handle the pan gesture start event processing.
     * @method SwipeView#onPanStart
     * @param {GestureEvent} e - the pan gesture event info.
     * @protected
     */
    onPanStart: function(e) {
        if (this._orientation === "horizontal") {
            if (e.offsetDirection === "left") {
                if (this._currentIndex < this._children.length - 1) {
                    this._nextIndex = this._currentIndex + 1;
                } else {
                    this._nextIndex = -1;
                }
            } else if (e.offsetDirection === "right") {
                if (this._currentIndex > 0) {
                    this._nextIndex = this._currentIndex - 1;
                } else {
                    this._nextIndex = -1;
                }
            }
        } else {
            if (e.offsetDirection === "up") {
                if (this._currentIndex < this._children.length - 1) {
                    this._nextIndex = this._currentIndex + 1;
                } else {
                    this._nextIndex = -1;
                }
            } else if (e.offsetDirection === "down") {
                if (this._currentIndex > 0) {
                    this._nextIndex = this._currentIndex - 1;
                } else {
                    this._nextIndex = -1;
                }
            }
        }
        if (this._nextIndex !== -1) {
            this._children[this._nextIndex].visibility = "visible";
        }
        this.invalidate();
    },

    /**
     * Handle the pan gesture move event processing.
     * @method SwipeView#onPanMove
     * @param {GestureEvent} e - the pan gesture event info.
     * @protected
     */
    onPanMove: function(e) {
        if (this._nextIndex === -1) {
            return;
        }

        var nextView = this._children[this._nextIndex];
        var currentView = this._children[this._currentIndex];

        if (this._orientation === "horizontal") {
            currentView.left = e.deltaX;
            nextView.left = (e.offsetDirection === "left" ? this._width : -this._width) + e.deltaX;
        } else {
            currentView.top = e.deltaY;
            nextView.top = (e.offsetDirection === "up" ? this._height : -this._height) + e.deltaY;
        }
        this.invalidate();
    },

    /**
     * Handle the pan gesture end event processing.
     * @method SwipeView#onPanEnd
     * @param {GestureEvent} e - the pan gesture event info.
     * @protected
     */
    onPanEnd: function(e) {
        if (this._nextIndex === -1) {
            return;
        }

        if (this._orientation === "horizontal") {
            this.startAutoSwipe(e.offsetDirection, e.deltaX);
        } else {
            this.startAutoSwipe(e.offsetDirection, e.deltaY);
        }
    },

    /**
     * Handle the pan gesture cancel event processing.
     * @method SwipeView#onPanCancel
     * @param {GestureEvent} e - the pan gesture event info
     * @protected
     */
    onPanCancel: function(e) {
        this.onPanEnd(e);
    },

    /**
     * Paint the swipe view's children.
     * @method SwipeView#paintChildren
     * @protected
     * @override
     */
    paintChildren: function(context) {
        if (this._nextIndex !== -1) {
            var nextView = this._children[this._nextIndex];
            context.translate(nextView.left, nextView.top);
            nextView.paint(context);
            context.translate(-nextView.left, -nextView.top);
        }

        var currentView = this._children[this._currentIndex];
        context.translate(currentView.left, currentView.top);
        currentView.paint(context);
        context.translate(-currentView.left, -currentView.top);
    },

    /**
     * Start to auto swipe the current view and the next view.
     * @method SwipeView#startAutoSwipe
     * @param {String} direction - the swiping direction.
     * @param {Number} startPosition - the start position of swiping.
     * @private
     */
    startAutoSwipe: function(direction, startPosition) {
        var startTime = new Date().getTime();

        var animationFunc = null;
        this._autoTimer = setTimeout(animationFunc = function() {
            var time = new Date().getTime();
            var nextView = this._children[this._nextIndex];
            var currentView = this._children[this._currentIndex];
            var endPosition = 0;
            if (this._orientation === "horizontal") {
                endPosition = direction === "left" ? -this._width : this._width;
            } else {
                endPosition = direction === "up" ? -this._height : this._height;
            }

            if (time - startTime >= this._duration) {
                if (this._orientation === "horizontal") {
                    currentView.left = endPosition;
                    nextView.left = (direction === "left" ? this._width : -this._width) + endPosition;
                } else {
                    currentView.top = endPosition;
                    nextView.top = (direction === "up" ? this._height : -this._height) + endPosition;
                }
                this._children[this._currentIndex].visibility = "gone";

                this.dispatchEvent("swiped", this._currentIndex, this._nextIndex);

                this._currentIndex = this._nextIndex;
                this._nextIndex = -1;

                this.stopAutoSwipe();
                return;
            }
            var delta = this._beziers.getPointForT((time - startTime) / this._duration).y;
            var distance = endPosition - startPosition;

            if (this._orientation === "horizontal") {
                currentView.left = startPosition + delta * distance;
                nextView.left = (direction === "left" ? this._width : -this._width) + currentView.left;
            } else {
                currentView.top = startPosition + delta * distance;
                nextView.top = (direction === "up" ? this._height : -this._height) + currentView.top;
            }
            this.invalidate();
            this._autoTimer = setTimeout(animationFunc, 16);
        }.bind(this), 16);
    },

    /**
     * Stop the auto swiping.
     * @method SwipeView#stopAutoSwipe
     * @private
     */
    stopAutoSwipe: function() {
        clearTimeout(this._autoTimer);
        this._autoTimer = null;
        this._isAnimation = false;
        this.invalidate();
    },

    /**
     * Remove the indicator and its binding event.
     * @method SwipeView#removeIndicator
     * @private
     */
    removeIndicator: function() {
        if (this._indicator !== null) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}, module);

});