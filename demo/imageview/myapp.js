"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ImageView = fx.import("framework.ui.view.ImageView");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var imageView = new ImageView();
        imageView.src = "./res/bg_1.png";
        imageView.left = 40;
        imageView.top = 40;
        imageView.width = 240;
        imageView.height = 240;

        this.window.addChild(imageView);
    }
}, module);
