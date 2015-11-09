"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var ImageView = fx.import("framework.ui.view.ImageView");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        this.window.addEventListener("touchend", this.onTouchEnd.bind(this));

        this.scaleTypes = ["matrix", "fitxy", "fitstart", "fitcenter", "fitend", "center", "centercrop", "centerinside"];
        this.index = 0;

        this.imageView = new ImageView();
        this.imageView.src = __dirname + "/res/big.png";
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

    onTouchEnd: function() {
        this.imageView.scaleType = this.scaleTypes[this.index++ % this.scaleTypes.length];
        this.textView.text = this.imageView.scaleType;
    }
}, module);
