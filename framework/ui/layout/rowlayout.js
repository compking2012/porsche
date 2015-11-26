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
var RowLayoutParam = require("./rowlayoutparam");

/**
 * Column Layout
 * @class RowLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.RowLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);

        this._paddingTop = 0;
        this._paddingBottom = 0;
        this._defaultParam = new RowLayoutParam(this);
    },

    destroy: function() {
        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name RowLayout#paddingTop
     * @type {Number}
     * @description 
     */
    get paddingTop() {
        return this._paddingTop;
    },

    set paddingTop(value) {
        this._paddingTop = value;
        this.invalidate();
    },

    /**
     * @name RowLayout#paddingBottom
     * @type {Number}
     * @description 
     */
    get paddingBottom() {
        return this._paddingBottom;
    },

    set paddingBottom(value) {
        this._paddingBottom = value;
        this.invalidate();
    },

    /**
     * @name RowLayout#defaultLayoutParam
     * @type {Number}
     * @description 
     */
    set defaultLayoutParam(constraint) {
        for (var property in constraint) {
            if (constraint.hasOwnProperty(property)) {
                if (property === "align") {
                    switch (constraint[property]) {
                        case "left":
                            this._defaultParam.alignLeft = true;
                            break;
                        case "right":
                            this._defaultParam.alignRight = true;
                            break;
                        case "center":
                            this._defaultParam.alignCenter = true;
                            break;
                        case "top":
                            this._defaultParam.alignTop = true;
                            break;
                        case "bottom":
                            this._defaultParam.alignBottom = true;
                            break;
                        case "middle":
                            this._defaultParam.alignMiddle = true;
                            break;
                        case "fill-parent":
                            this._defaultParam.alignLeft = true;
                            this._defaultParam.alignRight = true;
                            break;
                    }
                } else if (property === "margin") {
                    for (var attr in constraint[property]) {
                        if (constraint[property].hasOwnProperty(attr)) {
                            switch (attr) {
                                case "left":
                                    this._defaultParam.alignLeft = true;
                                    this._defaultParam.marginLeft = constraint[property][attr];
                                    break;
                                case "right":
                                    this._defaultParam.alignRight = true;
                                    this._defaultParam.marginRight = constraint[property][attr];
                                    break;
                                case "center":
                                    this._defaultParam.alignCenter = true;
                                    this._defaultParam.marginCenter = constraint[property][attr];
                                    break;
                                case "top":
                                    this._defaultParam.alignTop = true;
                                    this._defaultParam.marginTop = constraint[property][attr];
                                    break;
                                case "bottom":
                                    this._defaultParam.alignBottom = true;
                                    this._defaultParam.marginBottom = constraint[property][attr];
                                    break;
                                case "middle":
                                    this._defaultParam.alignMiddle = true;
                                    this._defaultParam.marginMiddle = constraint[property][attr];
                                    break;
                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * @method RowLayout#getParamAtIndex
     * @param {Number} index of the child RowLayout
     * @description return the child RowLayout of index
     * @override
     */
    getLayoutParam: function(index, attribute) {
        if (this._childparam[index] === undefined) {
            throw "The required RowLayoutParam is not defined";
        } else {
            return this._childparam[index];
        }
    },

    /**
     * @method RowLayout#setLayoutParam
     * @param {Number} index - index for the ChildParam
     * @param {String} attribute - attribute string of "align", "margin" to set alignment/margins
     * @param {Object} constraint - the constraint of the RowLayout
     * @description Add new constranit of the RowLayout
     */
    setLayoutParam: function(index, attribute, constraint) {
        if (this._childparam[index] === undefined) {
            this._childparam[index] = new RowLayoutParam(this);
        }
        if (attribute === "align") {
            for (var property in constraint) {
                if (constraint.hasOwnProperty(property)) {
                    switch (property) {
                        case "left":
                            this._childparam[index].alignLeft = true;
                            break;
                        case "right":
                            this._childparam[index].alignRight = true;
                            break;
                        case "center":
                            this._childparam[index].alignCenter = true;
                            break;
                        case "top":
                            this._childparam[index].alignTop = true;
                            break;
                        case "bottom":
                            this._childparam[index].alignBottom = true;
                            break;
                        case "middle":
                            this._childparam[index].alignMiddle = true;
                            break;
                        case "fill-parent":
                            this._childparam[index].alignLeft = true;
                            this._childparam[index].alignRight = true;
                            break;
                    }
                }
            }
        } else if (attribute === "margin") {
            for (var property in constraint) {
                if (constraint.hasOwnProperty(property)) {
                    if (typeof constraint[property] === "number") {
                        switch (property) {
                            case "left":
                                this._childparam[index].alignLeft = true;
                                this._childparam[index].marginLeft = constraint[property];
                                break;
                            case "right":
                                this._childparam[index].alignRight = true;
                                this._childparam[index].marginRight = constraint[property];
                                break;
                            case "center":
                                this._childparam[index].alignCenter = true;
                                this._childparam[index].marginCenter = constraint[property];
                                break;
                            case "top":
                                this._childparam[index].alignTop = true;
                                this._childparam[index].marginTop = constraint[property];
                                break;
                            case "bottom":
                                this._childparam[index].alignBottom = true;
                                this._childparam[index].marginBottom = constraint[property];
                                break;
                            case "middle":
                                this._childparam[index].alignMiddle = true;
                                this._childparam[index].marginMiddle = constraint[property];
                                break;
                        }
                    }
                }
            }
        } else {
            throw "The parameter error in function setLayoutParam";
        }
    },

    /**
     * @method RowLayout#perform
     * @description calculate position of all the children views
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
            var param = this._defaultParam;
            if (this._childparam[i] !== undefined) {
                param = this._childparam[i];
            }
            if (param.alignTop) {
                child.top = this._paddingTop + param.marginTop;
                if (param.alignBottom) {
                    child.height = this._associatedView.height - this._paddingTop - this._paddingBottom - param.marginTop - param.marginBottom;
                } else if (param.alignCenter) {
                    child.height = this._associatedView.height - this._paddingTop - this._paddingBottom + param.marginMiddle * 2;
                }
            } else if (param.alignBottom) {
                child.bottom = this._associatedView.height - this._paddingBottom - param.marginBottom;
                if (param.alignMiddle) {
                    child.height = (this._associatedView.height - this._paddingBottom - this._paddingTop) / 2 - param.marginTop + param.marginMiddle;
                }
            } else if (param.alignMiddle) {
                child.top = this._paddingTop + (this._associatedView.height - this._paddingTop - this._paddingBottom - child.height) / 2;
            } else {
                child.top = this._paddingTop + param.marginTop;
            }
            child.left = startPosition + param.marginLeft;
            if (param.alignLeft) {
                startPosition += param.marginLeft;
            } else if (param.alignRight) {
                startPosition += param.marginRight;
            }
            startPosition += child.width;
        }
    }
}, module);

});