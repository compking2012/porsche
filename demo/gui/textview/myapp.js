"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", App, {
    onStart: function() {
        var textview = new TextView();
        textview.text = "Hello world!";
        textview.fontSize = "24px";
        textview.textAlign = "center";
        textview.fontStyle = "normal";
        textview.background = "#FF0000";
        textview.color = "#00FF00";
        textview.width = 300;
        textview.height = 100;
        textview.left = 10;
        textview.top = 10;
        textview.multiLine = false;

        this.window.addChild(textview);
    }
}, module);
