define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var CompositeView = require("/framework/ui/view/compositeview");
var TextView = require("/framework/ui/view/textview");
var View = require("/framework/ui/view/view");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.window.id = "window";

        var compositeView = new CompositeView();
        compositeView.id = "compositeView";
        compositeView.background = "#CCCCCC";
        compositeView.left = 50;
        compositeView.top = 50;
        compositeView.width = 150;
        compositeView.height = 150;
        this.window.addChild(compositeView);

        var textView = new TextView();
        textView.id = "textView";
        textView.left = 20;
        textView.top = 20;
        textView.width = 100;
        textView.height = 50;
        textView.color = "#FFFFFF";
        textView.fontSize = "24px";
        textView.background = "#FF0000";
        textView.text = "Hello, world!";
        compositeView.addChild(textView);

        var view1 = new View();
        view1.id = "view1";
        view1.left = 100;
        view1.top = 100;
        view1.width = 120;
        view1.height = 120;
        view1.background = "#0000FF";
        this.window.addChild(view1);

        var view2 = new View();
        view2.id = "view2";
        view2.left = 150;
        view2.top = 150;
        view2.width = 100;
        view2.height = 100;
        view2.background = "#FF00FF";
        this.window.addChild(view2);

        view2.sendToBack();

        setTimeout(function() {
            view2.bringToFront();
            setTimeout(function() {
                view2.sendToBack();
            }, 3000);
        }, 3000);
    }
}, module);

});
});
});
});
});