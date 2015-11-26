define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var View = require("/framework/ui/view/view");
var CompositeView = require("/framework/ui/view/compositeview");
var FlowLayout = require("/framework/ui/layout/flowlayout");
var FlowLayoutParam = require("/framework/ui/layout/flowlayoutparam");
var ScrollableView = require("/framework/ui/view/scrollableview");
var Switch = require("/framework/ui/view/switch");

Class.define("MyApp", App, {
    onStart: function() {
        var scrollableView = new ScrollableView();
        scrollableView.width = this.window.width;
        scrollableView.height = this.window.height;

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];
        var height = [80, 60, 130, 50, 100, 90, 30];
        // code here to define layout style and set property values
        this.flow = new FlowLayout();
        this.flow.lineSpacing = 20;
        this.flow.align = "left";
        this.flow.valign = "middle";
        this.flow.header = 30;// set the spacing of header
        this.flow.defaultParam.itemSpacing = 10;

        this.cv = new CompositeView();
        this.cv.left = 0;
        this.cv.top = 0;
        this.cv.height = 300;
        this.cv.width = 320;
        this.cv.background = "rgb(128, 100, 162)";
        this.cv.layout = this.flow;
        scrollableView.addChild(this.cv);

        var layoutparam = this.flow.getParamAtIndex(1);
        layoutparam.itemSpacing = 20;
        layoutparam = this.flow.getParamAtIndex(2);
        layoutparam.itemSpacing = 30;

        for (var i = 0; i < 5; i++) {
            var view = new View();
            view.background = colors[i % 5];
            view.width = 80;
            view.height = height[i];
            this.cv.addChild(view);
        }

        this.window.addChild(scrollableView);
    }

}, module);

});