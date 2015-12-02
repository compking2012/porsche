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
 * Composite view is a special view that can contain other views (called children.)
 * The composite view is the base class for view containers.
 * @class CompositeView
 * @extends View
 */
Class.define("framework.ui.view.CompositeView", View, {
    /**
     * Constructor that create a composite view
     * @method CompositeView#initialize
     */
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._children = [];
        this._layout = null;
        this._needRelayout = false;
    },

    /**
     * Destructor that destroy this composite view
     * @method CompositeView#destroy
     */
    destroy: function() {
        this._children = null;
        if (this._layout !== null) {
            this._layout.destroy();
        }
        this._layout = null;

        View.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name CompositeView#layout
     * @type {Layout}
     * @description the layout applied for all children of the composite view.
     */
    get layout() {
        return this._layout;
    },

    set layout(value) {
        this.setProperty("layout", value, function() {
            if (value === null && this._layout !== null) {
                var length = this._children.length;
                for (var i = 0; i < length; i++) {
                    var view = this._children[i];
                    view.resetToNoLayout();
                }
                this._needRelayout = false;
                this._layout.associatedView = null;
            } else if (value !== null) {
                this._needRelayout = true;
                value.associatedView = this;
            }
        }.bind(this));
    },

    /**
     * @name CompositeView#children
     * @type {View[]}
     * @description the array of all children in this composite view.
     * @readonly
     */
    get children() {
        return this._children;
    },

    /**
     * Add a view to this composite view and it is on top of all other children.
     * @method CompositeView#addChild
     * @param {View} view - child view that added to the end of parent children.
     */
    addChild: function(view) {
        var length = this._children.length;
        for (var i = 0; i < length; i++) {
            if (this._children[i] === view) {
                return;
            }
        }

        this.dispatchEvent("childwilladd", view);
        view.dispatchEvent("willadd");

        if (view.parent !== null) {
            view.parent.removeChild(view);
        }
        this._children.push(view);
        view.parent = this;
        this._needRelayout = true;
        this.invalidate();

        this.dispatchEvent("childadded", view);
        view.dispatchEvent("added");
    },

    /**
     * Insert a child view in this composite view by the specified position.
     * @method CompositeView#insertChild
     * @param {View} view - the child view that inserted to the specified position.
     * @param {Number} index - the position at which to insert the child to.
     */
    insertChild: function(view, index) {
        var length = this._children.length;
        for (var i = 0; i < length; i++) {
            if (this._children[i] === view) {
                return;
            }
        }

        this.dispatchEvent("childwilladd", view, index);
        view.dispatchEvent("willadd", index);

        if (view.parent !== null) {
            view.parent.removeChild(view);
        }
        this._children.splice(index, 0, view);
        view.parent = this;
        this._needRelayout = true;
        this.invalidate();

        this.dispatchEvent("childadded", view, index);
        view.dispatchEvent("added", index);
    },

    /**
     * Remove the specified view from this composite view.
     * @method CompositeView#removeChild
     * @param {View} view - the child view to remove from its parent children.
     */
    removeChild: function(view) {
        var index = this._children.indexOf(view);
        if (index === -1) {
            return;
        }

        this.dispatchEvent("childwillremove", view);
        view.dispatchEvent("willremove");

        this._children.splice(index, 1);
        view.parent = null;
        this._needRelayout = true;
        this.invalidate();

        this.dispatchEvent("childremoved", view);
        view.dispatchEvent("removed");
    },

    /**
     * Remove all children views from this composite view.
     * @method CompositeView#removeAllChildren
     */
    removeAllChildren: function() {
        this._children.splice(0, this._children.length);
        this._needRelayout = true;
        this.invalidate();
    },

    /**
     * Change the z order of the child so it's on top of all other children.
     * @method CompositeView#bringChildToFront
     * @param {View} view - the child to bring to the top of the z order.
     */
    bringChildToFront: function(view) {
        var index = this._children.indexOf(view);
        if (index < 0) {
            return;
        }
        this._children.splice(index, 1);
        this._children.push(view);
        this.invalidate();
    },

    /**
     * Change the z order of the child so it's on bottom of all other children.
     * @method CompositeView#sendChildToBack
     * @param {View} view - the child to bring to the bottom of the z order.
     */
    sendChildToBack: function(view) {
        var index = this._children.indexOf(view);
        if (index < 0) {
            return;
        }
        this._children.splice(index, 1);
        this._children.unshift(view);
        this.invalidate();
    },

    /**
     * Find the view at the point.
     * @method CompositeView#findViewAtPoint
     * @param {Point} point - the point.
     * @return {View} return a child view which contains the specified point and is on the top of all children,
     * otherwise return this composite view if it contains the specified point.
     * @protected
     * @override
     */
    findViewAtPoint: function(point) {
        if (View.prototype.findViewAtPoint.call(this, point) === null) {
            return null;
        }

        point.offset(-this._left + this._scrollX, -this._top + this._scrollY);
        var findChild = null;
        var length = this._children.length;
        for (var i = length - 1; i >= 0; i--) {
            var child = this._children[i].findViewAtPoint(point);
            if (child !== null) {
                findChild = child;
                break;
            }
        }
        point.offset(this._left - this._scrollX, this._top - this._scrollY);
        return findChild || this;
    },

    /**
     * Paint the composite view itself.
     * @method CompositeView#paint
     * @param {Context} context - the canvas context to which it is rendered
     * @protected
     * @override
     */
    paint: function(context) {
        if (!this.paintSelf(context)) {
            return;
        }

        this.paintChildren(context);

        context.restore();

        this._dirty = false;
        this._dirtyRect.empty();
    },

    /**
     * Paint the composite view's children.
     * @method CompositeView#paintChildren
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
            if (view.bottom >= 0 && view.top <= this._height) {
                context.translate(view.left, view.top);
                view.paint(context);
                context.translate(-view.left, -view.top);
            }
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

        var length = this._children.length;
        for (var i = 0; i < length; i++) {
            var child = this._children[i];
            child.setDirty(rect);
        }

        this.invalidateInternal(rect);
    },

    /**
     * Mark the all the specified view overlapped children as dirty.
     * @method CompositeView#invalidateChild
     * @param {View} view - the specified view
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @private
     */
    invalidateChild: function(view, rect) {
        this._dirty = true;
        this._dirtyRect.assign(this._boundRect.left, this._boundRect.top, this._boundRect.width, this._boundRect.height);

        var length = this._children.length;
        for (var i = 0; i < length; i++) {
            var child = this._children[i];
            if (child !== view) {
                child.setDirty(rect);
            }
        }

        if (this._parent !== null) {
            this._parent.invalidateChild(this, rect);
        }
    },

    /**
     * Set this composite view and all children dirty.
     * @method CompositeView#setDirty
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
     */
    setDirty: function(rect) {
        View.prototype.setDirty.call(this, rect);
        var length = this._children.length;
        for (var i = 0; i < length; i++) {
            var child = this._children[i];
            child.setDirty(rect);
        }
    },

    /**
     * Relayout
     * @method CompositeView#relayout
     * @param {View} self - this view
     * @protected
     */
    relayout: function(self) {
        if (self) {
            this.needRelayout = true;
        }
        View.prototype.relayout.call(this, self);
    },

    /**
     * @name CompositeView#needRelayout
     * @type {Boolean}
     * @description whether need to relayout
     * @private
     */
    get needRelayout() {
        return this._needRelayout;
    },

    set needRelayout(value) {
        this._needRelayout = value;
        this.invalidate();
    }
}, module);
