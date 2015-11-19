"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var RowLayout = fx.import("framework.ui.layout.RowLayout");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    onStart: function() {
        var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"];

        this.rowLayout = new RowLayout();
        this.rowLayout.paddingTop = 10;
        this.rowLayout.paddingTop = 10;
        this.rowLayout.defaultLayoutParam = {align: "top", margin: {left: 10}};

        this.view1 = new View();
        this.view1.width = 20;
        this.view1.height = 80;
        this.view1.background = colors[0];
        this.window.addChild(this.view1);

        this.view2 = new View();
        this.view2.width = 50;
        this.view2.height = 120;
        this.view2.background = colors[1];
        this.window.addChild(this.view2);

        this.window.layout = this.rowLayout;

        this.view3 = new View();
        this.view3.width = 100;
        this.view3.height = 160;
        this.view3.background = colors[2];
        this.window.addChild(this.view3);
    }
}, module);
