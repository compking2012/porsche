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
        this.imageButton.top = 100;
        this.imageButton.width = 216;
        this.imageButton.height = 88;
        this.imageButton.src = global.app.rootPath + "/res/button_normal.png";
        this.imageButton.pressedImageSrc = global.app.rootPath + "/res/button_pressed.png";
        this.imageButton.focusedImageSrc = global.app.rootPath + "/res/button_focused.png";
        this.imageButton.disabledImageSrc = global.app.rootPath + "/res/button_disabled.png";
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
