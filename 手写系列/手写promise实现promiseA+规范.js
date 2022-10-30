// 手写promise实现promiseA+规范


const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
	const that = this // 在函数体内部首先创建了常量 that，因为代码可能会异步执行，用于获取正确的 this 值
	that.state = PENDING
	that.value = null // value 变量用于保存 resolve 或者 reject 中传入的值

	// resolvedCallbacks 和 rejectedCallbacks 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时应该把 then 中的回调保存起来用于状态改变是使用
	that.resolvedCallbacks = []
	that.rejectedCallbacks = []

	try {
		fn(resolve, reject)
	} catch (e) {
		reject(e)
	}

	// 对于 resolve 函数来说，首先要判断传入的值是否为 Promise 类型
	function resolve(value) {
		if (value instanceof MyPromise) {
			return value.then(resolve, reject)
		}

		// 浏览器支持 queueMicrotask，该函数可以触发微任务
		queueMicrotask(() => {
			if (that.state === PENDING) {
				that.state = RESOLVED
				that.value = value
				that.resolvedCallbacks.map(cb => cb(that.value))
			}
		})
	}

	function reject(value) {
		queueMicrotask(() => {
			if (that.state === PENDING) {
				that.state = REJECTED
				that.value = value
				that.rejectedCallbacks.map(cb => cb(that.value))
			}
		})
	}

}

// 新增一个变量 promise2 ，因为每个 then 函数都需要返回一个新的 Promise 对象，该对象用于保存新的返回对象 => promise2
// 执行 onFulfilled 或者 onRejected 函数时返回一个 x，x 不能与 promise2 相等，这样会发生循环引用的问题

MyPromise.prototype.then = function (onFulfilled, onRejected) {
	const that = this
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
	onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }

	if (that.state === PENDING) {
		return (promise2 = new MyPromise((resolve, reject) => {
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
		// that.resolvedCallbacks.push(onFulfilled)
		// that.rejectedCallbacks.push(onRejected)
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
		// onFulfilled(that.value)
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
		// onRejected(that.value)
	}
}

// x 不能与 promise2 相等
// 需要 创建一个变量 called 用于判断是否已经调用过函数
// 然后判断 x 是否为对象或者函数，如果都不是的话，将 x 传入 resolve 中
// 如果 x 是对象或者函数的话，  先把 x.then 赋值给 then，然后判断 then 的类型，如果不是函数类型的话，将 x 传入 resolve 中

// 如果 then 是函数的话，就将 x 作为函数的作用域 this 调用，并且传递两个回调函数作为参数，第一个参数叫做 resolvePromise， 第二个参数叫做 rejectPromise
// 两个回调函数需要判断是否已经执行过函数，然后进行相应的逻辑

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
	if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
		try {
			let then = x.then
			if (typeof then === 'function') {
				then.call(
					x,
					(resolvePromise) => {
						if (called) return
						called = true
						resolutionProcedure(promise2, resolvePromise, resolve, reject)
					},
					(rejectPromise) => {
						if (called) return
						called = true
						reject(rejectPromise)
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























