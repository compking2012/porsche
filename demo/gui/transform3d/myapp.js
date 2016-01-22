"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    onStart: function() {
        var view = new View();
        view.background = "#FF0000";
        view.left = 120;
        view.top = 120;
        view.width = 100;
        view.height = 100;

        view.originX = 50;
        view.originY = 50;
        view.rotationX = Math.PI / 180 * 30;
        view.rotationY = Math.PI / 180 * 60;

        this.window.addChild(view);
    }
}, module);
