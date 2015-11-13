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
/* global Event:true */
var Event = require("./event");

/**
 * Base event from all UI elements
 * @class UIEvent
 * @extends Event
 */
Class.define("framework.ui.event.UIEvent", Event, {
    /**
     * Constructor
     * @method UIEvent#initialize
     */
    initialize: function(/*options*/) {
        Event.prototype.initialize.apply(this, arguments);

        this._propagation = true;
        this._defaultBehavior = true;
    },

    /**
     * @name UIEvent#propagation
     * @type {Boolean}
     * @description whether stop propagation
     * @private
     */
    get propagation() {
        return this._propagation;
    },

    /**
     * @name UIEvent#defaultBehavior
     * @type {Boolean}
     * @description whether is send event to system
     * @private
     */
    get defaultBehavior() {
        return this._defaultBehavior;
    },

    /**
     * Stop the propagation of this event to its parent.
     * @method UIEvent#stopPropagation
     */
    stopPropagation: function() {
        this._propagation = false;
    },

    /**
     * Prevent this event back to system.
     * @method UIEvent#preventDefault
     */
    preventDefault: function() {
        this._defaultBehavior = false;
    }
}, module);
