"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var AlertDialog = fx.import("framework.ui.view.AlertDialog");
var ConfirmDialog = fx.import("framework.ui.view.ConfirmDialog");
var Button = fx.import("framework.ui.view.Button");

Class.define("MyApp", App, {
    onStart: function() {
        this.buttonAlert = new Button();
        this.buttonAlert.top = 50;
        this.buttonAlert.left = 40;
        this.buttonAlert.width = 240;
        this.buttonAlert.height = 100;
        this.buttonAlert.text = "Alert Dialog";
        this.buttonAlert.fontSize = "24px";
        this.buttonAlert.background = "#FF0000";
        this.buttonAlert.addEventListener("tap", this.onTapAlert.bind(this));
        this.window.addChild(this.buttonAlert);

        this.buttonConfirm = new Button();
        this.buttonConfirm.top = 200;
        this.buttonConfirm.left = 40;
        this.buttonConfirm.width = 240;
        this.buttonConfirm.height = 100;
        this.buttonConfirm.text = "Confirm Dialog";
        this.buttonConfirm.fontSize = "24px";
        this.buttonConfirm.background = "#00FF00";
        this.buttonConfirm.addEventListener("tap", this.onTapConfirm.bind(this));
        this.window.addChild(this.buttonConfirm);
    },

    onTapAlert: function() {
        var alert = new AlertDialog({
            messageText: "Hi, are you OK?",
            actionText: "OK"
        });
        alert.addEventListener("result", this.onAlertResult.bind(this));
        alert.show();
    },

    onTapConfirm: function() {
        var confirm = new ConfirmDialog({
            messageText: "Hi, are you OK?",
            confirmText: "OK",
            cancelText: "Cancel"
        });
        confirm.addEventListener("result", this.onConfirmResult.bind(this));
        confirm.show();
    },

    onAlertResult: function() {
        this.buttonAlert.text = "Alert Done";
    },

    onConfirmResult: function(e) {
        if (e) {
            this.buttonConfirm.text = "Confirm Done";
        } else {
            this.buttonConfirm.text = "Confirm Cancelled";
        }
    }
}, module);
