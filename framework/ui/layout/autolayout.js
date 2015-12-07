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
    /**
     * Constructor that create an auto layout.
     * @method AutoLayout#initialize
     */
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);

        this._autoLayoutView = new AutoLayoutJS.View({});
        this._constraints = [];
        this._paddingLeft = 0;
        this._paddingRight = 0;
        this._paddingTop = 0;
        this._paddingBottom = 0;
    },

    /**
     * Destructor that destroy this auto layout.
     * @method AutoLayout#destroy
     */
    destroy: function() {
        this._autoLayoutView = null;
        this._constraints = null;

        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * Add constraint definitions for this auto layout.
     * The constraint must follow the Extended Visual Format Language (EVFL).
     * @method AutoLayout#addConstraints
     * @param {String[]} constraints - an array of constraint definitions.
     */
    addConstraints: function(constraints) {
        for (var i = 0; i < constraints.length; i++) {
            this._constraints.push(constraints[i]);
        }
        this._autoLayoutView.addConstraints(AutoLayoutJS.VisualFormat.parse(this._constraints, {extended: true}));
    },

    /**
     * Add a constraint definition for this auto layout.
     * The constraint must follow the Extended Visual Format Language (EVFL).
     * @method AutoLayout#addConstraint
     * @param {String} constraint - the constraint definition.
     */
    addConstraint: function(constraint) {
        this._constraints.push(constraint);
    },

    /**
     * @name AutoLayout#paddingLeft
     * @type {Number}
     * @description the left padding to the left side of the associated composite view.
     */
    get paddingLeft() {
        return this._paddingLeft;
    },

    set paddingLeft(value) {
        this._paddingLeft = value;
        this.invalidate();
    },

    /**
     * @name AutoLayout#paddingRight
     * @type {Number}
     * @description the right padding to the right side of the associated composite view.
     */
    get paddingRight() {
        return this._paddingRight;
    },

    set paddingRight(value) {
        this._paddingRight = value;
        this.invalidate();
    },

    /**
     * @name AutoLayout#paddingTop
     * @type {Number}
     * @description the top padding to the top side of the associated composite view.
     */
    get paddingTop() {
        return this._paddingTop;
    },

    set paddingTop(value) {
        this._paddingTop = value;
        this.invalidate();
    },

    /**
     * @name AutoLayout#paddingBottom
     * @type {Number}
     * @description the bottom padding to the bottom side of the associated composite view.
     */
    get paddingBottom() {
        return this._paddingBottom;
    },

    set paddingBottom(value) {
        this._paddingBottom = value;
        this.invalidate();
    },

    /**
     * Get the layout param value for the child view at index.
     * @method AutoLayout#getLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @override
     */
    getLayoutParam: function(index, attribute) {
    },

    /**
     * Set the layout param value for the child view at index.
     * @method AutoLayout#setLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @param {Object} constraint - the constraint value in layout param.
     * @protected
     * @override
     */
    setLayoutParam: function(index, attribute, constraint) {
    },

    /**
     * Remove the layout param value for the child view at index.
     * @method AutoLayout#removeLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @override
     */
    removeLayoutParam: function(index, attribute) {
    },

    /**
     * Measure the auto layout for the associated view.
     * @method AutoLayout#measure
     * @param {Object[]} originPositions - the original positions of each child view in the associated view.
     * @return {Object[]} the new positions of each child view in the associated view.
     * @protected
     * @override
     */
    measure: function(/*originPositions*/) {
        var newPositions = [];
        this._autoLayoutView.setSize(this._associatedView.width, this._associatedView.height);
        this._autoLayoutView.setSpacing([this._paddingTop, this._paddingRight, this._paddingBottom, this._paddingLeft, 0, 0, 0]);
        var length = this._associatedView.children.length;
        for (var i = 0; i < length; i++) {
            var autoLayoutJSSubView = this._autoLayoutView.subViews["child" + (i + 1)];
            var newPosition = {
                left: autoLayoutJSSubView.left,
                top: autoLayoutJSSubView.top,
                width: autoLayoutJSSubView.width,
                height: autoLayoutJSSubView.height
            };
            newPositions.push(newPosition);
        }
        return newPositions;
    }
}, module);
