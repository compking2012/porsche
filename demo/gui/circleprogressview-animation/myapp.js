"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CircleProgressView = fx.import("framework.ui.view.CircleProgressView");
var PropertyAnimation = fx.import("framework.ui.animation.PropertyAnimation");
var AnimationGroup = fx.import("framework.ui.animation.AnimationGroup");

Class.define("MyApp", App, {
    onStart: function() {
        this.circleProgressView1 = new CircleProgressView();
        this.circleProgressView1.left = 90;
        this.circleProgressView1.top = 90;
        this.circleProgressView1.width = 140;
        this.circleProgressView1.height = 140;
        this.circleProgressView1.lineWidth = 30;
        this.circleProgressView1.background = "#0D171C";
        this.circleProgressView1.color = "#3ECCD3";
        this.window.addChild(this.circleProgressView1);

        this.circleProgressView2 = new CircleProgressView();
        this.circleProgressView2.left = 60;
        this.circleProgressView2.top = 60;
        this.circleProgressView2.width = 200;
        this.circleProgressView2.height = 200;
        this.circleProgressView2.lineWidth = 30;
        this.circleProgressView2.background = "#223403";
        this.circleProgressView2.color = "#97FF01";
        this.window.addChild(this.circleProgressView2);

        this.circleProgressView3 = new CircleProgressView();
        this.circleProgressView3.left = 30;
        this.circleProgressView3.top = 30;
        this.circleProgressView3.width = 260;
        this.circleProgressView3.height = 260;
        this.circleProgressView3.lineWidth = 30;
        this.circleProgressView3.background = "#0E171C";
        this.circleProgressView3.color = "#F20026";
        this.window.addChild(this.circleProgressView3);

        var animation1 = new PropertyAnimation(this.circleProgressView1);
        animation1.from = {value: 0};
        animation1.to = {value: 0.3};
        animation1.duration = 1000;
        animation1.easing = "ease";

        var animation2 = new PropertyAnimation(this.circleProgressView2);
        animation2.from = {value: 0};
        animation2.to = {value: 0.5};
        animation2.duration = 1000;
        animation2.easing = "ease";

        var animation3 = new PropertyAnimation(this.circleProgressView3);
        animation3.from = {value: 0};
        animation3.to = {value: 0.7};
        animation3.duration = 1000;
        animation3.easing = "ease";

        var animationGroup = new AnimationGroup();
        animationGroup.add(animation1);
        animationGroup.add(animation2);
        animationGroup.add(animation3);
        animationGroup.type = "parallel";

        animationGroup.start();
    }
}, module);
