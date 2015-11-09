"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var textview = new TextView();
        textview.text = "1234567890!";
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
