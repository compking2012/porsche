"use strict";

module.exports = {
    import: function(namespace) {
        if (this.hasOwnProperty(namespace)) {
            return this[namespace];
        } else {
            var idx = namespace.indexOf(".") + 1;
            var path = "./" + namespace.substr(idx).replace(/\./g, "/").toLowerCase();
            console.log("[AppFX] path:", namespace, path);
            return require(path);
        }
    }
};
