"use strict";
var fx = require("cloudappfx");
var Class = fx.import("framework.Class");
var CloudApp = fx.import("framework.app.CloudApp");
var Library = require("./library");
var Book = require("./book");

Class.define("MyApp", CloudApp, {
    initialize: function() {
        CloudApp.prototype.initialize.apply(this, arguments);

        // Test 1: create an empty library
        var library = new Library();
        library.create(function() {
            console.log("[MyApp] library created.");
        });

        // Test 2: add two new books
        var book1 = new Book({
            title: "Hello World",
            author: "Yang Yang",
            page: 300
        });
        library.add(book1);

        var book2 = new Book({
            title: "Hello World 2",
            author: "Yang Yang",
            page: 300
        });
        library.add(book2);
        library.update(function() {
            console.log("[MyApp] library updated.");
        });

        // Test 3: insert a new book at first
        var book3 = new Book({
            title: "Hello World 3",
            author: "Yang Yang",
            page: 300
        });
        library.insert(book3, 0);
        book3.create(function() {
            console.log("[MyApp] book3 created.");
        });

        // Test 4: remove a book from library
        library.remove(book1);
        book1.delete(function() {
            console.log("[MyApp] book1 deleted.");
        });

        // Test 5: show the book count of library and the first book title
        console.log("[MyApp] library.length=", library.length);
        console.log("[MyApp] library[0]=", library[0].get("title"));

        // Test 6: retrieve library and show the book count
        var library2 = new Library();
        library2.retrieve(null, function() {
            console.log("[MyApp] library2 retrieved.");
            console.log("[MyApp] library2.length=", library2.length);
        });
    }
}, module);
