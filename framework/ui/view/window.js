define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var CompositeView = require("./compositeview");

/**
 * Window class
 * @class Window
 * @extends CompositeView
 */
Class.define("framework.ui.view.Window", CompositeView, {
    /**
     * Constructor
     * @method Window#initialize
     */
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);
        this._windowManager = null;
        this._activeView = null;
    },

    /**
     * Destructor
     * @method Window#destroy
     */
    destroy: function() {
        this._windowManager.destroy();
        this._windowManager = null;
        this._activeView = null;
        CompositeView.prototype.destroy.apply(this, arguments);
    },

    /**
     * Paint the composite view itself.
     * @method CompositeView#paint
     * @param {Context} context - the canvas context to which it is rendered
     * @protected
     */
    paint: function(context) {
        context.clearRect(this._dirtyRect.left, this._dirtyRect.top, this._dirtyRect.width, this._dirtyRect.height);
        CompositeView.prototype.paint.call(this, context);
    },

    // viewDebug: function(context) {
    // },

    /**
     * Mark the area defined by dirty as needing to be drawn and start drawing
     * @method Window#invalidate
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
     */
    invalidate: function(rect) {
        if (rect === undefined) {
            rect = this.getBounds();
        }

        CompositeView.prototype.invalidate.call(this, rect);
        this.invalidateChild(this, rect);
    },

    /**
     * Mark the all the specified view overlapped children as dirty and start drawing.
     * @method Window#invalidateChild
     * @param {View} view - the specified view
     * @param {Rectangle} [rect] - the rectangle representing the bounds of the dirty region
     * @protected
     */
    invalidateChild: function(view, rect) {
        CompositeView.prototype.invalidateChild.call(this, view, rect);
        this._windowManager.draw();
    }
}, module);

});
