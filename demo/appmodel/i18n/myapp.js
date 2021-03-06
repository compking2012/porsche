"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", App, {
    onStart: function() {
        var textview = new TextView();
        textview.text = global.app.getI18nString("MY_TEXT");
        textview.fontSize = "60px";
        textview.textAlign = "center";
        textview.fontStyle = "normal";
        textview.background = "#FF0000";
        textview.color = "#00FF00";
        textview.width = 300;
        textview.height = 100;
        textview.left = 10;
        textview.top = 100;
        textview.multiLine = false;

        this.window.addChild(textview);
    }
}, module);
