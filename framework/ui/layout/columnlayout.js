"use strict";
var Class = require("../../class");
var Layout = require("./layout");
var ColumnLayoutParam = require("./columnlayoutparam");

/**
 * Column Layout
 * @class ColumnLayout
 * @extends Layout
 */
Class.define("{Framework}.ui.layout.ColumnLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);
        
        this._paddingLeft = 0;
        this._paddingRight = 0;
        this._defaultParam = new ColumnLayoutParam(this);
    },

    destroy: function() {
        Layout.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name ColumnLayout#paddingLeft
     * @type {Number}
     * @description 
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
     * @description 
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
     * @description 
     */
    set defaultLayoutParam(constraint) {
        for (var property in constraint) {
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
    },

    /**
     * @method ColumnLayout#getParamAtIndex
     * @param {Number} index of the child ColumnLayout
     * @description return the child ColumnLayout of index
     * @override
     */
    getLayoutParam: function(index, attribute) {
        if (this._childparam[index] === undefined) {
            throw "The required ColumnLayoutParam is not defind";
        } else {
            return this._childparam[index];
        }
    },

    /**
     * @method ColumnLayout#setLayoutParam
     * @param {Number} index - index for the ChildParam
     * @param {String} attribute - attribute string of "align", "margin" to set alignment/margins
     * @param {Object} constraint - the constraint of the ColumnLayout
     * @description Add new constranit of the ColumnLayout
     */
    setLayoutParam: function(index, attribute, constraint) {
        if (this._childparam[index] === undefined) {
            this._childparam[index] = new ColumnLayoutParam(this);
        }
        if (attribute === "align") {
            for (var property in constraint) {
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
        } else if (attribute === "margin") {
            for (var property in constraint) {
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
        } else {
            throw "The parameter error in function setLayoutParam";
        }
    },

    /**
     * @method ColumnLayout#perform
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
