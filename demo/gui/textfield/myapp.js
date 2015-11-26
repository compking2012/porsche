define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var App = require("/framework/app/app");
var CompositeView = require("/framework/ui/view/compositeview");
var TextView = require("/framework/ui/view/textview");
var TextField = require("/framework/ui/view/textfield");

Class.define("MyApp", App, {
    onStart: function() {
        this.compositeView = new CompositeView();
        this.compositeView.left = 10;
        this.compositeView.top = 10;
        this.compositeView.width = 300;
        this.compositeView.height = 160;
        this.compositeView.background = "#AAAAAA";
        this.window.addChild(this.compositeView);

        this.firstNameLabel = new TextView();
        this.firstNameLabel.left = 10;
        this.firstNameLabel.top = 30;
        this.firstNameLabel.width = 120;
        this.firstNameLabel.height = 40;
        this.firstNameLabel.text = "First Name:";
        this.window.addChild(this.firstNameLabel);

        this.firstNameTextField = new TextField();
        this.firstNameTextField.left = 140;
        this.firstNameTextField.top = 30;
        this.firstNameTextField.width = 160;
        this.firstNameTextField.height = 40;
        this.firstNameTextField.fontSize = "18px";
        this.firstNameTextField.placeholder = "first name...";
        this.window.addChild(this.firstNameTextField);

        this.lastNameLabel = new TextView();
        this.lastNameLabel.left = 10;
        this.lastNameLabel.top = 100;
        this.lastNameLabel.width = 120;
        this.lastNameLabel.height = 40;
        this.lastNameLabel.text = "Last Name:";
        this.window.addChild(this.lastNameLabel);

        this.lastNameTextField = new TextField();
        this.lastNameTextField.left = 140;
        this.lastNameTextField.top = 100;
        this.lastNameTextField.width = 160;
        this.lastNameTextField.height = 40;
        this.lastNameTextField.fontSize = "18px";
        this.lastNameTextField.placeholder = "last name...";
        this.window.addChild(this.lastNameTextField);

        this.firstNameTextField.text = "This is my First Name";
        this.lastNameTextField.text = "This is my Last Name";
    }
}, module);

});