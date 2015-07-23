define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var CircleProgressView = require("/framework/ui/view/circleprogressview");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.circleProgressView = new CircleProgressView();
        this.circleProgressView.width = 320;
        this.circleProgressView.height = 320;
        this.circleProgressView.lineWidth = 30;
        this.circleProgressView.background = "#FEFEFE";
        this.circleProgressView.foreground = "#FF0000";
        this.circleProgressView.value = 0.4;
        this.window.addChild(this.circleProgressView);
    }
}, module);

});
