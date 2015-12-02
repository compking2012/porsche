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
var RelativeLayoutParam = require("./relativelayoutparam");

/**
 * Relative layout that can automatically calculate the position of the specified child views
 * of an associated composite view based on the specified constraints.
 * @class RelativeLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.RelativeLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);

        this._units = 0;
    },

    destroy: function() {
        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * @method RelativeLayout#getLayoutParam
     * @param {Number} index - the index of the child layout param.
     * @description return the child RelativeLayout of index
     * @override
     */
    getLayoutParam: function(index, attribute) {
        if (this._layoutParams[index] === undefined) {
            throw "The RelativeLayoutParam required is not defind";
        }
        var child = this._layoutParams[index];
        if (attribute === "align") {
            return child.getAlignAttribute();
        } else if (attribute === "margin") {
            return child.getMarginAttribute();
        } else {
            throw "The attribute param incorrect in getLayoutParam";
        }
    },

    /**
     * @method RelativeLayout#setLayoutParam
     * @param {Number} index - index for the layoutParams
     * @param {String} attribute - attribute string of "align", "margin" to set alignment/margins
     * @param {Object} constraint - the constraint of the relativelayout
     * @description Add new constranit of the relativelayout
     */
    setLayoutParam: function(index, attribute, constraint) {
        if (this._layoutParams[index] === undefined) {
            this._layoutParams[index] = new RelativeLayoutParam(this);
            if (this._units < index) {
                this._units = index;
            }
        }
        if (attribute === "align") {
            for (var property in constraint) {
                var referenceView = "parent";
                var side = "";
                if (typeof constraint[property] === "number") {
                    referenceView = constraint[property];
                } else if (typeof constraint[property] === "object") {
                    for (var insideProperty in constraint[property]) {
                        if (insideProperty === "target") {
                            referenceView = constraint[property][insideProperty];
                        } else if (insideProperty === "side") {
                            side = constraint[property][insideProperty];
                        }
                    }
                }
                if (referenceView === "parent") {
                    referenceView = -1;
                }
                if (this._units < referenceView) {
                    this._units = referenceView;
                }
                switch (property) {
                    case "left":
                        this._layoutParams[index].alignLeft = true;
                        this._layoutParams[index].alignTargetLeft = referenceView;
                        this._layoutParams[index].alignSideLeft = side === "" ? "left" : side;
                        break;
                    case "right":
                        this._layoutParams[index].alignRight = true;
                        this._layoutParams[index].alignTargetRight = referenceView;
                        this._layoutParams[index].alignSideRight = side === "" ? "right" : side;
                        break;
                    case "center":
                        this._layoutParams[index].alignCenter = true;
                        this._layoutParams[index].alignTargetCenter = referenceView;
                        this._layoutParams[index].alignSideCenter = side === "" ? "center" : side;
                        break;
                    case "top":
                        this._layoutParams[index].alignTop = true;
                        this._layoutParams[index].alignTargetTop = referenceView;
                        this._layoutParams[index].alignSideTop = side === "" ? "top" : side;
                        break;
                    case "bottom":
                        this._layoutParams[index].alignBottom = true;
                        this._layoutParams[index].alignTargetBottom = referenceView;
                        this._layoutParams[index].alignSideBottom = side === "" ? "bottom" : side;
                        break;
                    case "middle":
                        this._layoutParams[index].alignMiddle = true;
                        this._layoutParams[index].alignTargetMiddle = referenceView;
                        this._layoutParams[index].alignSideMiddle = side === "" ? "middle" : side;
                        break;
                }
            }
        } else if (attribute === "margin") {
            for (var property in constraint) {
                if (typeof constraint[property] === "number") {
                    switch (property) {
                        case "left":
                            this._layoutParams[index].marginLeft = constraint[property];
                            break;
                        case "right":
                            this._layoutParams[index].marginRight = constraint[property];
                            break;
                        case "top":
                            this._layoutParams[index].marginTop = constraint[property];
                            break;
                        case "bottom":
                            this._layoutParams[index].marginBottom = constraint[property];
                            break;
                        case "center":
                            this._layoutParams[index].marginCenter = constraint[property];
                            break;
                        case "middle":
                            this._layoutParams[index].marginMiddle = constraint[property];
                            break;
                    }
                } else {
                    throw "The type of margins in setLayoutParam should be Number";
                }
            }
        } else {
            throw "The parameter error in function setLayoutParam";
        }
    },

    /**
     * @method RelativeLayout#removeLayoutParam
     * @param {Number} index - index for the layoutParams
     * @param {String} attribute - attribute string of "align", "margin" to set alignment/margins
     * @description remove "align" or "margin" attribute of layoutParams at index
     */
    removeLayoutParam: function(index, attribute) {
        if (this._layoutParams[index] !== undefined) {
            var param = this._layoutParams[index];
            if (attribute === "align") {
                param.removeAlignAttribute();
            } else if (attribute === "margin") {
                param.removeMarginAttribute();
            }
        }
    },

    /**
     * @method RelativeLayout#perform
     * @description calculate position for all children views
     * @override
     */
    perform: function() {
        var hasCircle = this.checkCircle();
        if (hasCircle) {
            throw "There is a circle reference in constraints";
        }

        var horizontalList = [];
        var verticalList = [];
        var list = [];
        var waitNum = this._associatedView.children.length;
        for (var i = 0; i <= this._units; i++) {
            horizontalList[i] = false;
            verticalList[i] = false;
            list[i] = false;
            if (this._layoutParams[i] === undefined) {
                horizontalList[i] = true;
                verticalList[i] = true;
                list[i] = true;
                waitNum--;
            } else if (this._layoutParams[i] !== undefined) {
                var param = this._layoutParams[i];
                if (param.alignLeft && param.alignTargetLeft === -1 || param.alignRight && param.alignTargetRight === -1 || param.alignCenter && param.alignTargetCenter === -1) {
                    horizontalList[i] = true;
                }
                if (param.alignTop && param.alignTargetTop === -1 || param.alignBottom && param.alignTargetBottom === -1 || param.alignMiddle && param.alignTargetMiddle === -1) {
                    verticalList[i] = true;
                }
                if (horizontalList[i] && verticalList[i]) {
                    list[i] = true;
                    waitNum--;
                    this.calculatePositionAtIndex(i);
                }
            }
        }
        this.iterationCalculate(waitNum, horizontalList, verticalList, list);
    },

    /**
     * @method RelativeLayout#getReferencePositonInfo
     * @description get reference position info
     * @private
     */
    getReferencePositonInfo: function(referenceSide, referenID) {
        var l, t, width, height;
        if (referenID === -1) {
            l = 0;
            t = 0;
            width = this._associatedView.width;
            height = this._associatedView.height;
        } else if (this._associatedView.children[referenID] === undefined) {
            l = 0;
            t = 0;
            width = 0;
            height = 0;
        } else {
            l = this._associatedView.children[referenID].left;
            t = this._associatedView.children[referenID].top;
            width = this._associatedView.children[referenID].width;
            height = this._associatedView.children[referenID].height;
        }
        switch (referenceSide) {
            case "left":
                return l;
            case "right":
                return l + width;
            case "center":
                return l + width / 2;
            case "top":
                return t;
            case "bottom":
                return t + height;
            case "middle":
                return t + height / 2;
        }
    },

    /**
     * @method RelativeLayout#calculatePositionAtIndex
     * @description calculate the specified position by index
     * @private
     */
    calculatePositionAtIndex: function(index) {
        if (this._layoutParams[index] !== undefined && this._associatedView.children[index] !== undefined) {
            var child = this._associatedView.children[index];
            var startPosition;
            var param = this._layoutParams[index];
            if (param.alignLeft) {
                startPosition = this.getReferencePositonInfo(param.alignSideLeft, param.alignTargetLeft);
                child.left = startPosition + param.marginLeft;
                if (param.alignRight) {
                    startPosition = this.getReferencePositonInfo(param.alignSideRight, param.alignTargetRight);
                    child.width = startPosition - param.marginRight - child.left;
                } else if (param.alignCenter) {
                    startPosition = this.getReferencePositonInfo(param.alignSideCenter, param.alignTargetCenter);
                    child.width = (startPosition + param.marginCenter - child.left) * 2;
                }
            } else if (param.alignRight) {
                var rightPosition, centerPosition;
                startPosition = this.getReferencePositonInfo(param.alignSideRight, param.alignTargetRight);
                rightPosition = startPosition - param.marginRight;
                if (param._alignCenter) {
                    startPosition = this.getReferencePositonInfo(param.alignSideCenter, param.alignTargetCenter);
                    centerPosition = startPosition + param.marginCenter;
                    child.width = (child.right - centerPosition) * 2;
                }
                child.left = rightPosition - child.width;
            } else if (param.alignCenter) {
                startPosition = this.getReferencePositonInfo(param.alignSideCenter, param.alignTargetCenter);
                child.left = startPosition + param.marginCenter - child.width / 2;
            }

            if (param.alignTop) {
                startPosition = this.getReferencePositonInfo(param.alignSideTop, param.alignTargetTop);
                child.top = startPosition + param.marginTop;
                if (param.alignBottom) {
                    startPosition = this.getReferencePositonInfo(param.alignSideBottom, param.alignTargetBottom);
                    child.height = startPosition - param.marginBottom - child.top;
                } else if (param.alignMiddle) {
                    startPosition = this.getReferencePositonparamInfo(param.alignSideMiddle, param.alignTargetMiddle);
                    child.height = (startPosition + param.marginMiddle - child.top) * 2;
                }
            } else if (param.alignBottom) {
                var bottomPosition, middlePosition;
                startPosition = this.getReferencePositonInfo(param.alignSideBottom, param.alignTargetBottom);
                bottomPosition = startPosition - param.marginBottom;
                if (param._alignMiddle) {
                    startPosition = this.getReferencePositonInfo(param.alignSideMiddle, param.alignTargetMiddle);
                    middlePosition = startPosition + param.marginMiddle;
                    child.height = (child.bottom - middlePosition) * 2;
                }
                child.top = bottomPosition - child.height;
            } else if (param.alignMiddle) {
                startPosition = this.getReferencePositonInfo(param.alignSideMiddle, param.alignTargetMiddle);
                child.top = startPosition + param.marginMiddle - child.height / 2;
            }
        }
    },

    /**
     * @method RelativeLayout#iterationCalculate
     * @description iterated to calculate
     * @private
     */
    iterationCalculate: function(waitNum, horizontalList, verticalList, list) {
        var flag = true;
        while (flag && waitNum > 0) {
            flag = false;
            for (var i = 0; i < this._associatedView.children.length; i++) {
                if (list[i]) {
                    continue;
                }
                if (this._layoutParams[i] === undefined) {
                    // if there is no constraint for current view deal as the views' absolute position
                    horizontalList[i] = true;
                    verticalList[i] = true;
                    list[i] = true;
                    waitNum--;
                    flag = true;
                } else {
                    // code here to calculate the other view's position
                    var param = this._layoutParams[i];
                    var left = param.alignLeft && (param.alignTargetLeft === -1 || horizontalList[param.alignTargetLeft]);
                    var center = param.alignCenter && (param.alignTargetCenter === -1 || horizontalList[param.alignTargetCenter]);
                    var right = param.alignRight && (param.alignTargetRight === -1 || horizontalList[param.alignTargetRight]);
                    var top = param.alignTop && (param.alignTargetTop === -1 || verticalList[param.alignTargetTop]);
                    var bottom = param.alignBottom && (param.alignTargetBottom === -1 || verticalList[param.alignTargetBottom]);
                    var middle = param.alignMiddle && (param.alignTargetMiddle === -1 || verticalList[param.alignTargetMiddle]);
                    if (left || center || right) {
                        if (param.alignLeft === left && param.alignRight === right || param.alignCenter === center) {
                            if (!horizontalList[i]) {
                                horizontalList[i] = true;
                                flag = true;
                            }
                        }
                    }
                    if (top || bottom || middle) {
                        if (param.alignTop === top && param.alignBottom === bottom || param.alignMiddle === middle) {
                            if (!verticalList[i]) {
                                verticalList[i] = true;
                                flag = true;
                            }
                        }
                    }
                    if (horizontalList[i] && verticalList[i]) {
                        list[i] = true;
                        this.calculatePositionAtIndex(i);
                        waitNum--;
                    }
                }
            }
        }
    },

    /**
     * @method RelativeLayout#checkCircle
     * @description check whether circle reference exists
     * @private
     */
    checkCircle: function() {
        var horizontalList = [];
        var verticalList = [];
        var list = [];
        var waitNum = this._units;
        for (var i = 0; i <= this._units; i++) {
            horizontalList[i] = false;
            verticalList[i] = false;
            list[i] = false;
            if (this._layoutParams[i] === undefined) {
                horizontalList[i] = true;
                verticalList[i] = true;
                list[i] = true;
                waitNum--;
            } else if (this._layoutParams[i] !== undefined) {
                if (this._layoutParams[i].alignLeft && this._layoutParams[i].alignTargetLeft === -1 || this._layoutParams[i].alignRight && this._layoutParams[i].alignTargetRight === -1 || this._layoutParams[i].alignCenter && this._layoutParams[i].alignTargetCenter === -1) {
                    horizontalList[i] = true;
                }
                if (this._layoutParams[i].alignTop && this._layoutParams[i].alignTargetTop === -1 || this._layoutParams[i].alignBottom && this._layoutParams[i].alignTargetBottom === -1 || this._layoutParams[i].alignMiddle && this._layoutParams[i].alignTargetMiddle === -1) {
                    verticalList[i] = true;
                }
                if (horizontalList[i] && verticalList[i]) {
                    list[i] = true;
                    waitNum--;
                }
            }
        }
        var flag = true;
        while (flag && waitNum >= 0) {
            flag = false;
            for (var i = 0; i < this._associatedView.children.length; i++) {
                if (list[i]) {
                    continue;
                }
                if (this._layoutParams[i] !== undefined) {
                    var left = this._layoutParams[i].alignLeft && (this._layoutParams[i].alignTargetLeft === -1 || horizontalList[this._layoutParams[i].alignTargetLeft]);
                    var center = this._layoutParams[i].alignCenter && (this._layoutParams[i].alignTargetCenter === -1 || horizontalList[this._layoutParams[i].alignTargetCenter]);
                    var right = this._layoutParams[i].alignRight && (this._layoutParams[i].alignTargetRight === -1 || horizontalList[this._layoutParams[i].alignTargetRight]);
                    var top = this._layoutParams[i].alignTop && (this._layoutParams[i].alignTargetTop === -1 || verticalList[this._layoutParams[i].alignTargetTop]);
                    var bottom = this._layoutParams[i].alignBottom && (this._layoutParams[i].alignTargetBottom === -1 || verticalList[this._layoutParams[i].alignTargetBottom]);
                    var middle = this._layoutParams[i].alignMiddle && (this._layoutParams[i].alignTargetMiddle === -1 || verticalList[this._layoutParams[i].alignTargetMiddle]);
                    if (left || center || right) {
                        if (this._layoutParams[i].alignLeft === left && this._layoutParams[i].alignRight === right || this._layoutParams.alignCenter === center) {
                            if (!horizontalList[i]) {
                                horizontalList[i] = true;
                                flag = true;
                            }
                        }
                    }
                    if (top || bottom || middle) {
                        if (this._layoutParams[i].alignTop === top && this._layoutParams[i].alignBottom === bottom || this._layoutParams.alignMiddle === middle) {
                            if (!verticalList[i]) {
                                verticalList[i] = true;
                                flag = true;
                            }
                        }
                    }
                    if (horizontalList[i] && verticalList[i]) {
                        list[i] = true;
                        waitNum--;
                    }
                }
            }
        }
        if (waitNum > 0) {
            return true;
        }
        return false;
    }
}, module);
