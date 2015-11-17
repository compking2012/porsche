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
var LayoutParam = require("./layoutparam");

Class.define("framework.ui.layout.RelativeLayoutParam", LayoutParam, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        this._alignTargetLeft = -1;
        this._alignTargetRight = -1;
        this._alignTargetTop = -1;
        this._alignTargetBottom = -1;
        this._alignTargetCenter = -1;
        this._alignTargetMiddle = -1;

        this._alignSideLeft = "left";
        this._alignSideRight = "right";
        this._alignSideTop = "top";
        this._alignSideBottom = "bottom";
        this._alignSideCenter = "center";
        this._alignSideMiddle = "middle";
    },

    destroy: function() {
        this.super.destroy.apply(this, arguments);
    },

    /**
     * @name RelativeLayoutParam#alignTargetLeft
     * @type {Number} -1 for the "parent"
     * @description left reference object for the current unit
     */
    get alignTargetLeft() {
        return this._alignTargetLeft;
    },

    set alignTargetLeft(value) {
        this._alignTargetLeft = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignTargetRight
     * @type {Number} -1 for the "parent"
     * @description right reference object for the current unit
     */
    get alignTargetRight() {
        return this._alignTargetRight;
    },

    set alignTargetRight(value) {
        this._alignTargetRight = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignTargetCenter
     * @type {Number} -1 for the "parent"
     * @description center reference object for the current unit
     */
    get alignTargetCenter() {
        return this._alignTargetCenter;
    },

    set alignTargetCenter(value) {
        this._alignTargetCenter = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignTargetTop
     * @type {Number} -1 for the "parent"
     * @description top reference object for the current unit
     */
    get alignTargetTop() {
        return this._alignTargetTop;
    },

    set alignTargetTop(value) {
        this._alignTargetTop = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignTargetBottom
     * @type {Number} -1 for the "parent"
     * @description bottom reference object for the current unit
     */
    get alignTargetBottom() {
        return this._alignTargetBottom;
    },

    set alignTargetBottom(value) {
        this._alignTargetBottom = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignTargetMiddle
     * @type {Number} -1 for the "parent"
     * @description middle reference object for the current unit
     */
    get alignTargetMiddle() {
        return this._alignTargetMiddle;
    },

    set alignTargetMiddle(value) {
        this._alignTargetMiddle = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignSideLeft
     * @type {String}
     * @description the reference side for current left side, it should be "left", "right", "center", default value is "left"
     */
    get alignSideLeft() {
        return this._alignSideLeft;
    },

    set alignSideLeft(value) {
        this._alignSideLeft = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignSideRight
     * @type {String}
     * @description the reference side for current right side, it should be "left", "right", "center", default value is "right"
     */
    get alignSideRight() {
        return this._alignSideRight;
    },

    set alignSideRight(value) {
        this._alignSideRight = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignSideCenter
     * @type {String}
     * @description the reference side for current center side, it should be "left", "right", "center", default value is "center"
     */
    get alignSideCenter() {
        return this._alignSideCenter;
    },

    set alignSideCenter(value) {
        this._alignSideCenter = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignSideTop
     * @type {String}
     * @description the reference side for current top side, it should be "top", "bottom", "middle", default value is "top"
     */
    get alignSideTop() {
        return this._alignSideTop;
    },

    set alignSideTop(value) {
        this._alignSideTop = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignSideBottom
     * @type {String}
     * @description the reference side for current bottom side, it should be "top", "bottom", "middle", default value is "bottom"
     */
    get alignSideBottom() {
        return this._alignSideBottom;
    },

    set alignSideBottom(value) {
        this._alignSideBottom = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#alignSideMiddle
     * @type {String}
     * @description the reference side for current middle side, it should be "top", "bottom", "middle", default value is "middle"
     */
    get alignSideMiddle() {
        return this._alignSideMiddle;
    },

    set alignSideMiddle(value) {
        this._alignSideMiddle = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#marginLeft
     * @type {Number}
     * @description the pixels size of left margin
     */
    get marginLeft() {
        return this._marginLeft;
    },

    set marginLeft(value) {
        this._marginLeft = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#marginRight
     * @type {Number}
     * @description the pixels size of right margin
     */
    get marginRight() {
        return this._marginRight;
    },

    set marginRight(value) {
        this._marginRight = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#marginCenter
     * @type {Number}
     * @description the pixels size of center margin
     */
    get marginCenter() {
        return this._marginCenter;
    },

    set marginCenter(value) {
        this._marginCenter = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#marginTop
     * @type {Number}
     * @description the pixels size of top margin
     */
    get marginTop() {
        return this._marginTop;
    },

    set marginTop(value) {
        this._marginTop = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#marginBottom
     * @type {Number}
     * @description the pixels size of bottom margin
     */
    get marginBottom() {
        return this._marginBottom;
    },

    set marginBottom(value) {
        this._marginBottom = value;
        this.invalidate();
    },

    /**
     * @name RelativeLayoutParam#marginMiddle
     * @type {Number}
     * @description the pixels size of middle margin
     */
    get marginMiddle() {
        return this._marginMiddle;
    },

    set marginMiddle(value) {
        this._marginMiddle = value;
        this.invalidate();
    },

    /**
     * @method RelativeLayoutParam#getAlignAttribute
     * @description return align attributes
     * @override
     */
    getAlignAttribute: function() {
        var result = "";
        var target;
        if (this._alignLeft) {
            target = this._alignTargetLeft === -1 ? "parent" : this._alignTargetLeft;
            result += "\"left\": { \"target\": " + target + ", \"side\": " + this._alignSideLeft + " }";
        }
        if (this._alignRight) {
            target = this._alignTargetRight === -1 ? "parent" : this._alignTargetRight;
            if (result !== "") {
                result += ", ";
            }
            result += "\"right\": { \"target\": " + target + ", \"side\": " + this._alignSideRight + " }";
        }
        if (this._alignCenter) {
            target = this._alignTargetCenter === -1 ? "parent" : this._alignTargetCenter;
            if (result !== "") {
                result += ", ";
            }
            result += "\"center\": { \"target\": " + target + ", \"side\": " + this._alignSideCenter + " }";
        }
        if (this._alignTop) {
            target = this._alignTargetTop === -1 ? "parent" : this._alignTargetTop;
            if (result !== "") {
                result += ", ";
            }
            result += "\"top\": { \"target\": " + target + ", \"side\": " + this._alignSideTop + " }";
        }
        if (this._alignBottom) {
            target = this._alignTargetBottom === -1 ? "parent" : this._alignTargetBottom;
            if (result !== "") {
                result += ", ";
            }
            result += "\"bottom\": { \"target\": " + target + ", \"side\": " + this._alignSideBottom + " }";
        }
        if (this._alignMiddle) {
            target = this._alignTargetMiddle === -1 ? "parent" : this._alignTargetMiddle;
            if (result !== "") {
                result += ", ";
            }
            result += "\"middle\": { \"target\": " + target + ", \"side\": " + this._alignSideMiddle + " }";
        }
        return "{" + result + "}";
    },

    /**
     * @method RelativeLayoutParam#getMarginAttribute
     * @description return margin attributes
     * @override
     */
    getMarginAttribute: function() {
        var result = "";
        result += "{\"left\": " + this._marginLeft + "{\"right\": " + this._marginRight + "{\"center\": " + this._marginCenter + "{\"top\": " + this._marginTop + "{\"bottom\": " + this._marginBottom + "{\"middle\": " + this._marginMiddle + " }";
        return result;
    },

    /**
     * @method RelativeLayoutParam#removeAlignAttribute
     * @description remove align attribute
     * @override
     */
    removeAlignAttribute: function() {
        this._alignLeft = false;
        this._alignRight = false;
        this._alignCenter = false;
        this._alignTop = false;
        this._alignBottom = false;
        this._alignMiddle = false;

        this._alignTargetLeft = -1;
        this._alignTargetRight = -1;
        this._alignTargetCenter = -1;
        this._alignTargetTop = -1;
        this._alignTargetBottom = -1;
        this._alignTargetMiddle = -1;

        this._alignSideLeft = "left";
        this._alignSideRight = "right";
        this._alignSideTop = "top";
        this._alignSideBottom = "bottom";
        this._alignSideCenter = "center";
        this._alignSideMiddle = "middle";
        this.invalidate();
    },

    /**
     * @method RelativeLayoutParam#removeMarginAttribute
     * @description remove align attribute
     * @override
     */
    removeMarginAttribute: function() {
        this._marginLeft = 0;
        this._marginRight = 0;
        this._marginTop = 0;
        this._marginBottom = 0;
        this._marginCenter = 0;
        this._marginMiddle = 0;
        this.invalidate();
    }
}, module);
