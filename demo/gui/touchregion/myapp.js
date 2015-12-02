define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var View = require("../../../framework/ui/view/view");
var Rectangle = require("../../../framework/ui/rectangle");

Class.define("MyApp", App, {
    onStart: function() {
        this.view = new View();
        this.view.background = "#FF0000";
        this.view.left = 110;
        this.view.top = 110;
        this.view.width = 100;
        this.view.height = 100;
        this.view.touchRegion = [
            new Rectangle(-50, 0, 50, this.view.height),
            new Rectangle(this.view.width, 0, 50, this.view.height)
        ];
        this.view.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.view.addEventListener("touchend", this.onTouchEnd.bind(this));
        this.window.addChild(this.view);
    },

    onTouchStart: function(/*e*/) {
        this.view.background = "#00FF00";
    },

    onTouchEnd: function(/*e*/) {
        this.view.background = "#FF0000";
    }
}, module);

});