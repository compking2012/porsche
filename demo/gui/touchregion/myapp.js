"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var Rectangle = fx.import("framework.graphics.Rectangle");

Class.define("MyApp", App, {
    onStart: function() {
        this.view = new View();
        this.view.background = "#FF0000";
        this.view.left = 110;
        this.view.top = 110;
        this.view.width = 100;
        this.view.height = 100;
        this.view.touchRegion = [
            new Rectangle(-50, 0, 0, this.view.height),
            new Rectangle(this.view.width, 0, this.view.width + 50, this.view.height)
        ];
        this.view.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.view.addEventListener("touchend", this.onTouchEnd.bind(this));
        this.window.addChild(this.view);
    },

    onTouchStart: function(/*e*/) {
        this.view.background = "#00FF00";
    },

    onTouchEnd: function(/*e*/) {
        this.view.background = "#FF0000";
    }
}, module);
