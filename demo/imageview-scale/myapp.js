define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var ImageView = require("/framework/ui/view/imageview");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var imageView = new ImageView();
        imageView.src = "./res/big.png";
        imageView.scaleType = "fitcenter";
        imageView.left = 0;
        imageView.top = 0;
        imageView.width = 320;
        imageView.height = 320;

        this.window.addChild(imageView);
    }
}, module);

});
