define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var CompositeView = require("/framework/ui/view/compositeview");
var TextView = require("/framework/ui/view/textview");
var Button = require("/framework/ui/view/button");

Class.define("MyApp", App, {
    onStart: function() {
        var compositeView = new CompositeView();
        compositeView.left = 50;
        compositeView.top = 50;
        compositeView.width = 200;
        compositeView.height = 200;
        this.window.addChild(compositeView);

        var textView = new TextView();
        textView.width = 200;
        textView.height = 100;
        textView.color = "#FF0000";
        textView.fontSize = "24px";
        textView.background = "#CCCCCC";
        textView.text = "Hello, world!";
        compositeView.addChild(textView);

        var button = new Button();
        button.text = "OK";
        button.fontSize = "32px";
        button.radius = 50;
        button.textAlign = "center";
        button.background = "#FF0000";
        button.top = 100;
        button.width = 200;
        button.height = 100;
        compositeView.addChild(button);
    }
}, module);

});