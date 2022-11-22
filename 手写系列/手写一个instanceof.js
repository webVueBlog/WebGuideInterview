/**
B站：算法猫叔
instanceof的底层实现原理：

作用：

用于判断某个实例是否属于某构造函数
在继承关系中用来判断一个实例是否属于它的父类或者祖先类型的实例

只要右边变量的prototype在左边变量的原型链上即可。instanceof在查找的过程中会遍历左边变量的原型链，直到找到右边变量的prototype，如果查找失败，则会返回false。

object instanceof constructor

参数：

object 某个实例对象
constructor 某个构造函数
功能 instanceof 运算符用于监测构造函数的 prototype 属性是否出现在某个实例对象的原型链
原理 内部机制是通过原型链实现的
用途：监测数据类型；判断一个引用类型变量是否是一个类的实例

对象 instanceof 构造函数
var obj = new Object()
obj instanceof Object // true
 */

function myInstanceof(left, right) {
 // 获取对象的原型
 let proto = Object.getPrototypeOf(left);
 // 获取构造函数的 prototype 对象
 let prototype = right.prototype;

 // 判断构造函数的 prototype 对象是否在对象的原型链上
 while (true) {
  if (!proto) return false;
  if (proto === prototype) return true;
  proto = Object.getPrototypeOf(proto);
 }
}

console.log(myInstanceof([], Array)) // true