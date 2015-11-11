"use strict";

var MyClass = require("./myclass");
var MySubClass = require("./mysubclass");
var myClass = new MyClass();
var mySubClass = new MySubClass();

myClass.showInstanceProperty();
mySubClass.showInstanceProperty();

myClass.showStaticProperty();
mySubClass.showStaticProperty();

MyClass.staticMethod();
MySubClass.staticMethod();
