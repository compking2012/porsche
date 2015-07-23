define(function(require, exports, module) {

"use strict";
var Class = require("/framework/class");
var CompositeView = require("/framework/ui/view/compositeview");
var ImageView = require("/framework/ui/view/imageview");

Class.define("Clock6SmallGears", CompositeView, {
    initialize: function() {
        CompositeView.prototype.initialize.apply(this, arguments);

        this.smallGearBg = new ImageView();
        this.smallGearBg.src = "res/6/small_gear_bg.png";
        this.smallGearBg.width = 70;
        this.smallGearBg.height = 70;

        this.smallGear1 = new ImageView();
        this.smallGear1.src = "res/6/small_gear_1.png";
        this.smallGear1.originX = 30;
        this.smallGear1.originY = 30;
        this.smallGear1.left = 27 - 30;
        this.smallGear1.top = 13 - 30;
        this.smallGear1.width = 60;
        this.smallGear1.height = 60;

        this.smallGear12 = new ImageView();
        this.smallGear12.src = "res/6/small_gear_1.png";
        this.smallGear12.originX = 30;
        this.smallGear12.originY = 30;
        this.smallGear12.left = 21 - 30;
        this.smallGear12.top = 63 - 30;
        this.smallGear12.width = 60;
        this.smallGear12.height = 60;

        this.smallGear2 = new ImageView();
        this.smallGear2.src = "res/6/small_gear_2.png";
        this.smallGear2.originX = 19;
        this.smallGear2.originY = 19;
        this.smallGear2.left = 55 - 19;
        this.smallGear2.top = 41 - 19;
        this.smallGear2.width = 38;
        this.smallGear2.height = 38;

        this.smallGearBgProjection = new ImageView();
        this.smallGearBgProjection.src = "res/6/small_gear_bg_projection.png";
        this.smallGearBgProjection.width = 70;
        this.smallGearBgProjection.height = 70;

        this.addChild(this.smallGearBg);
        this.addChild(this.smallGear1);
        this.addChild(this.smallGear12);
        this.addChild(this.smallGear2);
        this.addChild(this.smallGearBgProjection);

        this.now = 0;
    },

    setTime: function(time) {
        this.now = time;
        var sec = this.now.getSeconds();
        this.smallGear1.rotationZ = Math.PI / 40 * sec;
        this.smallGear12.rotationZ = -Math.PI / 40 * sec;
        this.smallGear2.rotationZ = Math.PI / 40 * sec;
    },

    paintChildren: function(context) {
        context.save();
        context.beginPath();
        context.arc(35, 35, 35, 0, Math.PI * 2);
        context.clip();
        context.translate(this.smallGearBg.left, this.smallGearBg.top);
        this.smallGearBg.paint(context);
        context.restore();

        context.save();
        context.beginPath();
        context.arc(35, 35, 30, 0, Math.PI * 2);
        context.clip();

        context.save();
        context.translate(this.smallGear1.left, this.smallGear1.top);
        this.smallGear1.paint(context);
        context.restore();

        context.save();
        context.translate(this.smallGear12.left, this.smallGear12.top);
        this.smallGear12.paint(context);
        context.restore();

        context.save();
        context.translate(this.smallGear2.left, this.smallGear2.top);
        this.smallGear2.paint(context);
        context.restore();
        context.restore();

        context.save();
        context.beginPath();
        context.arc(35, 35, 35, 0, Math.PI * 2);
        context.clip();
        context.translate(this.smallGearBgProjection.left, this.smallGearBgProjection.top);
        this.smallGearBgProjection.paint(context);
        context.restore();
    }
}, module);

});
