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

function Class() {}
(function() {
    Class.define = function(myClass, superClass, definition, module) {
        if (arguments.length === 3) {
            module = definition;
            definition = superClass;
            superClass = null;
        }

        var newClass = function() {
            if (typeof this.initialize === "function") {
                this.initialize.apply(this, arguments);
            }
        };

        if (superClass) {
            for (var key in superClass) {
                if (superClass.hasOwnProperty(key)) {
                    var pd = Object.getOwnPropertyDescriptor(superClass, key);
                    Object.defineProperty(newClass, key, pd);
                }
            }
        }

        if (definition.hasOwnProperty("static")) {
            var statics = definition.static;
            delete definition.static;
            for (var key in statics) {
                if (statics.hasOwnProperty(key)) {
                    var pd = Object.getOwnPropertyDescriptor(statics, key);
                    Object.defineProperty(newClass, key, pd);
                }
            }
        }

        if (superClass) {
            newClass.prototype = Object.create(superClass.prototype, {
                constructor: {
                    value: newClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            newClass.prototype.constructor = newClass;
        }

        for (var property in definition) {
            if (definition.hasOwnProperty(property)) {
                var pd = Object.getOwnPropertyDescriptor(definition, property);
                Object.defineProperty(newClass.prototype, property, pd);
            }
        }
        newClass.prototype.className = myClass;

        if (module !== null) {
            module.exports = newClass;
        } else {
            return newClass;
        }
    };
}).apply(Class.prototype);
module.exports = Class;
