"use strict";
var Class = require("../../class");
var LayoutParam = require("./layoutparam");

/**
 * Column LayoutParam
 * @class ColumnLayoutParam
 * @extends LayoutParam
 */
Class.define("{Framework}.ui.layout.ColumnLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);
    },

    /**
     * @name ColumnLayoutParam#align
     * @type {Boolean}
     * @description 
     */
    get align() {
        return this._align;
    },

    set align(value) {
        if (value === "right") {
            this.alignRight = true;
        } else if (value === "center") {
            this.alignCenter = true;
        } else {
            this.alignLeft = true;
        }
    }

}, module);
