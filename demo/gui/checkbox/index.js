define(function(require, exports, module) {
//我们开始构建一个最简单的应用，包括一个计时器，和一个button,当应用在前台的时候打开计时器，定时变换button颜色，当应用置于后台的时候关闭计时器；
//首先让我们将需要的资源引入文件：
var main = require("./myapp");
new main();
});