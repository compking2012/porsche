"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var ProgressView = fx.import("framework.ui.view.ProgressView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        this.progressView = new ProgressView();
        this.progressView.left = 20;
        this.progressView.top = 50;
        this.progressView.width = 280;
        this.progressView.height = 50;
        this.progressView.lineWidth = 30;
        this.progressView.background = "#FEFEFE";
        this.progressView.foreground = "#FF0000";
        this.progressView.value = 0.4;
        this.window.addChild(this.progressView);
    }
}, module);
