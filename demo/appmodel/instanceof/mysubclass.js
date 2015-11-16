"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var MyClass = require("./myclass");

Class.define("MySubClass", MyClass, {
    print: function() {
        console.log("MySubClass");
    }
}, module);
