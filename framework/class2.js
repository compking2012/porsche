// "use strict";
//所有类的基类
var Class = function () { };

//基类增加一个extend方法
Class.extend = function (prop) {
    var _super = this.prototype;
    //父类的实例赋给变量prototype
    var prototype = new this();
    //把要扩展的属性复制到prototype变量上
    for (var name in prop) {
        //下面代码是让ctor里可以直接访问使用this._super访问父类构造函数，除了ctor的其他方法，this._super都是访问父类的实例
        prototype[name] = name == "initialize" && typeof prop[name] == "function" &&
            typeof _super[name] == "function" ?
            (function (name, fn) {
                return function () {
                    //备份一下this._super
                    var tmp = this.super;
                    //替换成父类的同名ctor方法
                    this.super = _super[name];
                    //执行，此时fn中的this里面的this._super已经换成了_super[name],即父类的同名方法
                    var ret = fn.apply(this, arguments);
                    //把备份的还原回去
                    this.super = tmp;
                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    //假的构造函数
    function newClass() {
        //执行真正的ctor构造函数
        this.initialize.apply(this, arguments);
    }

    //继承父类的静态属性
    for (var key in this) {
        if (this.hasOwnProperty(key) && key != "extend")
            newClass[key] = this[key];
    }

    // 子类的原型指向父类的实例
    newClass.prototype = prototype;

    //这里一定要用new this
    //不能Class.prototype._super = prototype;（这里明显错误，prototype这时已经被copy进去了新的属性）
    //或者Class.prototype._super = _super;（这里会导致_super instanceof 不准确 ）
    newClass.prototype.super = new this();

    //覆盖父类的静态属性
    if (prop.static) {
        for (var name in prop.static) {
            if (prop.static.hasOwnProperty(name)) {
                newClass[name] = prop.static[name];
                if (name == "initialize") {
                    newClass[name]();
                }
            }
        }
    }

    newClass.prototype.constructor = newClass;

    //原型可扩展
    newClass.extendPrototype = function (prop) {
        for (var name in prop) {
            prototype[name] = prop[name];
        }
    };

    //任何Class.extend的返回对象都将具备extend方法
    newClass.extend = arguments.callee;

    return newClass;
};
module.exports = Class;
