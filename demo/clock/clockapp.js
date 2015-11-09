define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var Clock6View = require("./view/clock6/clock6view");

Class.define("ClockApp", App, {
    initialize: function() {
        App.prototype.initialize.apply(this, arguments);

        this.clockView = new Clock6View();
        this.clockView.width = 320;
        this.clockView.height = 320;
        this.window.addChild(this.clockView);
        setInterval(function() {
            this.clockView.setTime(new Date());
        }.bind(this), 1000);
    }
}, module);

});
});
});
});
});