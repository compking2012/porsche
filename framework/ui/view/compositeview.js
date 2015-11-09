"use strict";
var Class = require("../../class");
var View = require("./view");

/**
 * Composite view may add child view in it
 * @class CompositeView
 * @extends View
 */
Class.define("{Framework}.ui.view.CompositeView", View, {
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
     * Destructor that destroy a composite view
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

    set needRelayout(value) {
        this._needRelayout = value;
        this.invalidate();
    },

    /**
     * @name CompositeView#layout
     * @type {Layout}
     * @description layout for children of the view.
     */
    get layout() {
        return this._layout;
    },

    set layout(value) {
        if (value === null && this._layout !== null) {
            var length = this._children.length;
            for (var i = 0; i < length; i++) {
                var view = this._children[i];
                view.resetToNoLayout();
            }
            this._needRelayout = false;
            this._layout.setView(null);
            this._layout = null;
        } else if (value !== null) {
            this._needRelayout = true;
            this._layout = value;
            this._layout.setView(this);
        }
        this.invalidate();
    },

    /**
     * @name CompositeView#children
     * @type {Array<View>}
     * @description children array of the view.
     * @readOnly
     */
    get children() {
        return this._children;
    },

    /**
     * Paint the composite view itself.
     * @method CompositeView#paint
     * @param {Context} context - the canvas context to which it is rendered
     * @protected
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
     * @method CompositeView#paint
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
     * The appendChild method adds a view to specified parent view.
     * @method CompositeView#addChild
     * @param {View} view sub child view to be insert to the last, and show at top
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
     * @param {View} view - the child view to add
     * @param {Number} index - the position at which to add the child
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
     * @param {View} child - the child view to remove, or the position in this composite view to remove
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
     * Remove all child views from this composite view.
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
     * @param {View} view - the child to bring to the top of the z order
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
     * @param {View} view - the child to bring to the bottom of the z order
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
     * Find the view at the point
     * @method CompositeView#findViewAtPoint
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

        var x = this._left;
        var y = this._top;
        if (this._parent !== null) {
            x -= this._parent.scrollX;
            y -= this._parent.scrollY;
        }

        point.offset(-x, -y);
        var findChild = this;
        var length = this._children.length;
        for (var i = length - 1; i >= 0; i--) {
            var child = this._children[i].findViewAtPoint(point);
            if (child !== null) {
                findChild = child;
                break;
            }
        }
        point.offset(x, y);
        return findChild;
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

    relayout: function(self) {
        if (self) {
            this.needRelayout = true;
        }
        View.prototype.relayout.call(this, self);
    }
}, module);
