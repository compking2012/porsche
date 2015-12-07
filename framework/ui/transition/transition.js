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
var EventEmitter = require("../../eventemitter");

/**
 * Base class for transition.
 * Note that this class is never used to instantiate directly.
 * @class Transition
 * @extends EventEmitter
 */
Class.define("framework.ui.transition.Transition", EventEmitter, {
    /**
     * Constructor that create an animation.
     * @method Transition#initialize
     */
    initialize: function(property) {
        EventEmitter.prototype.initialize.apply(this, arguments);

    },

    /**
     * Destructor that destroy this animation.
     * @method Transition#destroy
     */
    destroy: function() {

        EventEmitter.prototype.destroy.apply(this, arguments);
    }
}, module);
