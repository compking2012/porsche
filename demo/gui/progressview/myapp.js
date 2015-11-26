define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var ProgressView = require("/framework/ui/view/progressview");

Class.define("MyApp", App, {
    onStart: function() {
        this.progressView = new ProgressView();
        this.progressView.left = 20;
        this.progressView.top = 50;
        this.progressView.width = 280;
        this.progressView.height = 50;
        this.progressView.lineWidth = 30;
        this.progressView.background = "#FEFEFE";
        this.progressView.foreground = "#FF0000";
        this.progressView.value = 0.4;
        this.window.addChild(this.progressView);
    }
}, module);

});