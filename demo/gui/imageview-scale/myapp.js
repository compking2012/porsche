"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ImageView = fx.import("framework.ui.view.ImageView");
var TextView = fx.import("framework.ui.view.TextView");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.addGestureRecognizer(new TapRecognizer());
        this.window.addEventListener("tap", this.onTap.bind(this));

        this.scaleTypes = ["matrix", "fitxy", "fitstart", "fitcenter", "fitend", "center", "centercrop", "centerinside"];
        this.index = 0;

        this.imageView = new ImageView();
        this.imageView.src = global.app.rootPath + "/res/big.png";
        this.imageView.scaleType = "centercrop";
        this.imageView.left = 0;
        this.imageView.top = 0;
        this.imageView.width = 320;
        this.imageView.height = 320;

        this.textView = new TextView();
        this.textView.text = this.imageView.scaleType;

        this.window.addChild(this.imageView);
        this.window.addChild(this.textView);
    },

    onTap: function() {
        this.imageView.scaleType = this.scaleTypes[this.index++ % this.scaleTypes.length];
        this.textView.text = this.imageView.scaleType;
    }
}, module);
