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

/**
 * Window class
 * @class Window
 * @extends CompositeView
 */
Class.define("framework.ui.view.Window", CompositeView, {
    /**
     * Constructor that create a window
     * @method Window#initialize
     */
    initialize: function(title) {
        CompositeView.prototype.initialize.apply(this, arguments);

        this._title = title;
        this._windowManager = null;
    },

    /**
     * Destructor that destroy a view
     * @method Window#destroy
     */
    destroy: function() {
        this._windowManager.destroy();
        this._windowManager = null;

        CompositeView.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Window#title
     * @type {String}
     * @description The title of a window
     */
    get title() {
        return this._title;
    },

    set title(value) {
        this.setProperty("title", value);
    },

    /**
     * Paint the window itself.
     * @method Window#paint
     * @param {Context} context - the canvas context to which it is rendered
     * @protected
     */
    paint: function(context) {
        if (context !== null) {
            context.clearRect(this._dirtyRect.left, this._dirtyRect.top, this._dirtyRect.width, this._dirtyRect.height);
        }

        CompositeView.prototype.paint.call(this, context);
    },

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

        if (this._windowManager !== null) {
            this._windowManager.draw();
        }
    },

    /**
     * @name Window#windowManager
     * @type {WindowManager}
     * @description the window manager which assoicated with this window
     * @private
     */
    get windowManager() {
        return this._windowManager;
    },

    set windowManager(value) {
        this._windowManager = value;
    }
}, module);
