define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var Switch = require("../../../framework/ui/view/switch");
var TextView = require("../../../framework/ui/view/textview");

Class.define("MyApp", App, {
    onStart: function() {
        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 50;
        this.textView.fontSize = "30px";
        this.textView.textAlign = "center";
        this.textView.fontStyle = "normal";
        this.textView.background = "#FF0000";
        this.textView.color = "#00FF00";
        this.textView.text = "Click the Switch";
        this.window.addChild(this.textView);

        this.switch = new Switch();
        this.switch.left = 50;
        this.switch.top = 50;
        this.switch.width = 100;
        this.switch.height = 100;
        this.switch.addEventListener("click", this.onClick.bind(this));
        this.window.addChild(this.switch);
    },

    destroy: function() {
        this.switch.destroy();
        this.switch = null;
    },

    onClick: function() {
        if (this.switch.value) {
            this.textView.text = "Switch is on";
        } else {
            this.textView.text = "Switch is off";
        }
    }
}, module);

});