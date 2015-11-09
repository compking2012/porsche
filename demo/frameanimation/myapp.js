define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var ImageView = require("/framework/ui/view/imageview");
var CompositeView = require("/framework/ui/view/compositeview");
var FrameAnimation = require("/framework/ui/animation/frameanimation");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var imageView = new ImageView();
        imageView.src = "./coin.png";
        imageView.scaleType = "matrix";
        imageView.width = 1000;
        imageView.height = 100;

        var containerView = new CompositeView();
        containerView.width = 100;
        containerView.height = 100;
        containerView.top = 160;
        containerView.addChild(imageView);

        var animation1 = new FrameAnimation(containerView);
        animation1.frames = {
            "0%": {left: 10},
            "10%": {left: 30},
            "20%": {left: 50},
            "30%": {left: 70},
            "40%": {left: 90},
            "50%": {left: 110},
            "60%": {left: 130},
            "70%": {left: 150},
            "80%": {left: 170},
            "90%": {left: 190},
            "100%": {left: 210}
        };
        animation1.duration = 3000;
        animation1.repeat = 0;
        animation1.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        animation1.from = "0%";
        animation1.to = "100%";
        animation1.start();

        var animation2 = new FrameAnimation(imageView);
        animation2.frames = {
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
        animation2.duration = 1000;
        animation2.repeat = 0;
        animation2.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        animation2.from = "0%";
        animation2.to = "100%";
        animation2.start();

        this.window.addChild(containerView);
    }
}, module);

});
});
});
});
});