define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var SwipeView = require("../../../framework/ui/view/swipeview");
var ImageView = require("../../../framework/ui/view/imageview");

Class.define("MyApp", App, {
    onStart: function() {
        var swipeView = new SwipeView();
        swipeView.orientation = "horizental";
        swipeView.width = 320;
        swipeView.height = 320;

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

        this.window.addChild(swipeView);
    }
}, module);

});