define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var ScrollableView = require("/framework/ui/view/scrollableview");
var CompositeView = require("/framework/ui/view/compositeview");
var TextView = require("/framework/ui/view/textview");

Class.define("MyApp", App, {
    onStart: function() {
        var scrollableView = new ScrollableView();
        scrollableView.width = 200;
        scrollableView.height = 200;
        scrollableView.left = 60;
        scrollableView.top = 60;
        this.window.addChild(scrollableView);

        var view = new CompositeView();
        view.left = 10;
        view.top = 10;
        view.width = 200;
        view.height = 200;
        view.background = "rgb(192, 80, 77)";
        scrollableView.addChild(view);

        var textView = new TextView();
        textView.text = "TextView";
        textView.fontSize = "24px";
        textView.background = "#FF0000";
        textView.width = 100;
        textView.height = 100;
        view.addChild(textView);

        var view2 = new CompositeView();
        view2.width = 200;
        view2.height = 200;
        view2.left = 250;
        view2.top = 250;
        view2.background = "#00FF00";
        scrollableView.addChild(view2);
    }
}, module);

});