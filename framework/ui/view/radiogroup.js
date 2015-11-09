"use strict";
var Class = require("../../class");
var CompositeView = require("./compositeview");

Class.define("{Framework}.ui.view.RadioGroup", CompositeView, {
    initialize: function () {
        CompositeView.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        CompositeView.prototype.destroy.apply(this, arguments);
    }
}, module);
