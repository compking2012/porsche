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

        this.layout = new ColumnLayout();
        this.layout.defaultLayoutParam = {align: "center", margin: {left: 0, right: 0, top: 0, bottom: 0}};

        this._orientation = "vertical";
        this._itemHeight = -1;
    },

    /**
     * Destructor
     * @method ListView#destroy
     */
    destroy: function() {
        this.layout.destroy();
        this.layout = null;

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
        this.dispatchEvent("propertychange", "orientation", oldValue, value);
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
        var oldValue = this._orientation;
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
        view.width = this._width;
        view.height = this._itemHeight;

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
        view.width = this._width;
        view.height = this._itemHeight;

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
        if (this._orientation === "vertical") {
            var offset = this._contentHeight - this._positionArray[index].top > this.height ? this._positionArray[index].top : this._contentHeight - this.height;
            this.scrollY = offset;
        } else if (this._orientation === "horizontal") {
            var offset = this._contentWidth - this._positionArray[index].left > this.width ? this._positionArray[index].left : this._contentWidth - this.width;
            this.scrollX = offset;
        }
    },

    scrollToNearestItem: function() {
        
    },

    // draw: function(context) {
    //     var length = this._children.length;
    //     var obj = context.getMatrix();
    //     this._doLayout();
    //     context.save();
    //     context.beginPath();
    //     if (this._repaint === false) {
    //         // For scroll only
    //         if (this._orientation === "vertical") {
    //             this._moveMargin = this._scrollY - this._oldscrollY;
    //             this._oldscrollY = this._scrollY;
    //             if (this._moveMargin <= 0) {
    //                 context.bitblt(obj.x0, obj.y0, this.width, this.height - Math.abs(this._moveMargin), obj.x0, obj.y0 + Math.abs(this._moveMargin));
    //             } else {
    //                 context.bitblt(obj.x0, obj.y0 + this._moveMargin, this.width, this.height - Math.abs(this._moveMargin), obj.x0, obj.y0);
    //             }
    //             context.rect(0, this._moveMargin > 0 ? this.height - this._moveMargin : 0, this.width, Math.abs(this._moveMargin));
    //         } else {
    //             this._moveMargin = this._scrollX - this._oldscrollX;
    //             this._oldscrollX = this._scrollX;
    //             if (this._moveMargin <= 0) {
    //                 context.bitblt(obj.x0, obj.y0, this.width - Math.abs(this._moveMargin), this.height, obj.x0 + Math.abs(this._moveMargin), obj.y0);
    //             } else {
    //                 context.bitblt(obj.x0 + this._moveMargin, obj.y0, this.width - Math.abs(this._moveMargin), this.height, obj.x0, obj.y0);
    //             }
    //             context.rect(this._moveMargin > 0 ? this.height - this._moveMargin : 0, 0, Math.abs(this._moveMargin), this.height);
    //         }
    //     } else {
    //         context.rect(0, 0, this.width, this.height);
    //     }
    //     context.clip();
    //     context.save();
    //     context.globalAlpha = this.opacity;
    //     if(this._dirty) {
    //         this.draw(context);
    //         this._dirty = false;
    //     }
    //     if (this._repaint || this._moveMargin !== 0) {
    //         this._paintItem(context, this._scrollX, this._scrollY, length);
    //     }
    //     context.restore();
    //     context.restore();
    // },

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
        var startIndex = Math.max(0, Math.floor(this._scrollY / this._itemHeight));
        var endIndex = Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight));
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

        if (this._orientation === "vertical") {
            var startIndex = Math.max(0, Math.floor(this._scrollY / this._itemHeight));
            var endIndex = Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight));
            for (var i = startIndex; i < endIndex; i++) {
                var listitem = this._children[i];
                context.translate(listitem.left - this._scrollX, listitem.top - this._scrollY);
                listitem.paint(context);
                context.translate(-listitem.left + this._scrollX, -listitem.top + this._scrollY);
            }
        }
        // } else {
        //     scrolloffset = scrolloffsetX;
        //     ending = scrolloffset + this.width;
        //     if (this._moveMargin < 0 && !this._repaint) {
        //         begin = this.halfsearch(this._positionArray, scrolloffset, 0, length - 1);
        //         ending = scrolloffset - this._moveMargin;
        //     } else if (this._moveMargin > 0 && !this._repaint){
        //         begin = this.halfsearch(this._positionArray, scrolloffset + this.height - this._moveMargin, 0, length - 1);
        //     }
        //     for(var j = Math.max(0, begin); j < length; j++) {
        //         var view = this._children[j];
        //         if (view.left + view._width > scrolloffset && view.left < ending) {
        //             context.save();
        //             context.translate(-scrolloffset, 0);
        //             context.translate(view.left, view.top);
        //             view.paint.call(view, context);
        //             context.restore();
        //             view = null;
        //         } else if (view.left >= ending) {
        //             break;
        //         }
        //     }
        // }

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

        var startIndex = Math.max(0, Math.floor(this._scrollY / this._itemHeight));
        var endIndex = Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight));
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
        var startIndex = Math.max(0, Math.floor(this._scrollY / this._itemHeight));
        var endIndex = Math.min(this._children.length, Math.ceil((this._scrollY + this._height) / this._itemHeight));
        for (var i = startIndex; i < endIndex; i++) {
            var child = this._children[i];
            child.setDirty(rect);
        }
    }
}, module);
