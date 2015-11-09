define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var Class1 = require("./class1");

Class.define("Class2", Class1, {
    initialize: function() {
        Class1.prototype.initialize.apply(this, arguments);

        this._obj2 = {
            longStr: new Array(1000000).join("*")
        };
    },

    destroy: function() {
        this._obj2 = null;
        Class1.prototype.destroy.apply(this, arguments);
    }
}, module);

});
});
});
});
});