"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var MyClass = require("./myclass");
var MySubClass = require("./mysubclass");

Class.define("MyApp", App, {
    onStart: function() {
        var myClass = new MyClass();
        MyClass.takeStaticAction();
        myClass.takeInstanceAction();

        var mySubClass = new MySubClass();
        MySubClass.takeStaticAction();
        mySubClass.takeInstanceAction();
    }
}, module);
