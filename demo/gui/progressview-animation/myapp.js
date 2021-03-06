"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ProgressView = fx.import("framework.ui.view.ProgressView");
var PropertyAnimation = fx.import("framework.ui.animation.PropertyAnimation");
var AnimationGroup = fx.import("framework.ui.animation.AnimationGroup");

Class.define("MyApp", App, {
    onStart: function() {
        this.progressView1 = new ProgressView();
        this.progressView1.left = 20;
        this.progressView1.top = 50;
        this.progressView1.width = 280;
        this.progressView1.height = 30;
        this.progressView1.background = "#0D171C";
        this.progressView1.color = "linear-gradient(#3ECCD3, #FFFFFF)";
        this.window.addChild(this.progressView1);

        this.progressView2 = new ProgressView();
        this.progressView2.left = 20;
        this.progressView2.top = 150;
        this.progressView2.width = 280;
        this.progressView2.height = 30;
        this.progressView2.background = "#223403";
        this.progressView2.color = "linear-gradient(#97FF01, #FFFFFF)";
        this.window.addChild(this.progressView2);

        this.progressView3 = new ProgressView();
        this.progressView3.left = 20;
        this.progressView3.top = 250;
        this.progressView3.width = 280;
        this.progressView3.height = 30;
        this.progressView3.background = "#0E171C";
        this.progressView3.color = "linear-gradient(#F20026, #FFFFFF)";
        this.window.addChild(this.progressView3);

        var animation1 = new PropertyAnimation(this.progressView1);
        animation1.from = {value: 0};
        animation1.to = {value: 0.3};
        animation1.duration = 1000;
        animation1.easing = "ease";

        var animation2 = new PropertyAnimation(this.progressView2);
        animation2.from = {value: 0};
        animation2.to = {value: 0.5};
        animation2.duration = 1000;
        animation2.easing = "ease";

        var animation3 = new PropertyAnimation(this.progressView3);
        animation3.from = {value: 0};
        animation3.to = {value: 0.7};
        animation3.duration = 1000;
        animation3.easing = "ease";

        var animationGroup = new AnimationGroup();
        animationGroup.add(animation1);
        animationGroup.add(animation2);
        animationGroup.add(animation3);
        animationGroup.type = "sequential";

        animationGroup.start();
    }
}, module);
