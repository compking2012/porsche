"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var Controller = fx.import("framework.controller.Controller");
var View = fx.import("framework.ui.view.View");
var OtherController = require("./othercontroller");

Class.define("MyApp.MainController", Controller, {
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        var view = new View();
        view.background = "#FF0000";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        view.addEventListener("click", this.onClick.bind(this));

        this.view = view;
    },

    onClick: function() {
        console.log("MainController clicked");
        var controller = new OtherController();
        this.app.rootController = controller;
    }
}, module);
