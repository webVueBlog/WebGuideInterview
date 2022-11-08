/**
手写 bind
bind()方法
方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。
个人账号：https://github.com/webVueBlog
B站：https://space.bilibili.com/144761334
 */
Function.prototype.myBind = function(context) {
 // 调用 bind 必须是一个函数
 if (typeof this !== 'function') {
  throw new TypeError(`${this} is not a function`)
 }

 const fn = this
 // 获取调用bind时候传入的参数
 const args = [...arguments].slice(1)

 // 返回一个函数
 const fBound = function() {
  // 获取返回函数调用时传递的参数
  const bindArgs = [...arguments]
  // 用作构造函数时，this指向当前实例
  return fn.apply(this instanceof fBound ? this : context, args.concat(bindArgs))
 }
 // 创建中转函数，避免修改 fBound.prototype 同时修改 this.prototype
 const tempFun = function () {}
 tempFun.prototype = this.prototype
 // 将返回函数的原型设置为 this.prototype 从而可以获取原型上的值
 fBound.prototype = new tempFun()
 return fBound
}



Function.prototype.myBind2 = function(context) {
 const me = this;
 const args = Array.prototype.slice.call(arguments, 1);
 const F = function() {};
 F.prototype = this.prototype;

 const bound = function() {
  const innerArgs = Array.prototype.slice.call(arguments);
  const finalArgs = args.concat(innerArgs);

  return me.apply(this instanceof bound ? this : context, finalArgs);
 }

 bound.prototype = new F();
 return bound;
}