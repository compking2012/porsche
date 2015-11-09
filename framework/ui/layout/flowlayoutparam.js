"use strict";
var Class = require("../../class");
var LayoutParam = require("./layoutparam");

/**
 * Flow LayoutParam
 * @class FlowLayoutParam
 * @extends LayoutParam
 */
Class.define("framework.ui.layout.FlowLayoutParam", LayoutParam, {
    initialize: function() {
        LayoutParam.prototype.initialize.apply(this, arguments);

        this._itemSpacing = 10; // vertical spacing betwwen views and and parent container
    },

    get itemSpacing() {
        return this._itemSpacing;
    },

    set itemSpacing(value) {
        this._itemSpacing = value;
        this.invalidate();
    }

}, module);
