"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var DataSource = fx.import("framework.model.DataSource");
var Library = require("./library");
var Book = require("./book");
var fs = require("fs");

Class.define("MyDataSource", DataSource, {
    initialize: function() {
        DataSource.prototype.initialize.apply(this, arguments);

        this.metafile = __dirname + "/data/list.data";
    },

    create: function(entity, callback) {
        if (entity instanceof Book) {
            var model = entity;
            var file = __dirname + "/data/item-" + model.id + ".data";
            var exists = fs.existsSync(file);
            if (exists) {
                if (callback !== undefined) {
                    callback.call(this, false);
                }
                return;
            }

            fs.writeFileSync(file, model.serialize());
            callback.call(this, true);
        } else if (entity instanceof Library) {
            var models = entity;
            var length = models.length;
            for (var i = 0; i < length; i++) {
                var file = __dirname + "/data/item-" + models[i].id + ".data";
                var exists = fs.existsSync(this.file);
                if (exists) {
                    if (callback !== undefined) {
                        callback.call(this, false);
                    }
                    return;
                }

                fs.unlinkSync(file);
                fs.writeFileSync(file, models[i].serialize());
            }
            fs.writeFileSync(this.metafile, length);
            callback.call(this, true);
        } else {
            throw "Unknown type";
        }
    },

    retrieve: function(entity, callback) {
        if (entity instanceof Book) {
            var model = entity;
            var file = __dirname + "/data/item-" + model.id + ".data";
            var exists = fs.existsSync(file);
            if (!exists) {
                if (callback !== undefined) {
                    callback.call(this, false);
                }
                return;
            }

            var result = fs.readFileSync(file);
            model.deserialize(result);
            callback.call(this, true);
        } else if (entity instanceof Library) {
            var models = entity;
            models.splice(0, models.length);
            var count = fs.readFileSync(this.metafile);
            for (var i = 0; i < count; i++) {
                var file = __dirname + "/data/item-" + this._models[i].id + ".data";
                var exists = fs.existsSync(file);
                if (!exists) {
                    if (callback !== undefined) {
                        callback.call(this, false);
                    }
                    return;
                }

                var result = fs.readFileSync(file);
                model.deserialize(result);
                models.push(model);
            }
            callback.call(this, true);
        } else {
            throw "Unknown type";
        }
    },

    update: function(entity, callback) {
        if (entity instanceof Book) {
            var model = entity;
            var file = __dirname + "/data/item-" + model.id + ".data";
            var exists = fs.existsSync(file);
            if (!exists) {
                if (callback !== undefined) {
                    callback.call(this, false);
                }
                return;
            }

            fs.writeFileSync(file, model.serialize());
            callback.call(this, true);
        } else if (entity instanceof Library) {
            var models = entity;
            var length = models.length;
            for (var i = 0; i < length; i++) {
                var file = __dirname + "/data/item-" + models[i].id + ".data";
                var exists = fs.existsSync(this.file);
                if (!exists) {
                    if (callback !== undefined) {
                        callback.call(this, false);
                    }
                    return;
                }

                fs.unlinkSync(file);
                fs.writeFileSync(file, models[i].serialize());
            }
            fs.writeFileSync(this.metafile, length);
            callback.call(this, true);
        } else {
            throw "Unknown type";
        }
    },

    delete: function(entity, callback) {
        if (entity instanceof Book) {
            var model = entity;
            var file = __dirname + "/data/item-" + model.id + ".data";
            var exists = fs.existsSync(file);
            if (!exists) {
                if (callback !== undefined) {
                    callback.call(this, false);
                }
                return;
            }
            fs.unlinkSync(file);
            callback.call(this, true);
        } else if (entity instanceof Library) {
            var models = entity;
            var length = models.length;
            for (var i = 0; i < length; i++) {
                var file = __dirname + "/data/item-" + models[i].id + ".data";
                var exists = fs.existsSync(this.file);
                if (!exists) {
                    if (callback !== undefined) {
                        callback.call(this, false);
                    }
                    return;
                }

                fs.unlinkSync(file);
            }
            fs.writeFileSync(this.metafile, 0);
            callback.call(this, true);
        } else {
            throw "Unknown type";
        }
    }
}, module);
