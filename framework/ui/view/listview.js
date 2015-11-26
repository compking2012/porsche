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
var ScrollableView = require("./scrollableview");
var RowLayout = require("../layout/rowlayout");
var ColumnLayout = require("../layout/columnlayout");
var ListItem = require("./listitem");

/**
 * ListView widget, it can scroll vertically by touch.
 * @class ListView
 * @extends ScrollableView
 */
Class.define("framework.ui.view.ListView", ScrollableView, {
    /**
     * Constructor
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
     * Destructor
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
     * @description The orientation for scroll, such as "horizontal", "vertical".
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
        this.layout = this._orientation === "vertical" ? this._columnLayout : this._rowLayout;
        this.dispatchEvent("propertychange", "orientation", oldValue, value);
        this.invalidate();
    },

    /**
     * @name ListView#itemWidth
     * @type {Number}
     * @description the width of each list item.
     */
    get itemWidth() {
        return this._itemWidth;
    },

    set itemWidth(value) {
        var oldValue = this._itemWidth;
        if (oldValue === value) {
            return;
        }
        this._itemWidth = value;
        this.dispatchEvent("propertychange", "itemWidth", oldValue, value);
        this.invalidate();
    },

    /**
     * @name ListView#itemHeight
     * @type {Number}
     * @description the height of each list item.
     */
    get itemHeight() {
        return this._itemHeight;
    },

    set itemHeight(value) {
        var oldValue = this._itemHeight;
        if (oldValue === value) {
            return;
        }
        this._itemHeight = value;
        this.dispatchEvent("propertychange", "itemHeight", oldValue, value);
        this.invalidate();
    },

    /**
     * Add a view to specified parent view.
     * @method ListView#addChild
     * @param {View} view - sub child view to be insert to the last, and show at top
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
     * Insert a child view in this composite view by the specified position.
     * @method ListView#insertChild
     * @param {View} view - the child view to add
     * @param {Number} index - the position at which to add the child
     */
    insertChild: function(view, index) {
        if (!view instanceof ListItem) {
            throw "The view must be a List Item";
        }
        view.saveAbsoluteInfo();
        view.width = this._orientation === "vertical" ? this._width : this._itemWidth;
        view.height = this._orientation === "vertical" ? this._itemHeight : this._height;

        ScrollableView.prototype.insertChild.call(this, view, index);
    },

    /**
     * Remove the specified view from this composite view.
     * @method ListView#removeChild
     * @param {View} view - the child view to remove, or the position in this composite view to remove
     */
    removeChild: function(view) {
        if (!view instanceof ListItem) {
            throw "The view must be a List Item";
        }
        view.resetToNoLayout();

        ScrollableView.prototype.removeChild.call(this, view);
    },

    scrollToItem: function(index) {
    },

    scrollToNearestItem: function() {
    },

    /**
     * Find the view at the point
     * @method ListView#findViewAtPoint
     * @param {Point} point the point in put
     * @return {View} return the view which point in the view and it has the max zOrder;
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
     * @method CompositeView#invalidate
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
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
     * Set this composite view and all children dirty.
     * @method ListView#setDirty
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
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

});