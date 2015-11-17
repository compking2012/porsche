"use strict";
var MyClass = require("./myclass");
var MySubClass = require("./mysubclass");
var MySubSubClass = require("./mysubsubclass");

var myClass = new MyClass();
MyClass.takeStaticAction();
MyClass.staticProperty = "MyClass";
console.log("MyClass.staticProperty = ", MyClass.staticProperty);
myClass.takeInstanceAction();
myClass.instanceProperty = "myClass";
console.log("myClass.instanceProperty = ", myClass.instanceProperty);
console.log("------------------------------------------------------------");

var mySubClass = new MySubClass();
MySubClass.takeStaticAction();
MySubClass.staticProperty = "MySubClass";
console.log("MySubClass.staticProperty = ", MySubClass.staticProperty);
mySubClass.takeInstanceAction();
mySubClass.instanceProperty = "mySubClass";
console.log("mySubClass.instanceProperty = ", mySubClass.instanceProperty);
console.log("------------------------------------------------------------");

var mySubSubClass = new MySubSubClass();
MySubSubClass.takeStaticAction();
MySubSubClass.staticProperty = "MySubSubClass";
console.log("MySubSubClass.staticProperty = ", MySubSubClass.staticProperty);
mySubSubClass.takeInstanceAction();
mySubSubClass.instanceProperty = "mySubSubClass";
console.log("mySubSubClass.instanceProperty = ", mySubSubClass.instanceProperty);
console.log("------------------------------------------------------------");
