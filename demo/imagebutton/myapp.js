define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var ImageButton = require("/framework/ui/view/imagebutton");
var TextView = require("/framework/ui/view/textview");

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
        this.imageButton.src = "./res/wall3.png";
        this.imageButton.pressedSrc = "./res/wall1.png";
        this.imageButton.disabledSrc = "./res/wall2.png";
        this.imageButton.left = 50;
        this.imageButton.top = 50;
        this.imageButton.width = 100;
        this.imageButton.height = 100;
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

});
