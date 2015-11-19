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
 * Base Layout for all the layouts
 * @class Layout
 * @extends YObject
 */
Class.define("framework.ui.layout.Layout", YObject, {
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._associatedView = null;
        this._childparam = [];
    },

    destroy: function() {
        this._associatedView = null;
        for (var i = 0; i < this._childparam.length; i++) {
            this._childparam[i] = null;
        }

        YObject.prototype.destroy.apply(this, arguments);
    },

    get view() {
        return this._associatedView;
    },

    get childparam() {
        return this._childparam;
    },

    /**
     * @method Layout#getLayoutParam
     * @description get childparam of child view at index
     * @abstract
     */
    getLayoutParam: function(/*index, attribute*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * @method Layout#setLayoutParam
     * @description set childparam of child view at index
     * @abstract
     */
    setLayoutParam: function(/*index, attribute, constraint*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * @method Layout#removeLayoutParam
     * @description remove childparam of child view at index
     * @abstract
     */
    removeLayoutParam: function(/*index, attribute*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * @method Layout#calculateFrame
     * @@description Handle view's layout
     * @abstract
     */
    perform: function() {
        // TO BE IMPLEMENTED
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
