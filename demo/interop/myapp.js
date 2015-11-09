"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var ffi = require("ffi");
// var ref = require("ref");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        var libtest = ffi.Library("libtest", {
            "myapi": ["int", ["int"]]
        });

        console.log("result=", libtest.myapi(100));
    }
}, module);
