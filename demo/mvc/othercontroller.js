"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var Controller = fx.import("framework.controller.Controller");
var View = fx.import("framework.ui.view.View");
var Other2Controller = require("./other2controller");

Class.define("MyApp.Other2Controller", Controller, {
    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        var view = new View();
        view.background = "#00FF00";
        view.left = 110;
        view.top = 110;
        view.width = 100;
        view.height = 100;

        view.addEventListener("click", this.onClick.bind(this));

        this.view = view;
    },

    onClick: function() {
        console.log("OtherController clicked");
        console.log("OtherController app:", this.app);
        var controller = new Other2Controller();
        this.app.rootController = controller;
    }
}, module);
