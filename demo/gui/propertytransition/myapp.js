"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");
var PropertyTransition = fx.import("framework.ui.transition.PropertyTransition");

Class.define("MyApp", App, {
    onStart: function() {
        this.view = new View();
        this.view.background = "#FF0000";
        this.view.left = 0;
        this.view.top = 0;
        this.view.width = 100;
        this.view.height = 100;
        this.view.addGestureRecognizer(new TapRecognizer());
        this.view.addEventListener("tap", this.onTap.bind(this));

        this.view.addTransition(new PropertyTransition("left"));
        this.view.addTransition(new PropertyTransition("top"));
        this.view.addTransition(new PropertyTransition("opacity"));

        this.window.addChild(this.view);
        this.moved = false;
    },

    onTap: function(/*e*/) {
        if (!this.moved) {
            this.view.left = 200;
            this.view.top = 200;
            this.view.opacity = 0.3;
        } else {
            this.view.left = 0;
            this.view.top = 0;
            this.view.opacity = 1;
        }
        this.moved = !this.moved;
    }
}, module);
