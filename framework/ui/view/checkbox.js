define(function(require, exports, module) {

"use strict";
var Class = require("../../class");
var Switch = require("./switch");

Class.define("framework.ui.view.CheckBox", Switch, {
    initialize: function () {
        Switch.prototype.initialize.apply(this, arguments);

        this._disabledSrc = __dirname + "/resources/checkboxdisabled.png";
        this._offSrc = __dirname + "/resources/checkboxoff.png";
        this._onSrc = __dirname + "/resources/checkboxon.png";
    },

    destroy: function() {
        Switch.prototype.destroy.apply(this, arguments);
    }
}, module);

});
