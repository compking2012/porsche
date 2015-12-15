"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var CompositeView = fx.import("framework.ui.view.CompositeView");

Class.define("views.MyCompositeView", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.loadContent();
        this.background = "#00FFFF";
    }
}, module);
