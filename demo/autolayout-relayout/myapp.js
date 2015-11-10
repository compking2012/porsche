"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var TextView = fx.import("framework.ui.view.TextView");
var AutoLayout = fx.import("framework.ui.layout.AutoLayout");
var TapRecognizer = fx.import("framework.ui.gesture.TapRecognizer");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.window.addGestureRecognizer(new TapRecognizer());
        this.window.addEventListener("tap", this.onTap.bind(this));

        this.compositeView = new CompositeView();
        this.compositeView.width = 200;
        this.compositeView.height = 320;


        var view1 = new TextView();
        view1.background = "#FF0000";
        this.compositeView.addChild(view1);

        var view2 = new TextView();
        view2.background = "#00FF00";
        this.compositeView.addChild(view2);

        var view3 = new TextView();
        view3.background = "#0000FF";
        this.compositeView.addChild(view3);

        var view4 = new TextView();
        view4.background = "#FFFF00";
        this.compositeView.addChild(view4);

        var view5 = new TextView();
        view5.background = "#00FFFF";
        this.compositeView.addChild(view5);

        this.window.addChild(this.compositeView);

        this.compositeView.layout = new AutoLayout();
        this.compositeView.layout.addConstraints([
            "|-[child1(child3)]-[child3]-|",
            "|-[child2(child4)]-[child4]-|",
            "[child5(child4)]-|",
            "V:|-[child1(child2)]-[child2]-|",
            "V:|-[child3(child4,child5)]-[child4]-[child5]-|"
        ]);

        this.compositeView.layout.setLayoutParam(0, "name", "child1");
        this.compositeView.layout.setLayoutParam(1, "name", "child2");
        this.compositeView.layout.setLayoutParam(2, "name", "child3");
        this.compositeView.layout.setLayoutParam(3, "name", "child4");
        this.compositeView.layout.setLayoutParam(4, "name", "child5");

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
