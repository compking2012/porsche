define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ImageButton = require("../../../framework/ui/view/imagebutton");
var TextView = require("../../../framework/ui/view/textview");

Class.define("MyApp", App, {
    onStart: function() {
        this.textView = new TextView();
        this.textView.width = 320;
        this.textView.height = 50;
        this.textView.fontSize = "30px";
        this.textView.align = "center";
        this.textView.fontStyle = "normal";
        this.textView.background = "#FF0000";
        this.textView.color = "#00FF00";
        this.textView.text = "Tap the ImageButton";
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
        this.imageButton.addEventListener("tap", this.onTap.bind(this));
        this.window.addChild(this.imageButton);
    },

    onTap: function() {
        this.textView.text = "Hello!";
    }
}, module);

});