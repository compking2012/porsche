"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var TextField = fx.import("framework.ui.view.TextField");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.textField = new TextField();
        this.textField.background = "#FF0000";
        this.textField.left = 60;
        this.textField.top = 110;
        this.textField.width = 200;
        this.textField.height = 100;
        this.textField.text = "Press Key...";
        this.textField.addEventListener("keydown", this.onKeyDown.bind(this));
        this.textField.addEventListener("keyup", this.onKeyUp.bind(this));

        this.window.addChild(this.textField);
    },

    onKeyDown: function(e) {
        this.textField.text = "KeyDown: " + String.fromCharCode(e.keyCode);
    },

    onKeyUp: function(e) {
        this.textField.text = "KeyUp: " + String.fromCharCode(e.keyCode);
    }
}, module);
