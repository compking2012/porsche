define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var View = require("../../../framework/ui/view/view");

Class.define("views.MyView", View, {
    initialize: function() {
        View.prototype.initialize.apply(this, arguments);

        this.loadContent();
        this.background = "#00FF00";
    }
}, module);

});