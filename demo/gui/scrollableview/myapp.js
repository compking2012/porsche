"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ScrollableView = fx.import("framework.ui.view.ScrollableView");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var scrollableView = new ScrollableView();
        scrollableView.width = 320;
        scrollableView.height = 320;
        this.window.addChild(scrollableView);

        var view1 = new CompositeView();
        view1.width = 400;
        view1.height = 400;
        view1.background = "rgb(192, 80, 77)";
        scrollableView.addChild(view1);

        var textView1 = new TextView();
        textView1.text = "TextView1";
        textView1.fontSize = "30px";
        textView1.background = "#FF0000";
        textView1.width = 300;
        textView1.height = 300;
        view1.addChild(textView1);

        var view2 = new CompositeView();
        view2.left = 400;
        view2.width = 400;
        view2.height = 400;
        view2.background = "rgb(155, 187, 89)";
        scrollableView.addChild(view2);

        var textView2 = new TextView();
        textView2.text = "TextView2";
        textView2.fontSize = "30px";
        textView2.background = "#00FF00";
        textView2.width = 300;
        textView2.height = 300;
        view2.addChild(textView2);

        var view3 = new CompositeView();
        view3.top = 400;
        view3.width = 400;
        view3.height = 400;
        view3.background = "rgb(128, 100, 162)";
        scrollableView.addChild(view3);

        var textView3 = new TextView();
        textView3.text = "TextView3";
        textView3.fontSize = "30px";
        textView3.background = "#0000FF";
        textView3.width = 300;
        textView3.height = 300;
        view3.addChild(textView3);

        var view4 = new CompositeView();
        view4.left = 400;
        view4.top = 400;
        view4.width = 400;
        view4.height = 400;
        view4.background = "rgb(63, 89, 34)";
        scrollableView.addChild(view4);

        var textView4 = new TextView();
        textView4.text = "TextView4";
        textView4.fontSize = "30px";
        textView4.background = "#FFFF00";
        textView4.width = 300;
        textView4.height = 300;
        view4.addChild(textView4);
    }
}, module);
