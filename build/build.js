"use strict";
var fs = require("fs");
var path = require("path");

var mode = process.argv[2];     // "h5", "node", "h5-es6" or "node-es6"
var dstDir = process.argv[3];
var prefix = process.argv[4] || "";

var contentPrefix = "define(function(require, exports, module) {\r\n";
var contentPostfix = "\r\n});";
var html = "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<title></title>" +
            "<script src=\"" + prefix + "/framework/vendor/seajs/2.1.1/sea.js\"></script>" +
            "<script src=\"" + prefix + "/framework/vendor/seajs-style/1.0.0/seajs-style.js\"></script>" +
            "<script src=\"" + prefix + "/framework/vendor/seajs-text/1.0.2/seajs-text.js\"></script>" +
            "<script>" +
                "window.__prefix__ = \"" + prefix + "\";" +
                "seajs.config({" +
                    "base: \"./\"" +
                "});" +
                "seajs.use(\"./index\");" +
            "</script>" +
            "</head>" +
            "<body style=\"margin: 0; padding: 0; overflow:hidden;\"></body>" +
            "</html>";

prepare();

var dirInfo = scanFolder(dstDir);

var files = dirInfo.files;

files.forEach(function(file) {
    var content = fs.readFileSync(file).toString();
    if (mode === "h5") {
        content = contentPrefix + content + contentPostfix;

        var fxRequire = "var fx = require(\"framework\");";
        var fxImport = /fx.import\(\"(\w+[\.|\w+]*)\"\)/g;
        content = content.replace(fxRequire, "").replace(fxImport, function(line, match) {
            match = match.toLowerCase();
            var newLine = "require(\"" + prefix + (match.startsWith("framework") ? "/" : "") + match.replace(/\./g, "/") + "\")";
            return newLine;
        });
    }

    if (file.endsWith("app/app.js")) {
        var fxAppService = "var AppService = require(\"../platform/appservice\");";
        var fxInputService = "var InputService = require(\"../platform/inputservice\");";
        var fxRenderService = "var RenderService = require(\"../platform/renderservice\");";
        if (mode === "h5") {
            var fxH5AppService = "var AppService = require(\"../platform/h5appservice\");";
            var fxH5InputService = "var InputService = require(\"../platform/h5inputservice\");";
            var fxH5RenderService = "var RenderService = require(\"../platform/h5renderservice\");";
            content = content.replace(fxAppService, fxH5AppService).replace(fxInputService, fxH5InputService).replace(fxRenderService, fxH5RenderService);
        } else {
            var fxNodeAppService = "var AppService = require(\"../platform/nodeappservice\");";
            var fxNodeInputService = "var InputService = require(\"../platform/nodeinputservice\");";
            var fxNodeRenderService = "var RenderService = require(\"../platform/noderenderservice\");";
            content = content.replace(fxAppService, fxNodeAppService).replace(fxInputService, fxNodeInputService).replace(fxRenderService, fxNodeRenderService);
        }
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
                if (tmpPath.startsWith(dstDir + "/demo")) {
                    fs.writeFileSync(tmpPath + "/index.html", html);
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
