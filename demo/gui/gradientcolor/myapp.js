"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var SwipeView = fx.import("framework.ui.view.SwipeView");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    onStart: function() {
        this.swipeView = new SwipeView();
        this.swipeView.width = this.window.width;
        this.swipeView.height = this.window.height;

        this.linearGradientView = new View();
        // this.linearGradientView.background = "linear-gradient(135deg, red 30%, yellow 60%)";
        this.linearGradientView.background = "linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)";
        // this.linearGradientView.background = "linear-gradient(to left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727)";
        this.swipeView.addChild(this.linearGradientView);

        this.radialGradientView = new View();
        this.radialGradientView.background = "radial-gradient(#FF0000, #FFFFFF)";
        this.swipeView.addChild(this.radialGradientView);

        this.conicalGradientView = new View();
        this.conicalGradientView.background = "conical-gradient(#FF0000, #FFFFFF, 320)";
        this.swipeView.addChild(this.conicalGradientView);

        this.window.addChild(this.swipeView);
    }
}, module);
