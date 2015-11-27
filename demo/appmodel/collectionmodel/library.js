define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var Collection = require("../../../framework/model/collection");
var MyDataSource = require("./mydatasource");
var Book = require("./book");

Class.define("Library", Collection, {
    initialize: function() {
        Collection.prototype.initialize.apply(this, arguments);

        this._dataSource = new MyDataSource();
    },

    serialize: function(/*type*/) {
        var pieces = [];
        var length = this._models.length;
        for (var i = 0; i < length; i++) {
            pieces.push(this._models[i].serialize());
        }
        var json = "[" + pieces.join(",") + "]";
        return json;
    },

    deserialize: function(data/*, type*/) {
        var json = JSON.parse(data);

        var length = json.length;
        for (var i = 0; i < length; i++) {
            var book = new Book();
            book.deserialize(JSON.stringify(json[i]));
            this.add(book);
        }
    }
}, module);

});