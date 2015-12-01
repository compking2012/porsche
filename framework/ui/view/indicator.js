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
var View = require("./view");

/**
 * Indicator widget only use for swipeview
 * @class Indicator
 * @extends View
 **/
Class.define("framework.ui.view.Indicator", View, {
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._count = 0;
        this._currentIndex = 0;
        this._margin = 5;
        this._radius = 5;
        this._color = "#FFFFFF";
        this._associatedView = null;
    },

    /**
     * @name Indicator#count
     * @type {Number}
     * @description number of the points.
     */
    get count() {
        return this._count;
    },

    set count(value) {
        this.setProperty("count", value);
    },

    /**
     * @name Indicator#currentIndex
     * @type {Number}
     * @description current point number.
     */
    get currentIndex() {
        return this._currentIndex;
    },

    set currentIndex(value) {
        this.setProperty("currentIndex", value);
    },

    /**
     * @name Indicator#radius
     * @type {Number}
     * @description the radius of the point.
     */
    get radius() {
        return this._radius;
    },

    set radius(value) {
        this.setProperty("radius", value);
    },

    /**
     * @name Indicator#margin
     * @type {Number}
     * @description the margin between points.
     */
    get margin() {
        return this._margin;
    },

    set margin(value) {
        this.setProperty("margin", value);
    },

    /**
     * @name Indicator#color
     * @type {String}
     * @description the color for points.
     */
    get color() {
        return this._color;
    },

    set color(value) {
        this.setProperty("color", value);
    },

    /**
     * Draw the indicator.
     * @method Indicator#draw
     * @param {Context} context - the canvas context to which the view is rendered.
     * @protected
     * @override
     */
    draw: function(context) {
        context.save();
        context.fillStyle = this._color;
        var startPosition = (this._width - this._radius * this._count * 2 - this._margin * (this._count - 1)) / 2;
        for (var i = 0; i < this._count; i++) {
            context.roundRect(startPosition, this._height / 2 - this._radius, this._radius * 2, this._radius * 2, this._radius);
            if (i === this._currentIndex) {
                context.globalAlpha = 1;
            } else {
                context.globalAlpha = 0.5;
            }
            context.fill();
            startPosition += this._radius * 2 + this._margin;
        }
        context.restore();
    },

    /**
     * @name Indicator#associatedView
     * @type {SwipeView}
     * @description the swipe view that associates with this indicator.
     * @private
     */
    get associatedView() {
        return this._associatedView;
    },

    set associatedView(value) {
        this.removeAssociatedView();
        this._associatedView = value;
        this._associatedView.addEventListener("swiped", this._onAssociatedViewSwipedFunc = this.onAssociatedViewSwiped.bind(this));
        this._associatedView.addEventListener("childadded", this._onAssociatedViewChildAddedFunc = this.onAssociatedViewChildAdded.bind(this));
    },

    /**
     * Handle the changed event when associated view is changed.
     * @method Indicator#onAssociatedViewSwiped
     * @param {Object} originalIndex - the original index.
     * @param {Object} currentIndex - the current index.
     * @private
     */
    onAssociatedViewSwiped: function(originalIndex, currentIndex) {
        this.currentIndex = currentIndex;
    },

    onAssociatedViewChildAdded: function() {
        this.count = this._associatedView.children.length;
    },

    /**
     * Remove the associated view.
     * @method Indicator#removeAssociatedView
     * @private
     */
    removeAssociatedView: function() {
        if (this._associatedView !== null) {
            this._associatedView.removeEventListener("propertychange", this._onAssociatedViewChangeFunc);
            this._onAssociatedViewChildAddedFunc = null;
            this._associatedView.removeEventListener("childadded", this._onAssociatedViewChildAddedFunc);
            this._onAssociatedViewChangeFunc = null;
            this._associatedView = null;
        }
    }
}, module);

});