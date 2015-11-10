"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var View = fx.import("framework.ui.view.View");
var CompositeView = fx.import("framework.ui.view.CompositeView");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var view1 = new View();
        view1.id = "view1";
        view1.background = "#FF0000";
        view1.left = 20;
        view1.top = 20;
        view1.originX = 50;
        view1.originY = 50;
        view1.width = 100;
        view1.height = 100;

        var view2 = new View();
        view2.id = "view2";
        view2.background = "#FFFF00";
        view2.left = 100;
        view2.top = 50;
        view2.originX = 50;
        view2.originY = 50;
        view2.width = 100;
        view2.height = 100;

        var cview1 = new CompositeView();
        cview1.id = "cview1";
        cview1.background = "#00FF00";
        cview1.left = 20;
        cview1.top = 20;
        cview1.width = 200;
        cview1.height = 200;
        cview1.addChild(view1);
        cview1.addChild(view2);

        var view3 = new View();
        view3.id = "view3";
        view3.background = "#00FFFF";
        view3.left = 50;
        view3.top = 100;
        view3.originX = 50;
        view3.originY = 50;
        view3.width = 100;
        view3.height = 100;

        var cview2 = new CompositeView();
        cview2.id = "cview2";
        cview2.background = "#0000FF";
        cview2.left = 20;
        cview2.top = 20;
        cview2.width = 250;
        cview2.height = 250;
        cview2.addChild(cview1);
        cview2.addChild(view3);

        this.window.id = "window";
        this.window.background = "#CCCCCC";
        this.window.addChild(cview2);

        setTimeout(function() {
            view2.rotationZ = Math.PI / 180 * 30;
        }, 3000);
    }
}, module);
