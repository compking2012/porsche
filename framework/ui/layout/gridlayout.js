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
var GridLayoutParam = require("./gridlayoutparam");
/**
 * Grid Layout
 * @class GridLayout
 * @extends Layout
 * @private
 */
Class.define("framework.ui.layout.GridLayout", Layout, {
    initialize: function() {
        Layout.prototype.initialize.apply(this, arguments);
        this._defaultLayoutParam = new GridLayoutParam(-1, -1, this);
        this._defaultLayoutParam.setMargin(0, 0, 0, 0);
        this._rows = 1;
        this._columns = 1;
    },

    get defaultLayoutParam() {
        return this._defaultLayoutParam;
    },

    /**
     * @name GridLayout#rows
     * @type {Number}
     * @description The total number of rows
     */
    get rows() {
        return this._rows;
    },

    set rows(value) {
        this._rows = value;
        this.invalidate();
    },

    /**
     * @name GridLayout#columns
     * @type {Number}
     * @description The total number of columns
     */
    get columns() {
        return this._columns;
    },

    set columns(value) {
        this._columns = value;
        this.invalidate();
    },

    /**
     * @method GridLayout#getParamAtIndex
     * @param {Number} index of the child GridLayout
     * @description return the child GridLayout of index
     * @override
     */
    getParamAtIndex: function(index) {
        if (this._layoutParams[index] ===  undefined) {
            this._layoutParams[index] = new GridLayoutParam(-1, -1, this);
            this._layoutParams[index]._margin = this._defaultLayoutParam._margin;
            this._layoutParams[index]._align = this._defaultLayoutParam._align;
            this._layoutParams[index]._valign = this._defaultLayoutParam._valign;
        }
        return this._layoutParams[index];
    },

    /**
     * @method GridLayout#calculateFrame
     * @description calculate position of all the children views
     * @override
     */
    calculateFrame: function() {
        var rowHeight = this._associatedView.height / this._rows;
        var columnWidth = this._associatedView.width / this._columns;
        var l = 0, t = 0;
        for (var i = 0; i < this._associatedView._children.length; i++) {
            var child = this._associatedView._children[i];
            var layoutParam = null;
            this._childPosition[i] = {left: child.left, top: child.top, width: child.width, height: child.height};
            if (this._layoutParams[i] !== undefined && this._layoutParams[i]._set === 1) {
                layoutParam = this._layoutParams[i];
            } else {
                layoutParam = this._defaultLayoutParam;
            }
            // if the child view's width/height beyond the grid cell, then adjust its width/height to adapt the grid cell
            if (child.width > columnWidth) {
                layoutParam._align = "fill";
            }
            if (child.height > rowHeight) {
                layoutParam._valign = "fill";
            }
            if (layoutParam._align === "left") {
                child.left = l + layoutParam._margin._leftmargin;
            } else if (layoutParam._align === "right") {
                child.left = l + columnWidth - layoutParam._margin._rightmargin - child.width;
            } else if (layoutParam._align === "center") {
                child.left = l + (columnWidth - child.width) / 2;
            } else if (layoutParam._align === "fill") {
                child.left = l;
                child.width = columnWidth;
            } else {
                child.left = l + layoutParam._margin._leftmargin;
            }
            if (layoutParam._valign === "top") {
                child.top = t + layoutParam._margin._topmargin;
            } else if (layoutParam._valign === "bottom") {
                child.top = t + rowHeight - layoutParam._margin._bottommargin - child.height;
            } else if (layoutParam._valign === "midlle") {
                child.top = t + (rowHeight - child.height) / 2;
            } else if (layoutParam._valign === "fill") {
                child.top = t;
                child.height = rowHeight;
            } else {
                child.top =  t + layoutParam._margin._topmargin;
            }
            // add code here to deal the l and t
            if ((i + 1) % this._columns) {
                l += columnWidth;
            } else {
                l = 0;
                t += rowHeight;
            }
        }
    }

}, module);
