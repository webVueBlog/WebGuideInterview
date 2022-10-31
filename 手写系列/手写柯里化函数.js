// 手写柯里化函数
/**
在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2) // 3


 */

// 柯里化：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数
var curry = (fn) =>
 (judge = (...args) => args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg))

// 手写
function curry(fn, ...args) {
 // 返回一个函数
 return function() {
  let _args = [...args, ...arguments];
  let len = fn.length;
  if (_args.length < len) {
   // 递归
   return curry(fn, ..._args)
  } else {
   return fn.apply(this, _args)
  }
 }
}

// 优化
function curry(fn, ...args) {
 const { length } = fn
 return function () {
  const _args = [...args, ...arguments]
  if (_args.length < length) return curry(fn, ..._args)
  return fn.apply(this, _args)
 }
}