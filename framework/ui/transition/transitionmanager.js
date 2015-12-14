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
var LayoutTransition = require("./layouttransition");
var ChildTransition = require("./childtransition");

Class.define("framework.ui.transition.TransitionManager", EventEmitter, {
    initialize: function(view) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._associatedView = view;
        this._transitions = [];
        this._layoutTransiting = false;
        this._childTransiting = false;
    },

    destroy: function() {
        this._associatedView = null;
        for (var i = 0; i < this._transitions.length; i++) {
            this._transitions[i].destroy();
        }
        this._transitions = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get layoutTransiting() {
        return this._layoutTransiting;
    },

    get childTransiting() {
        return this._childTransiting;
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

    getLayoutTransition: function() {
        for (var i = 0; i < this._transitions.length; i++) {
            if (this._transitions[i] instanceof LayoutTransition) {
                return this._transitions[i];
            }
        }
        return null;
    },

    getChildTransition: function() {
        for (var i = 0; i < this._transitions.length; i++) {
            if (this._transitions[i] instanceof ChildTransition) {
                return this._transitions[i];
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

    setProperty: function(property, oldValue, newValue, callback) {
        var propertyTransition = this.getPropertyTransition(property);
        if (propertyTransition !== null) {
            if (propertyTransition.transiting) {
                return;
            }
            propertyTransition.stop();
            propertyTransition.from = oldValue;
            propertyTransition.to = newValue;
            var completeFunc = null;
            propertyTransition.addEventListener("complete", completeFunc = function() {
                propertyTransition.removeEventListener("complete", completeFunc);
                callback();
            }.bind(this));
            propertyTransition.start();
            return;
        }
        callback();
    },

    setLayout: function(oldLayout, newLayout, callback) {
        var layoutTransition = this.getLayoutTransition();
        if (layoutTransition !== null) {
            if (layoutTransition.transiting) {
                return;
            }
            layoutTransition.stop();
            layoutTransition.from = oldLayout;
            layoutTransition.to = newLayout;
            var completeFunc = null;
            layoutTransition.addEventListener("complete", completeFunc = function() {
                layoutTransition.removeEventListener("complete", completeFunc);
                this._layoutTransiting = false;
                callback();
            }.bind(this));
            layoutTransition.start();
            this._layoutTransiting = true;
            return;
        }
        callback();
    },

    addChild: function(view, index, changeCallback, completeCallback) {
        var childTransition = this.getChildTransition();
        if (childTransition !== null) {
            if (childTransition.transiting) {
                return;
            }
            childTransition.stop();
            childTransition.childView = view;
            childTransition.index = index;
            childTransition.action = "add";
            var changeFunc = null;
            var completeFunc = null;
            childTransition.addEventListener("change", changeFunc = function() {
                childTransition.removeEventListener("change", changeFunc);
                changeCallback();
            }.bind(this));
            childTransition.addEventListener("complete", completeFunc = function() {
                childTransition.removeEventListener("change", completeFunc);
                this._childTransiting = false;
                completeCallback();
            }.bind(this));
            childTransition.start();
            this._childTransiting = true;
            return;
        }
        changeCallback();
        completeCallback();
    },

    removeChild: function(view, index, changeCallback, completeCallback) {
        var childTransition = this.getChildTransition();
        if (childTransition !== null) {
            if (childTransition.transiting) {
                return;
            }
            childTransition.stop();
            childTransition.childView = view;
            childTransition.index = index;
            childTransition.action = "remove";
            var changeFunc = null;
            var completeFunc = null;
            childTransition.addEventListener("change", changeFunc = function() {
                childTransition.removeEventListener("change", changeFunc);
                changeCallback();
            }.bind(this));
            childTransition.addEventListener("complete", completeFunc = function() {
                childTransition.removeEventListener("complete", completeFunc);
                this._childTransiting = false;
                completeCallback();
            });
            childTransition.start();
            this._childTransiting = true;
            return;
        }
        changeCallback();
        completeCallback();
    },

    removeAllChildren: function() {

    }
}, module);
