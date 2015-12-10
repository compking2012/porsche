"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var ChildTransition = fx.import("framework.ui.transition.ChildTransition");
var CircleLayout = require("./circlelayout");

Class.define("MyApp", App, {
    onStart: function() {
        this.colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "navy", "magenta", "salmon", "sienna", "turquoise"];
        this.index = 0;
        while (this.index < 3) {
            var view = new View();
            view.background = this.colors[this.index];
            view.width = 60;
            view.height = 60;
            this.window.addChild(view);
            this.index++;
        }
        this.window.addEventListener("touchend", this.onTouchEnd.bind(this));

        this.window.addTransition(new ChildTransition());
        this.window.layout = new CircleLayout();
    },

    onTouchEnd: function() {
        var view = new View();
        view.background = this.colors[this.index % this.colors.length];
        view.width = 60;
        view.height = 60;
        this.window.addChild(view);
        this.index++;
    }
}, module);
