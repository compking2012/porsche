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
var Transition = require("./transition");
var PropertyAnimation = require("../animation/propertyanimation");

/**
 * Property transition.
 * @class PropertyTransition
 * @extends Transition
 */
Class.define("framework.ui.transition.PropertyTransition", Transition, {
    /**
     * Constructor that create a property transition.
     * @method PropertyTransition#initialize
     */
    initialize: function(property) {
        Transition.prototype.initialize.apply(this, arguments);

        this._defaultDuration = 300;
        this._defaultEasing = "cubic-bezier(0.42, 0, 0.58, 1.0)";

        this._property = property;
        this._associatedView = null;
        this._animation = null;
        this._from = null;
        this._to = null;
    },

    /**
     * Destructor that destroy this property transition.
     * @method PropertyTransition#destroy
     */
    destroy: function() {
        if (this._animation !== null) {
            this._animation.destroy();
            this._animation = null;
        }

        Transition.prototype.destroy.apply(this, arguments);
    },

    get property() {
        return this._property;
    },

    set property(value) {
        this._property = value;
    },

    get from() {
        return this._from;
    },

    set from(value) {
        this._from = value;
    },

    get to() {
        return this._from;
    },

    set to(value) {
        this._to = value;
    },

    get transiting() {
        if (this._animation === null) {
            return false;
        }

        return this._animation.animating;
    },

    start: function() {
        this._animation.from = {};
        this._animation.from[this._property] = this._from;
        this._animation.to = {};
        this._animation.to[this._property] = this._to;
        this._animation.duration = this._defaultDuration;
        this._animation.easing = this._defaultEasing;

        this._animation.start();
    },

    set associatedView(value) {
        this._associatedView = value;
        this._animation = new PropertyAnimation(this._associatedView);
    }
}, module);
