"use strict";
var Class = require("../../class");
var Switch = require("./switch");

/**
 * CheckBox widget
 * @class CheckBox
 * @extends Switch
 */
Class.define("framework.ui.view.CheckBox", Switch, {
    /**
     * Constructor
     * @method CheckBox#initialize
     */
    initialize: function () {
        Switch.prototype.initialize.apply(this, arguments);
        this._disabledSrc = "/framework/resources/checkboxdisabled.png";
        this._offSrc = "/framework/resources/checkboxoff.png";
        this._onSrc = "/framework/resources/checkboxon.png";
    },

    /**
     * Destructor
     * @method CheckBox#destroy
     */
    destroy: function() {
        Switch.prototype.destroy.apply(this, arguments);
    }
}, module);
