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
Class.define("framework.h5.view.Window", CompositeView, {
    /**
     * Constructor that create a window
     * @method Window#initialize
     */
    initialize: function(title) {
        CompositeView.prototype.initialize.apply(this, arguments);

        this._title = title;
        this._windowManager = null;
        this._element = document.body;
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
