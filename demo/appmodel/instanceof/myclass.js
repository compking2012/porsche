define(function(require, exports, module) {
"use strict";

var Class = require("/framework/class");

Class.define("MyClass", {
    print: function() {
        console.log("MyClass");
    }
}, module);

});