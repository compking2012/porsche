"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ScrollableView = fx.import("framework.ui.view.ScrollableView");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.scrollableView = new ScrollableView();
        this.scrollableView.width = this.window.width;
        this.scrollableView.height = this.window.height;
        this.window.addChild(this.scrollableView);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
        for (var i = 0; i < 8; i++) {
            var view = new View();
            view.background = colors[i % colors.length];
            view.top = i * 100;
            view.width = 200;
            view.height = 100;

            this.scrollableView.addChild(view);
        }
    }
}, module);
