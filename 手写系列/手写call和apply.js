// 手写call和apply

// 思路：
// 1. 将函数设为对象的属性
// 2. 执行该函数
// 3. 删除该函数

Function.prototype.myCall = function (context = window, ...args) {
	const fnKey = Symbol("fn"); // 唯一值
	context[fnKey] = this; // 对象属性赋值函数
	const result = context[fnKey](...args); // 执行该函数，获取结果
	delete context[fnKey]; // 删除属性
	return result; // 返回结果
}

Function.prototype.myApply = function (context = window, args = []) {
	const fnKey = Symbol("fn"); // 唯一值
	context[fnKey] = this; // 对象属性赋值函数
	const result = context[fnKey](...args); // 执行该函数，获取结果
	delete context[fnKey]; // 删除属性
	return result; // 返回结果
}