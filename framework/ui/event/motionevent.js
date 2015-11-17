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
var Class = require("../class");
var UIEvent = require("./uievent");

/**
 * Gesture Event
 * @class GestureEvent
 * @extends UIEvent
 */
Class.define("framework.ui.event.MotionEvent", UIEvent, {
    /**
     * Constructor
     * @method Motion#initialize
     */
    initialize: function(/*options*/) {
        this.super.initialize();
    }
}, module);
