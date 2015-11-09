"use strict";
var Class = require("../../class");
var CheckBox = require("./checkbox");

Class.define("{Framework}.ui.view.RadioButton", CheckBox, {
    initialize: function () {
        CheckBox.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        CheckBox.prototype.destroy.apply(this, arguments);
    }
}, module);
