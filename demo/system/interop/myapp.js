"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var App = fx.import("framework.app.App");
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
