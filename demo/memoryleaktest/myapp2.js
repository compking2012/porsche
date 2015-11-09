define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var App = require("/framework/app/app");
var Class2 = require("./class2");

Class.define("MyApp", {
    initialize: function() {
        this.start();
    },

    start: function() {
        this.count = 0;
        this.timer = setInterval(function() {
            var c = new Class2();
            c.destroy();
            this.count++;
            if (this.count % 1000 === 0) {
                console.log("Created objects:", this.count);
            }
        }.bind(this), 1);

        // var theThing = null;
        // var replaceThing = function () {
        //     var originalThing = theThing;
        //     theThing = {
        //         longStr: new Array(1000000).join("*")
        //     };
        // };
        // setInterval(replaceThing, 1);
    },

    stop: function() {
        clearInterval(this.timer);
    }
}, module);

});
});
});
});
});