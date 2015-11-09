"use strict";
var Class = require("../../class");
var CompositeView = require("./compositeview");

/**
 * ListItem widget, it is used for ListView, SwipeList.
 * @class ListItem
 * @extends CompositeView
 */
Class.define("{Framework}.ui.view.ListItem", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        CompositeView.prototype.destroy.apply(this, arguments);
    }
}, module);
