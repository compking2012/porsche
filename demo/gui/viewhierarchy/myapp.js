"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var TextView = fx.import("framework.ui.view.TextView");
var Button = fx.import("framework.ui.view.Button");

Class.define("MyApp", App, {
    onStart: function() {
        var compositeView = new CompositeView();
        compositeView.left = 50;
        compositeView.top = 50;
        compositeView.width = 200;
        compositeView.height = 200;
        this.window.addChild(compositeView);

        var textView = new TextView();
        textView.width = 200;
        textView.height = 100;
        textView.color = "#FF0000";
        textView.fontSize = "24px";
        textView.background = "#CCCCCC";
        textView.text = "Hello, world!";
        compositeView.addChild(textView);

        var button = new Button();
        button.text = "OK";
        button.fontSize = "32px";
        button.radius = 50;
        button.textAlign = "center";
        button.background = "#FF0000";
        button.top = 100;
        button.width = 200;
        button.height = 100;
        compositeView.addChild(button);
    }
}, module);
