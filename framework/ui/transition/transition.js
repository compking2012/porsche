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
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._defaultDuration = 300;
        this._defaultEasing = "cubic-bezier(0.42, 0, 0.58, 1.0)";
        this._associatedView = null;
    },

    /**
     * Destructor that destroy this animation.
     * @method Transition#destroy
     */
    destroy: function() {
        this._associatedView = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    /**
     * @name Transition#transiting
     * @type {Boolean}
     * @description indicating whether it is in transiting.
     */
    get transiting() {
        return false;
    },

    /**
     * Implement this to start the transition.
     * @method Transition#start
     * @protected
     * @abstract
     */
    start: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * Implement this to stop the transition.
     * @method Transition#stop
     * @protected
     * @abstract
     */
    stop: function() {
        // TO BE IMPLEMENTED
    },

    /**
     * @name Transition#associatedView
     * @type {View}
     * @description the associated view with this transition.
     * @private
     */
    get associatedView() {
        return this._associatedView;
    },

    set associatedView(value) {
        this._associatedView = value;
    }
}, module);
