"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var TextField = fx.import("framework.ui.view.TextField");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.textField = new TextField();
        this.textField.left = 60;
        this.textField.top = 110;
        this.textField.width = 200;
        this.textField.height = 100;
        this.textField.fontSize = "36px";
        this.textField.placeholder = "input...";

        this.window.addChild(this.textField);
    }
}, module);
