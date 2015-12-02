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
var Layout = require("./layout");
var ColumnLayoutParam = require("./columnlayoutparam");

/**
 * Column layout that layouts the child views in associated composite view one by one, as a column.
 * @class ColumnLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.ColumnLayout", Layout, {
    /**
     * Constructor that create a column layout.
     * @method ColumnLayout#initialize
     */
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);

        this._paddingLeft = 0;
        this._paddingRight = 0;
        this._defaultLayoutParam = new ColumnLayoutParam(this);
    },

    /**
     * Destructor that destroy this column layout.
     * @method ColumnLayout#destroy
     */
    destroy: function() {
        this._defaultLayoutParam.destroy();
        this._defaultLayoutParam = null;

        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ColumnLayout#paddingLeft
     * @type {Number}
     * @description the left padding between the left side of the associated composite view
     * and the first cell view.
     */
    get paddingLeft() {
        return this._paddingLeft;
    },

    set paddingLeft(value) {
        this._paddingLeft = value;
        this.invalidate();
    },

    /**
     * @name ColumnLayout#paddingRight
     * @type {Number}
     * @description the right padding between the right side of the associated composite view
     * and the last cell view.
     */
    get paddingRight() {
        return this._paddingRight;
    },

    set paddingRight(value) {
        this._paddingRight = value;
        this.invalidate();
    },

    /**
     * @name ColumnLayout#defaultLayoutParam
     * @type {Number}
     * @description the default layout param for the cell view.
     */
    set defaultLayoutParam(constraint) {
        for (var property in constraint) {
            if (property === "align") {
                switch (constraint[property]) {
                    case "left":
                        this._defaultLayoutParam.alignLeft = true;
                        break;
                    case "right":
                        this._defaultLayoutParam.alignRight = true;
                        break;
                    case "center":
                        this._defaultLayoutParam.alignCenter = true;
                        break;
                    case "top":
                        this._defaultLayoutParam.alignTop = true;
                        break;
                    case "bottom":
                        this._defaultLayoutParam.alignBottom = true;
                        break;
                    case "middle":
                        this._defaultLayoutParam.alignMiddle = true;
                        break;
                    case "fill-parent":
                        this._defaultLayoutParam.alignLeft = true;
                        this._defaultLayoutParam.alignRight = true;
                        break;
                }
            } else if (property === "margin") {
                for (var attr in constraint[property]) {
                    switch (attr) {
                        case "left":
                            this._defaultLayoutParam.alignLeft = true;
                            this._defaultLayoutParam.marginLeft = constraint[property][attr];
                            break;
                        case "right":
                            this._defaultLayoutParam.alignRight = true;
                            this._defaultLayoutParam.marginRight = constraint[property][attr];
                            break;
                        case "center":
                            this._defaultLayoutParam.alignCenter = true;
                            this._defaultLayoutParam.marginCenter = constraint[property][attr];
                            break;
                        case "top":
                            this._defaultLayoutParam.alignTop = true;
                            this._defaultLayoutParam.marginTop = constraint[property][attr];
                            break;
                        case "bottom":
                            this._defaultLayoutParam.alignBottom = true;
                            this._defaultLayoutParam.marginBottom = constraint[property][attr];
                            break;
                        case "middle":
                            this._defaultLayoutParam.alignMiddle = true;
                            this._defaultLayoutParam.marginMiddle = constraint[property][attr];
                            break;
                    }
                }
            }
        }
    },

    /**
     * Get the layout param value for the child view at index.
     * @method ColumnLayout#getLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @override
     */
    getLayoutParam: function(index, attribute) {
        if (this._layoutParams[index] === undefined) {
            throw "The required ColumnLayoutParam is not defind";
        } else {
            return this._layoutParams[index];
        }
    },

    /**
     * Set the layout param value for the child view at index.
     * @method ColumnLayout#setLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @param {Object} constraint - the constraint value in layout param.
     * @protected
     * @override
     */
    setLayoutParam: function(index, attribute, constraint) {
        if (this._layoutParams[index] === undefined) {
            this._layoutParams[index] = new ColumnLayoutParam(this);
        }
        if (attribute === "align") {
            for (var property in constraint) {
                switch (property) {
                    case "left":
                        this._layoutParams[index].alignLeft = true;
                        break;
                    case "right":
                        this._layoutParams[index].alignRight = true;
                        break;
                    case "center":
                        this._layoutParams[index].alignCenter = true;
                        break;
                    case "top":
                        this._layoutParams[index].alignTop = true;
                        break;
                    case "bottom":
                        this._layoutParams[index].alignBottom = true;
                        break;
                    case "middle":
                        this._layoutParams[index].alignMiddle = true;
                        break;
                    case "fill-parent":
                        this._layoutParams[index].alignLeft = true;
                        this._layoutParams[index].alignRight = true;
                        break;
                }
            }
        } else if (attribute === "margin") {
            for (var property in constraint) {
                if (typeof constraint[property] === "number") {
                    switch (property) {
                        case "left":
                            this._layoutParams[index].alignLeft = true;
                            this._layoutParams[index].marginLeft = constraint[property];
                            break;
                        case "right":
                            this._layoutParams[index].alignRight = true;
                            this._layoutParams[index].marginRight = constraint[property];
                            break;
                        case "center":
                            this._layoutParams[index].alignCenter = true;
                            this._layoutParams[index].marginCenter = constraint[property];
                            break;
                        case "top":
                            this._layoutParams[index].alignTop = true;
                            this._layoutParams[index].marginTop = constraint[property];
                            break;
                        case "bottom":
                            this._layoutParams[index].alignBottom = true;
                            this._layoutParams[index].marginBottom = constraint[property];
                            break;
                        case "middle":
                            this._layoutParams[index].alignMiddle = true;
                            this._layoutParams[index].marginMiddle = constraint[property];
                            break;
                    }
                }
            }
        } else {
            throw "The parameter error in function setLayoutParam";
        }
    },

    /**
     * Remove the layout param value for the child view at index.
     * @method ColumnLayout#removeLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @override
     */
    removeLayoutParam: function(/*index, attribute*/) {
        // TODO
    },

    /**
     * Perform the column layouting for the associated view.
     * @method ColumnLayout#perform
     * @protected
     * @override
     */
    perform: function() {
        var startPosition = 0;
        for (var i = 0; i < this._associatedView.children.length; i++) {
            var child = this._associatedView.children[i];
            child.saveAbsoluteInfo();
        }
        for (var i = 0; i < this._associatedView.children.length; i++) {
            var child = this._associatedView.children[i];
            var param = this._defaultLayoutParam;
            if (this._layoutParams[i] !== undefined) {
                param = this._layoutParams[i];
            }
            if (param.alignLeft) {
                child.left = this._paddingLeft + param.marginLeft;
                if (param.alignRight) {
                    child.width = this._associatedView.width - this._paddingLeft - this._paddingRight - param.marginLeft - param.marginRight;
                } else if (param.alignCenter) {
                    child.width = this._associatedView.width - this._paddingLeft - this._paddingRight + param.marginCenter * 2;
                }
            } else if (param.alignRight) {
                child.right = this._associatedView.width - this._paddingRight - param.marginRight;
                if (param.alignCenter) {
                    child.width = (this._associatedView.width - this._paddingRight - this._paddingLeft) / 2 - param.marginLeft + param.marginCenter;
                }
            } else if (param.alignCenter) {
                child.left = this._paddingLeft + (this._associatedView.width - this._paddingLeft - this._paddingRight - child.width) / 2;
            } else {
                child.left = this._paddingLeft + param.marginLeft;
            }
            child.top = startPosition + param.marginTop;
            if (param.alignTop) {
                startPosition += param.marginTop;
            } else if (param.alignBottom) {
                startPosition += param.marginBottom;
            }
            startPosition += child.height;
        }
    }
}, module);

});