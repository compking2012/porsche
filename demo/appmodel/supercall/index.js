"use strict";
var Animal = require("./animal");
var Pig = require("./pig");
var BigPig = require("./bigpig");

// Test static property
console.log("Animal.TestStaticProperty === 1: ", Animal.TestStaticProperty === 1);

// Test static method
console.log("Animal.TestStaticMethod() === 2: ", Animal.TestStaticMethod() === 2);

// Test access superclass static property from subclass
console.log("Pig.TestStaticProperty === 1: ", Pig.TestStaticProperty === 1);

// Test override superclass static property from subclass
console.log("Pig.TestStaticProperty2 === 3: ", Pig.TestStaticProperty2 === 3);

// Test access superclass static method from subclass
console.log("Pig.TestStaticMethod() === 2: ", Pig.TestStaticMethod() === 2);

// Test override superclass static property from subclass
console.log("Pig.TestStaticMethod2() === 3: ", Pig.TestStaticMethod2() === 3);

// Test non-override static property
console.log("Animal.TestStaticProperty2 === 2: ", Animal.TestStaticProperty2 === 2);

// Test non-override static method
console.log("Animal.TestStaticMethod2() === 33: ", Animal.TestStaticMethod2() === 33);


var animal = new Animal(11);
// Test constructor, property and method
console.log("animal.age === 11: ", animal.age === 11);
console.log("animal.eat() === \"nice\": ", animal.eat() === "nice");

// Test subclass constructor, property and method
var pig = new Pig(1, 11);
console.log("pig.testProp === \"animal\": ", pig.testProp === "animal");
console.log("pig.climbTree() === \"nice\": ", pig.climbTree() === "nice");
console.log("pig.eat() === \"very nice\": ", pig.eat() === "very nice");
console.log("pig instanceof Pig: ", pig instanceof Pig);

var bigPig = new BigPig();
// Test access super-super-class from sub-sub-class
console.log("bigPig.testProp === \"animal\": ", bigPig.testProp === "animal");

// Test access super-super-class method from sub-sub-class
console.log("bigPig.drink() === \"good\": ", bigPig.drink() === "good");
console.log("bigPig instanceof BigPig: ", bigPig instanceof BigPig);

// Test access this.super
console.log("bigPig.getSuper() instanceof Pig: ", bigPig.getSuper() instanceof Pig);
console.log("bigPig instanceof Animal: ", bigPig instanceof Animal);
