"use strict";
var Class = require("../../class");
var Layout = require("./layout");
var RelativeLayoutParam = require("./relativelayoutparam");

/**
 * Relative Layout which can automatically caculate views' position based on constraints
 * @class RelativeLayout
 * @extends Layout
 */
Class.define("{Framework}.ui.layout.RelativeLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);
        
        this._units = 0;
    },

    destroy: function() {
        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * @method RelativeLayout#getLayoutParam
     * @param {Number} index of the child RelativeLayout
     * @description return the child RelativeLayout of index
     * @override
     */
    getLayoutParam: function(index, attribute) {
        if (this._childparam[index] === undefined) {
            throw "The RelativeLayoutParam required is not defind";
        }
        var child = this._childparam[index];
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
     * @param {Number} index - index for the ChildParam
     * @param {String} attribute - attribute string of "align", "margin" to set alignment/margins
     * @param {Object} constraint - the constraint of the relativelayout
     * @description Add new constranit of the relativelayout
     */
    setLayoutParam: function(index, attribute, constraint) {
        if (this._childparam[index] === undefined) {
            this._childparam[index] = new RelativeLayoutParam(this);
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
                        this._childparam[index].alignLeft = true;
                        this._childparam[index].alignTargetLeft = referenceView;
                        this._childparam[index].alignSideLeft = side === "" ? "left" : side;
                        break;
                    case "right":
                        this._childparam[index].alignRight = true;
                        this._childparam[index].alignTargetRight = referenceView;
                        this._childparam[index].alignSideRight = side === "" ? "right" : side;
                        break;
                    case "center":
                        this._childparam[index].alignCenter = true;
                        this._childparam[index].alignTargetCenter = referenceView;
                        this._childparam[index].alignSideCenter = side === "" ? "center" : side;
                        break;
                    case "top":
                        this._childparam[index].alignTop = true;
                        this._childparam[index].alignTargetTop = referenceView;
                        this._childparam[index].alignSideTop = side === "" ? "top" : side;
                        break;
                    case "bottom":
                        this._childparam[index].alignBottom = true;
                        this._childparam[index].alignTargetBottom = referenceView;
                        this._childparam[index].alignSideBottom = side === "" ? "bottom" : side;
                        break;
                    case "middle":
                        this._childparam[index].alignMiddle = true;
                        this._childparam[index].alignTargetMiddle = referenceView;
                        this._childparam[index].alignSideMiddle = side === "" ? "middle" : side;
                        break;
                }
            }
        } else if (attribute === "margin") {
            for (var property in constraint) {
                if (typeof constraint[property] === "number") {
                    switch (property) {
                        case "left":
                            this._childparam[index].marginLeft = constraint[property];
                            break;
                        case "right":
                            this._childparam[index].marginRight = constraint[property];
                            break;
                        case "top":
                            this._childparam[index].marginTop = constraint[property];
                            break;
                        case "bottom":
                            this._childparam[index].marginBottom = constraint[property];
                            break;
                        case "center":
                            this._childparam[index].marginCenter = constraint[property];
                            break;
                        case "middle":
                            this._childparam[index].marginMiddle = constraint[property];
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
     * @param {Number} index - index for the ChildParam
     * @param {String} attribute - attribute string of "align", "margin" to set alignment/margins
     * @description remove "align" or "margin" attribute of childParam at index
     */
    removeLayoutParam: function(index, attribute) {
        if (this._childparam[index] !== undefined) {
            var param = this._childparam[index];
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
            if (this._childparam[i] === undefined) {
                horizontalList[i] = true;
                verticalList[i] = true;
                list[i] = true;
                waitNum--;
            } else if (this._childparam[i] !== undefined) {
                var param = this._childparam[i];
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
        if (this._childparam[index] !== undefined && this._associatedView.children[index] !== undefined) {
            var child = this._associatedView.children[index];
            var startPosition;
            var param = this._childparam[index];
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
                if (this._childparam[i] === undefined) {
                    // if there is no constraint for current view deal as the views' absolute position
                    horizontalList[i] = true;
                    verticalList[i] = true;
                    list[i] = true;
                    waitNum--;
                    flag = true;
                } else {
                    // code here to calculate the other view's position
                    var param = this._childparam[i];
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
            if (this._childparam[i] === undefined) {
                horizontalList[i] = true;
                verticalList[i] = true;
                list[i] = true;
                waitNum--;
            } else if (this._childparam[i] !== undefined) {
                if (this._childparam[i].alignLeft && this._childparam[i].alignTargetLeft === -1 || this._childparam[i].alignRight && this._childparam[i].alignTargetRight === -1 || this._childparam[i].alignCenter && this._childparam[i].alignTargetCenter === -1) {
                    horizontalList[i] = true;
                }
                if (this._childparam[i].alignTop && this._childparam[i].alignTargetTop === -1 || this._childparam[i].alignBottom && this._childparam[i].alignTargetBottom === -1 || this._childparam[i].alignMiddle && this._childparam[i].alignTargetMiddle === -1) {
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
                if (this._childparam[i] !== undefined) {
                    var left = this._childparam[i].alignLeft && (this._childparam[i].alignTargetLeft === -1 || horizontalList[this._childparam[i].alignTargetLeft]);
                    var center = this._childparam[i].alignCenter && (this._childparam[i].alignTargetCenter === -1 || horizontalList[this._childparam[i].alignTargetCenter]);
                    var right = this._childparam[i].alignRight && (this._childparam[i].alignTargetRight === -1 || horizontalList[this._childparam[i].alignTargetRight]);
                    var top = this._childparam[i].alignTop && (this._childparam[i].alignTargetTop === -1 || verticalList[this._childparam[i].alignTargetTop]);
                    var bottom = this._childparam[i].alignBottom && (this._childparam[i].alignTargetBottom === -1 || verticalList[this._childparam[i].alignTargetBottom]);
                    var middle = this._childparam[i].alignMiddle && (this._childparam[i].alignTargetMiddle === -1 || verticalList[this._childparam[i].alignTargetMiddle]);
                    if (left || center || right) {
                        if (this._childparam[i].alignLeft === left && this._childparam[i].alignRight === right || this._childparam.alignCenter === center) {
                            if (!horizontalList[i]) {
                                horizontalList[i] = true;
                                flag = true;
                            }
                        }
                    }
                    if (top || bottom || middle) {
                        if (this._childparam[i].alignTop === top && this._childparam[i].alignBottom === bottom || this._childparam.alignMiddle === middle) {
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
