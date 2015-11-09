"use strict";
var Class = require("../../class");
var LayoutParam = require("./layoutparam");

/**
 * Grid LayoutParam
 * @class GridLayoutParam
 * @extends LayoutParam
 */
Class.define("{Framework}.ui.layout.GridLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);
        
        this._align = "center"; // left right center fill-parent
        this._valign = "middle"; // top bottom middle fill-parent
    },

    /**
     * @name GridLayoutParam#align
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
     * @name GridLayoutParam#valign
     * @type {String} such as top, bottom and middle
     * @description the alignment for the views on the vertical direction
     */
    get valign() {
        return this._valign;
    },

    set valign(value) {
        this._valign = value;
        this.invalidate();
    }

}, module);
