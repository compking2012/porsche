"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var Button = fx.import("framework.ui.view.Button");
var Point = fx.import("framework.ui.Point");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        this.startPoint = new Point(0, 0);
        this.buttonPoint = new Point(0, 0);

        this.button = new Button();
        this.button.text = "Hello";
        this.button.fontSize = "32px";
        this.button.radius = 50;
        this.button.textAlign = "center";
        this.button.background = "#FF0000";
        this.button.width = 300;
        this.button.height = 300;

        this.window.addEventListener("touchstart", this.onTouchStart.bind(this));
        this.window.addEventListener("touchmove", this.onTouchMove.bind(this));
        this.window.addEventListener("touchend", this.onTouchEnd.bind(this));
        this.window.addEventListener("touchcancel", this.onTouchCancel.bind(this));

        this.window.addChild(this.button);
    },

    onTouchStart: function(e) {
        this.startPoint.assign(e.touches[0].screenX, e.touches[0].screenY);
        this.buttonPoint.assign(this.button.left, this.button.top);
    },

    onTouchMove: function(e) {
        var offsetX = e.touches[0].pageX - this.startPoint.x;
        var offsetY = e.touches[0].pageY - this.startPoint.y;
        this.button.left = this.buttonPoint.x + offsetX;
        this.button.top = this.buttonPoint.y + offsetY;
    },

    onTouchEnd: function(/*e*/) {
        this.startPoint.assign(0, 0);
        this.buttonPoint.assign(0, 0);
    },

    onTouchCancel: function(/*e*/) {
        this.startPoint.assign(0, 0);
        this.buttonPoint.assign(0, 0);
    }
}, module);
