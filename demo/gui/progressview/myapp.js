"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ProgressView = fx.import("framework.ui.view.ProgressView");

Class.define("MyApp", App, {
    onStart: function() {
        this.progressView = new ProgressView();
        this.progressView.left = 20;
        this.progressView.top = 50;
        this.progressView.width = 280;
        this.progressView.height = 30;
        this.progressView.background = "#FEFEFE";
        this.progressView.color = "#FF0000";
        this.progressView.value = 0.4;
        this.window.addChild(this.progressView);
    }
}, module);
