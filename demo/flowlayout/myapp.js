"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var View = fx.import("framework.ui.view.View");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var FlowLayout = fx.import("framework.ui.layout.FlowLayout");
var FlowLayoutParam = fx.import("framework.ui.layout.FlowLayoutParam");
var ScrollableView = fx.import("framework.ui.view.ScrollableView");
var Switch = fx.import("framework.ui.view.Switch");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var scrollableView = new ScrollableView();
        scrollableView.width = this.window.width;
        scrollableView.height = this.window.height;

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];
        var height = [80, 60, 130, 50, 100, 90, 30];
        // code here to define layout style and set property values
        this.flow = new FlowLayout();
        this.flow.lineSpacing = 20;
        this.flow.align = "left";
        this.flow.valign = "middle";
        this.flow.header = 30;// set the spacing of header
        this.flow.defaultParam.itemSpacing = 10;

        this.cv = new  CompositeView();
        this.cv.left = 0;
        this.cv.top = 0;
        this.cv.height = 300;
        this.cv.width = 320;
        this.cv.background = "rgb(128, 100, 162)";
        this.cv.layout = this.flow;
        scrollableView.addChild(this.cv);

        var layoutparam = this.flow.getParamAtIndex(1);
        layoutparam.itemSpacing = 20;
        layoutparam = this.flow.getParamAtIndex(2);
        layoutparam.itemSpacing = 30;

        for (var i = 0; i < 5; i++) {
            var view = new View();
            view.background = colors[i % 5];
            view.width = 80;
            view.height =height[i];
            this.cv.addChild(view);
        }

        this.window.addChild(scrollableView);
        setTimeout(function(){console.log("Hello world");},1000000);

    }

}, module);
