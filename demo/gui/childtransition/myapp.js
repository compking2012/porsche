"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var ChildTransition = fx.import("framework.ui.transition.ChildTransition");
var PropertyAnimation = fx.import("framework.ui.animation.PropertyAnimation");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");
var CircleLayout = require("./circlelayout");

Class.define("MyApp", App, {
    onStart: function() {
        this.colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "navy", "magenta", "salmon", "sienna", "turquoise"];
        this.window.addGestureRecognizer(new TapRecognizer());
        this.window.addEventListener("tap", this.onTapWindow.bind(this));

        this.index = 0;
        while (this.index < 3) {
            this.createView();
        }

        var childTransition = new ChildTransition();

        var appearingAnimation = new PropertyAnimation();
        appearingAnimation.from = {rotationZ: 0, opacity: 0};
        appearingAnimation.to = {rotationZ: 2 * Math.PI, opacity: 1};
        appearingAnimation.duration = 300;
        childTransition.setAnimation("appearing", appearingAnimation);

        var changeAppearingAnimation = new PropertyAnimation();
        changeAppearingAnimation.from = {scaleX: 0.5, scaleY: 0.5};
        changeAppearingAnimation.to = {scaleX: 1, scaleY: 1};
        changeAppearingAnimation.duration = 300;
        childTransition.setAnimation("change-appearing", changeAppearingAnimation);

        var disappearingAnimation = new PropertyAnimation();
        disappearingAnimation.from = {rotationZ: 0, opacity: 1};
        disappearingAnimation.to = {rotationZ: 2 * Math.PI, opacity: 0};
        disappearingAnimation.duration = 300;
        childTransition.setAnimation("disappearing", disappearingAnimation);

        var changeDisappearingAnimation = new PropertyAnimation();
        changeDisappearingAnimation.from = {scaleX: 0.5, scaleY: 0.5};
        changeDisappearingAnimation.to = {scaleX: 1, scaleY: 1};
        changeDisappearingAnimation.duration = 300;
        childTransition.setAnimation("change-disappearing", changeDisappearingAnimation);

        this.window.addTransition(childTransition);

        this.window.layout = new CircleLayout();
    },

    onTapWindow: function(e) {
        if (e.target !== this.window) {
            return;
        }
        this.createView();
    },

    onTapView: function(e) {
        e.stopPropagation();
        var view = e.target;
        this.window.removeChild(view);
    },

    createView: function() {
        var view = new View();
        view.background = this.colors[this.index % this.colors.length];
        view.width = 60;
        view.height = 60;
        view.originX = 30;
        view.originY = 30;
        view.addGestureRecognizer(new TapRecognizer());
        view.addEventListener("tap", this.onTapView.bind(this));
        this.window.addChild(view);
        this.index++;
    }
}, module);
