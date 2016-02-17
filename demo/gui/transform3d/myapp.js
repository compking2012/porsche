"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var PropertyAnimation = fx.import("framework.ui.animation.PropertyAnimation");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.background = "#00FF00";
        var view = new View();
        view.background = "#FF0000";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        // view.originX = 50;
        // view.originY = 50;
        // view.rotationX = Math.PI / 180 * 1;
        // view.rotationY = Math.PI / 180 * 0.1;

        this.window.rotationX = Math.PI / 180 * 45;
        this.window.addChild(view);

        // var animation1 = new PropertyAnimation(view);
        // // DO NOT WORK: translationZ, rotationX, rotationY
        // animation1.from = {rotationX: 0};
        // animation1.to = {rotationX: 2 * Math.PI};
        // animation1.duration = 5000;
        // animation1.repeat = "infinite";
        // animation1.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        // animation1.start();
    }
}, module);
