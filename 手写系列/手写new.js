// 手写new关键字
/**
生成一个新的对象
新对象的_proto_指向构造函数的prototype
使用apply改变构造函数的this指向，使其指向新对象，这样以来obj就有构造函数里面的属性啦
判断构造函数是否有返回值，如果构造函数返回对象，则直接返回构造函数中的对象
返回新对象
 */

// new 关键字做了什么？
function myNew() {
 let obj = new Object();
 let constrctor = Array.prototype.shift.call(arguments);
 obj.__proto__ = constrctor.prototype;

 let ret = constrctor.apply(obj, arguments);
 // 如果构造函数里面自己定义了返回值，那就根据它自己定义的值进行返回
 return typeof ret === 'object' ? ret : obj;
}

// new 实现
function New(constrctor, ...args) {
 // 1. Create a new empty object
 const obj = {};
 // const obj = new Object();
 // const obj = Object.create(null)

 // 2. Assgin the constructor's prototype property to the new empty object's __proto__ property
 obj.__proto__ = constrctor.prototype;
 // Object.setPrototypeOf(obj, constructor.prototype);

 // 3. Execute the constructor, set obj as the context of this when the constructor runs
 const result = constrctor.apply(obj, args);

 // 4. Return the object
 return typeof result === 'object' ? result : obj;
}
