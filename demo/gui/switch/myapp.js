"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var Switch = fx.import("framework.ui.view.Switch");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", App, {
    onStart: function() {
        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 50;
        this.textView.fontSize = "30px";
        this.textView.fontStyle = "normal";
        this.textView.align = "center";
        this.textView.background = "#FF0000";
        this.textView.color = "#00FF00";
        this.textView.text = "Click the Switch";
        this.window.addChild(this.textView);

        this.switch = new Switch();
        this.switch.left = 50;
        this.switch.top = 50;
        this.switch.width = 100;
        this.switch.height = 100;
        this.switch.addEventListener("tap", this.onTap.bind(this));
        this.window.addChild(this.switch);
    },

    onTap: function() {
        if (this.switch.value) {
            this.textView.text = "Switch is on";
        } else {
            this.textView.text = "Switch is off";
        }
    }
}, module);
