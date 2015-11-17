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

        var bindMethodWithSuper = function(func, sc) {
            return function() {
                var currentSuperClass = this.super;
                this.super = sc;
                var ret = func.apply(this, arguments);
                this.super = currentSuperClass;
                return ret;
            };
        };

        var newClass = function() {
            if (typeof this.initialize === "function") {
                this.initialize.apply(this, arguments);
            }
        };

        var scp = superClass ? superClass : null;
        if (definition.hasOwnProperty("static")) {
            var statics = definition.static;
            delete definition.static;
            for (var key in statics) {
                if (statics.hasOwnProperty(key)) {
                    var pd = Object.getOwnPropertyDescriptor(statics, key);
                    if (pd.value instanceof Function) {
                        pd.value = bindMethodWithSuper(pd.value, scp);
                    } else if (pd.set instanceof Function || pd.get instanceof Function) {
                        if (pd.set instanceof Function) {
                            pd.set = bindMethodWithSuper(pd.set, scp);
                        }
                        if (pd.get instanceof Function) {
                            pd.get = bindMethodWithSuper(pd.get, scp);
                        }
                    }

                    Object.defineProperty(newClass, key, pd);
                }
            }
        }
        newClass.super = scp;

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

        scp = superClass ? superClass.prototype : null;
        for (var property in definition) {
            if (definition.hasOwnProperty(property)) {
                var pd = Object.getOwnPropertyDescriptor(definition, property);
                if (pd.value instanceof Function) {
                    pd.value = bindMethodWithSuper(pd.value, scp);
                } else if (pd.set instanceof Function || pd.get instanceof Function) {
                    if (pd.set instanceof Function) {
                        pd.set = bindMethodWithSuper(pd.set, scp);
                    }
                    if (pd.get instanceof Function) {
                        pd.get = bindMethodWithSuper(pd.get, scp);
                    }
                }
                Object.defineProperty(newClass.prototype, property, pd);
            }
        }
        newClass.prototype.super = scp;

        newClass.prototype.className = myClass;

        if (module !== null) {
            module.exports = newClass;
        } else {
            return newClass;
        }
    };
}).apply(Class.prototype);
module.exports = Class;
