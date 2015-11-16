"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var RelativeLayout = fx.import("framework.ui.layout.RelativeLayout");
var View = fx.import("framework.ui.view.View");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");

Class.define("MyApp", App, {
    onStart: function() {
        this.windowLayout = new RelativeLayout();
        this.windowLayout.setLayoutParam(0, "align", {center: "parent", middle: "parent"});
        this.window.layout = this.windowLayout;
        this.window.addGestureRecognizer(new TapRecognizer());
        this.window.addEventListener("tap", this.onTap.bind(this));

        this.compositeView = new CompositeView();
        this.compositeView.width = 200;
        this.compositeView.height = 320;
        this.compositeView.background = "#FFFFFF";

        // this is only for test cases, when actually should use var layout instead of this.layout
        this.layout = new RelativeLayout();
        this.layout.setLayoutParam(0, "align", {left: "parent", top: "parent"});
        this.layout.setLayoutParam(0, "margin", {left: 20, top: 20});

        this.layout.setLayoutParam(1, "align", {left: {target: 0, side: "right"}, right: "parent", top: "parent", bottom: {target: 0, side: "bottom"}});
        this.layout.setLayoutParam(1, "margin", {right: 20, top: 20, left: 20});

        this.layout.setLayoutParam(2, "align", {left: "parent", top: {target: 0, side: "bottom"}, right: "parent", bottom: "parent"});
        this.layout.setLayoutParam(2, "margin", {left: 20, top: 20, right: 20, bottom: 20});

        this.view1 = new View();
        this.view1.width = 80;
        this.view1.height = 100;
        this.view1.background = "#FF0000";
        this.compositeView.addChild(this.view1);

        this.view2 = new View();
        this.view2.background = "#00FF00";
        this.compositeView.addChild(this.view2);

        this.view3 = new View();
        this.view3.background = "#0000FF";
        this.compositeView.addChild(this.view3);

        this.compositeView.layout = this.layout;
        this.window.addChild(this.compositeView);
        this.stopflag = true;
    },

    onTap: function() {
        if (this.stopflag) {
            this.compositeView.width = 320;
            this.compositeView.height = 200;
            this.stopflag = false;
        } else {
            this.compositeView.width = 200;
            this.compositeView.height = 320;
            this.stopflag = true;
        }
    }
}, module);
