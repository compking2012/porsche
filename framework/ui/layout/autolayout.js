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
var Layout = require("./layout");
var AutoLayoutJS = require("./autolayout/autolayout");
var AutoLayoutParam = require("./autolayoutparam");

/**
 * Auto layout that layouts the child views in associated composite view, following the constraints.
 * @class AutoLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.AutoLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);

        this._autoLayoutView = new AutoLayoutJS.View({});
        this._constraints = [];
        this._paddingLeft = 0;
        this._paddingRight = 0;
        this._paddingTop = 0;
        this._paddingBottom = 0;
    },

    destroy: function() {
        this._autoLayoutView = null;
        this._constraints = null;

        Layout.prototype.destroy.apply(this, arguments);
    },

    addConstraints: function(constraints) {
        for (var i = 0; i < constraints.length; i++) {
            this._constraints.push(constraints[i]);
        }
        this._autoLayoutView.addConstraints(AutoLayoutJS.VisualFormat.parse(this._constraints, {extended: true}));
    },

    addConstraint: function(constraint) {
        this._constraints.push(constraint);
    },

    get paddingLeft() {
        return this._paddingLeft;
    },

    set paddingLeft(value) {
        this._paddingLeft = value;
    },

    get paddingRight() {
        return this._paddingRight;
    },

    set paddingRight(value) {
        this._paddingRight = value;
    },

    get paddingTop() {
        return this._paddingTop;
    },

    set paddingTop(value) {
        this._paddingTop = value;
    },

    get paddingBottom() {
        return this._paddingBottom;
    },

    set paddingBottom(value) {
        this._paddingBottom = value;
    },

    /**
     * @method AutoLayout#getLayoutParam
     * @description get layoutParams of child view at index
     * @abstract
     */
    getLayoutParam: function(index, attribute) {
    },

    /**
     * @method AutoLayout#setLayoutParam
     * @description set layoutParams of child view at index
     * @abstract
     */
    setLayoutParam: function(index, attribute, constraint) {
    },

    /**
     * @method AutoLayout#removeLayoutParam
     * @description remove layoutParams of child view at index
     * @abstract
     */
    removeLayoutParam: function(index, attribute) {
    },

    perform: function() {
        this._autoLayoutView.setSize(this._associatedView.width, this._associatedView.height);
        this._autoLayoutView.setSpacing([this._paddingTop, this._paddingRight, this._paddingBottom, this._paddingLeft, 0, 0, 0]);
        for (var i = 0; i < this._associatedView.children.length; i++) {
            var view = this._associatedView.children[i];
            var autoLayoutJSSubView = this._autoLayoutView.subViews["child" + (i + 1)];
            view.left = autoLayoutJSSubView.left;
            view.top = autoLayoutJSSubView.top;
            view.width = autoLayoutJSSubView.width;
            view.height = autoLayoutJSSubView.height;
        }
    }
}, module);
