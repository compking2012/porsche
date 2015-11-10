"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var Animation = fx.import("framework.ui.animation.Animation");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.view = new View();
        this.view.background = "#FF0000";
        this.view.left = 110;
        this.view.top = 110;
        this.view.originX = 50;
        this.view.originY = 50;
        this.view.width = 100;
        this.view.height = 100;

        this.window.addChild(this.view);

        var animation = new Animation(this.view);
        animation.from = {rotationZ: 0 * Math.PI / 180, width: 100, height: 100, opacity: 0, background: "#FF0000"};
        animation.to = {rotationZ: 360 * Math.PI / 180, width: 200, height: 200, opacity: 1, background: "rgb(0,255,0)"};
        animation.duration = 3000;
        animation.repeat = 0;
        animation.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        animation.addEventListener("iteration", function(iteration) {
            if (iteration === 5) {
                animation.pause();
                setTimeout(function() {
                    animation.resume();
                }, 3000);
            }
        });
        animation.start();
    }
}, module);
