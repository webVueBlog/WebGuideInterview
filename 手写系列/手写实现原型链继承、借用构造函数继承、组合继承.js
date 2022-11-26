/**
B站：算法猫叔
手写：实现原型链继承、借用构造函数继承、组合继承

继承

原型链
盗用构造函数
组合继承
原型式继承
寄生式继承
寄生组合继承

基本思想就是通过 原型 继承 多个引用类型的属性和方法
每个构造函数都有一个原型对象，原型有一个属性指向构造函数，而实例有一个内部指针指向原型。

原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本构想。

1. 默认原型
默认情况下，所有引用类型都继承自 Object，这也是通过原型链实现的。任何函数的默认原型都是一个 Object 的实例，这意味着这个实例有一个内部指针指向Object.prototype。

2. 原型与继承关系
原型与实例的关系可以通过两种方式来确定

第一种方式是使用 instanceof 操作符

第二种方式是使用 isPrototypeOf()方法 原型链中的每个原型都可以调用这个方法

// 有效
// 新方法
SubType.prototype.getSubValue = function () {
 return this.subproperty;
};
// 覆盖已有的方法
SubType.prototype.getSuperValue = function () {
 return false;
};

// 无效 以对象字面量方式创建原型方法会破坏之前的原型链
SubType.prototype = {
 getSubValue() {
 return this.subproperty;
 },
 someOtherMethod() {
 return false;
 }
}; 


原型链的问题
主要问题出现在原型中包含引用值的时候。原型中包含的引用值会在所有实例间共享，这也是为什么属性通常会在构造函数中定义而不会定义在原型上的原因。

在使用原型实现继承时，原型实际上变成了另一个类型的实例。

原型链的第二个问题是，子类型在实例化时不能给父类型的构造函数传参。


如何用原型链的方式实现一个 JS 继承？
当我们对使用 new 关键字创建对象，被创建的对象的 [[prototype]] 会指向这个 prototype。

function Rect() {}
const rect = new Rect()
rect.__proto__ === Rect.prototype // true
Rect.prototype.constructor === Rect // true

用原型链的方式实现继承

// 父类
function Shape() {}
Shape.prototype.draw = function() {
  console.log('Shape Draw')
}
Shape.prototype.clear = function() {
  console.log('Shape Clear')
}
// 子类
function Rect() {}

// 实现继承的代码放这里

Rect.prototype.draw = function() {
  console.log('Rect Draw')
}
方法1：Object.create

Rect.prototype = Object.create(Shape.prototype)
Rect.prototype.constructor = Rect // 选用，如果要用到 constructor

Object.create(proto) 是个神奇的方法，它能够创建一个空对象，并设置它的 [[prototype]] 为传入的对象。

因为我们无法通过代码的方式给 [[prototype]] 属性赋值，所以使用了 Object.create 方法作为替代。

因为 Rect.prototype 指向了另一个新的对象，所以把 constructor 给丢失了，可以考虑把它放回来，如果你要用到的话。

缺点是替换掉了原来的对象。

方法2：直接修改 [[prototype]]

但不推荐。

Object.setPrototypeOf() 可以修改对象的 [[prototype]]，但因为性能的问题，也不推荐使用。

方法3：使用父类的实例

Rect.prototype = new Shape()
rect -> shape（替代掉原来的 Rect.prototype） -> Shape.prototype -> Object.prototype -> null
缺点是会产生副作用，就是执行 new Shap() 可能会出现副作用

借用构造函数
借用构造函数（Constructor Stealing），即在子类型构造函数的内部调用父类构造函数以实现对父类构造函数属性的继承。

function SubType() {
 // 继承 SuperType
 SuperType.call(this);
}
传递参数

相对于原型链而言，借用构造函数有一个很大的优势，即 可以在子类型构造函数中向父类型构造函数传递参数。

function Parent(name) {
  this.name = name;
}

function Child() {
  //继承了 Parent，同时还传递了参数
  Parent.call(this, 'dada');

  //实例属性
  this.age = 18;
}

const child = new Child();
console.log(child.name);
// 'dada'
console.log(child.age);
// 18
通过往父类型构造函数传递参数，能自定义需要继承的属性
为了确保子构造函数自身定义的属性或方法不被父构造函数生成的属性重写，可以在调用父类型构造函数后，再添加子类型构造函数中定义的属性
缺陷
只能继承父类实例对象的属性和方法，不能继承原型对象的属性和方法
无法实现复用，每个子类都有父类实例函数的副本，影响性能

JavaScript如何借用构造函数继承

function girlFriend(){
   this.girls = ['chen','wang','zhu'];
 }
function Person(){
  girlFriend.call(this,20);
}
var wang = new Person();
var zhu = new Person();
wang.girls.push('zhang');
console.log(wang.girls);  //(4) ["chen", "wang", "zhu", "zhang"]
console.log(zhu.girls);    //(3) ["chen", "wang", "zhu"]
在原型链继承中出现的问题不再出现了，这个超类不会被子类所创建的实例共享了。

借用构造函数继承的优势：是可以在子类型构造函数中向超类型构造函数传递参数

借用构造函数继承的问题：用构造函数继承并不能继承到超类型原型中定义的方法

组合继承
组合继承（Combination Inheritance）（也叫伪经典继承），指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。

其背后的思路是使用原型链实现对原型对象的属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

function SubType(name, age){
 // 继承属性
 SuperType.call(this, name);
 this.age = age;
}
// 继承方法
SubType.prototype = new SuperType();
组合继承弥补了原型链和盗用构造函数的不足，是 JavaScript 中使用最多的继承模式。

组合继承也保留了 instanceof 操作符和 isPrototypeOf()方法识别合成对象的能力。

缺陷
无论什么情况下，都会调用两次父类构造函数：第一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。

组合继承优化
Child.prototype = new Parent();


Child.prototype = Parent.prototype;
寄生组合式继承
function Child() {
  Parent.call(this);
  thi.type = 'Child';
}

Child.prototype = Object.create(Parent.prototype);

Child.prototype.constructor = Child;
 */


 