/**
实现一个函数sum函数满足以下规律

sum(1, 2, 3).valueOf() // 6
sum(2, 3)(2).valueOf() // 7
sum(1)(2)(3)(4).valueOf() // 10
sum(2)(4, 1)(2).valueOf() // 9

分析
仔细观察这几种调用方式可以得到以下信息

sum函数可以传递一个或者多个参数
sum函数调用后返回的是一个新的函数且参数可传递一个或者多个
调用.valueOf时完成最后计算

 */

var toArr = (arg) => [].slice.call(arg);
var _add = (arr) => arr.reduce((a, b) => a + b);
function sum() {
 var argsArr = toArr(arguments);

 var fn = function() {
  var innerArgsArr = toArr(arguments);
  var totalArgsArr = argsArr.concat(innerArgsArr);
  return sum.apply(null, totalArgsArr);
 };

 fn.valueOf = function() {
  return _add(argsArr)
 };
 return fn;
}

var ans = sum(1)(2)(3,4).valueOf();
console.log('ans', ans);