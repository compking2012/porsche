define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");
var ffi = require("ffi");
// var ref = require("ref");

Class.define("MyApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        var libtest = ffi.Library("libtest", {
            "myapi": ["int", ["int"]]
        });

        console.log("result=", libtest.myapi(100));
    }
}, module);

});