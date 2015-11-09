define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {
define(function(require, exports, module) {define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");

Class.define("Class1", {
    initialize: function() {
        this._obj = {
            longStr: new Array(1000000).join("*")
        };
    },

    destroy: function() {
        this._obj = null;
    }
}, module);

});
});
});
});
});