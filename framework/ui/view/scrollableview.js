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
 * Scrollable view that can place one or more views in and can be scrolled by the user,
 * allowing it to be larger than the physical display.
 * @class ScrollableView
 * @extends CompositeView
 */
Class.define("framework.ui.view.ScrollableView", CompositeView, {
    /**
     * Constructor that create a scrollable view
     * @method ScrollableView#initialize
     */
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.addGestureRecognizer(this._panRecognizer = new PanRecognizer({threshold: 1}));
        this.addEventListener("panstart", this._onPanStartFunc = this.onPanStart.bind(this));
        this.addEventListener("panmove", this._onPanMoveFunc = this.onPanMove.bind(this));
        this.addEventListener("panend", this._onPanEndFunc = this.onPanEnd.bind(this));
        this.addEventListener("pancancel", this._onPanCancelFunc = this.onPanCancel.bind(this));

        this._overScroll = false;
        this._orientation = "all";
        this._horizontalScrollBar = null;
        this._verticalScrollBar = null;

        this._autoTimer = null;
        this._velocityX = 0;
        this._velocityY = 0;
        this._rebackDuration = 200;
        this._elastic = 0.2;

        this._contentWidth = 0;
        this._contentHeight = 0;
    },

    /**
     * Destructor that destroy this scrollable view
     * @method ScrollableView#destroy
     */
    destroy: function() {
        this.stopAutoScroll();

        this.removeHorizontalScrollBar();
        this.removeVerticalScrollBar();

        this.removeGestureRecognizer(this._panRecognizer);
        this._panRecognizer = null;
        this.removeEventListener("panstart", this._onPanStartFunc);
        this._onPanStartFunc = null;
        this.removeEventListener("panmove", this._onPanMoveFunc);
        this._onPanMoveFunc = null;
        this.removeEventListener("panend", this._onPanEndFunc);
        this._onPanEndFunc = null;
        this.removeEventListener("pancancel", this._onPanCancelFunc);
        this._onPanCancelFunc = null;

        CompositeView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ScrollableView#horizontalScrollBar
     * @type {ScrollBar}
     * @description The associated horizontal scroll bar.
     */
    get horizontalScrollBar() {
        return this._horizontalScrollBar;
    },

    set horizontalScrollBar(value) {
        this.setProperty("horizontalScrollBar", value, function() {
            this.removeHorizontalScrollBar();
            value.associatedView = this;
        }.bind(this));
    },

    /**
     * @name ScrollableView#verticalScrollBar
     * @type {ScrollBar}
     * @description The associated vertical scroll bar.
     */
    get verticalScrollBar() {
        return this._verticalScrollBar;
    },

    set verticalScrollBar(value) {
        this.setProperty("verticalScrollBar", value, function() {
            this.removeVerticalScrollBar();
            value.associatedView = this;
        }.bind(this));
    },

    /**
     * @name ScrollableView#contentWidth
     * @type {Number}
     * @description the content width.
     * @readonly
     */
    get contentWidth() {
        return this._contentWidth;
    },

    /**
     * @name ScrollableView#contentHeight
     * @type {Number}
     * @description the content height.
     * @readonly
     */
    get contentHeight() {
        return this._contentHeight;
    },

    /**
     * @name ScrollableView#orientation
     * @type {String}
     * @description the orientation for scroll, such as "horizontal", "vertical".
     */
    get orientation() {
        return this._orientation;
    },

    set orientation(value) {
        var oldValue = this._orientation;
        if (oldValue === value) {
            return;
        }
        this._orientation = value;
        this.dispatchEvent("propertychange", "orientation", oldValue, value);
        this.invalidate();
    },

    /**
     * @name ScrollableView#overScroll
     * @type {Boolean}
     * @description indicating whether allows over scroll.
     * @private
     */
    get overScroll() {
        return this._overScroll;
    },

    set overScroll(value) {
        var oldValue = this._overScroll;
        if (oldValue === value) {
            return;
        }
        this._overScroll = value;
        this.dispatchEvent("propertychange", "overScroll", oldValue, value);
        this.invalidate();
    },

    /**
     * Add a view to this scrollable view.
     * @method ScrollableView#addChild
     * @param {View} view - sub child view to be insert to the last, and show at top
     */
    addChild: function(view) {
        view.addEventListener("propertychange", this._onPropertyChangeFunc = this.onPropertyChange.bind(this, view));
        if (view.right > this._contentWidth) {
            this._contentWidth = view.right;
        }
        if (view.bottom > this._contentHeight) {
            this._contentHeight = view.bottom;
        }
        CompositeView.prototype.addChild.call(this, view);
    },

    /**
     * Insert a child view to this scrollable view by the specified position.
     * @method ScrollableView#insertChild
     * @param {View} view - the child view to add
     * @param {Number} index - the position at which to add the child
     */
    insertChild: function(view, index) {
        view.addEventListener("propertychange", this._onPropertyChangeFunc = this.onPropertyChange.bind(this, view));
        if (view.right > this._contentWidth) {
            this._contentWidth = view.right;
        }
        if (view.bottom > this._contentHeight) {
            this._contentHeight = view.bottom;
        }
        CompositeView.prototype.insertChild.call(this, view, index);
    },

    /**
     * Remove the specified view from this scrollable view.
     * @method ScrollableView#removeChild
     * @param {View} view - the child view to remove, or the position in this composite view to remove
     */
    removeChild: function(view) {
        view.removeEventListener("propertychange", this._onPropertyChangeFunc);
        var length = this._children.length;
        if (view.right === this._contentWidth) {
            this._contentWidth = 0;
            for (var i = 0; i < length; i++) {
                if (this._children[i] === view) {
                    continue;
                }
                if (this._children[i].right > this._contentWidth) {
                    this._contentWidth = this._children[i].right;
                }
            }
        }
        if (view.bottom === this._contentHeight) {
            this._contentHeight = 0;
            for (var j = 0; j < length; j++) {
                if (this._children[j] === view) {
                    continue;
                }
                if (this._children[j].bottom > this._contentHeight) {
                    this._contentHeight = this._children[j].bottom;
                }
            }
        }
        CompositeView.prototype.removeChild.call(this, view);
    },

    /**
     * Paint the scrollable view's children.
     * @method ScrollableView#paintChildren
     * @protected
     */
    paintChildren: function(context) {
        if (this._layout !== null && this._needRelayout) {
            this._layout.perform();
            this._needRelayout = false;
        }

        var length = this._children.length;
        for (var i = 0; i < length; i++) {
            var view = this._children[i];
            if (view.bottom >= this._scrollY && view.top <= this._scrollY + this._height) {
                context.translate(view.left - this._scrollX, view.top - this._scrollY);
                view.paint(context);
                context.translate(-view.left + this._scrollX, -view.top + this._scrollY);
            }
        }
    },

    /**
     * Handle the pan gesture start event processing.
     * @method ScrollableView#onPanStart
     * @param {GestureEvent} e - the pan gesture event info
     * @protected
     */
    onPanStart: function(/*e*/) {
        this.stopAutoScroll();

        this._startScrollX = this._scrollX;
        this._startScrollY = this._scrollY;
    },

    /**
     * Handle the pan gesture move event processing.
     * @method ScrollableView#onPanMove
     * @param {GestureEvent} e - the pan gesture event info
     * @protected
     */
    onPanMove: function(e) {
        if (this._orientation === "horizontal" || this._orientation === "all") {
            var scrollX = this._startScrollX - e.deltaX;
            if (!this._overScroll) {
                if (scrollX > Math.max(0, this._contentWidth - this._width)) {
                    this.scrollX = Math.max(0, this._contentWidth - this._width);
                } else if (scrollX < 0) {
                    this.scrollX = 0;
                } else {
                    this.scrollX = scrollX;
                }
            } else {
                if (scrollX <= -10) {
                    this.scrollX = Math.round(scrollX * this._elastic - 10 * (1 - this._elastic));
                } else if (scrollX >= Math.max(this._contentWidth - this._width + 10, 0)) {
                    this.scrollX = Math.round(scrollX * this._elastic + Math.max(this._contentWidth - this._width + 10, 0) * (1 - this._elastic));
                } else {
                    this.scrollX = scrollX;
                }
            }
        }

        if (this._orientation === "vertical" || this._orientation === "all") {
            var scrollY = this._startScrollY - e.deltaY;
            if (!this._overScroll) {
                if (scrollY > Math.max(0, this._contentHeight - this._height)) {
                    this.scrollY = Math.max(0, this._contentHeight - this._height);
                } else if (scrollY < 0) {
                    this.scrollY = 0;
                } else {
                    this.scrollY = scrollY;
                }
            } else {
                if (scrollY <= -10) {
                    this.scrollY = Math.round(scrollY * this._elastic - 10 * (1 - this._elastic));
                } else if (scrollY >= Math.max(this._contentHeight - this._height + 10, 0)) {
                    this.scrollY = Math.round(scrollY * this._elastic + Math.max(this._contentHeight - this._height + 10, 0) * (1 - this._elastic));
                } else {
                    this.scrollY = scrollY;
                }
            }
        }
    },

    /**
     * Handle the pan gesture end event processing.
     * @method ScrollableView#onPanEnd
     * @param {GestureEvent} e - the pan gesture event info
     * @protected
     */
    onPanEnd: function(e) {
        this._velocityX = e.velocityX * 1000;
        this._velocityY = e.velocityY * 1000;
        if (this._orientation === "horizontal") {
            if (this._scrollX > 0 && this._scrollX < Math.max(0, this._contentWidth - this._width)) {
                this.startAutoScroll(this._velocityX, 0);
                return;
            }
        } else if (this._orientation === "vertical") {
            if (this._scrollY > 0 && this._scrollY < Math.max(0, this._contentHeight - this._height)) {
                this.startAutoScroll(0, this._velocityY);
                return;
            }
        } else {
            if (this._scrollX < 0 || this._scrollX > Math.max(0, this._contentWidth - this._width)) {
                this._velocityX = 0;
            }
            if (this._scrollY < 0 || this._scrollY > Math.max(0, this._contentHeight - this._height)) {
                this._velocityY = 0;
            }
            if (this._velocityX !== 0 || this._velocityY !== 0) {
                this.startAutoScroll(this._velocityX, this._velocityY);
                return;
            }
        }
        if (this._overScroll) {
            // FIXME
            if (this._scrollX < 0 ||
                this._scrollX > this._contentWidth - this._width && this._scrollX > 0 ||
                this._scrollY < 0 ||
                this._scrollY > 0 && this._scrollY > this._contentHeight - this._height) {
                this.reback();
            }
        }
    },

    /**
     * Handle the pan gesture cancel event processing.
     * @method ScrollableView#onPanCancel
     * @param {GestureEvent} e - the pan gesture event info
     * @protected
     */
    onPanCancel: function(e) {
        this.onPanEnd(e);
    },

    /**
     * Handle the property change event processing.
     * @method ScrollableView#onPropertyChange
     * @param {View} view - the view whose property is changed.
     * @param {View} property - the property name.
     * @param {View} oldValue - the old value.
     * @param {View} newValue - the new value.
     * @protected
     */
    onPropertyChange: function(view, property/*, oldValue, newValue*/) {
        if (property === "left" || property === "top" || property === "bottom" || property === "right" || property === "width" || property === "height") {
            var length = this._children.length;
            this._contentWidth = 0;
            for (var i = 0; i < length; i++) {
                var child = this._children[i];
                if (child === view) {
                    continue;
                }
                var right = child.right;
                if (right > this._contentWidth) {
                    this._contentWidth = right;
                }
            }

            this._contentHeight = 0;
            for (var j = 0; j < length; j++) {
                if (this._children[j] === view) {
                    continue;
                }
                if (this._children[j].bottom > this._contentHeight) {
                    this._contentHeight = this._children[j].bottom;
                }
            }
        }
    },

    /**
     * Start to auto scroll the content based a specified velocity.
     * @method ScrollableView#startAutoScroll
     * @param {Number} amplitudeX - the velocity of x-axis
     * @param {Number} amplitudeY - the velocity of y-axis
     * @private
     */
    startAutoScroll: function(amplitudeX, amplitudeY) {
        console.log("amplitudeX, amplitudeY: ", amplitudeX, amplitudeY);
        var startTime = new Date().getTime();
        var totalTime = 0;
        if (amplitudeX !== 0 && amplitudeY !== 0) {
            totalTime = Math.max(this._velocityX / amplitudeX, this._velocityY / amplitudeY);
        } else if (amplitudeX !== 0) {
            totalTime = this._velocityX / amplitudeX;
        } else if (amplitudeY !== 0) {
            totalTime = this._velocityY / amplitudeY;
        }
        totalTime *= 1000;
        var isEndX = false;
        var isEndY = false;
        if (!this._autoTimer) {
            var animationFunc = null;
            this._autoTimer = setTimeout(animationFunc = function() {
                var time = new Date().getTime();
                var deltaX = this.calculateDelta(this._velocityX, amplitudeX, time - startTime);
                var deltaY = this.calculateDelta(this._velocityY, amplitudeY, time - startTime);
                var scrollX = this._scrollX;
                var scrollY = this._scrollY;

                if (!isEndX) {
                    scrollX -= deltaX;
                }
                if (!isEndY) {
                    scrollY -= deltaY;
                }

                totalTime -= time - startTime;
                startTime = new Date().getTime();

                if (totalTime > 0) {
                    if (scrollX <= 0) {
                        this.scrollX = 0;
                        isEndX = true;
                    } else if (scrollX >= Math.max(0, this._contentWidth - this._width)) {
                        this.scrollX = Math.max(0, this._contentWidth - this._width);
                        isEndX = true;
                    } else {
                        this.scrollX = scrollX;
                    }

                    if (scrollY <= 0) {
                        this.scrollY = 0;
                        isEndY = true;
                    } else if (scrollY >= Math.max(0, this._contentHeight - this._height)) {
                        this.scrollY = Math.max(0, this._contentHeight - this._height);
                        isEndY = true;
                    } else {
                        this.scrollY = scrollY;
                    }

                    if (isEndX && isEndY) {
                        this.stopAutoScroll();
                        return;
                    }
                } else {
                    this.scrollX = scrollX;
                    this.scrollY = scrollY;
                    this.stopAutoScroll();
                    return;
                }
                this._autoTimer = setTimeout(animationFunc, 16);
            }.bind(this), 16);
        }
    },

    /**
     * Stop the auto scrolling.
     * @method ScrollableView#stopAutoScroll
     * @private
     */
    stopAutoScroll: function() {
        if (this._autoTimer !== null) {
            clearTimeout(this._autoTimer);
            this._velocityX = 0;
            this._velocityY = 0;
            this._autoTimer = null;
            this.invalidate();
        }
    },

    /**
     * Remove the horizontal scroll bar and its binding event.
     * @method ScrollableView#removeHorizontalScrollBar
     * @private
     */
    removeHorizontalScrollBar: function() {
        if (this._horizontalScrollBar !== null) {
            this._horizontalScrollBar.removeEventListener("propertychange", this._onHorizontalScrollBarChangeFunc);
            this._onHorizontalScrollBarChangeFunc = null;
            this._horizontalScrollBar.destroy();
            this._horizontalScrollBar = null;
        }
    },

    /**
     * Remove the vertical scroll bar and its binding event.
     * @method ScrollableView#removeVerticalScrollBar
     * @private
     */
    removeVerticalScrollBar: function() {
        if (this._verticalScrollBar !== null) {
            this._verticalScrollBar.removeEventListener("propertychange", this._onVerticalScrollBarChangeFunc);
            this._onVerticalScrollBarChangeFunc = null;
            this._verticalScrollBar.destroy();
            this._verticalScrollBar = null;
        }
    },

    /**
     * Calculate delta.
     * @method ScrollableView#calculdateDelta
     * @param  {Number} v - velocity
     * @param  {Number} a - amplitude
     * @param  {Number} t - time
     * @private
     */
    calculateDelta: function(v, a, t) {
        if (a < 10 && a > -10) {
            return 0;
        }
        var vt = v;
        var v0 = vt - a * t / 1000;
        var delta = (Math.pow(vt, 2) - Math.pow(v0, 2)) * 0.5 / a;
        if (v === this._velocityX) {
            this._velocityX = v0;
        }
        if (v === this._velocityY) {
            this._velocityY = v0;
        }
        return delta;
    },

    /**
     * Do a scroll back.
     * @method ScrollableView#reback
     * @private
     */
    reback: function() {
        var targetX = 0;
        var targetY = 0;
        var beziers = new CubicBezier(0.33, 0.66, 0.66, 1);
        if (this._scrollX > Math.max(0, this._contentWidth - this._width)) {
            targetX = Math.max(0, this._contentWidth - this._width);
        } else if (this._scrollX < 0) {
            targetX = 0;
        } else {
            targetX = this._scrollX;
        }
        if (this._scrollY > Math.max(0, this._contentHeight - this._height)) {
            targetY = Math.max(0, this._contentHeight - this._height);
        } else if (this._scrollY < 0) {
            targetY = 0;
        } else {
            targetY = this._scrollY;
        }
        var startX = this._scrollX;
        var startY = this._scrollY;
        var startTime = new Date().getTime();
        var animationFunc = null;
        this._autoTimer = setTimeout(animationFunc = function() {
            var time = new Date().getTime();
            if (time - startTime >= this._rebackDuration) {
                this.scrollX = targetX;
                this.scrollY = targetY;
                clearTimeout(this._autoTimer);
                return;
            }
            var delta = beziers.getPointForT((time - startTime) / this._rebackDuration).y;
            this.scrollX = startX + delta * (targetX - startX);
            this.scrollY = startY + delta * (targetY - startY);
            this._autoTimer = setTimeout(animationFunc, 10);
        }.bind(this), 10);
    }
}, module);
