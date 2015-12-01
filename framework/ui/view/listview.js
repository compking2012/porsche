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
var ScrollableView = require("./scrollableview");
var RowLayout = require("../layout/rowlayout");
var ColumnLayout = require("../layout/columnlayout");
var ListItem = require("./listitem");

/**
 * List view that shows items in a horizontal or vertical scrolling list.
 * @class ListView
 * @extends ScrollableView
 */
Class.define("framework.ui.view.ListView", ScrollableView, {
    /**
     * Constructor that create a list view
     * @method ListView#initialize
     */
    initialize: function() {
        ScrollableView.prototype.initialize.apply(this, arguments);

        this._rowLayout = new RowLayout();
        this._rowLayout.defaultLayoutParam = {align: "middle", margin: {left: 0, right: 0, top: 0, bottom: 0}};
        this._columnLayout = new ColumnLayout();
        this._columnLayout.defaultLayoutParam = {align: "center", margin: {left: 0, right: 0, top: 0, bottom: 0}};

        this.layout = this._columnLayout;

        this._orientation = "vertical";
        this._itemWidth = -1;
        this._itemHeight = -1;
    },

    /**
     * Destructor that destroy this list view
     * @method ListView#destroy
     */
    destroy: function() {
        this._rowLayout.destroy();
        this._rowLayout = null;
        this._columnLayout.destroy();
        this._columnLayout = null;
        this._layout = null;

        ScrollableView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ListView#orientation
     * @type {String}
     * @description The orientation for scroll, either "horizontal" or "vertical".
     */
    get orientation() {
        return this._orientation;
    },

    set orientation(value) {
        this.setProperty("orientation", value, function() {
            this.layout = value === "vertical" ? this._columnLayout : this._rowLayout;
        }.bind(this));
    },

    /**
     * @name ListView#itemWidth
     * @type {Number}
     * @description the width of each list item.
     * Note that this value is only available when orientation is horizontal.
     */
    get itemWidth() {
        return this._itemWidth;
    },

    set itemWidth(value) {
        this.setProperty("itemWidth", value);
    },

    /**
     * @name ListView#itemHeight
     * @type {Number}
     * @description the height of each list item.
     * Note that this value is only available when orientation is vertical.
     */
    get itemHeight() {
        return this._itemHeight;
    },

    set itemHeight(value) {
        this.setProperty("itemHeight", value);
    },

    /**
     * Add a view to this list view.
     * @method ListView#addChild
     * @param {View} view - sub child view to be insert to the last, and show at top.
     */
    addChild: function(view) {
        if (!view instanceof ListItem) {
            throw "The view must be a List Item";
        }
        view.saveAbsoluteInfo();
        view.width = this._orientation === "vertical" ? this._width : this._itemWidth;
        view.height = this._orientation === "vertical" ? this._itemHeight : this._height;

        ScrollableView.prototype.addChild.call(this, view);
    },

    /**
     * Insert a child view to this list view by the specified position.
     * @method ListView#insertChild
     * @param {View} view - the child view to add, must be a list item.
     * @param {Number} index - the position at which to add the child
     */
    insertChild: function(view, index) {
        if (!view instanceof ListItem) {
            throw "The view must be a ListItem";
        }
        view.saveAbsoluteInfo();
        view.width = this._orientation === "vertical" ? this._width : this._itemWidth;
        view.height = this._orientation === "vertical" ? this._itemHeight : this._height;

        ScrollableView.prototype.insertChild.call(this, view, index);
    },

    /**
     * Remove the specified view from this list view.
     * @method ListView#removeChild
     * @param {View} view - the child view to remove.
     */
    removeChild: function(view) {
        if (!view instanceof ListItem) {
            throw "The view must be a List Item";
        }
        view.resetToNoLayout();

        ScrollableView.prototype.removeChild.call(this, view);
    },


    /**
     * Smoothly scroll to the specified position.
     * The view will scroll such that the indicated position is displayed.
     * @param  {Number} index - the position to scroll.
     * @private
     */
    scrollToItem: function(index) {
    },

    /**
     * Smoothly scroll to the position of the nearest item.
     * The view will scroll such that the indicated position is displayed.
     * @private
     */
    scrollToNearestItem: function() {
    },

    /**
     * Find the view at the point
     * @method ListView#findViewAtPoint
     * @param {Point} point - the point.
     * @return {View} return a child view which contains the specified point and is on the top of all children,
     * otherwise return this list view if it contains the specified point.
     * @protected
     * @override
     */
    findViewAtPoint: function(point) {
        if (this._visibility !== "visible") {
            return null;
        }

        if (!this.containsPoint(point)) {
            return null;
        }

        point.offset(-this._left + this._scrollX, -this._top + this._scrollY);
        var findChild = this;
        var startIndex = this._orientation === "vertical" ? Math.max(0, Math.floor(this._scrollY / this._itemHeight)) : Math.max(0, Math.floor(this._scrollX / this._itemWidth));
        var endIndex = this._orientation === "vertical" ? Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight)) : Math.min(this._children.length, Math.ceil((this._scrollX + this._width) / this._itemWidth));
        for (var i = endIndex - 1; i >= startIndex; i--) {
            var child = this._children[i].findViewAtPoint(point);
            if (child !== null) {
                findChild = child;
                break;
            }
        }
        point.offset(this._left - this._scrollX, this._top - this._scrollY);
        return findChild;
    },

    /**
     * Paint the list view's children.
     * @method ListView#paintChildren
     * @protected
     * @override
     */
    paintChildren: function(context) {
        if (this._layout !== null && this._needRelayout) {
            this._layout.perform();
            this._needRelayout = false;
        }

        var startIndex = this._orientation === "vertical" ? Math.max(0, Math.floor(this._scrollY / this._itemHeight)) : Math.max(0, Math.floor(this._scrollX / this._itemWidth));
        var endIndex = this._orientation === "vertical" ? Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight)) : Math.min(this._children.length, Math.ceil((this._scrollX + this._width) / this._itemWidth));
        for (var i = startIndex; i < endIndex; i++) {
            var listitem = this._children[i];
            context.translate(listitem.left - this._scrollX, listitem.top - this._scrollY);
            listitem.paint(context);
            context.translate(-listitem.left + this._scrollX, -listitem.top + this._scrollY);
        }
    },

    /**
     * Mark the area defined by dirty as needing to be drawn.
     * @method ListView#invalidate
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region.
     * @protected
     * @override
     */
    invalidate: function(rect) {
        if (rect === undefined) {
            rect = this._boundRect.clone();
        }

        var startIndex = this._orientation === "vertical" ? Math.max(0, Math.floor(this._scrollY / this._itemHeight)) : Math.max(0, Math.floor(this._scrollX / this._itemWidth));
        var endIndex = this._orientation === "vertical" ? Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight)) : Math.min(this._children.length, Math.ceil((this._scrollX + this._width) / this._itemWidth));
        for (var i = startIndex; i < endIndex; i++) {
            var child = this._children[i];
            child.setDirty(rect);
        }

        this.invalidateInternal(rect);
    },

    /**
     * Set this list view and all children dirty.
     * @method ListView#setDirty
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region.
     * @protected
     * @override
     */
    setDirty: function(rect) {
        ScrollableView.prototype.setDirty.call(this, rect);
        var startIndex = this._orientation === "vertical" ? Math.max(0, Math.floor(this._scrollY / this._itemHeight)) : Math.max(0, Math.floor(this._scrollX / this._itemWidth));
        var endIndex = this._orientation === "vertical" ? Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight)) : Math.min(this._children.length, Math.ceil((this._scrollX + this._width) / this._itemWidth));
        for (var i = startIndex; i < endIndex; i++) {
            var child = this._children[i];
            child.setDirty(rect);
        }
    }
}, module);
