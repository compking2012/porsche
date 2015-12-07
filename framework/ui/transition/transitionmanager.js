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
var PropertyTransition = require("./propertytransition");

Class.define("framework.ui.transition.TransitionManager", EventEmitter, {
    initialize: function(view) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._associatedView = view;
        this._transitions = [];
    },

    destroy: function() {
        this._associatedView = null;
        for (var i = 0; i < this._transitions.length; i++) {
            this._transitions[i].destroy();
        }
        this._transitions = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    getPropertyTransition: function(property) {
        for (var i = 0; i < this._transitions.length; i++) {
            if (this._transitions[i] instanceof PropertyTransition) {
                if (this._transitions[i].property === property) {
                    return this._transitions[i];
                }
            }
        }
        return null;
    },

    add: function(transition) {
        transition.associatedView = this._associatedView;
        this._transitions.push(transition);
    },

    remove: function(transition) {
        var index = this._transitions.indexOf(transition);
        if (index === -1) {
            return;
        }

        this._transitions.splice(index, 1);
        transition.associatedView = null;
    },

    setProperty: function(property, oldValue, newValue) {
        var propertyTransition = this.getPropertyTransition(property);
        if (propertyTransition !== null) {
            if (!propertyTransition.transiting) {
                propertyTransition.from = oldValue;
                propertyTransition.to = newValue;
                propertyTransition.start();
                return false;
            }
        }
        return true;
    }
}, module);
