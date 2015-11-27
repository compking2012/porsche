define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var Button = require("../../../framework/ui/view/button");

Class.define("MyApp", App, {
    onStart: function() {
        this.button = new Button();
        this.button.text = "Hello";
        this.button.fontSize = "32px";
        this.button.radius = 50;
        this.button.textAlign = "center";
        this.button.background = "#FF0000";
        this.button.top = 60;
        this.button.left = 60;
        this.button.width = 200;
        this.button.height = 200;

        this.button.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.button.addEventListener("touchmove", this.onTouchMove.bind(this));
        this.button.addEventListener("touchend", this.onTouchEnd.bind(this));
        this.button.addEventListener("touchcancel", this.onTouchCancel.bind(this));
        this.button.addEventListener("tap", this.onTap.bind(this));

        this.window.addChild(this.button);
    },

    onTouchStart: function(e) {
        this.button.background = "#00FF00";
        e.stopPropagation();
    },

    onTouchMove: function(e) {
        this.button.background = "#FFFF00";
        e.stopPropagation();
    },

    onTouchEnd: function(e) {
        this.button.background = "#FF0000";
        e.stopPropagation();
    },

    onTouchCancel: function(e) {
        this.button.background = "#0000FF";
        e.stopPropagation();
    },

    onTap: function(e) {
        this.button.text = "Well done!";
        e.stopPropagation();
    }
}, module);

});