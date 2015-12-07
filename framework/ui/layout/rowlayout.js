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
 * Row layout that layouts the child views in associated composite view one by one, as a row.
 * @class RowLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.RowLayout", Layout, {
    /**
     * Constructor that create a row layout.
     * @method RowLayout#initialize
     */
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);

        this._paddingTop = 0;
        this._paddingBottom = 0;
        this._defaultLayoutParam = new RowLayoutParam(this);
    },

    /**
     * Destructor that destroy this row layout.
     * @method RowLayout#destroy
     */
    destroy: function() {
        this._defaultLayoutParam.destroy();
        this._defaultLayoutParam = null;

        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name RowLayout#paddingTop
     * @type {Number}
     * @description the top padding between the top side of the associated composite view
     * and the first cell view.
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
     * @description the bottom padding between the bottom side of the associated composite view
     * and the last cell view.
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
     * @description the default layout param for the cell view.
     */
    get defaultLayoutParam() {
        return this._defaultLayoutParam;
    },

    set defaultLayoutParam(constraint) {
        for (var property in constraint) {
            if (constraint.hasOwnProperty(property)) {
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
                        if (constraint[property].hasOwnProperty(attr)) {
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
            }
        }
    },

    /**
     * Get the layout param value for the child view at index.
     * @method RowLayout#getLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @override
     */
    getLayoutParam: function(index, attribute) {
        if (this._layoutParams[index] === undefined) {
            throw "The required RowLayoutParam is not defined";
        } else {
            return this._layoutParams[index];
        }
    },

    /**
     * Set the layout param value for the child view at index.
     * @method RowLayout#setLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @param {Object} constraint - the constraint value in layout param.
     * @protected
     * @override
     */
    setLayoutParam: function(index, attribute, constraint) {
        if (this._layoutParams[index] === undefined) {
            this._layoutParams[index] = new RowLayoutParam(this);
        }
        if (attribute === "align") {
            for (var property in constraint) {
                if (constraint.hasOwnProperty(property)) {
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
            }
        } else if (attribute === "margin") {
            for (var property in constraint) {
                if (constraint.hasOwnProperty(property)) {
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
            }
        } else {
            throw "The parameter error in function setLayoutParam";
        }
    },

    /**
     * Remove the layout param value for the child view at index.
     * @method RowLayout#removeLayoutParam
     * @param {Number} index - the index of the child view.
     * @param {String} attribute - the attribute in layout param.
     * @protected
     * @override
     */
    removeLayoutParam: function(/*index, attribute*/) {
        // TODO
    },

    /**
     * Measure the row layout for the associated view.
     * @method RowLayout#measure
     * @param {Object[]} originPositions - the original positions of each child view in the associated view.
     * @return {Object[]} the new positions of each child view in the associated view.
     * @protected
     * @override
     */
    measure: function(originPositions) {
        var startPosition = 0;
        var newPositions = [];
        var length = originPositions.length;
        for (var i = 0; i < length; i++) {
            var originPosition = originPositions[i];
            var newPosition = {
                left: originPosition.left,
                top: originPosition.top,
                width: originPosition.width,
                height: originPosition.height
            };
            var param = this._defaultLayoutParam;
            if (this._layoutParams[i] !== undefined) {
                param = this._layoutParams[i];
            }
            if (param.alignTop) {
                newPosition.top = this._paddingTop + param.marginTop;
                if (param.alignBottom) {
                    newPosition.height = this._associatedView.height - this._paddingTop - this._paddingBottom - param.marginTop - param.marginBottom;
                } else if (param.alignCenter) {
                    newPosition.height = this._associatedView.height - this._paddingTop - this._paddingBottom + param.marginMiddle * 2;
                }
            } else if (param.alignBottom) {
                newPosition.bottom = this._associatedView.height - this._paddingBottom - param.marginBottom;
                if (param.alignMiddle) {
                    newPosition.height = (this._associatedView.height - this._paddingBottom - this._paddingTop) / 2 - param.marginTop + param.marginMiddle;
                }
            } else if (param.alignMiddle) {
                newPosition.top = this._paddingTop + (this._associatedView.height - this._paddingTop - this._paddingBottom - newPosition.height) / 2;
            } else {
                newPosition.top = this._paddingTop + param.marginTop;
            }
            newPosition.left = startPosition + param.marginLeft;
            if (param.alignLeft) {
                startPosition += param.marginLeft;
            } else if (param.alignRight) {
                startPosition += param.marginRight;
            }
            startPosition += newPosition.width;
            newPositions.push(newPosition);
        }
        return newPositions;
    }
}, module);
