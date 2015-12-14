"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var RowLayout = fx.import("framework.ui.layout.RowLayout");
var ColumnLayout = fx.import("framework.ui.layout.ColumnLayout");
var LayoutTransition = fx.import("framework.ui.transition.LayoutTransition");
var PropertyAnimation = fx.import("framework.ui.animation.PropertyAnimation");
var CircleLayout = require("./circlelayout");

Class.define("MyApp", App, {
    onStart: function() {
        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        this.rowLayout = new RowLayout();
        this.rowLayout.paddingTop = 10;
        this.rowLayout.paddingTop = 10;
        this.rowLayout.defaultLayoutParam = {align: "top", margin: {left: 10}};

        this.columnLayout = new ColumnLayout();
        this.columnLayout.paddingLeft = 10;
        this.columnLayout.paddingRight = 10;
        this.columnLayout.defaultLayoutParam = {align: "left", margin: {top: 10}};

        this.circleLayout = new CircleLayout();

        this.view1 = new View();
        this.view1.width = 40;
        this.view1.height = 40;
        this.view1.originX = 20;
        this.view1.originY = 20;
        this.view1.background = colors[0];
        this.window.addChild(this.view1);

        this.view2 = new View();
        this.view2.width = 80;
        this.view2.height = 80;
        this.view2.originX = 40;
        this.view2.originY = 40;
        this.view2.background = colors[1];
        this.window.addChild(this.view2);

        this.window.layout = this.rowLayout;

        this.view3 = new View();
        this.view3.width = 120;
        this.view3.height = 120;
        this.view3.originX = 60;
        this.view3.originY = 60;
        this.view3.background = colors[2];
        this.window.addChild(this.view3);

        var layoutTranstion = new LayoutTransition();

        var animation2 = new PropertyAnimation(this.view2);
        animation2.from = {rotationZ: 0, opacity: 0};
        animation2.to = {rotationZ: 2 * Math.PI, opacity: 1};
        animation2.duration = 300;
        layoutTranstion.setAnimation(1, animation2);

        var animation3 = new PropertyAnimation(this.view3);
        animation3.from = {scaleX: 0.5, scaleY: 0.5};
        animation3.to = {scaleX: 1, scaleY: 1};
        animation3.duration = 300;
        layoutTranstion.setAnimation(2, animation3);
        this.window.addTransition(layoutTranstion);

        this.window.addEventListener("touchend", this.onTouchEnd.bind(this));
    },

    onTouchEnd: function() {
        if (this.window.layout === this.columnLayout) {
            this.window.layout = this.circleLayout;
        } else if (this.window.layout === this.rowLayout) {
            this.window.layout = this.columnLayout;
        } else {
            this.window.layout = this.rowLayout;
        }
    }
}, module);
