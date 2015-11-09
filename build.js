"use strict";
var fs = require("fs");
var path = require("path");

var mode = process.argv[2];     // "h5" or "node"
var srcDir = ".";
var dstDir = "out";

if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir);
}

prepare();

var dirInfo = scanFolder(srcDir);

var files = dirInfo.files;
var contentPrefix = "define(function(require, exports, module) {\r\n";
var contentPostfix = "\r\n});";

files.forEach(function(file) {
    var content = fs.readFileSync(file).toString();
    if (mode === "h5") {
        content = contentPrefix + content + contentPostfix;
    }
    var dstFile = path.join(dstDir, file);
    console.log("dstFile: ", dstFile);
    fs.writeFileSync(dstFile, content);
});


function prepare() {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
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
                if (item === dstDir) {
                    return;
                }
                if (tmpPath === srcDir + "/framework/vendor") {
                    return;
                }
                walk(tmpPath, fileList);
            } else {
                if (!tmpPath.endsWith(".js")) {
                    return;
                }
                if (item === "build.js") {
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
