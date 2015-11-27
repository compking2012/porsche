define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var CompositeView = require("../../../framework/ui/view/compositeview");
var View = require("../../../framework/ui/view/view");
var AutoLayout = require("../../../framework/ui/layout/autolayout");

Class.define("MyApp", App, {
    onStart: function() {
        var compositeView = new CompositeView();
        compositeView.width = 320;
        compositeView.height = 320;

        var view1 = new View();
        view1.background = "#FF0000";
        compositeView.addChild(view1);

        var view2 = new View();
        view2.background = "#00FF00";
        compositeView.addChild(view2);

        var view3 = new View();
        view3.background = "#0000FF";
        compositeView.addChild(view3);

        var view4 = new View();
        view4.background = "#FFFF00";
        compositeView.addChild(view4);

        var view5 = new View();
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

});