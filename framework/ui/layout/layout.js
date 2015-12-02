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
var YObject = require("../../yobject");

/**
 * Base class for all the layouts
 * @class Layout
 * @extends YObject
 */
Class.define("framework.ui.layout.Layout", YObject, {
    /**
     * Constructor that create a layout.
     * @method Layout#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._associatedView = null;
        this._childparam = [];
    },

    /**
     * Destructor that destroy this layout.
     * @method Layout#destroy
     */
    destroy: function() {
        this._associatedView = null;
        for (var i = 0; i < this._childparam.length; i++) {
            this._childparam[i] = null;
        }

        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * Get the layout param value for the child view at index.
     * @method Layout#getLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @abstract
     */
    getLayoutParam: function(/*index, attribute*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Set the layout param value for the child view at index.
     * @method Layout#setLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @param {Object} constraint - the constraint value in layout param.
     * @protected
     * @abstract
     */
    setLayoutParam: function(/*index, attribute, constraint*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Remove childparam of child view at index.
     * @method Layout#removeLayoutParam
     * @abstract
     */
    removeLayoutParam: function(/*index, attribute*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * @@description Handle view's layout
     * @method Layout#calculateFrame
     * @abstract
     */
    perform: function() {
        // TO BE IMPLEMENTED
    },

    get view() {
        return this._associatedView;
    },

    get childparam() {
        return this._childparam;
    },

    /**
     * set the current layout for the  parametric compositeview
     * @method Layout#setView
     * @private
     */
    setView: function(view) {
        this._associatedView = view;

        if (view !== null) {
            for (var i = 0; i < this._associatedView.children.length; i++) {
                var child = this._associatedView.children[i];
                child.saveAbsoluteInfo();
            }
        }
    },

    /**
     * set the current layout for the  parametric compositeview
     * @method Layout#setView
     * @private
     */
    invalidate: function() {
        if (this._associatedView !== null) {
            this._associatedView.needRelayout = true;
        }
    }
}, module);
