"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var CircleProgressView = fx.import("framework.ui.view.CircleProgressView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

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
