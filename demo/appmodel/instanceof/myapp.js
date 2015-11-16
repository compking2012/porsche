"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
var MyClass = require("./myclass");
var MySubClass = require("./mysubclass");

Class.define("MyApp", App, {
    onStart: function() {
        var myClass = new MyClass();
        myClass.print();
        var mySubClass = new MySubClass();
        mySubClass.print();
        console.log("mySubClass instanceof MySubClass: ", mySubClass instanceof MySubClass);
        console.log("mySubClass instanceof MyClass: ", mySubClass instanceof MyClass);
        console.log("myClass instanceof MySubClass: ", myClass instanceof MySubClass);
        console.log("myClass instanceof MyClass: ", myClass instanceof MyClass);
        console.log("this instanceof App: ", this instanceof App);
    }
}, module);
