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
Class.define("framework.h5.view.CompositeView", View, {
    /**
     * Constructor that create a composite view
     * @method CompositeView#initialize
     */
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this._children = [];
    },

    /**
     * Destructor that destroy this composite view
     * @method CompositeView#destroy
     */
    destroy: function() {
        this._children = null;

        View.prototype.destroy.apply(this, arguments);
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

        if (view.parent !== null) {
            throw "The view is still contained by another composite view. Need to remove from it first.";
        }

        this.dispatchEvent("childwilladd", view);
        view.dispatchEvent("willadd");

        this._element.appendChild(view.element);

        this._children.push(view);
        view.parent = this;

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

        if (view.parent !== null) {
            throw "The view is still contained by another composite view. Need to remove from it first.";
        }

        this.dispatchEvent("childwilladd", view, index);
        view.dispatchEvent("willadd", index);

        this._element.insertBefore(view.element, this._children[index].element);

        this._children.splice(index, 0, view);
        view.parent = this;

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

        this._element.removeChild(view.element);

        this._children.splice(index, 1);
        view.parent = null;

        this.dispatchEvent("childremoved", view);
        view.dispatchEvent("removed");
    },

    /**
     * Remove all children views from this composite view.
     * @method CompositeView#removeAllChildren
     */
    removeAllChildren: function() {
        this._children.splice(0, this._children.length);
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
    }
}, module);
