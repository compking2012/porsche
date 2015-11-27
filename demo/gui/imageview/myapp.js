define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ImageView = require("../../../framework/ui/view/imageview");

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

});