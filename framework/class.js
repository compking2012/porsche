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

        // var bindMethodWithSuper = function(func, sc) {
        //     return function() {
        //         var currentSuperClass = this.super;
        //         this.super = sc;
        //         var ret = func.apply(this, arguments);
        //         this.super = currentSuperClass;
        //         return ret;
        //     };
        // };

        var newClass = function() {
            if (!this.initialize instanceof Function) {
                throw "The constructor must be a function";
            }
            this.initialize.apply(this, arguments);
        };
        newClass.prototype.constructor = newClass;
        newClass.prototype.className = myClass;

        // Static properties and methods
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

        // Instance properties and methods
        if (superClass) {
            var _super = superClass.prototype;
            var prototype = new superClass();

            // newClass.prototype = Object.create(superClass.prototype, {
            //     constructor: {
            //         value: newClass,
            //         enumerable: false,
            //         writable: true,
            //         configurable: true
            //     }
            // });

            for (var property in definition) {
                if (definition.hasOwnProperty(property)) {
                    var p = null;
                    if (property === "initialize" && definition[property] instanceof Function && _super[property] instanceof Function) {
                        p = function(property, fn) {
                                return function () {
                                    var tmp = this.super;
                                    this.super = _super[property];
                                    var ret = fn.apply(this, arguments);
                                    this.super = tmp;
                                    return ret;
                                };
                            }(property, definition[property]);
                    } else {
                        p = definition[property];
                    }
                    prototype[property] = p;
                }
            }
            newClass.prototype = prototype;
        } else {
            for (var property in definition) {
                if (definition.hasOwnProperty(property)) {
                    var pd = Object.getOwnPropertyDescriptor(definition, property);
                    Object.defineProperty(newClass.prototype, property, pd);
                }
            }
        }
        newClass.prototype.super = superClass ? new superClass() : null;

        if (module !== null) {
            module.exports = newClass;
        } else {
            return newClass;
        }
    };
}).apply(Class.prototype);
module.exports = Class;
