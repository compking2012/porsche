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
        this._disabledSrc = global.AppFXRootPath + "/resources/checkboxdisabled.png";
        this._offSrc = global.AppFXRootPath + "/resources/checkboxoff.png";
        this._onSrc = global.AppFXRootPath + "/resources/checkboxon.png";
    },

    /**
     * Destructor
     * @method CheckBox#destroy
     */
    destroy: function() {
        Switch.prototype.destroy.apply(this, arguments);
    }
}, module);
