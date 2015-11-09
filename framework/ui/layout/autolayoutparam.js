"use strict";
var Class = require("../../class");
var LayoutParam = require("./layoutparam");

/**
 * Column LayoutParam
 * @class ColumnLayoutParam
 * @extends LayoutParam
 */
Class.define("{Framework}.ui.layout.AutoLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        LayoutParam.prototype.destroy.apply(this, arguments);
    }
}, module);
