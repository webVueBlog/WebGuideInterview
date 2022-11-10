[](https://start.aliyun.com/bootstrap.html)
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

原型继承和 Class 继承
首先在 JS 中并不存在类，class 只是语法糖，本质还是函数。
class Person {}
Person instanceof Function // true

组合继承是最常用的继承方式
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}
function Child(value) {
  Parent.call(this, value)
}
Child.prototype = new Parent()

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true

继承的方式核心是在子类的构造函数中通过 Parent.call(this) 继承父类的属性，然后改变子类的原型为 new Parent() 来继承父类的函数。

优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

寄生组合继承
function Parent(value) {
	this.val = value
}
Parent.prototype.getValue = function() {
	console.log(this.val)
}
function Child(value) {
	Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
	constructor: {
		value: Child,
		enumerable: false,
		writable: true,
		configurable: true
	}
})
const child = new Child(1)
child.getValue()
child instanceof Parent

将父类的原型赋值给了子类，并且将构造函数设置为子类，还能正确的找到子类的构造函数。

Class 继承
使用 extends 表明继承自哪个父类，并且在子类构造函数中必须调用 super

模块化
解决命名冲突
提供复用性
提高代码可维护性

立即执行函数
使用立即执行函数实现模块化是常见的手段
通过函数作用域解决了命名冲突、污染全局作用域的问题。

(function(globalVariable){
   globalVariable.test = function() {}
   // ... 声明各种变量、函数都不会污染全局作用域
})(globalVariable)

Map、WeakMap、Object 区别

三者都为键值对容器，但是在 key 的类型方面有一些区别。
Object 的 key 只能为 string 或者 symbol 类型
Map 的 key 接受任意类型
WeakMap 的 key 只能为 object 类型，并且该对象为弱引用，因此多用于解决引用层面，比如前文中提到的深拷贝中的循环引用问题。
Object 的存储是无序的，但是 Map 的存储是有序的，在遍历过程中会根据值的插入顺序。

AMD 和 CMD

// AMD
define(['./a', './b'], function(a, b) {
  // 加载模块完毕可以使用
  a.do()
  b.do()
})
// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a')
  a.doSomething()
})

CommonJS
CommonJS 最早是 Node 在使用

// a.js
module.exports = {
    a: 1
}
// or 
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1

----------------------------------

var module = require('./a.js')
module.a 
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
    a: 1
}
// module 基本实现
var module = {
  id: 'xxxx', // 我总得知道怎么去找到他吧
  exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports 
var load = function (module) {
    // 导出的东西
    var a = 1
    module.exports = a
    return module.exports
};
// 然后当我 require 的时候去找到独特的
// id，然后将要使用的东西用立即执行函数包装下，over


Proxy

 Vue3.0 中将会通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式。 Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

let p = new Proxy(target, handler)
target 代表需要添加代理的对象，handler 用来自定义对象中的操作，

let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

在 get 中收集依赖，在 set 派发更新

之所以 Vue3.0 要使用 Proxy 替换原本的 API 原因在于 Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。

get(target, property, receiver) {
    getLogger(target, property)
    // 这句判断代码是新增的
    if (typeof target[property] === 'object' && target[property] !== null) {
        return new Proxy(target[property], handler);
    } else {
        return Reflect.get(target, property);
    }
}


并发（concurrency）和并行（parallelism）区别

并发 指的是有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

并行 指的是假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

并发指的是场景 / 需求，比如说我们这个业务有高并发的场景，但是并行指的是能力，表明我们目前的功能是可以实现这件事情的。

回调函数（Callback）

回调函数存在两大问题：

信任问题
可读性
可读性多指回调地狱（Callback hell）。假设多个请求存在依赖性

回调地狱的根本问题是：
嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
嵌套函数一多，就很难处理错误

回调函数还存在着别的几个缺点：
不能使用 try catch 捕获错误
不能直接 return

Generator
它最大的特点就是可以控制函数的执行。
可以通过 Generator 函数解决回调地狱的问题

Promise
等待中（pending）
完成了 （resolved）
拒绝了（rejected）

new Promise((resolve, reject) => {
  resolve('success')
  // 无效
  reject('reject')
})

当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('finifsh')
// new Promise -> finifsh

Promise 实现了链式调用，也就是说每次调用 then 之后返回的都是一个 Promise，并且是一个全新的 Promise，原因也是因为状态不可变。如果你在 then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装

比如说 all、race、allSettled

async 及 await
一个函数如果加上 async ，那么该函数就会返回一个 Promise。
async function test() {
  return "1"
}
console.log(test()) // -> Promise {<resolved>: "1"}
async 就是将函数返回值使用 Promise.resolve() 包裹了下，和 then 中处理返回值一样
await 只能配套 async 使用。

目前 await 可以直接脱离 async 在顶层调用，但是需要在 ESM 模块中。Chrome 中可以没有模块限制，但是这只是 V8 的一个特性。

async 和 await 可以说是异步终极解决方案了，相比直接使用 Promise 来说，优势在于处理 then 的调用链，能够更清晰准确的写出代码

当然也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低。

async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url)
  await fetch(url1)
  await fetch(url2)
}

常用定时器函数
常见的定时器函数有 setTimeout、setInterval、requestAnimationFrame。

因为 JS 是单线程执行的，如果前面的代码影响了性能，就会导致 setTimeout 不会按期执行。
通常来说不建议使用 setInterval。第一，它和 setTimeout 一样，不能保证在预期的时间执行任务。第二，回调函数执行时间不确定，可能会出现意外情况。

第一次回调函数正常被执行，100 毫秒之后第二个回调函数进入定时器队列等待执行，再 100 毫秒之后第三个回调函数也需要进入队列，但是此时队列中已经有相同的函数在排队了，所以此次函数不会被推入队列中等待执行，也就导致了意外情况的发生。

如果你有循环定时器的需求，其实完全可以通过 requestAnimationFrame 来实现
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)

首先 requestAnimationFrame 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题，当然你也可以通过该函数来实现 setTimeout。

实现一个简易版 Promise
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
	const that = this
	that.state = PENDING
	that.value = null
	that.resolvedCallbacks = []
	this.rejectedCallbacks = []
	// 待完善 resolve 和 reject 函数
	// 待完善执行 fn 函数
}

对于经常使用的一些值都应该通过常量来管理，便于开发及后期维护
在函数体内部首先创建了常量 that，因为代码可能会异步执行，用于获取正确的 this 对象
value 变量用于保存 resolve 或者 reject 中传入的值
resolvedCallbacks 和 rejectedCallbacks 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用

来完善 resolve 和 reject 函数，添加在 MyPromise 函数体内部

function MyPromise(fn) {
	const that = this
	that.state = PENDING
	that.value = null
	that.resolvedCallbacks = []
	this.rejectedCallbacks = []
	// 待完善 resolve 和 reject 函数
	// 待完善执行 fn 函数
	
	function resolve(value) {
		if (that.state === PENDING) {
			that.state = RESOLVED
			that.value = value
			that.resolvedCallbacks.map(cb => cb(that.value))
		}
	}
	
	function reject(value) {
		if (that.state === PENDING) {
			that.state = REJECTED
			that.value = value
			that.rejectedCallbacks.map(cb => cb(that.value))
		}
	}
}

只有等待态才可以改变状态
将当前状态更改为对应状态，并且将传入的值赋值给 value
遍历回调数组并执行

实现如何执行 Promise 中传入的函数了
来实现较为复杂的 then 函数
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function MyPromise(fn) {
	const that = this
	that.state = PENDING
	that.value = null
	that.resolvedCallbacks = []
	this.rejectedCallbacks = []
	// 待完善 resolve 和 reject 函数
	// 待完善执行 fn 函数
	try {
		fn(resolve, reject)
	} catch (e) {
		reject(e)
	}
	
	function resolve(value) {
		if (that.state === PENDING) {
			that.state = RESOLVED
			that.value = value
			that.resolvedCallbacks.map(cb => cb(that.value))
		}
	}
	
	function reject(value) {
		if (that.state === PENDING) {
			that.state = REJECTED
			that.value = value
			that.rejectedCallbacks.map(cb => cb(that.value))
		}
	}
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
	const that = this
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
	onRejected = typeof onRejected === 'function' ? onRejected : r = {
		throw r
	}
	if (that.state === PENDING) {
		that.resolvedCallbacks.push(onFullfilled)
		that.rejectedCallbacks.push(onRejected)
	}
	if (that.state === RESOLVED) {
		onFulfilled(that.value)
	}
	if (that.state === REJECTED) {
		onRejected(that.value)
	}
}

改造一下 resolve 和 reject 函数
对于 resolve 函数来说，首先需要判断传入的值是否为 Promise 类型

继续改造 then 函数中的代码，首先我们需要新增一个变量 promise2，因为每个 then 函数都需要返回一个新的 Promise 对象，该变量用于保存新的返回对象

规范规定，执行 onFulfilled 或者 onRejected 函数时会返回一个 x，并且执行 Promise 解决过程，这是为了不同的 Promise 都可以兼容使用，比如 JQuery 的 Promise 能兼容 ES6 的 Promise
x 不能与 promise2 相等，这样会发生循环引用的问题

创建一个变量 called 用于判断是否已经调用过函数
然后判断 x 是否为对象或者函数，如果都不是的话，将 x 传入 resolve 中
如果 x 是对象或者函数的话，先把 x.then 赋值给 then，然后判断 then 的类型，如果不是函数类型的话，就将 x 传入 resolve 中

如果 then 是函数类型的话，就将 x 作为函数的作用域 this 调用之，并且传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise，两个回调函数都需要判断是否已经执行过函数，然后进行相应的逻辑

在执行的过程中如果抛错了，将错误传入 reject 函数中

const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function MyPromise(fn) {
	const that = this
	that.state = PENDING
	that.value = value
	that.resolvedCallbacks = []
	that.rejectedCallbacks = []
	try {
		fn(resolve, reject)
	} catch (e) {
		reject(e)
	}
	function resolve(value) {
		if (value instanceof MyPromsie) {
			return value.then(resolve, reject)
		}
		// 浏览器支持queueMicrotask，该函数可以出发微任务
		queueMicrotask(() => {
			if (this.state === PENDING) {
				that.state = RESOLVED
				that.value = value
				that.resolvedCallbacks.map(cb => cb(that.value))
			}
		})
	}
	funtion reject(value) {
		queueMicrotask(() => {
			if (that.state === PENDING) {
				that.state = REJECTED
				that.value = value
				that.rejectedCallbacks.map(cb => cb(that.value))
			}
		})
	}
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
	const that = this
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
	onRejected = typeof onRejected === 'function' ? onRejected : r => {
		throw r
	}
	if (that.state === PENDING) {
		return (promise2 = new MyPromsie((resolve, reject) => {
			that.resolvedCallbacks.push(() => {
				try {
					const x = onFulfilled(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})
			
			that.rejectedCallbacks.push(() => {
				try {
					const x = onRejected(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})
		}))
	}
	if (that.state === RESOLVED) {
		return (promise2 = new MyPromise((resolve, reject) => {
			queueMicrotask(() => {
				try {
					const x = onFulfilled(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (reason) {
					reject(reason)
				}
			})
		}))
	}
	if (that.state === REJECTED) {
		return (promise2 = new MyPromise((resolve, reject) => {
			queueMicrotask(() => {
				try {
					const x = onRejected(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (reason) {
					reject(reason)
				}
			})
		}))
	}
}
function resolutionProcedure(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('Error'))
	}
	if (x instanceof MyPromise) {
		x.then(function (value) {
			resolutionProcedure(promise2, value, resolve, reject)
		}, reject)
	}
	let called = false
	if (x !== null && (typeof x === 'ojbect' || typeof x === 'function')) {
		try {
			let then = x.then
			if (typeof then === 'function') {
				then.call(
					x,
					y => {
						if (called) return
						called = true
						resolutionProcedure(promise, y, resolve, reject)
					},
					e => {
						if (called) return
						called = true
						reject(e)
					}
				)
			} else {
				resolve(x)
			}
		} catch (e) {
			if (called) return
			called = true
			reject(e)
		}
	} else {
		resolve(x)
	}
}

手写 call、apply 及 bind 函数
Function.prototype.myCall = function (context) {
	if (typeof context === undefined || typeof context === null) {
		context = window
	}
	const symbol = Symbol()
	context[symbol] = this
	const args = [...arguments].slice(1)
	const result = context[symbol](...args)
	delete context[symbol]
	return result
}

Function.prototype.myApply = function(context) {
	if (typeof context === undefined || typeof context === null) {
		context = window
	}
	const symbol = Symbol()
	context[symbol] = this
	
	let result
	if (arguments[1]) {
		result = context[symbol](...arguments[1])
	} else {
		result = context[symbol]()
	}
	delete context[symbol]
	return result
}

Function.prototype.myBind = function(context) {
	if (typeof context === undefined || typeof context === null) {
		context = window
	}
	const _this = this
	const args = [...arguments].slice(1)
	return function F() {
		if (this instanceof F) {
			return new _this(...args, ...arguments)
		}
		return _this.apply(context, args.concat(...arguments))
	}
}

new
在调用 new 的过程中会发生以上四件事情：

新生成了一个对象
链接到原型
绑定 this
返回新对象

对实现的分析：

创建一个空对象
获取构造函数
设置空对象的原型
绑定 this 并执行构造函数
确保返回值为对象

function create() {
	let obj = {}
	let Con = [].shift.call(arguments)
	obj.__proto__ = Con.prototype
	let result = Con.apply(obj, arguments)
	return result intanceof Object ? result ? obj
}

instanceof 可以正确的判断对象的类型
function myInstanceof(left, right) {
	let prototype = right.prototype
	left = left.__proto__
	while(true) {
		if (left === null || left === undefined) return false
		if (prototype === left) return true
		left = left.__proto__
	}
}

为什么 0.1 + 0.2 != 0.3
因为 JS 采用 IEEE 754 双精度版本（64位）

垃圾回收机制
V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。因此，V8 将内存（堆）分为新生代和老生代两部分。
新生代中的对象一般存活时间较短，使用 Scavenge GC 算法。
老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是标记清除算法和标记压缩算法。

事件机制、跨域、存储相关
// 以下会先打印冒泡然后是捕获
node.addEventListener(
  'click',
  event => {
    console.log('冒泡')
  },
  false
)
node.addEventListener(
  'click',
  event => {
    console.log('捕获 ')
  },
  true
)

stopPropagation 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。stopImmediatePropagation 同样也能实现阻止事件

事件代理

事件代理的方式相较于直接给目标注册事件来说，有以下优点：

节省内存
不需要给子节点注销事件

跨域
因为浏览器出于安全考虑，有同源策略。也就是说，如果协议、域名或者端口有一个不同就是跨域，Ajax 请求会失败。

JSONP
JSONP 的原理很简单，就是利用 `<script>` 标签没有跨域限制的漏洞。
通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时。

```js
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
    function jsonp(data) {
    	console.log(data)
	}
</script>    
```
JSONP 使用简单且兼容性不错，但是只限于 get 请求。
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data) {
    success && success(data)
  }
  document.body.appendChild(script)
}
jsonp('http://xxx', 'callback', function(value) {
  console.log(value)
})

CORS
CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

GET
HEAD
POST

text/plain
multipart/form-data
application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  )
  next()
})

document.domain
该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。

postMessage
这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', event => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})


cookie，localStorage，sessionStorage，indexDB

cookie
一般由服务器生成，可以设置过期时间 4K 每次都会携带在 header 中，对于请求性能影响

localStorage
除非被清理，否则一直存在 5M 

sessionStorage
页面关闭就清理	

indexDB
除非被清理，否则一直存在 无限

Service Worker
Service Worker 是运行在浏览器背后的独立线程 一般可以用来实现缓存功能。

使用 Service Worker的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。

Service Worker 实现缓存功能一般分为三个步骤：首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。
打开页面，可以在开发者工具中的 Application 看到 Service Worker 已经启动了!
在 Cache 中也可以发现我们所需的文件已被缓存

浏览器缓存机制
缓存可以说是性能优化中简单高效的一种优化方式了，它可以显著减少网络传输所带来的损耗。

直接使用缓存而不发起请求，或者发起了请求但后端存储的数据和前端一致，那么就没有必要再将数据回传回来，这样就减少了响应数据。

缓存位置
缓存策略
实际场景应用缓存策略

缓存位置
Service Worker
Memory Cache
Disk Cache
Push Cache
网络请求

Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

当 Service Worker 没有命中缓存的时候，我们需要去调用 fetch 函数获取数据。也就是说，如果我们没有在 Service Worker 命中缓存的话，会根据缓存查找优先级去查找数据。但是不管我们是从 Memory Cache 中还是从网络请求中获取的数据，浏览器都会显示我们是从 Service Worker 中获取的内容。

Memory Cache

Memory Cache 也就是内存中的缓存，读取内存中的数据肯定比磁盘快。但是内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。 一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存缓存

内存中其实可以存储大部分的文件，比如说 JSS、HTML、CSS、图片等等。但是浏览器会把哪些文件丢进内存这个过程就很玄学了，我查阅了很多资料都没有一个定论。

Disk Cache
Disk Cache 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。

Push Cache
Push Cache 是 HTTP/2 中的内容
它才会被使用。并且缓存时间也很短暂，只在会话（Session）中存在，一旦会话结束就被释放。

网络请求
如果所有缓存都没有命中的话，那么只能发起请求来获取资源了。

强缓存和协商缓存
缓存策略都是通过设置 HTTP Header 来实现的。
Expires 和 Cache-Control 。强缓存表示在缓存期间不需要请求，state code 为 200。

Expires
Expires: Wed, 22 Oct 2018 08:41:00 GMT
Expires 是 HTTP/1 的产物，表示资源会在 Wed, 22 Oct 2018 08:41:00 GMT 后过期，需要再次请求。并且 Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效。

Cache-control
Cache-control: max-age=30
Cache-Control 出现于 HTTP/1.1，
优先级高于 Expires 。该属性值表示资源会在 30 秒后过期，需要再次请求。
Cache-Control 可以在请求头或者响应头中设置，并且可以组合使用多种指令

协商缓存
如果缓存过期了，就需要发起请求验证资源是否有更新。协商缓存可以通过设置两种 HTTP Header 实现：Last-Modified 和 ETag 。
当浏览器发起请求验证资源时，如果资源没有做改变，那么服务端就会返回 304 状态码，并且更新浏览器缓存有效期。

Last-Modified 和 If-Modified-Since

ETag 和 If-None-Match
Last-Modified 表示本地文件最后修改日期，If-Modified-Since 会将 Last-Modified 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来，否则返回 304 状态码。

如果本地打开缓存文件，即使没有对文件进行修改，但还是会造成 Last-Modified 被修改，服务端不能命中缓存导致发送相同的资源
因为 Last-Modified 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源
所以在 HTTP / 1.1 出现了 ETag 。

ETag 和 If-None-Match
ETag 类似于文件指纹，If-None-Match 会将当前 ETag 发送给服务器，询问该资源 ETag 是否变动，有变动的话就将新的资源发送回来。并且 ETag 优先级比 Last-Modified 高。

节流
const throttle = (func, wait = 50) => {
  // 上一次执行该函数的时间
  let lastTime = 0
  return function(...args) {
    // 当前时间
    let now = +new Date()
    // 将当前时间和上一次执行函数时间对比
    // 如果差值大于设置的等待时间就执行函数
    if (now - lastTime > wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

防抖
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = 0
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}





