"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");

Class.define("MyClass", {
    print: function() {
        console.log("MyClass");
    }
}, module);
