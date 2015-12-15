define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var View = require("../../../framework/ui/view/view");
var RowLayout = require("../../../framework/ui/layout/rowlayout");
var ColumnLayout = require("../../../framework/ui/layout/columnlayout");

Class.define("MyApp", App, {
    onStart: function() {
        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        this.rowLayout = new RowLayout();
        this.rowLayout.paddingTop = 10;
        this.rowLayout.paddingTop = 10;
        this.rowLayout.defaultLayoutParam = {align: "top", margin: {left: 10}};

        this.columnLayout = new ColumnLayout();
        this.columnLayout.paddingLeft = 10;
        this.columnLayout.paddingRight = 10;
        this.columnLayout.defaultLayoutParam = {align: "left", margin: {top: 10}};

        this.view1 = new View();
        this.view1.width = 40;
        this.view1.height = 40;
        this.view1.background = colors[0];
        this.window.addChild(this.view1);

        this.view2 = new View();
        this.view2.width = 80;
        this.view2.height = 80;
        this.view2.background = colors[1];
        this.window.addChild(this.view2);

        this.window.layout = this.rowLayout;

        this.view3 = new View();
        this.view3.width = 120;
        this.view3.height = 120;
        this.view3.background = colors[2];
        this.window.addChild(this.view3);

        this.window.addEventListener("touchend", this.onTouchEnd.bind(this));
    },

    onTouchEnd: function() {
        if (this.window.layout === this.columnLayout) {
            this.window.layout = this.rowLayout;
        } else {
            this.window.layout = this.columnLayout;
        }
    }
}, module);

});