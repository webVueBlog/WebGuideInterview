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






