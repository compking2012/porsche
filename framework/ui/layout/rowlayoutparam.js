"use strict";
var Class = require("../../class");
var LayoutParam = require("./layoutparam");

/**
 * Row LayoutParam
 * @class RowLayoutParam
 * @extends LayoutParam
 */
Class.define("{Framework}.ui.layout.RowLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);
    },

    /**
     * @name RowLayoutParam#align
     * @type {Boolean}
     * @description 
     */
    set align(value) {
        if (value === "bottom") {
            this.alignBottom = true;
        } else if (value === "middle") {
            this.alignMiddle = true;
        } else {
            this.alignTop = true;
        }
    }

}, module);
