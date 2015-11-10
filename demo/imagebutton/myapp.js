"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var ImageButton = fx.import("framework.ui.view.ImageButton");
var TextView = fx.import("framework.ui.view.TextView");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 50;
        this.textView.fontSize = "30px";
        this.textView.textAlign = "center";
        this.textView.fontStyle = "normal";
        this.textView.background = "#FF0000";
        this.textView.color = "#00FF00";
        this.textView.text = "Click the ImageButton";
        this.window.addChild(this.textView);

        this.imageButton = new ImageButton();
        this.imageButton.left = 50;
        this.imageButton.top = 50;
        this.imageButton.width = 100;
        this.imageButton.height = 100;
        this.imageButton.src = global.app.rootPath + "/res/wall3.png";
        this.imageButton.pressedSrc = global.app.rootPath + "/res/wall1.png";
        this.imageButton.disabledSrc = global.app.rootPath + "/res/wall2.png";
        this.imageButton.addEventListener("click", this.onClick.bind(this));
        this.window.addChild(this.imageButton);
    },

    destroy: function() {
        this.imageButton.destroy();
        this.imageButton = null;
    },

    onClick: function() {
        this.textView.text = "Hello!";
    }
}, module);
