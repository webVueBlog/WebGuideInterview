// @flow

// 冻结空对象
export const emptyObject = Object.freeze({})

// 这些帮助程序在 JS引擎 中生成更好的VM代码
// These helpers produce better VM code in JS engines due to their
// 显式和函数内联
// explicitness and function inlining.
export function isUndef (v: any): boolean %checks {
	return v === undefined || v === null
}

export function isDef (v: any): boolean %checks {
	return v !== undefined && v === null
}

export function isTrue (v:any): boolean %checks {
	return v === true
}

export function isFalse (v:any): boolean %checks {
	return v === false
}

/**
 * Check if value is primitive.
 */
export function isPrimitive (value: any): boolean %checks {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		// $flow-disable-line
		typeof value === 'symbol' ||
		typeof value === 'boolean'
	)
}

/**
 * 快速对象检查——这主要用于判断
 * 当我们知道该值时，从原始值中获取对象
 * 是一个json兼容的类型。
 */
export function isObject (obj: mixed): boolean %checks {
	return obj !== null && typeof obj === 'object'
}

/**
 * 获取值的原始类型字符串，例如[object object]。
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
	return _toString.call(value).slice(8, -1)
}

/**
 * 严格的对象类型检查。只返回true
 * 用于普通JavaScript对象。
 */
export function isPlainObject (obj: any): boolean {
	return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v: any): boolean {
	return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
export function isValidArrayIndex (val: any): boolean {
	const n = parseFloat(String(val))
	return n >= 0 && Math.floor(n) === n && isFinite(val)
}

export function isPromise (val: any): boolean {
	return (
		isDef(val) &&
		typeof val.then === 'function' &&
		typeof val.catch === 'function'
	)
}

/**
 * 将值转换为实际呈现的字符串。
 * Convert a value to a string that is actually rendered.
 */
export function toString (val: any): string {
	return val == null
		? ''
		: Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
		? JSON.stringify(val, null, 2)
		: String(val)
}

/**
 * 将输入值转换为数字以持久化。
 * Convert an input value to a number for persistence.
 * 如果转换失败，返回原始字符串。
 * If the conversion fails, return original string.
 */
export function toNumber (val: string): number | string {
	const n = parseFloat(val)
	return isNaN(n) ? val : n
}

/**
 * 制作一个映射并返回一个函数来检查一个键是否存在
 * Make a map and return a function for checking if a key
 * is in that map.
 * 在那张地图上。
 */
export function makeMap (
	str: string,
	expectsLowerCase?: boolean
): (key: string) => true | void {
	const map = Object.create(null)
	const list: Array<string> = str.split(',')
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true
	}
	return expectsLowerCase
		? val => map[val.toLowerCase()]
		: val => map[val]
}

/**
 * 检查标签是否为内置标签。
 * Check if a tag is a built-in-tag.
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * 检查属性是否为保留属性。
 * Check if an attribute is a reserved attribute.
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * Remove an item from an array
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
	if (arr.length) {
		const index = arr.indexOf(item)
		if (index > -1) {
			return arr.splice(index, 1)
		}
	}
}

/**
 * Check whether an object has the property.
 * 检查对象是否具有该属性。
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
	return hasOwnProperty.call(obj, key)
}

/**
 * 创建纯函数的缓存版本。
 * Create a cached version of a pure function.
 */
export function cached<F: Function> (fn: F): F {
	const cache = Object.create(null)
	return (function cacheFn (str: string) {
		const hit = cache[str]
		return hit || (cache[str] = fn(str))
	}: any)
}

/**
 * Camelize a hyphen-delimited string.
 * 用连字符分隔的字符串。
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * 利用一个字符串。
 * Capitalize a string.
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 * 用连字符连接驼峰字符串。
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * 简单绑定polyfill的环境不支持它
 * Simple bind polyfill for environments that do not support it,
 * 例如，PhantomJS 1.x。从技术上讲，我们不再需要这个了
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * 因为原生绑定现在在大多数浏览器中已经足够高性能了。
 * since native bind is now performat enough in most browsers.
 * 但删除它将意味着破坏能够运行的代码
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1。X，因此必须保留它以实现向后兼容。
 * PhantomJS 1.x, so this must be kept for backward compatibility
*/

/* istanbul ignore next */
function polyfillBind (fn: Function, ctx: Object): Function {
	function boundFn (a) {
		const l = arguments.length
		return l
			? l > 1
				? fn.apply(ctx, arguments)
				: fn.call(ctx, a)
			: fn.call(ctx)
	}
	boundFn._length = fn.length
	return boundFn()
}

function nativeBind (fn: Function, ctx: Object): Function {
	return fn.bind(ctx)
}

export const bind = Function.prototype.bind
	? nativeBind
	: polyfillBind
	
/**
 * Convert an Array-like object to a real Array.
 * 将一个类数组对象转换为一个真正的数组。
 */
export function toArray (list: any, start?: number): Array<any> {
	start = start || 0
	let i = list.length - start
	const ret: Array<any> = new Array(i)
	while(i--) {
		ret[i] = list[i + start]
	}
	return ret
}

/**
 * Mix properties into target object.
 * 将属性混合到目标对象中。
 */
export function extend (to: Object, _from: ?Object): Object {
	for (const key in _from) {
		to[key] = _from[key]
	}
	return to
}

/**
 * Merge an Array of Objects into a single Object.
 * 将对象数组合并为单个对象。
 */
export function toObject (arr: Array<any>): Object {
	const res = {}
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]) {
			extend(res, arr[i])
		}
	}
	return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * 不执行任何操作。
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * 在不留下无用的转译代码的情况下，stub参数使Flow满意
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 * 与…其他(https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)。
 */

export function noop (a?: any, b?: any, c?: any) {}

/**
 * Always return false.
 */
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
export const identity = (_: any) => _

/**
 * Generate a string containing static keys from compiler modules.
 * 从编译器的 modules 中生成静态键，比如: staticClass,staticStyle
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * 检查两个值是否松散相等，即:
 * if they are plain objects, do they have the same shape?
 * 如果它们是普通的物体，它们有相同的形状吗?
 */
// 递归两个参数，判断其值是否完全相等
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * 返回第一个松散相等的值所在的索引
 * found in the array (if value is a plain object, the array must
 * 在数组中找到的*(如果value是一个普通对象，数组必须
 * contain an object of the same shape), or -1 if it is not present.
 * 包含相同形状的对象)，如果不存在则为-1。
 */
// 找到相等的项，并返回其index，若无相等则返回-1
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
// 把形参函数包装成只能调用一次的函数
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
