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
var Class = require("../class");
var EventEmitter = require("../yobject");

Class.define("framework.model.Model", EventEmitter, {
    initialize: function(attributes) {
        EventEmitter.prototype.initialize.apply(this, arguments);

        this._attributes = {};
        this._changedAttributes = {};
        this._id = "";
        this._isNew = false;

        if (attributes === undefined) {
            return;
        }

        if (!this.validate(attributes)) {
            throw "Unable to create this model";
        }

        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                this._attributes[key] = attributes[key];
                this._changedAttributes[key] = {changed: false, originValue: attributes[key]};
            }
        }
    },

    destroy: function() {
        this._attributes = null;
        this._changedAttributes = null;
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    get id() {
        return this._id;
    },

    set id(value) {
        this._id = value;
    },

    get isNew() {
        return this._isNew;
    },

    set isNew(value) {
        this._isNew = value;
    },

    get: function(key) {
        return this._attributes[key];
    },

    set: function(key, value) {
        this._attributes[key] = value;
        if (!this._changedAttributes.hasOwnProperty(key)) {
            this._changedAttributes[key] = {changed: false, originValue: value};
        }
        this._changedAttributes[key].changed = this._changedAttributes[key].originValue !== value;
    },

    has: function(key) {
        if (this._attributes.hasOwnProperty(key)) {
            return true;
        } else {
            return false;
        }
    },

    save: function(callback) {
        if (this._isNew) {
            var allAttrs = {};
            for (var key in this._attributes) {
                if (!this._attributes.hasOwnProperty(key)) {
                    continue;
                }
                allAttrs[key] = this._attributes[key];
            }
            if (callback) {
                this.create(allAttrs, callback);
            } else {
                return this.create(allAttrs);
            }
        } else {
            var changedAttrs = {};
            for (var key in this._changedAttributes) {
                if (!this._changedAttributes.hasOwnProperty(key)) {
                    continue;
                }
                if (this._changedAttributes[key].changed) {
                    changedAttrs[key] = this._attributes[key];
                }
            }
            if (callback) {
                this.update(changedAttrs, callback);
            } else {
                return this.update(changedAttrs);
            }
        }
    },

    /**
     * Implement this to validate your model.
     * @method Model#validate
     * @abstract
     * @param {String} attributes - the attributes need to validate
     */
    validate: function(/*attributes*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Implement this to serialize your model.
     * @method Model#serialize
     * @abstract
     * @param {String} type - the type of serialization
     */
    serialize: function(/*type*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Implement this to deserialize data as your model.
     * @method Model#deserialize
     * @abstract
     * @param {String} data - the raw data
     * @param {String} type - the type of deserialization
     */
    deserialize: function(/*data, type*/) {
        // TO BE IMPLEMENTED
    },

    /**
     * Implement this to create model on the data source.
     * @method Model#create
     * @abstract
     * @param {Array} attributes - the attributes need to create
     * @param {Function} [callback] - the callback of the result
     */
    create: function(attributes, callback) {
    },

    /**
     * Implement this to retrieve model from the data source.
     * @method Model#retrieve
     * @abstract
     * @param {Function} [callback] - the callback of the result
     */
    retrieve: function(callback) {
    },

    /**
     * Implement this to update model on the data source.
     * @method Model#update
     * @abstract
     * @param {Array} attributes - the attributes need to update
     * @param {Function} [callback] - the callback of the result
     */
    update: function(attributes, callback) {
    },

    /**
     * Implement this to delete model on the data source.
     * @method Model#delete
     * @abstract
     * @param {Function} [callback] - the callback of the result
     */
    delete: function(callback) {
    }
}, module);

});