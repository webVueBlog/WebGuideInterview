// 手写new和bind

// new: 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

// bind: 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数

Function.prototype.myBind = function(context) {
	const me = this;
	const args = Array.prototype.slice.call(arguments, 1);
	const F = function() {};
	F.prototype = this.prototype;
	const bound = function() {
		const innerArgs = Array.prototype.slice.call(arguments);
		const finialArgs = args.concat(innerArgs);
		return me.apply(this instanceof F ? this : context, finialArgs);
	};
	bound.prototype = new F();
	return bound;
}

const createInstance = (Constructor, ...args) => {
	const instance = Object.create(Constructor.prototype);
	// 构造函数内部的 this 指向 instance 变量
	let res = Constructor.call(instance, ...args);
	const isObj = res !== null && typeof res === 'object';
	const isFunc = typeof res === 'function';
	return isObj || isFunc ? res : instance;
}