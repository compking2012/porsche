define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var Model = require("../../../framework/model/model");
var MyDataSource = require("./mydatasource");

Class.define("Book", Model, {
    initialize: function() {
        Model.prototype.initialize.apply(this, arguments);

        this._dataSource = new MyDataSource();
    },

    serialize: function(/*type*/) {
        return JSON.stringify({
            title: this.get("title"),
            author: this.get("author"),
            page: this.get("page")
        });
    },

    deserialize: function(data/*, type*/) {
        var json = JSON.parse(data);
        this.set("title", json.title);
        this.set("author", json.author);
        this.set("page", json.page);
    }
}, module);

});