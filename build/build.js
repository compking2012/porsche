"use strict";
var fs = require("fs");
var path = require("path");

var mode = process.argv[2];     // "h5", "node", "h5-es6" or "node-es6"
var srcDir = process.argv[3];
var dstDir = process.argv[4];

prepare();

var dirInfo = scanFolder(dstDir);

var files = dirInfo.files;
var contentPrefix = "define(function(require, exports, module) {\r\n";
var contentPostfix = "\r\n});";

files.forEach(function(file) {
    var content = fs.readFileSync(file).toString();
    if (mode === "h5") {
        content = contentPrefix + content + contentPostfix;
    }
    var dstFile = path.join(dstDir, file);
    fs.writeFileSync(dstFile, content);
});


function prepare() {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    String.prototype.startsWith = function(prefix) {
        return this.indexOf(prefix, 0) !== -1;
    };
}

function scanFolder(path) {
    var fileList = [];
    var walk = function(path, fileList) {
        var files = fs.readdirSync(path);
        files.forEach(function(item) {
            var tmpPath = path + "/" + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                if (tmpPath.startsWith(dstDir + "/framework/vendor")) {
                    return;
                }
                walk(tmpPath, fileList);
            } else {
                if (!tmpPath.endsWith(".js")) {
                    return;
                }
                fileList.push(tmpPath);
            }
        });
    };

    walk(path, fileList);

    return {
        files: fileList
    };
}
