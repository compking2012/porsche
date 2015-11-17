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
var LayoutParam = require("./layoutparam");

/**
 * Row Layout
 * @class RowLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.RowLayout", Layout, {
    initialize: function() {
        this.super.initialize.apply(this, arguments);

        this._paddingTop = 0;
        this._paddingBottom = 0;
        this._defaultparam = new RowLayoutParam(this);
    },

    destroy: function() {
        this._defaultparam = null;

        this.super.destroy.apply(this, arguments);
    },

    /**
     * @name RowLayout#paddingLeft
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
     * @name RowLayout#paddingLeft
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
     * @name RowLayout#defaultParam
     * @type {Number}
     * @description 
     */
    get defaultParam() {
        return this._defaultParam;
    },

    set defaultParam(value) {
        this._defaultParam = value;
        this.invalidate();
    },

    /**
     * @method RowLayout#getParamAtIndex
     * @param {Number} index of the child RowLayout
     * @description return the child RowLayout of index
     * @override
     */
    getParamAtIndex: function(index) {
        if (this._childparam[index] ===  undefined) {
            this._childparam[index] = new RowLayoutParam(-1, -1, this);
            this._childparam[index]._margin = this._defaultparam._margin;
        }
        return this._childparam[index];
    },

    /**
     * @method RowLayout#calculateFrame
     * @description calculate position of all the children views
     * @override
     */
    calculateFrame: function() {
        var startpos = 0;
        for (var i = 0; i < this._associatedView._children.length; i++) {
            var child = this._associatedView._children[i];
            var layoutParam = null;
            this._childPosition[i] = {left: child.left, top: child.top, width: child.width, height: child.height};
            if (this._childparam[i] !== undefined && this._childparam[i]._set === 1) {
                layoutParam = this._childparam[i];
            }
            else {
                layoutParam = this._defaultparam;
            }
            child.left = startpos + layoutParam._margin._leftmargin;
            startpos += layoutParam._margin._leftmargin;
            startpos += child.width;
            if (layoutParam._layoutgravity === "top") {
                child.top = layoutParam._margin._topmargin;
            }else if (layoutParam._layoutgravity === "bottom") {
                child.top = this._associatedView.height - layoutParam._margin._bottommargin - child.height;
            } else if (layoutParam._layoutgravity === "middle") {
                child.top = (this._associatedView.height - child.height) / 2;
            } else if (layoutParam._layoutgravity === "fill") {
                child.top = 0;
                child.height = this._associatedView.height;
            } else {
                child.top = layoutParam._margin._topmargin;
            }
        }
    }
}, module);
