"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var View = fx.import("framework.ui.view.View");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var GridLayout = fx.import("framework.ui.layout.GridLayout");
var GridLayoutParam = fx.import("framework.ui.layout.GridLayoutParam");
var LayoutParam = fx.import("framework.ui.layout.LayoutParam");
var ScrollableView = fx.import("framework.ui.view.ScrollableView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var scrollableView = new ScrollableView();
        scrollableView.width = this.window.width;
        scrollableView.height = this.window.height;;
        this.window.addChild(scrollableView);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        var gridLayout = new GridLayout();
        gridLayout.rows = 4;
        gridLayout.columns = 3;
        //gridLayout.defaultparam.leftmargin = 10;//set margin by this way or use setMargin()
        //gridLayout.defaultparam.topmargin = 10;
        gridLayout.defaultparam.setMargin(10,10,10,10);
        gridLayout.defaultparam.align = "fill";
        gridLayout.defaultparam.valign = "fill";

        var cv = new CompositeView();
        cv.width = 400;
        cv.height = 400;
        cv.layout = gridLayout;
        scrollableView.addChild(cv);

        var layoutparam = gridLayout.getParamAtIndex(1);
        layoutparam.align = "center";
        layoutparam.valign = "middle";
        layoutparam = gridLayout.getParamAtIndex(2);
        layoutparam.align = "left";
        layoutparam.valign = "top";
        layoutparam = gridLayout.getParamAtIndex(3);
        layoutparam.align = "right";
        layoutparam.valign = "bottom";

        for (var i = 0; i < 6; i++) {
            var view = new View();
            view.background = colors[i % 5];
            view.width = 80;
            view.height = 80;
            cv.addChild(view);
        }

        var view = new View();
        view.background = "#0FFFF0";
        view.width = 180;
        view.height = 180;
        cv.addChild(view);

        setTimeout(function(){console.log("Hello world");},1000000);
    }
}, module);
