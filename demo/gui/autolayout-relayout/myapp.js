define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var CompositeView = require("../../../framework/ui/view/compositeview");
var TextView = require("../../../framework/ui/view/textview");
var AutoLayout = require("../../../framework/ui/layout/autolayout");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.addEventListener("touchend", this.onTouchEnd.bind(this));

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

    onTouchEnd: function() {
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

});