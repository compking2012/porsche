"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var CheckBox = fx.import("framework.ui.view.CheckBox");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 50;
        this.textView.fontSize = "30px";
        this.textView.textAlign = "center";
        this.textView.fontStyle = "normal";
        this.textView.background = "#FF0000";
        this.textView.color = "#00FF00";
        this.textView.text = "Tap the Checkbox";
        this.window.addChild(this.textView);

        this.checkbox = new CheckBox();
        this.checkbox.left = 50;
        this.checkbox.top = 50;
        this.checkbox.width = 100;
        this.checkbox.height = 100;
        this.checkbox.addEventListener("tap", this.onTap.bind(this));
        this.window.addChild(this.checkbox);
    },

    destroy: function() {
        this.checkbox.destroy();
        this.checkbox = null;
    },

    onTap: function() {
        if (this.checkbox.value) {
            this.textView.text = "Checkbox is on";
        } else {
            this.textView.text = "Checkbox is off";
        }
    }
}, module);
