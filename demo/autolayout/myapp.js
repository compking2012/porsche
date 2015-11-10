"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var TextView = fx.import("framework.ui.view.TextView");
var AutoLayout = fx.import("framework.ui.layout.AutoLayout");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var compositeView = new CompositeView();
        compositeView.width = 320;
        compositeView.height = 320;

        var view1 = new TextView();
        view1.background = "#FF0000";
        compositeView.addChild(view1);

        var view2 = new TextView();
        view2.background = "#00FF00";
        compositeView.addChild(view2);

        var view3 = new TextView();
        view3.background = "#0000FF";
        compositeView.addChild(view3);

        var view4 = new TextView();
        view4.background = "#FFFF00";
        compositeView.addChild(view4);

        var view5 = new TextView();
        view5.background = "#00FFFF";
        compositeView.addChild(view5);

        this.window.addChild(compositeView);

        compositeView.layout = new AutoLayout();
        compositeView.layout.addConstraints([
            "|-[child1(child3)]-[child3]-|",
            "|-[child2(child4)]-[child4]-|",
            "[child5(child4)]-|",
            "V:|-[child1(child2)]-[child2]-|",
            "V:|-[child3(child4,child5)]-[child4]-[child5]-|"
        ]);

        compositeView.layout.setLayoutParam(0, "name", "child1");
        compositeView.layout.setLayoutParam(1, "name", "child2");
        compositeView.layout.setLayoutParam(2, "name", "child3");
        compositeView.layout.setLayoutParam(3, "name", "child4");
        compositeView.layout.setLayoutParam(4, "name", "child5");
    }
}, module);
