define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ImageView = require("../../../framework/ui/view/imageview");
var PropertyAnimation = require("../../../framework/ui/animation/propertyanimation");

Class.define("MyApp", App, {
    onStart: function() {
        for (var i = 0; i < 10; i++) {
            var imageView = new ImageView();
            imageView.src = global.app.rootPath + "/res/ic_launcher.png";
            imageView.left = 10 + i * 20;
            imageView.top = 10 + (i % 5) * 20;
            imageView.originX = 50;
            imageView.originY = 50;
            imageView.width = 100;
            imageView.height = 100;

            this.window.addChild(imageView);

            var animation = new PropertyAnimation(imageView);
            animation.from = {rotationZ: 0 * Math.PI / 180, width: 100, height: 100, opacity: 0};
            animation.to = {rotationZ: 360 * Math.PI / 180, width: 200, height: 200, opacity: 1};
            animation.duration = 1000;
            animation.repeat = "infinite";
            animation.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
            animation.start();
        }
    }
}, module);

});