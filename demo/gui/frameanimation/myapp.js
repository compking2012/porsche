define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ImageView = require("../../../framework/ui/view/imageview");
var CompositeView = require("../../../framework/ui/view/compositeview");
var FrameAnimation = require("../../../framework/ui/animation/frameanimation");

Class.define("MyApp", App, {
    onStart: function() {
        var imageView = new ImageView();
        imageView.src = global.app.rootPath + "/coin.png";
        imageView.scaleType = "matrix";
        imageView.width = 1000;
        imageView.height = 100;

        var containerView = new CompositeView();
        containerView.width = 100;
        containerView.height = 100;
        containerView.top = 160;
        containerView.left = 110;
        containerView.addChild(imageView);

        var animation = new FrameAnimation(imageView);
        animation.frames = {
            "0%": {left: 0},
            "10%": {left: -100},
            "20%": {left: -200},
            "30%": {left: -300},
            "40%": {left: -400},
            "50%": {left: -500},
            "60%": {left: -600},
            "70%": {left: -700},
            "80%": {left: -800},
            "90%": {left: -900},
            "100%": {left: 0}
        };
        animation.duration = 1000;
        animation.repeat = "infinite";
        animation.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        animation.start();

        this.window.addChild(containerView);
    }
}, module);

});