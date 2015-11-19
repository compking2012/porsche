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
var FlowLayoutParam = require("./flowlayoutparam");

/**
 * Flow Layout which can assign views as word editor
 * @class FlowLayout
 * @extends Layout
 */
Class.define("framework.ui.layout.FlowLayout", Layout, {
    initialize: function() {
        this.super.initialize.call(this);

        this._align = "center";
        this._valign = "middle";
        this._lineSpacing = 5; // horizontal spacing between views and parent container
        this._header = 10;
        this._defaultparam = new FlowLayoutParam(-1, -1, this); // default values
        this._defaultparam.setMargin(0, 0, 0, 0);
    },

    destroy: function() {
        this._defaultparam = null;

        this.super.destroy.call(this);
    },

    /**
     * @name FlowLayout#lineSpacing
     * @type {Number}
     * @description the distance between current top edge and upper bottom edge
     */
    get lineSpacing() {
        return this._lineSpacing;
    },

    set lineSpacing(value) {
        this._lineSpacing = value;
        this.invalidate();
    },

    /**
     * @name FlowLayout#align
     * @type {String} such as left, right and center
     * @description the alignment for the views on the horizontal direction
     */
    get align() {
        return this._align;
    },

    set align(value) {
        this._align = value;
        this.invalidate();
    },

    /**
     * @name FlowLayout#valign
     * @type {String} such as top, bottom and middle
     * @description the alignment for the views on the vertical direction
     */
    get valign() {
        return this._valign;
    },

    set valign(value) {
        this._valign = value;
        this.invalidate();
    },

    get defaultParam() {
        return this._defaultparam;
    },

    /**
     * @name FlowLayout#header
     * @type {Number}
     * @description the distance between the first line and the top edge
     */
    get header() {
        return this._header;
    },

    set header(value) {
        this._header = value;
        this.invalidate();
    },

    /**
     * @method FlowLayout#getParamAtIndex
     * @param {Number} index of the child FlowLayoutParam
     * @description return the child FlowLayoutParam of index
     * @override
     */
    getParamAtIndex: function(index) {
        if (this._childparam[index] ===  undefined) {
            this._childparam[index] = new FlowLayoutParam(-1, -1, this);
            this._childparam[index]._margin = this._defaultparam._margin;
            this._childparam[index]._itemSpacing = this._defaultparam._itemSpacing;
        }
        return this._childparam[index];
    },

    /**
     * @method FlowLayout#calculateFrame
     * @description calculate position of all the children views
     * @override
     */
    calculateFrame: function() {
        var linesInfo = this.getLinesInfo();
        if (linesInfo === null) {
            return;
        }
        var layoutParam = null;
        var l = 0, beginIndex = 0, endIndex = 0, linesnum = 0;
        if (this._align === "right") {
            l = this._associatedView.width;
            while (beiginIndex < this._associatedView._children.length) {
                endIndex = beginIndex + linesInfo[linesnum].viewnum;
                for (var i = endIndex - 1; i >= beginIndex; i--) {
                    if (this._childparam[i] !== undefined && this._childparam[i]._set === 1) {
                        layoutParam = this._childparam[i];
                    }
                    else {
                        layoutParam = this._defaultparam;
                    }
                    var child = this._associatedView._children[i];
                    child.left = l - layoutParam._itemSpacing - child.width;
                    child.top = this.getHeight(linesInfo[linesnum].offset, linesInfo[linesnum].maxheight, child.height);
                    l = child.left;
                }
                beginIndex = endIndex;
                l = this._associatedView.width;
                linesnum++;
            }
        } else if (this._align === "center"){
            var rowWidth = 0, endIndex;
            while ( beginIndex < this._associatedView._children.length) {
                endIndex = beginIndex + linesInfo[linesnum].viewnum;
                rowWidth = 0;
                for (var i = endIndex - 1; i >= beginIndex; i--) {
                    rowWidth += this._associatedView._children[i].width;
                     if (this._childparam[i] !== undefined && this._childparam[i]._set === 1) {
                        layoutParam = this._childparam[i];
                    }
                    else {
                        layoutParam = this._defaultparam;
                    }
                    rowWidth += layoutParam._itemSpacing;
                }
                rowWidth -= layoutParam._itemSpacing;
                l = (this._associatedView.width - rowWidth) / 2;
                for (var i = beginIndex; i < endIndex; i++) {
                    if (this._childparam[i] !== undefined && this._childparam[i]._set === 1) {
                        layoutParam = this._childparam[i];
                    }
                    else {
                        layoutParam = this._defaultparam;
                    }
                    var child = this._associatedView._children[i];
                    child.left = l;
                    child.top = this.getHeight(linesInfo[linesnum].offset, linesInfo[linesnum].maxheight, child.height);
                    l += layoutParam._itemSpacing;
                    l += child.width;
                }
                beginIndex = endIndex;
                linesnum++;
            }
        } else {
            while ( beginIndex < this._associatedView._children.length) {
                endIndex = beginIndex + linesInfo[linesnum].viewnum;
                for (var i = beginIndex; i < endIndex; i++) {
                    if (this._childparam[i] !== undefined && this._childparam[i]._set === 1) {
                        layoutParam = this._childparam[i];
                    }
                    else {
                        layoutParam = this._defaultparam;
                    }
                    var child = this._associatedView._children[i];
                    child.left = l + layoutParam._itemSpacing;
                    child.top = this.getHeight(linesInfo[linesnum].offset, linesInfo[linesnum].maxheight, child.height);
                    l += layoutParam._itemSpacing;
                    l += child.width;
                }
                beginIndex = endIndex;
                linesnum++;
                l = 0;
            }
        }
        // code here for debug log
        for (var i = 0; i < this._associatedView._children.length; i++) {
            var child = this._associatedView._children[i];
        }
    },

    /**
     * @method FlowLayout#getLinesInfo
     * @description calculate and return related lineinfo of all childviews
     * @private
     */
    getLinesInfo: function() {
        var maxHeight = 0, lineNum = 0, viewNum = 0;
        var startpos = 0;
        var linesInfo = [], offsetY = this._header;
        for (var i = 0; i < this._associatedView._children.length; i++) {
            var child = this._associatedView._children[i];
            var layoutParam = null;
            if (this._childparam[i] === undefined) {
                this._childparam[i] = new FlowLayoutParam(-1, -1, this);
            }
            this._childPosition[i] = {left: child.left, top: child.top, width: child.width, height: child.height};
            if (this._childparam[i]._set === 1) {
                layoutParam = this._childparam[i];
            }
            else {
                layoutParam = this._defaultparam;
            }
            startpos += layoutParam._itemSpacing;
            startpos += child.width;
            if (startpos > this._associatedView.width) {
                linesInfo[lineNum++] = {offset: offsetY, maxheight: maxHeight, viewnum: viewNum};
                offsetY += maxHeight;
                offsetY += this._lineSpacing;
                maxHeight = child.height;
                startpos = layoutParam._itemSpacing + child.width;
                viewNum = 1;
                continue;
            }
            if (maxHeight < child.height) {
                maxHeight = child.height;
            }
            viewNum++;
        }
        linesInfo[lineNum] = {offset: offsetY, maxheight: maxHeight, viewnum: viewNum};
        return linesInfo;
    },

    /**
     * @method FlowLayout#getHeight
     * @param {Number} the upper baseline of the current line
     * @param {Number} the max height of all views in the current line
     * @param {Number} the height of the current view
     * @description calculate height value of the current child view
     * @private
     */
    getHeight: function(baseline, maxheight, viewheight) {
        if (this._valign === "middle") {
            return baseline + (maxheight - viewheight) / 2;
        } else if (this._valign === "top") {
            return baseline;
        } else if (this._valign === "bottom") {
            return baseline + maxheight - viewheight;
        } else {
            return baseline + (maxheight - viewheight) / 2;
        }
    }


}, module);
