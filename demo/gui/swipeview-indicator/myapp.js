"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var SwipeView = fx.import("framework.ui.view.SwipeView");
var ImageView = fx.import("framework.ui.view.ImageView");
var Indicator = fx.import("framework.ui.view.Indicator");

Class.define("MyApp", App, {
    onStart: function() {
        var swipeView = new SwipeView();
        swipeView.orientation = "horizontal";
        swipeView.width = 320;
        swipeView.height = 320;
        this.window.addChild(swipeView);

        swipeView.indicator = new Indicator();
        swipeView.indicator.left = 130;
        swipeView.indicator.top = 300;
        swipeView.indicator.width = 60;
        swipeView.indicator.height = 10;
        this.window.addChild(swipeView.indicator);

        var imageView1 = new ImageView();
        imageView1.src = global.app.rootPath + "/res/porsche1.png";
        swipeView.addChild(imageView1);

        var imageView2 = new ImageView();
        imageView2.src = global.app.rootPath + "/res/porsche2.png";
        swipeView.addChild(imageView2);

        var imageView3 = new ImageView();
        imageView3.src = global.app.rootPath + "/res/porsche3.png";
        swipeView.addChild(imageView3);

        var imageView4 = new ImageView();
        imageView4.src = global.app.rootPath + "/res/porsche4.png";
        swipeView.addChild(imageView4);
    }
}, module);
