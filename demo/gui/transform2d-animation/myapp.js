define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var CompositeView = require("/framework/ui/view/compositeview");
var View = require("/framework/ui/view/view");
var Animation = require("/framework/ui/animation/animation");
var AnimationGroup = require("/framework/ui/animation/animationgroup");

Class.define("MyApp", App, {
    onStart: function() {
        var compositeView = new CompositeView();
        compositeView.width = 200;
        compositeView.height = 200;
        compositeView.left = 100;
        compositeView.top = 60;
        compositeView.background = "#CCCCCC";
        this.window.addChild(compositeView);

        var view1 = new View();
        view1.background = "#FF0000";
        view1.width = 100;
        view1.height = 100;
        view1.left = 50;
        view1.top = 50;
        view1.originX = 50;
        view1.originY = 50;
        view1.rotationZ = Math.PI / 180 * 45;
        view1.translationX = 50;
        view1.translationY = 50;
        view1.scaleX = 1.5;
        view1.scaleY = 1.5;
        compositeView.addChild(view1);

        var view2 = new View();
        view2.background = "#00FF00";
        view2.width = 100;
        view2.height = 100;
        view2.left = 150;
        view2.top = 160;
        view2.originX = 10;
        view2.originY = 10;
        view2.rotationZ = Math.PI / 180 * 45;
        view2.translationX = 50;
        view2.translationY = 50;
        view2.scaleX = 1.5;
        view2.scaleY = 1.5;
        this.window.addChild(view2);

        var animation1 = new Animation(view1);
        animation1.from = {rotationZ: 0 * Math.PI / 180, scaleX: 0.5, scaleY: 0.5, translationX: -200, translationY: -200};
        animation1.to = {rotationZ: 360 * Math.PI / 180, scaleX: 2, scaleY: 2, translationX: 200, translationY: 200};
        animation1.duration = 5000;
        animation1.repeat = 0;
        animation1.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";

        var animation2 = new Animation(view2);
        animation2.from = {rotationZ: 0 * Math.PI / 180, scaleX: 0.5, scaleY: 0.5, translationX: -200, translationY: -200};
        animation2.to = {rotationZ: 360 * Math.PI / 180, scaleX: 2, scaleY: 2, translationX: 200, translationY: 200};
        animation2.duration = 5000;
        animation2.repeat = 0;
        animation2.easing = "cubic-bezier(0.42, 0, 0.58, 1.0)";

        var animationGroup = new AnimationGroup();
        animationGroup.add(animation1);
        animationGroup.add(animation2);
        animationGroup.type = "parallel";
        animationGroup.start();
    }
}, module);

});