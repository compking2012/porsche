define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var Button = require("/framework/ui/view/button");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.button = new Button();
        this.button.text = "Hello";
        this.button.fontSize = "32px";
        this.button.radius = 50;
        this.button.textAlign = "center";
        this.button.background = "#FF0000";
        this.button.width = 200;
        this.button.height = 100;

        this.button.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.button.addEventListener("touchmove", this.onTouchMove.bind(this));
        this.button.addEventListener("touchend", this.onTouchEnd.bind(this));
        this.button.addEventListener("touchcancel", this.onTouchCancel.bind(this));
        this.button.addEventListener("click", this.onClick.bind(this));

        this.window.addChild(this.button);
    },

    onTouchStart: function(/*e*/) {
        this.button.background = "#00FF00";
    },

    onTouchMove: function(/*e*/) {
        this.button.background = "#FFFF00";
    },

    onTouchEnd: function(/*e*/) {
        this.button.background = "#FF0000";
    },

    onTouchCancel: function(/*e*/) {
        this.button.background = "#0000FF";
    },

    onClick: function(/*e*/) {
        this.button.text = "Well done!";
    }
}, module);

});
