define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var Controller = require("../../../framework/controller/controller");
var View = require("../../../framework/ui/view/view");
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

});