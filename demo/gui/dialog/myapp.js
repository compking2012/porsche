define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var AlertDialog = require("/framework/ui/view/alertdialog");
var ConfirmDialog = require("/framework/ui/view/confirmdialog");
var Button = require("/framework/ui/view/button");

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
            actionText: "完成"
        });
        alert.addEventListener("result", this.onAlertResult.bind(this));
        alert.show();
    },

    onTapConfirm: function() {
        var confirm = new ConfirmDialog({
            messageText: "Hi, are you OK?",
            confirmText: "完成",
            cancelText: "取消"
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

});