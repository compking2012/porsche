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
var EventEmitter = require("../eventemitter");

Class.define("framework.model.Collection", EventEmitter, {
    initialize: function() {
        this.super.initialize();

        this._models = [];
    },

    destroy: function() {
        var length = this._models.length;
        for (var i = 0; i < length; i++) {
            this._models[i].destroy();
        }
        this._models = null;
        this.super.destroy();
    },

    add: function(model) {
        this._models.push(model);
    },

    insert: function(model, index) {
        this._models.splice(index, 0, model);
    },

    remove: function(model) {
        var length = this._models.length;
        for (var i = 0; i < length; i++) {
            if (this._models[i] === model) {
                this._models.splice(i, 1);
                return;
            }
        }
    },

    removeAll: function() {
        while (this._models.length > 0) {
            this.removeChild(this._models[0]);
        }
        this._models = [];
    },

    get length() {
        return this._models.length;
    },

    item: function(index) {
        return this._models[index];
    },

    find: function(id) {
        var length = this._models.length;
        for (var i = 0; i < length; i++) {
            if (this._models[i].id === id) {
                return this._models[i];
            }
        }
        return null;
    },

    search: function(condition) {

    },

    load: function(options) {
    },

    save: function() {
    },

    /**
     * Implement this to serialize your collection.
     * @method Collection#serialize
     * @abstract
     * @param {String} type - the type of serialization
     */
    serialize: function(/*type*/) {

    },

    /**
     * Implement this to deserialize data as your collection.
     * @method Collection#deserialize
     * @abstract
     * @param {String} data - the raw data
     * @param {String} type - the type of deserialization
     */
    deserialize: function(/*data, type*/) {

    },

    /**
     * Implement this to create collection on the data source.
     * @method Collection#create
     * @abstract
     * @param {Function} callback - the callback of the result
     */
    create: function(callback) {
    },

    /**
     * Implement this to retrieve collection from the data source.
     * @method Collection#retrieve
     * @abstract
     * @param {Object|String} condition - the condition used for retrieve
     * @param {Array} models - the models
     * @param {Function} callback - the callback of the result
     */
    retrieve: function(condition, callback) {
    },

    /**
     * Implement this to update collection on the data source.
     * @method Collection#update
     * @abstract
     * @param {Function} callback - the callback of the result
     */
    update: function(callback) {
    },

    /**
     * Implement this to delete collection on the data source.
     * @method Collection#delete
     * @abstract
     * @param {Function} callback - the callback of the result
     */
    delete: function(callback) {
    }
}, module);
