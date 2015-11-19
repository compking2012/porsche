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
var YObject = require("../../yobject");

Class.define("framework.ui.layout.LayoutParam", YObject, {
    initialize: function(layout) {
        YObject.prototype.initialize.apply(this, arguments);

        this._width = -1;
        this._height = -1;

        this._alignLeft = false;
        this._alignRight = false;
        this._alignTop = false;
        this._alignBottom = false;
        this._alignCenter = false;
        this._alignMiddle = false;

        this._marginLeft = 0;
        this._marginRight = 0;
        this._marginTop = 0;
        this._marginBottom = 0;
        this._marginCenter = 0;
        this._marginMiddle = 0;

        this._layoutgravity = 0;
        this._weightsum = 0;
        this._weight = 0;
        this._set = 0;
        this._layout = layout;
    },

    /**
     * @name LayoutParam#width
     * @type {Number}
     * @description Width of the item
     */
    get width() {
        return this._width;
    },

    set width(value) {
        this._width = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#height
     * @type {Number}
     * @description Height of the item
     */
    get height() {
        return this._height;
    },

    set height(value) {
        this._height = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#alignLeft
     * @type {Boolean}
     * @description whether the left align is set
     */
    get alignLeft() {
        return this._alignLeft;
    },

    set alignLeft(value) {
        this._alignLeft = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#alignRight
     * @type {Boolean}
     * @description whether the right align is set
     */
    get alignRight() {
        return this._alignRight;
    },

    set alignRight(value) {
        this._alignRight = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#alignCenter
     * @type {Boolean}
     * @description whether the center align is set
     */
    get alignCenter() {
        return this._alignCenter;
    },

    set alignCenter(value) {
        this._alignCenter = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#alignTop
     * @type {Boolean}
     * @description whether the top align is set
     */
    get alignTop() {
        return this._alignTop;
    },

    set alignTop(value) {
        this._alignTop = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#alignBottom
     * @type {Boolean}
     * @description whether the bottom align is set
     */
    get alignBottom() {
        return this._alignBottom;
    },

    set alignBottom(value) {
        this._alignBottom = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#alignMiddle
     * @type {Boolean}
     * @description whether the middle align is set
     */
    get alignMiddle() {
        return this._alignMiddle;
    },

    set alignMiddle(value) {
        this._alignMiddle = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#marginLeft
     * @type {Number}
     * @description The left margin for the current item
     */
    get marginLeft() {
        return this._marginLeft;
    },

    set marginLeft(value) {
        this._marginLeft = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#marginRight
     * @type {Number}
     * @description The right margin for the current item
     */
    get marginRight() {
        return this._marginRight;
    },

    set marginRight(value) {
        this._marginRight = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#marginTop
     * @type {Number}
     * @description The top margin for the current item
     */
    get marginTop() {
        return this._marginTop;
    },

    set marginTop(value) {
        this._marginTop = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#marginBottom
     * @type {Number}
     * @description The bottom margin for the current item
     */
    get marginBottom() {
        return this._marginBottom;
    },

    set marginBottom(value) {
        this._marginBottom = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#marginCenter
     * @type {Number}
     * @description The center margin for the current item
     */
    get marginCenter() {
        return this._marginCenter;
    },

    set marginCenter(value) {
        this._marginCenter = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#marginMiddle
     * @type {Number}
     * @description The middle margin for the current item
     */
    get marginMiddle() {
        return this._marginMiddle;
    },

    set marginMiddle(value) {
        this._marginMiddle = value;
        this.invalidate();
    },

    /**
     * @name LayoutParam#layoutgravity
     * @type {Number}
     * @description The alignment for the item, such as left/right/center/top/bottom/middle
     */
    set layoutgravity(value) {
        this._layoutgravity = value;
        this.invalidate();
    },

    get layoutgravity() {
        return this._layoutgravity;
    },

    /**
     * @method LayoutParam#invalidate
     * @description Mark the area defined by dirty as needing to be drawn
     * @private
     */
    invalidate: function() {
        this._set = 1;
        if (this._layout !== null) {
            this._layout.invalidate();
        }
    }
}, module);
