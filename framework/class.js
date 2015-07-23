define(function(require, exports, module) {

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
            this.initialize.apply(this, arguments);
        };
        // global[myClass] = newClass;
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
        newClass.prototype.super = superClass ? superClass.prototype : null;
        newClass.prototype.className = myClass;
        module.exports = newClass;
    };
}).apply(Class.prototype);
module.exports = Class;

});
