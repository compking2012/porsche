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
 * Base event from user touch
 * @class TouchEvent
 * @extends InputEvent
 */
Class.define("framework.ui.event.TouchEvent", InputEvent, {
    /**
     * Constructor
     * @method TouchEvent#initialize
     */
    initialize: function(options) {
        this.super.initialize.call(this, options);

        this._touches = options.touches !== undefined ? options.touches : [];
        this._targetTouches = options.targetTouches !== undefined ? options.targetTouches : [];
        this._changedTouches = options.changedTouches !== undefined ? options.changedTouches : [];
    },

    /**
     * Destructor
     * @method TouchEvent#destroy
     */
    destroy: function() {
        this._touches = null;
        this._targetTouches = null;
        this._changedTouches = null;

        this.super.destroy.call(this);
    },

    /**
     * @name TouchEvent#touches
     * @type {Touch[]}
     * @description A list of touches for every point of contact currently touching the surface.
     * @readonly
     */
    get touches() {
        return this._touches;
    },

    /**
     * @name TouchEvent#targetTouches
     * @type {Touch[]}
     * @description A list of touches for every point of contact that is touching the surface and started on the element that is the target of the current event.
     * @readonly
     */
    get targetTouches() {
        return this._targetTouches;
    },

    /**
     * @name TouchEvent#changedTouches
     * @type {Touch[]}
     * @description A list of touches for every point of contact which contributed to the event.
     * @readonly
     */
    get changedTouches() {
        return this._changedTouches;
    }
}, module);
