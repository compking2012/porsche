"use strict";
var Class = require("../../class");
var CompositeView = require("./compositeview");
var CubicBezier = require("../animation/cubicbezier");

/**
 * swipeview widget, touch slider.
 * @class SwipeView
 * @extends ScrollableView
 **/
Class.define("framework.ui.view.SwipeView", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this._orientation = "vertical";
        this._currentIndex = 0;
        this._duration = 250;

        this._forwardView = null;
        this._currentView = null;
        this._backwardView = null;
        this._needrepaint = true;
        this._beziers = CubicBezier.easeOut();
        this._isAnimation = false;

        this.showCurrentView();
    },

    destroy: function() {

    },

    /**
     * @name SwipeView#currentIndex
     * @type {number}
     * @description current index
     */

    get currentIndex() {
        return this._currentIndex;
    },

    set currentIndex(value) {
        var length = this._children.length;
        if (value < 0 || value >= length) {
            return;
        }
        this._currentIndex = value;
        this.showCurrentView();
    },

    addChild: function(child) {
        child.width = this._width;
        child.height = this._height;
        child.visibility = "gone";
        CompositeView.prototype.addChild.call(this, child);
        this.showCurrentView();
    },

    paint: function(context) {
        if (this._needrepaint) {
            var length = this._children.length;
            for (var i = 0; i < length; i++) {
                var child = this._children[i];
                if (this._orientation === "horizontal") {
                    child.left = i * this._width;
                    child.top = 0;
                    this._contentWidth = child.left + this._width;
                }
                if (this._orientation === "vertical") {
                    child.top = i * this._height;
                    child.left = 0;
                    this._contentHeight = child.top + this._height;
                }
            }
            this._needrepaint = false;
        }
        CompositeView.prototype.paint.call(this, context);
    },

    showCurrentView: function() {
        if (this._children.length === 0) {
            return;
        }

        if (this._forwardView !== null) {
            this._forwardView.visibility = "gone";
        }
        if (this._backwardView !== null) {
            this._backwardView.visibility = "gone";
        }
        if (this._currentView !== null) {
            this._currentView.visibility = "gone";
        }

        if (this._currentIndex > 0) {
            this._forwardView = this._children[this._currentIndex - 1];
            this._forwardView.visibility = "visible";
        } else {
            this._forwardView = null;
        }

        this._currentView = this._children[this._currentIndex];
        this._currentView.visibility = "visible";

        if (this._currentIndex < this._children.length - 1) {
            this._backwardView = this._children[this._currentIndex + 1];
            this._backwardView.visibility = "visible";
        } else {
            this._backwardView = null;
        }

        if (this._orientation === "vertical") {
            this._scrollX = 0;
            this._scrollY = this._currentIndex * this._height;
        } else if (this._orientation === "horizontal") {
            this._scrollX = this._currentIndex * this._width;
            this._scrollY = 0;
        }
    },

    swapToPrev: function(duration) {
        if (this._forwardView === null || this._isAnimation) {
            return;
        }

        var start = 0;
        var distance = 0;
        if (this._orientation === "horizontal") {
            start = this._scrollX;
            distance = -this._scrollX + this._offsetX - this._width;
        }
        if (this._orientation === "vertical") {
            start = this._scrollY;
            distance = -this._scrollY + this._offsetY - this._height;
        }

        this.swapAnimation(duration, start, distance, -1, function() {
            this.currentIndex--;
        }.bind(this));
    },

    swapToNext: function(duration) {
        if (this._backwardView === null || this._isAnimation) {
            return;
        }

        var start = 0;
        var distance = 0;
        if (this._orientation === "horizontal") {
            start = this._scrollX;
            distance = -this._scrollX + this._offsetX + this._width;
        }
        if (this._orientation === "vertical") {
            start = this._scrollY;
            distance = -this._scrollY + this._offsetY + this._height;
        }

        this.swapAnimation(duration, start, distance, 1, function() {
            this.currentIndex++;
        }.bind(this));
    },

    prevBack: function(duration) {
        if (this._isAnimation) {
            return;
        }
        var start = 0;
        var distance = 0;
        if (this._orientation === "horizontal") {
            start = this._scrollX;
            distance = -this._scrollX + this._offsetX;
        }
        if (this._orientation === "vertical") {
            start = this._scrollY;
            distance = -this._scrollY + this._offsetY;
        }

        this.swapAnimation(duration, start, distance, -1);
    },

    nextBack: function(duration) {
        if (this._isAnimation) {
            return;
        }

        var start = 0;
        var distance = 0;
        if (this._orientation === "horizontal") {
            start = this._scrollX;
            distance = -this._scrollX + this._offsetX;
        }
        if (this._orientation === "vertical") {
            start = this._scrollY;
            distance = -this._scrollY + this._offsetY;
        }

        this.swapAnimation(duration, start, distance, 1);
    },

    swapAnimation: function(duration, start, distance, direction, callback) {
        this._isAnimation = true;
        var startTime = new Date().getTime();
        var timer = setInterval(function() {
            var time = new Date().getTime();
            if (time - startTime >= duration) {
                if (this._orientation === "horizontal") {
                    this._scrollX = start + distance;
                }
                if (this._orientation === "vertical") {
                    this._scrollY = start + distance;
                }
                this.invalidate();

                if (callback) {
                    callback.call(this);
                }
                clearInterval(timer);
                this._isAnimation = false;
                this.dispatchEvent("viewchanged", this._currentIndex);
                return;
            }
            var delta = this._beziers.getPointForT((time - startTime) / duration).y;
            var offset = start + delta * distance;

            if (this._orientation === "horizontal") {
                this._scrollX = offset;
            }
            if (this._orientation === "vertical") {
                this._scrollY = offset;
            }
            this.invalidate();
        }.bind(this), 16);
    },

    handleTouchStart: function(e) {
        if (this._isAnimation) {
            return;
        }
        CompositeView.prototype.handleTouchStart.call(this, e);
    },

    handleTouchMove: function(e) {
        if (this._isAnimation) {
            return;
        }
        CompositeView.prototype.handleTouchMove.call(this, e);
    },

    handleTouchEnd: function(e) {
        if (this._isAnimation) {
            return;
        }
        var offset = 0;
        if (this._orientation === "horizontal") {
            offset = this._scrollX - this._offsetX;
        } else if (this._orientation === "vertical") {
            offset = this._scrollY - this._offsetY;
        }
        // var v = Math.max(Math.abs(vel) / 100, 2);
        var s = this._height / 3;
        if (Math.abs(offset) > s) {
            if (offset > 0) {
                this.swapToNext(this._duration);
            } else if (offset < 0) {
                this.swapToPrev(this._duration);
            }
        } else {
            if (offset < 0) {
                this.prevBack(this._duration);
            } else if (offset > 0) {
                this.nextBack(this._duration);
            }
        }
        CompositeView.prototype.handleTouchEnd.call(this, e);
    }
}, module);
