"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var ColumnLayout = fx.import("framework.ui.layout.ColumnLayout");
var RelativeLayout = fx.import("framework.ui.layout.RelativeLayout");
var View = fx.import("framework.ui.view.View");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);
        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        this.windowLayout = new RelativeLayout();
        this.windowLayout.setLayoutParam(0, "align", {center: "parent", middle: "parent"});
        this.window.width = 320;
        this.window.height = 320;
        this.window.layout = this.windowLayout;
        this.window.addGestureRecognizer(new TapRecognizer());
        this.window.addEventListener("tap", this.onTap.bind(this));

        this.compositeView = new CompositeView();
        this.compositeView.width = 320;
        this.compositeView.height = 320;
        this.compositeView.background = "#FFFFFF";
        this.window.addChild(this.compositeView);

        this.columnLayout = new ColumnLayout();
        this.columnLayout.paddingLeft = 10;
        this.columnLayout.paddingRight = 10;

        this.columnLayout.defaultLayoutParam = {align: "center", margin: {left: 30, right: 30, top: 10}};
        //this.columnLayout.defaultLayoutParam = {align: "center", margin: {center: 0, top: 10}};

        //this.columnLayout.setLayoutParam(0, "margin", {left: 30, top: 0});
        //this.columnLayout.setLayoutParam(1, "margin", {left: 30, top: 10});
        //this.columnLayout.setLayoutParam(2, "margin", {center: 0, top: 10});
        //this.columnLayout.setLayoutParam(3, "margin", {left: 30, top: 10});
        //this.columnLayout.setLayoutParam(4, "margin", {left: 30, right: 30, top: 10});

        this.view1 = new View();
        this.view1.width = 80;
        this.view1.height = 20;
        this.view1.background = colors[0];
        this.compositeView.addChild(this.view1);

        this.view2 = new View();
        this.view2.width = 80;
        this.view2.height = 20;
        this.view2.background = colors[1];
        this.compositeView.addChild(this.view2);

        this.view3 = new View();
        this.view3.width = 80;
        this.view3.height = 20;
        this.view3.background = colors[2];
        this.compositeView.addChild(this.view3);

        this.compositeView.layout = this.columnLayout;
    },

    onTap: function() {
        var view = new View();
        view.width = 100;
        view.height = 20;
        view.background = "#FF00FF";
        this.compositeView.addChild(view);
    }
}, module);
