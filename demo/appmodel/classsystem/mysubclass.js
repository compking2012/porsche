define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var MyClass = require("./myclass");

Class.define("MySubClass", MyClass, {
    initialize: function() {
        this.instanceProperty = "This is a instance property of MySubClass instance";
    },

    static: {
        staticProperty: "This is a staic property of MySubClass class",

        staticMethod: function() {
            console.log("This is a static method of MySubClass class.");
        }
    }
}, module);

});