"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var TextView = fx.import("framework.ui.view.TextView");
var Slider = fx.import("framework.ui.view.Slider");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.textview = new TextView();
        this.textview.fontSize = "40px";
        this.textview.textAlign = "center";
        this.textview.fontStyle = "normal";
        this.textview.color = "#00FF00";
        this.textview.width = 300;
        this.textview.height = 100;
        this.textview.left = 10;
        this.textview.top = 10;
        this.window.addChild(this.textview);

        this.slider = new Slider();
        this.slider.background = "#FF0000";
        this.slider.left = 20;
        this.slider.top = 200;
        this.slider.width = 280;
        this.slider.height = 80;
        // this.slider.thumb = __dirname + "/res/sliderthumb.png";
        this.slider.addEventListener("change", this.onChange.bind(this));
        this.window.addChild(this.slider);

        this.slider.value = 0.5;
        this.textview.text = 0.5;
    },

    onChange: function(e) {
        this.textview.text = this.slider.value;
    }
}, module);
