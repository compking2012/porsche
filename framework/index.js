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

module.exports = {
    import: function(namespace) {
        if (this.hasOwnProperty(namespace)) {
            return this[namespace];
        } else {
            var idx = namespace.indexOf(".") + 1;
            var path = "./" + namespace.substr(idx).replace(/\./g, "/").toLowerCase();
            return require(path);
        }
    }
};

});