define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var ProgressView = require("/framework/ui/view/progressview");
var Animation = require("/framework/ui/animation/animation");
var AnimationGroup = require("/framework/ui/animation/animationgroup");

Class.define("MyApp", App, {
    onStart: function() {
        this.progressView1 = new ProgressView();
        this.progressView1.left = 20;
        this.progressView1.top = 50;
        this.progressView1.width = 280;
        this.progressView1.height = 50;
        this.progressView1.lineWidth = 30;
        this.progressView1.background = "#0D171C";
        this.progressView1.foreground = "linear-gradient(#3ECCD3, #FFFFFF)";
        this.window.addChild(this.progressView1);

        this.progressView2 = new ProgressView();
        this.progressView2.left = 20;
        this.progressView2.top = 150;
        this.progressView2.width = 280;
        this.progressView2.height = 50;
        this.progressView2.lineWidth = 30;
        this.progressView2.background = "#223403";
        this.progressView2.foreground = "linear-gradient(#97FF01, #FFFFFF)";
        this.window.addChild(this.progressView2);

        this.progressView3 = new ProgressView();
        this.progressView3.left = 20;
        this.progressView3.top = 250;
        this.progressView3.width = 280;
        this.progressView3.height = 50;
        this.progressView3.lineWidth = 30;
        this.progressView3.background = "#0E171C";
        this.progressView3.foreground = "linear-gradient(#F20026, #FFFFFF)";
        this.window.addChild(this.progressView3);

        var animation1 = new Animation(this.progressView1);
        animation1.from = {value: 0};
        animation1.to = {value: 0.3};
        animation1.duration = 1000;
        animation1.easing = "ease";

        var animation2 = new Animation(this.progressView2);
        animation2.from = {value: 0};
        animation2.to = {value: 0.5};
        animation2.duration = 1000;
        animation2.easing = "ease";

        var animation3 = new Animation(this.progressView3);
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

});