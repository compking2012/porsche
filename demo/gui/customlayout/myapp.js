"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var CircleLayout = fx.import("CircleLayout");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.layout = new CircleLayout();
        var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "navy", "magenta", "salmon", "sienna", "turquoise"];
        for (var i = 0; i < colors.length; i++) {
            var view = new View();
            view.background = colors[i];
            view.width = 60;
            view.height = 60;
            this.window.addChild(view);
        }
    }
}, module);
