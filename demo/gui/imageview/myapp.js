"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ImageView = fx.import("framework.ui.view.ImageView");

Class.define("MyApp", App, {
    onStart: function() {
        var imageView = new ImageView();
        imageView.src = global.app.rootPath + "/res/big.png";
        imageView.left = 40;
        imageView.top = 40;
        imageView.width = 240;
        imageView.height = 240;

        this.window.addChild(imageView);
    }
}, module);
