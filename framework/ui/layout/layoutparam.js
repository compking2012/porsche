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

/**
 * Base class for all the layout params.
 * Note that this class is never used to instantiate directly.
 * @class LayoutParam
 * @extends YObject
 */
Class.define("framework.ui.layout.LayoutParam", YObject, {
    /**
     * Constructor that create a layout param.
     * @method LayoutParam#initialize
     * @param {Layout} layout - the associated layout.
     */
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

        this._layout = layout;
    },

    /**
     * Destructor that destroy this layout param.
     * @method LayoutParam#destroy
     */
    destroy: function() {
        this._layout = null;

        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name LayoutParam#width
     * @type {Number}
     * @description the width for the cell view.
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
     * @description the height for the cell view.
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
     * @description the value indicates whether align left.
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
     * @description the value indicates whether align right.
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
     * @description the value indicates whether align horizontal center.
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
     * @description the value indicates whether align top.
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
     * @description the value indicates whether align bottom.
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
     * @description the value indicates wheter align vertical middle.
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
     * @description the left margin for the cell view.
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
     * @description the right margin for the cell view.
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
     * @description the top margin for the cell view.
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
     * @description the bottom margin for the cell view.
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
     * @description the center margin for the cell view.
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
     * @description the middle margin for the cell view.
     */
    get marginMiddle() {
        return this._marginMiddle;
    },

    set marginMiddle(value) {
        this._marginMiddle = value;
        this.invalidate();
    },

    /**
     * Mark its associated layout invalidated.
     * @method LayoutParam#invalidate
     * @private
     */
    invalidate: function() {
        if (this._layout !== null) {
            this._layout.invalidate();
        }
    }
}, module);
