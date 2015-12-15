define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var App = require("../../../framework/app/app");

Class.define("MyApp", App, {
    onStart: function() {
        this.window.loadContent();
    }
}, module);

});