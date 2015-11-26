define(function(require, exports, module) {
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
var YObject = require("../../yobject");

/**
 * Base class for event
 * @class Event
 * @extends YObject
 */
Class.define("framework.ui.event.Event", YObject, {
    /**
     * Constructor
     * @method Event#initialize
     */
    initialize: function(options) {
        YObject.prototype.initialize.apply(this, arguments);

        this._target = options.target !== undefined ? options.target : null;
        this._type = options.type !== undefined ? options.type : "";
        this._timestamp = options.timestamp !== undefined ? options.timestamp : 0;
        this._immediatePropagation = true;
    },

    /**
     * Destructor
     * @method Event#destroy
     */
    destroy: function() {
        this._target = null;

        YObject.prototype.destroy.apply(this, arguments);
    },

    /**
     * @description Stop the propagation of this event to its parent.
     * @method Event#stopImmediatePropagation
     */
    stopImmediatePropagation: function() {
        this._immediatePropagation = false;
    },

    /**
     * @name Event#target
     * @type {View}
     * @description event send target.
     * @readonly
     */
    get target() {
        return this._target;
    },

    /**
     * @name Event#type
     * @type {String}
     * @description the type of this event.
     * @readonly
     */
    get type() {
        return this._type;
    },

    /**
     * @name Event#timestamp
     * @type {Number}
     * @description the timestamp of this event.
     * @readonly
     */
    get timestamp() {
        return this._timestamp;
    }
}, module);

});