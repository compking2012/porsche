define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");
var MyClass = require("./myclass");

Class.define("MySubClass", MyClass, {
    print: function() {
        console.log("MySubClass");
    }
}, module);

});