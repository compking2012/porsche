"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var ImageView = fx.import("framework.ui.view.ImageView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var imageView = new ImageView();
        imageView.src = __dirname + "/res/bg_1.png";
        imageView.left = 40;
        imageView.top = 40;
        imageView.width = 240;
        imageView.height = 240;

        this.window.addChild(imageView);
    }
}, module);
