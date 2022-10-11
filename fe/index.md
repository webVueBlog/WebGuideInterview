
JS 数据类型分为两大类：

原始类型
对象类型

原始（Primitive）类型

在 JS 中，存在着 7 种原始值，分别是：

boolean
null
undefined
number
string
symbol
bigint

首先原始类型存储的都是值，是没有函数可以调用的，比如 undefined.toString() 报错

此时你肯定会有疑问，这不对呀，明明 '1'.toString() 是可以使用的。其实在这种情况下，'1' 已经不是原始类型了，而是被强制转换成了 String 类型也就是对象类型，所以可以调用 toString 函数。

其中 JS 的 number 类型是浮点类型的，在使用中会遇到某些 Bug，比如 0.1 + 0.2 !== 0.3

string 类型的值是不可变的，无论你在 string 类型上调用何种方法，都不会对值有改变。

虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

对象类型和原始类型不同的是，原始类型存储的是值，一般存储在栈上，对象类型存储的是地址（指针），数据存储在堆上

当创建了一个对象类型的时候，计算机会在堆内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）。

对于常量 a 来说，假设内存地址（指针）为 #001，那么在地址 #001 的位置存放了值 []，常量 a 存放了地址（指针） #001

当我们将变量赋值给另外一个变量时，复制的是原本变量的地址（指针），也就是说当前变量 b 存放的地址（指针）也是 #001。因此当我们对任一变量进行数据修改的时候，等同于修改存放在地址（指针） #001 上的值，所以就导致了两个变量的值都发生了改变。

函数传参是传递对象指针的副本

类型判断有多种方式。

typeof 对于原始类型来说，除了 null 都可以显示正确的类型

typeof 对于对象来说，除了函数都会显示 object

instanceof 通过原型链的方式来判断是否为构建函数的实例，常用于判断具体的对象类型

对于原始类型来说，你想直接通过 instanceof 来判断类型是不行的
Symbol.hasInstance

Symbol.hasInstance 是什么东西，其实就是一个能让我们自定义 instanceof 行为的东西  instanceof 并不是百分之百可信的。

还可以直接通过构建函数来判断类型：[].constructor === Array

Object.prototype.toString.call
Object.prototype.toString.call 综合来看是最佳选择，能判断的类型最完整

同时还存在一些判断特定类型的 API

在 JS 中类型转换只有三种情况，分别是：

转换为布尔值
转换为数字
转换为字符串

在条件判断时，除了 undefined， null， false， NaN， ''， 0， -0，其他所有值都转为 true，包括所有对象。

对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数

如果需要转字符串类型就调用 x.toString()，转换为基础类型的话就返回转换的值。不是字符串类型的话就先调用 valueOf，结果不是基础类型的话再调用 toString
调用 x.valueOf()，如果转换为基础类型，就返回转换的值
如果都没有返回原始类型，就会报错
你也可以重写 Symbol.toPrimitive ，该方法在转原始类型时调用优先级最高。

如果一方不是字符串或者数字，那么会将它转换为数字或者字符串
true + true // 2
4 + [1,2,3] // "41,2,3"

加法还需要注意这个表达式 'a' + + 'b'
'a' + + 'b' // -> "aNaN"
因为 + 'b' 等于 NaN，所以结果为 "aNaN"

4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN

比较运算符
如果是对象，就通过 toPrimitive 转换对象
如果是字符串，就通过 unicode 字符索引来比较

对象，会通过 valueOf 转换为原始类型再比较值。

this
寻找函数foo中的this
判断函数类型
箭头函数 (包裹箭头函数的第一个普通函数中的this) - 普通函数(函数如何被调用) - this是第一个参数 (bind, call, apply)

函数如何被调用

除了new的方式 （foo()还是obj.foo()) - this被固化在实例上(new 的方式)

foo() this为window - obj.foo() this为obj

== vs ===
首先会判断两者类型是否相同。相同的话就是比大小了
类型不相同的话，那么就会进行类型转换
会先判断是否在对比 null 和 undefined，是的话就会返回 true
判断两者类型是否为 string 和 number，是的话就会将字符串转换为 number
判断其中一方是否为 object 且另一方为 string、number，是的话就会把 object 转为原始类型再进行判断，也就是执行 x.toString() 及 valueOf

'1' == { name: 'xxx' }
'1' == '[object Object]'

闭包
假如一个函数能访问外部的变量，那么就形成了一个闭包，而不是一定要返回一个函数。

闭包是如何存储外部变量的
局部、占用空间确定的数据，一般会存放在栈中，否则就在堆中（也有例外）。
原始数据一般存放在栈上。

let a = 1
var b = 2
// 形成闭包
function fn() {
  console.log(a, b);
}
[[Scopes]]
全局下声明的变量，如果是 var 的话就直接被挂到 global 上，如果是其他关键字声明的话就被挂到 Script 上。
虽然这些数据同样还是存在 [[Scopes]] 上，但是全局变量在内存中是存放在静态区域的，因为全局变量无需进行垃圾回收。

局部变量被存储在栈上，全局变量存储在静态区域上，其它都存储在堆上。

浅拷贝
通过 Object.assign
这个函数会拷贝所有的属性值到新的对象中。如果属性值是对象的话，拷贝的是地址。
展开运算符 ... 来实现浅拷贝：

深拷贝
深拷贝通常可以通过 JSON.parse(JSON.stringify(object)) 来解决，这个方式基本能解决大部分情况。
如果对象中存在循环引用，这个方法是存在局限性的。
// 利用 WeakMap 解决循环引用

// 利用 WeakMap 解决循环引用
let map = new WeakMap()
function deepClone(obj) {
  if (obj instanceof Object) {
    if (map.has(obj)) {
      return map.get(obj)
    }
    let newObj
    if (obj instanceof Array) {
      newObj = []     
    } else if (obj instanceof Function) {
      newObj = function() {
        return obj.apply(this, arguments)
      }
    } else if (obj instanceof RegExp) {
      // 拼接正则
      newobj = new RegExp(obj.source, obj.flags)
    } else if (obj instanceof Date) {
      newobj = new Date(obj)
    } else {
      newObj = {}
    }
    // 克隆一份对象出来
    let desc = Object.getOwnPropertyDescriptors(obj)
    let clone = Object.create(Object.getPrototypeOf(obj), desc)
    map.set(obj, clone)
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepClone(obj[key])
      }
    }
    return newObj
  }
  return obj
}

递归肯定会存在爆栈的问题，因为执行栈的大小是有限制的，到一定数量栈就会爆掉。当遇到这种问题，我们可以通过遍历的方式来改写递归。也就是如何写层序遍历（BFS）的问题了，只需要通过数组来模拟执行栈就能解决爆栈问题。

原型
每个 JS 对象都有 __proto__ 属性，这个属性指向了原型。
对于 obj 来说，可以通过 __proto__ 找到一个原型对象，在该对象中定义了很多函数让我们来使用。
constructor 属性，也就是构造函数
并不是所有函数都具有这个属性，Function.prototype.bind() 就没有这个属性。
原型链就是多个对象通过 __proto__ 的方式连接了起来。

Object 是所有对象的爸爸，所有对象都可以通过 __proto__ 找到它
Function 是所有函数的爸爸，所有函数都可以通过 __proto__ 找到它
函数的 prototype 是一个对象
对象的 __proto__ 属性指向原型， __proto__ 将对象和原型连接起来组成了原型链

在《你不知道的JS》书里，对闭包的描述是：当函数可以记住并访问所在的词法作用域时，就产生了闭包。闭包指的是作用域的引用。

提升
函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
let 和 const 作用基本一致，但是后者声明的变量不能再次赋值























