"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var SwipeView = fx.import("framework.ui.view.SwipeView");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    onStart: function() {
        var swipeView = new SwipeView();
        swipeView.orientation = "horizental";
        swipeView.width = 320;
        swipeView.height = 320;

        var view1 = new View();
        view1.background = "#FF0000";
        swipeView.addChild(view1);

        var view2 = new View();
        view2.background = "#00FF00";
        swipeView.addChild(view2);

        var view3 = new View();
        view3.background = "#0000FF";
        swipeView.addChild(view3);

        // var view2 = new CompositeView();
        // view2.background = "#00FF00";
        // view2.width = 320;
        // view2.height = 320;
        // swipeView.addChild(view2);

        // var textView2 = new TextView();
        // textView2.text = "I am a TextView of CompositeView";
        // textView2.left = 100;
        // textView2.width = 320;
        // textView2.height = 100;
        // view2.addChild(textView2);

        // var imageView = new ImageView();
        // imageView.src = global.app.rootPath + "/res/bg_1.png";
        // imageView.width = 320;
        // imageView.height = 320;
        // swipeView.addChild(imageView);

        this.window.addChild(swipeView);
    }
}, module);
