define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ScrollableView = require("../../../framework/ui/view/scrollableview");
var View = require("../../../framework/ui/view/view");

Class.define("MyApp", App, {
    onStart: function() {
        this.scrollableView = new ScrollableView();
        this.scrollableView.width = this.window.width;
        this.scrollableView.height = this.window.height;
        this.window.addChild(this.scrollableView);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
        for (var i = 0; i < 100; i++) {
            var view = new View();
            view.background = colors[i % colors.length];
            view.top = i * 100;
            view.width = 200;
            view.height = 100;

            this.scrollableView.addChild(view);
        }
    }
}, module);

});