"use strict";
var fx = require("framework");
var Class = fx.import("framework.Class");
var ImageView = fx.import("framework.ui.view.ImageView");
var CompositeView = fx.import("framework.ui.view.CompositeView");
var Clock6BigGears = require("./clock6biggears");
var Clock6Pointers = require("./clock6pointers");
var Clock6SmallGears = require("./clock6smallgears");

Class.define("framework.apps.simpleclock.Clock6View", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.bg = new ImageView();
        this.bg.src = __dirname + "/../../res/6/bg_1.png";
        this.bg.width = 320;
        this.bg.height = 320;

        this.bigGearBg = new ImageView();
        this.bigGearBg.src = __dirname + "/../../res/6/big_gear_bg.png";
        this.bigGearBg.left = 115 - 52;
        this.bigGearBg.top = 205 - 52;
        this.bigGearBg.width = 104;
        this.bigGearBg.height = 104;

        this.bigGears = new Clock6BigGears();
        this.bigGears.left = 115 - 52;
        this.bigGears.top = 205 - 52;
        this.bigGears.width = 104;
        this.bigGears.height = 104;

        this.bg2 = new ImageView();
        this.bg2.src = __dirname + "/../../res/6/bg_2.png";
        this.bg2.left = 160 - 75;
        this.bg2.top = 160 - 75;
        this.bg2.width = 150;
        this.bg2.height = 150;

        this.smallGears = new Clock6SmallGears();
        this.smallGears.left = 205 - 35;
        this.smallGears.top = 205 - 35;
        this.smallGears.width = 70;
        this.smallGears.height = 70;

        this.pointers = new Clock6Pointers();
        this.pointers.width = 320;
        this.pointers.height = 320;

        this.addChild(this.bg);
        this.addChild(this.bigGearBg);
        this.addChild(this.bigGears);
        this.addChild(this.bg2);
        this.addChild(this.smallGears);
        this.addChild(this.pointers);
    },

    setTime: function(time) {
        // console.log(time.getTime());
        // time.setTimezone("Asia/Shanghai");
        this.bigGears.setTime(time);
        this.pointers.setTime(time);
        this.smallGears.setTime(time);
    }
}, module);
