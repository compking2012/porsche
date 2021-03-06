"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var PropertyAnimation = fx.import("framework.ui.animation.PropertyAnimation");
var AnimationGroup = fx.import("framework.ui.animation.AnimationGroup");

Class.define("MyApp", App, {
    onStart: function() {
        this.view1 = new View();
        this.view1.background = "#FF0000";
        this.view1.left = 70;
        this.view1.top = 70;
        this.view1.originX = 50;
        this.view1.originY = 50;
        this.view1.width = 100;
        this.view1.height = 100;
        this.window.addChild(this.view1);

        this.view2 = new View();
        this.view2.background = "#00FF00";
        this.view2.left = 210;
        this.view2.top = 210;
        this.view2.originX = 50;
        this.view2.originY = 50;
        this.view2.width = 100;
        this.view2.height = 100;
        this.window.addChild(this.view2);

        var animation1 = new PropertyAnimation(this.view1);
        animation1.from = {rotationZ: 0 * Math.PI / 180};
        animation1.to = {rotationZ: 360 * Math.PI / 180};
        animation1.duration = 3000;
        animation1.repeat = 4;
        animation1.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";

        var animation2 = new PropertyAnimation(this.view2);
        animation2.from = {rotationZ: 0 * Math.PI / 180};
        animation2.to = {rotationZ: 360 * Math.PI / 180};
        animation2.duration = 3000;
        animation2.repeat = 4;
        animation2.easing = "linear";

        var animationGroup = new AnimationGroup();
        animationGroup.add(animation1);
        animationGroup.add(animation2);
        animationGroup.type = "parallel";
        animationGroup.addEventListener("complete", function() {
            console.log("AnimationGroup parallel mode complete");

            var animationGroup2 = new AnimationGroup();
            animationGroup2.add(animation1);
            animationGroup2.add(animation2);
            animationGroup2.type = "sequential";
            animationGroup2.addEventListener("complete", function() {
                console.log("AnimationGroup sequential complete");
            });
            animationGroup2.start();
        });
        animationGroup.start();
    }
}, module);
