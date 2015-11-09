"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var view = new View();
        view.background = "#FF0000";
        view.left = 120;
        view.top = 120;
        view.width = 100;
        view.height = 100;

        view.originX = 50;
        view.originY = 50;
        view.rotationZ = Math.PI / 180 * 30;
        view.scaleX = 1.5;
        view.scaleY = 1.5;
        view.translationX = -40;
        view.translationY = -40;

        this.window.addChild(view);

        setTimeout(function() {
            view.left = 150;
            view.top = 150;
            view.rotationZ = Math.PI / 180 * -30;
            view.scaleX = 0.8;
            view.scaleY = 0.8;
            view.translationX = -100;
            view.translationY = -100;
        }, 3000);
    }
}, module);
