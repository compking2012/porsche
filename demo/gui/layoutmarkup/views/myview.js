"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var View = fx.import("framework.ui.view.View");

Class.define("views.MyView", View, {
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this.loadContent();
        this.background = "#00FF00";
    }
}, module);
