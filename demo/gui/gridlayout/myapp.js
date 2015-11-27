define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var View = require("../../../framework/ui/view/view");
var CompositeView = require("../../../framework/ui/view/compositeview");
var GridLayout = require("../../../framework/ui/layout/gridlayout");
var GridLayoutParam = require("../../../framework/ui/layout/gridlayoutparam");
var LayoutParam = require("../../../framework/ui/layout/layoutparam");
var ScrollableView = require("../../../framework/ui/view/scrollableview");

Class.define("MyApp", App, {
    onStart: function() {
        var scrollableView = new ScrollableView();
        scrollableView.width = this.window.width;
        scrollableView.height = this.window.height;;
        this.window.addChild(scrollableView);

        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        var gridLayout = new GridLayout();
        gridLayout.rows = 4;
        gridLayout.columns = 3;
        //gridLayout.defaultparam.leftmargin = 10;//set margin by this way or use setMargin()
        //gridLayout.defaultparam.topmargin = 10;
        gridLayout.defaultparam.setMargin(10,10,10,10);
        gridLayout.defaultparam.align = "fill";
        gridLayout.defaultparam.valign = "fill";

        var cv = new CompositeView();
        cv.width = 400;
        cv.height = 400;
        cv.layout = gridLayout;
        scrollableView.addChild(cv);

        var layoutparam = gridLayout.getParamAtIndex(1);
        layoutparam.align = "center";
        layoutparam.valign = "middle";
        layoutparam = gridLayout.getParamAtIndex(2);
        layoutparam.align = "left";
        layoutparam.valign = "top";
        layoutparam = gridLayout.getParamAtIndex(3);
        layoutparam.align = "right";
        layoutparam.valign = "bottom";

        for (var i = 0; i < 6; i++) {
            var view = new View();
            view.background = colors[i % 5];
            view.width = 80;
            view.height = 80;
            cv.addChild(view);
        }

        var view = new View();
        view.background = "#0FFFF0";
        view.width = 180;
        view.height = 180;
        cv.addChild(view);
    }
}, module);

});