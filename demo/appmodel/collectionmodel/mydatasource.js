define(function(require, exports, module) {
"use strict";

var Class = require("../../../framework/class");
var DataSource = require("../../../framework/model/datasource");
var Library = require("./library");
var Book = require("./book");
var fs = require("fs");

Class.define("MyDataSource", DataSource, {
    initialize: function() {
        DataSource.prototype.initialize.apply(this, arguments);

        this.metafile = global.app.rootPath + "/data/list.data";
    },

    create: function(entity, callback) {
        if (entity instanceof Book) {
            var model = entity;
            var file = global.app.rootPath + "/data/item-" + model.id + ".data";
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
                var file = global.app.rootPath + "/data/item-" + models[i].id + ".data";
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
            var file = global.app.rootPath + "/data/item-" + model.id + ".data";
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
                var file = global.app.rootPath + "/data/item-" + this._models[i].id + ".data";
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
            var file = global.app.rootPath + "/data/item-" + model.id + ".data";
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
                var file = global.app.rootPath + "/data/item-" + models[i].id + ".data";
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
            var file = global.app.rootPath + "/data/item-" + model.id + ".data";
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
                var file = global.app.rootPath + "/data/item-" + models[i].id + ".data";
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

});