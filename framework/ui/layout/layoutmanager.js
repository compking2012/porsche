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
var Class = require("../../class");
var EventEmitter = require("../../eventemitter");
var DOMParser = require("../../util/xmldom/dom-parser").DOMParser;

Class.define("framework.ui.layout.LayoutManager", EventEmitter, {
    initialize: function() {
        EventEmitter.prototype.initialize.apply(this);

        this._path = global.app.rootPath + "/layouts/" + this.getLayoutFolder();
        this._filenames = null;
        this._layouts = {};
        this._classMap = {};
        this._loadCount = 0;
        this._loadIndex = 0;
    },

    destroy: function() {
        this._filenames = null;
        this._layouts = null;
        this._classMap = null;

        EventEmitter.prototype.destroy.apply(this, arguments);
    },

    loadContent: function(view, className) {
        if (!this._layouts[className]) {
            return null;
        }

        var doc = this._layouts[className];
        var root = doc.documentElement;
        this.setAttribute(view, root);

        var objects = this.getObjectsByClass(root);
        for (var i = 0; i < objects.length; i++) {
            view.addChild(objects[i]);
        }
    },

    load: function() {
        global.app.appService.loadFile(this._path + "/files.json", function(content) {
            if (content !== null) {
                this._filenames = JSON.parse(content);
            }
            if (content === null || this._filenames.length === 0) {
                this.dispatchEvent("load");
                return;
            }
            var filename = this._filenames.pop();
            this.loadLayout(filename);
        }.bind(this));
    },

    getObjectsByClass: function(node) {
        var objects = [];
        var length = node.childNodes.length;
        for (var i = 0; i < length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeType === 1) {
                var obj = this.getObjectByClass(childNode);
                objects.push(obj);
            }
        }
        return objects;
    },

    getObjectByClass: function(node) {
        var nodeClassName = node.getAttribute("class");
        var nodeClass = this._classMap[nodeClassName];
        var nodeObject = new nodeClass();
        this.setAttribute(nodeObject, node);

        var length = node.childNodes.length;
        for (var i = 0; i < length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeType === 1) {
                var obj = this.getObjectByClass(childNode);
                nodeObject.addChild(obj);
            }
        }
        return nodeObject;
    },

    setAttribute: function(view, node) {
        var attrLength = node.attributes.length;
        for (var k = 0; k < attrLength; k++) {
            var attr = node.attributes[k];
            var property = attr.name;
            if (property === "class") {
                continue;
            }
            var value = attr.value;
            view[property] = value;
        }
    },

    loadLayout: function(file) {
        console.log(this._path + "/" + file);
        global.app.appService.loadFile(this._path + "/" + file, function(content) {
            if (content === null) {
                throw "Layout load error.";
            }
            var doc = new DOMParser().parseFromString(content, "text/xml");
            var docClass = doc.documentElement.getAttribute("class");
            this._layouts[docClass] = doc;

            this.preloadClass(doc.documentElement);

            this._loadIndex = 0;
            this.loadClass(function() {
                if (this._filenames.length === 0) {
                    this.dispatchEvent("load");
                    return;
                }
                var filename = this._filenames.pop();
                this.loadLayout(filename);
            }.bind(this));
        }.bind(this));
    },

    preloadClass: function(node) {
        var nodeClass = node.getAttribute("class");
        if (!this._classMap.hasOwnProperty(nodeClass)) {
            this._loadCount++;
            this._classMap[nodeClass] = null;
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeType === 1) {
                this.preloadClass(childNode);
            }
        }
    },

    loadClass: function(callback) {
        for (var nodeClass in this._classMap) {
            if (this._classMap.hasOwnProperty(nodeClass)) {
                var path = null;
                if (/^framework\./.test(nodeClass)) {
                    var idx = nodeClass.indexOf(".") + 1;
                    path = global.AppFXRootPath + "/" + nodeClass.substr(idx).replace(/\./g, "/").toLowerCase();
                } else {
                    path = global.app.rootPath + "/" + nodeClass.replace(/\./g, "/").toLowerCase();
                }

                (function(nodeClass) {
                    global.app.appService.asyncLoadModule(path, function(mod) {
                        this._classMap[nodeClass] = mod;
                        this._loadIndex++;
                        if (this._loadIndex === this._loadCount) {
                            callback();
                            return;
                        }
                    }.bind(this));
                }.bind(this))(nodeClass);
            }
        }
    },

    getLayoutFolder: function() {
        // TODO
        return "320x320-square";
    }
}, module);

});