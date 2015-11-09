"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var ScrollableView = fx.import("framework.ui.view.ScrollableView");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        global.CloudAppFXDebugPaintFPS = true;

        var scrollableView = new ScrollableView();
        scrollableView.width = 200;
        scrollableView.height = 200;
        scrollableView.left = 60;
        scrollableView.top = 60;
        this.window.addChild(scrollableView);

        var view = new CompositeView();
        view.left = 10;
        view.top = 10;
        view.width = 200;
        view.height = 200;
        view.background = "rgb(192, 80, 77)";
        scrollableView.addChild(view);

        var textView = new TextView();
        textView.text = "TextView";
        textView.fontSize = "24px";
        textView.background = "#FF0000";
        textView.width = 100;
        textView.height = 100;
        view.addChild(textView);

        var view2 = new CompositeView();
        view2.width = 200;
        view2.height = 200;
        view2.left = 250;
        view2.top = 250;
        view2.background = "#00FF00";
        scrollableView.addChild(view2);
    }
}, module);
