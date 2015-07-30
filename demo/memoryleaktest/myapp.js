define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var View = require("/framework/ui/view/view");
var Animation = require("/framework/ui/animation/animation");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        // var func = function() {
        //     if (this.view) {
        //         this.window.removeChild(this.view);
        //         this.view.destroy();
        //     }
        //     this.view = new View();
        //     this.view.background = "#FF0000";
        //     this.view.left = 110;
        //     this.view.top = 110;
        //     this.view.originX = 50;
        //     this.view.originY = 50;
        //     this.view.width = 100;
        //     this.view.height = 100;

        //     this.window.addChild(this.view);

        //     setTimeout(func, 100);
        // }.bind(this);


        var func = function() {
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
            animation.duration = 1000;
            animation.repeat = 0;
            animation.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
            var iterationFunc = null;
            animation.addEventListener("iteration", iterationFunc = function(iteration) {
                if (iteration === 5) {
                    animation.removeEventListener("iteration", iterationFunc);
                    animation.stop();
                    animation.destroy();
                    this.window.removeChild(this.view);
                    this.view.destroy();
                    setTimeout(func, 1000);
                }
            }.bind(this));
            animation.start();
        }.bind(this);

        setTimeout(func, 0);
    }
}, module);

});
