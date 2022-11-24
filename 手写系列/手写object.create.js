/**
B站：算法猫叔
手写object.create.js

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
 */

function createObj(o) {
 function f() {};
 f.prototype = o;
 return new f();
}

let obj = {
 myName: 'B站：算法猫叔'
}

let res = createObj(obj);
console.log(res)
console.log(res.myName)
// {}
// B站：算法猫叔

/**
 * 
 * @param {*} proto 原型对象
 * @param {*} propertiesObject 对象
 */
const create = (proto, propertiesObject) => {
 if (typeof proto !== 'object' && typeof proto !== null) {
  throw new TypeError('proto is not a object');
 }
 // 创建一个空函数
 function F() {}
 // 将空函数的原型对象指向传进来的原型对象
 F.prototype = proto;
 // 返回一个o的实例，从而实现让该实例继承 原型对象proto的属性
 const o = new F();
 // 如果有第二个参数
 if (propertiesObject !== undefined) {
  Object.defineProperties(o, propertiesObject);
 }
 if (proto === null) {
  o.__proto__ = null;
 }
 return o;
}

const person = {
 myName: '掘金：我是哪吒',
 showName() {
  console.log(this.myName)
 }
}

const ans = create(null);
const ans1 = Object.create(null);
console.log('ans', ans, 'ans1', ans1); // ans [F: null prototype] {} ans1 [Object: null prototype] {}

const ans2 = create(person);
const ans3 = Object.create(person);
console.log('ans2', ans2, 'ans3', ans3) // ans2 {} ans3 {}

ans2.showName(); // 掘金：我是哪吒
ans2.myName = '我是哪吒'
ans2.showName(); // 我是哪吒

ans3.myName = '1024bibi.com'
ans3.showName(); // 1024bibi.com