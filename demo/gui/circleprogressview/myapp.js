"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CircleProgressView = fx.import("framework.ui.view.CircleProgressView");

Class.define("MyApp", App, {
    onStart: function() {
        this.circleProgressView = new CircleProgressView();
        this.circleProgressView.width = 320;
        this.circleProgressView.height = 320;
        this.circleProgressView.lineWidth = 30;
        this.circleProgressView.background = "#FEFEFE";
        this.circleProgressView.foreground = "#FF0000";
        this.circleProgressView.value = 0.4;
        this.window.addChild(this.circleProgressView);
    }
}, module);
