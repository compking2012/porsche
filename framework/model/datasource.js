"use strict";
var Class = require("../class");
var EventEmitter = require("../yobject");

Class.define("{Framework}.model.DataSource", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this, arguments);

    },

    destroy: function() {
        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    /**
     * Implement this to create collection on the data source.
     * @method Collection#create
     * @abstract
     * @param {Function} callback - the callback of the result
     */
    create: function(models, callback) {
    },

    /**
     * Implement this to retrieve collection from the data source.
     * @method Collection#retrieve
     * @abstract
     * @param {Object|String} condition - the condition used for retrieve
     * @param {Array} models - the models
     * @param {Function} callback - the callback of the result
     */
    retrieve: function(condition, models, callback) {
    },

    /**
     * Implement this to update collection on the data source.
     * @method Collection#update
     * @abstract
     * @param {Function} callback - the callback of the result
     */
    update: function(models, callback) {
    },

    /**
     * Implement this to delete collection on the data source.
     * @method Collection#delete
     * @abstract
     * @param {Function} callback - the callback of the result
     */
    delete: function(models, callback) {
    }
}, module);
