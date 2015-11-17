"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var View = fx.import("framework.ui.view.View");

Class.define("MyApp", App, {
    onStart: function() {
        var compositeView1 = new CompositeView();
        compositeView1.background = "#FF0000";
        compositeView1.left = 10;
        compositeView1.top = 10;
        compositeView1.width = 140;
        compositeView1.height = 300;
        this.window.addChild(compositeView1);

        var compositeView2 = new CompositeView();
        compositeView2.hardwareAccelerated = true;
        compositeView2.background = "#00FF00";
        compositeView2.left = 170;
        compositeView2.top = 10;
        compositeView2.width = 140;
        compositeView2.height = 300;
        this.window.addChild(compositeView2);

        var view11 = new View();
        view11.background = "#0000FF";
        view11.left = 10;
        view11.top = 10;
        view11.width = 120;
        view11.height = 120;
        view11.originX = 60;
        view11.originY = 60;
        view11.rotationZ = Math.PI / 180 * 45;
        view11.hardwareAccelerated = true;
        compositeView1.addChild(view11);

        var view12 = new View();
        view12.background = "#FFFF00";
        view12.left = 10;
        view12.top = 160;
        view12.width = 120;
        view12.height = 120;
        view12.originX = 60;
        view12.originY = 60;
        view12.rotationZ = Math.PI / 180 * 45;
        compositeView1.addChild(view12);

        var view21 = new View();
        view21.background = "#00FFFF";
        view21.left = 10;
        view21.top = 10;
        view21.width = 120;
        view21.height = 120;
        compositeView2.addChild(view21);

        var view22 = new View();
        view22.background = "#FF00FF";
        view22.left = 10;
        view22.top = 160;
        view22.width = 120;
        view22.height = 120;
        view22.hardwareAccelerated = true;
        compositeView2.addChild(view22);
    }
}, module);
