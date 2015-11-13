/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

"use strict";
var Class = require("../../class");
var InputEvent = require("./inputevent");

/**
 * Keyboard event
 * @class KeyboardEvent
 * @extends InputEvent
 */
Class.define("framework.ui.event.KeyboardEvent", InputEvent, {
    /**
     * Constructor
     * @method KeyboardEvent#initialize
     */
    initialize: function(options) {
        InputEvent.prototype.initialize.apply(this, arguments);

        this._keyCode = options.keyCode !== undefined ? options.keyCode : 0;
    },

    destroy: function() {
        InputEvent.prototype.destroy.apply(this, arguments);
    },

    get keyCode() {
        return this._keyCode;
    }
}, module);
