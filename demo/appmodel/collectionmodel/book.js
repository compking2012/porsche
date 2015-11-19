"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var Model = fx.import("framework.model.Model");
var MyDataSource = require("./mydatasource");

Class.define("Book", Model, {
    initialize: function() {
        this.super.initialize.call(this);

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
