define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var View = require("../../../framework/ui/view/view");
var CircleLayout = require("./circlelayout");

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

});