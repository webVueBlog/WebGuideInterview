/**
 * vue.js v2.5.16
 * @webVueBlog 手写版本
 * development 开发
 * production 生产
 * 兼容 amd cmd 模块写法
 */
/**
 * @param {Object} global
 * @param {Object} factory
 */
(function(global, factory) {
	// 判断exports是否是对象，并且判断module不是undefined
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.Vue = factory());
}(this, (function() {
	'use strict';
	// Object.freeze() 阻止修改现有属性的特性和值，并阻止添加新属性
	var emptyObject = Object.freeze({})
	// 这些帮助程序在JS引擎中生成更好的vm代码，因为它们
	// 显示和函数内联
	
	// 判断数据 是否是 undefined 或者 null
	function isUndef(v) {
		return v === undefined || v === null
	}
	
	// 判断数据 是否不等于 undefined 或者 null
	function is
})))


























