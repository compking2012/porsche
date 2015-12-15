define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var CompositeView = require("../../../framework/ui/view/compositeview");

Class.define("views.MyCompositeView", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.loadContent();
        this.background = "#00FFFF";
    }
}, module);

});