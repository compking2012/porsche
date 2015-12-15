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
var YObject = require("../../yobject");

/**
 * Base class for all the layouts.
 * Note that this class is never used to instantiate directly.
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
        this._layoutParams = [];
    },

    /**
     * Destructor that destroy this layout.
     * @method Layout#destroy
     */
    destroy: function() {
        this._associatedView = null;
        for (var i = 0; i < this._layoutParams.length; i++) {
            this._layoutParams[i] = null;
        }

        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * @method Layout#layoutParams
     * @type {LayoutParam[]}
     * @description all layout params that indicates the layout of each views in the associated composite view.
     */
    get layoutParams() {
        return this._layoutParams;
    },

    perform: function() {
        var originPositions = this.getOriginPositions();
        var newPositions = this.measure(originPositions);
        this.setNewPositions(newPositions);
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
     * Remove the layout param value for the child view at index.
     * @method Layout#removeLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @abstract
     */
    removeLayoutParam: function(/*index, attribute*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Implement this to measure the layout for the associated view.
     * @method Layout#measure
     * @param {Object[]} originPositions - the original positions of each child view in the associated view.
     * @return {Object[]} the new positions of each child view in the associated view.
     * @protected
     * @abstract
     */
    measure: function(/*originPositions*/) {
        // TO BE IMPLEMENTED
    },

    getOriginPositions: function() {
        var originPositions = [];
        var length = this._associatedView.children.length;
        for (var i = 0; i < length; i++) {
            var child = this._associatedView.children[i];
            originPositions.push({
                left: child.left,
                top: child.top,
                width: child.width,
                height: child.height
            });
        }

        return originPositions;
    },

    setNewPositions: function(newPositions) {
        var length = this._associatedView.children.length;
        for (var i = 0; i < length; i++) {
            var child = this._associatedView.children[i];
            child.left = newPositions[i].left;
            child.top = newPositions[i].top;
            child.width = newPositions[i].width;
            child.height = newPositions[i].height;
        }
    },

    /**
     * @name Layout#associatedView
     * @type {CompositeView}
     * @description the current layout for the  parametric compositeview.
     * @private
     */
    get associatedView() {
        return this._associatedView;
    },

    set associatedView(value) {
        this._associatedView = value;

        var length = this._associatedView.children.length;
        for (var i = 0; i < length; i++) {
            var child = this._associatedView.children[i];
            if (this._associatedView !== null) {
                child.saveAbsoluteInfo();
            } else {
                child.resetToNoLayout();
            }
        }
    },

    /**
     * Mark the associated view need to relayout.
     * @method Layout#invalidate
     * @private
     */
    invalidate: function() {
        if (this._associatedView !== null) {
            this._associatedView.needRelayout = true;
        }
    }
}, module);

});