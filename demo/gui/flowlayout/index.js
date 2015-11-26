define(function(require, exports, module) {
"use strict";

var MyApp = require("./myapp");
new MyApp("FlowLayout");
setTimeout(function(){console.log("Hello world");},1000000);

});