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
	function isDef(v) {
		return v !== undefined && v !== null
	}
	
	// 判断是否真的等于 true
	function isTrue(v) {
		return v === true
	}
	
	// 判断是否是 false
	function isFalse(v) {
		return v === false
	}
	
	/**
	 * 判断数据类型是否是 string, number, symbol, boolean
	 */
	function isPrimitive(value) {
		// 判断数据类型是否是 string, number, symbol, boolean
		return (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'symbol' ||
			typeof value === 'boolean'
		)
	}
	
	/**
	 * 快速对象检查-这里主要用于判断
	 * 当我们知道该值的时候，从原始值中获取对象
	 * 是一个 json 兼容的情况
	 */
	function isObject(obj) {
		// 判断是否是对象
		return obj !== null && typeof obj === 'object'
	}
	
	/**
	 * 获取值的原始类型字符串，例如[object object]
	 */
	// 获取 toString 简写
	var _toString = Object.prototype.toString;
	
	function toRawType(value) {
		// 类型判断 返回Array, Function, String, Object
		return _toString.call(value).slice(8, -1)
	}
	
	/**
	 * 严格的对象类型检查，只返回 true
	 * 用于普通 JavaScript 对象
	 */
	function isPlainObject(obj) {
		// 判断是否是对象
		return _toString.call(obj) === '[object Object]'
	}
	
	function isRegExp(v) {
		// 判断是否是正则对象
		return _toString.call(v) === '[object RegExp]'
	}
	
	/**
	 * 检查 val 是否是有效的数组索引
	 */
	function isValidArrayIndex(val) {
		// isFinite 检测是否是数据
		// Math.floor 向下取整
		var n = parseFloat(String(val))
		// isFinite 如果 number 是有限数字（或可转换为有限数字），那么返回 true，否则，如果 number 是 NaN 非数字，或者是正负无穷大的数，则返回 false
		return n >= 0 && Math.floor(n) === n && isFinite(val)
	}
	
	/**
	 * 将值转换为实际呈现的字符串
	 */
	function toString(val) {
		// 将对象或者其它基本数据 变成一个 字符串
		return val == null ?
			'' :
			typeof val === 'object' ?
			JSON.stringify(val, null, 2) :
			String(val)
	}
	
	/**
	 * 将输入值转换为数字以持久化
	 * 如果转换失败，返回原始字符串
	 */
	function toNumber(val) {
		// 字符串转数字，如果失败则返回字符串
		var n = parseFloat(val);
		return isNaN(n) ? val : n
	}
	
	/**
	 * make a map and return a function for checking if a key
	 * 制作一个映射并返回一个函数来检查一个键是否存在
	 * 在map上
	 * map 对象中的 [name1, name2, name3, name4] =>
	 * map { name1: true, name2: true, name3: true }
	 * 并且传进一个 key 值取值，这里用到策略者模式
	 */
	/**
	 * @param {Object} str
	 * @param {Object} expectsLowerCase
	 */
	function makeMap(str, expectsLowerCase) {
		// 创建一个新的对象
		var map = Object.create(null)
		// 按字符串，分割
		var list = str.split(',')
		for (var i = 0; i < list.length; i++) {
			map[list[i]] = true
		}
		return expectsLowerCase ?
			function(val) {
				return map[val.toLowerCase()];
			} // 返回一个柯里化函数 toLowerCase 转换成小写
			:
			function(val) {
				return map[val];
			} // 返回一个柯里化函数 并且把map中添加一个属性键
	}
	
	/**
	 * check if a tag is a built-in tag
	 * 检查标记是否为内置标记
	 */
	var isBuiltInTag = makeMap('slot,component', true);
	
	/**
	 * Check if a attribute is a reserved attribute
	 * 检查属性是否为保留属性
	 * isReservedAttribute = function(value) {
		 map {key:true,ref:true,slot-scope:true,is:true,value:undefined}
	 }
	 */
	var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')
	
	/**
	 * Remove an item from an array
	 * 删除数组
	 */
	function remove(arr, item) {
		if (arr.length) {
			var index = arr.indexOf(item);
			if (index > - 1) {
				return arr.splice(index, 1)
			}
		}
	}
	
	/**
	 * Check whether the object has the property
	 * 检查对象属性是否是实例化还是原型上的
	 */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	function hasOwn(obj, key) {
		return hasOwnProperty.call(obj, key)
	}
	
	/**
	 * Create a cached version of a pure function
	 * 创建纯函数的缓存版本
	 * 创建一个函数，缓存，再 return 返回柯里化函数
	 * 闭包用法
	 */
	/**
	 * var aFn = cached(function(string) {
		 return string
	 })
	 aFn(string1);
	 aFn(string2);
	 aFn 函数会多次调用 里面就能体现了
	 用对象去缓存记录函数
	 */
	function cached(fn) {
		var cache = Object.create(null)
		return (function cachedFn(str) {
			var hit = cache[str];
			return hit || (cache[str] = fn(str))
		})
	}
	
	/**
	 * Camelize a hyphen-delimited string
	 * 用连字符分割的字符串
	 * camelize = cachedFn(str) => { 
		 var hit = cache[str];
		 return hit || (cache[str] = fn(str))
	   }
	 * 调用一个 camelize 存一个键进来 调用两次 如果键一样就返回 hit
	 * 横线 - 的转换成驼峰写法
	 * 可以让这样的属性 v-model 变成 vModel
	 */
	var camelizeRE = /-(\w)/g;
	var camelize = cached(function(str) {
		return str.replace(came;lizeRE, function(_, c) {
			return c ? c.toUpperCase() : '';
		})
	});
	
	/**
	 * Capitalize a string
	 * 将首字母变成大写
	 */
	var capitalize = cached(function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	});
	
	/**
	 * 非单词的分隔符
	 * \B 
	 */
	var hyphenateRE = /\B([A-Z])/g;
	var hyphenate = cached(function(str) {
		// 大写字母，加完减号又转成小写了，比如把驼峰 aBc 变成 a-bc
		// 匹配大写字母并且两面不是空白的替换成'-' + '字母' 在全部转换成小写
		return str.replace(hyphenateRE, '-$1').toLowerCase();
	});
	
	/**
	 * 改变this 上下文
	 * 执行方式
	 * 绑定事件 并且改变上下文指向
	 */
	function polyfillBind(fn, ctx) {
		function boundFn(a) {
			var l = arguments.length
			return l ?
				l > 1 ?
				fn.apply(ctx, arguments) :
				fn.call(ctx, a) :
				fn.call(ctx)
		}
		boundFn._length = fn.length;
		return boundFn
	}
	
	// 执行方式
	function nativeBind(fn, ctx) {
		return fn.bind(ctx)
	}
	
	// bing 改变this上下文
	var bind = Function.prototype.bind ?
		nativeBind : polyfillBind;
	
	/**
	 * Convert an Array-like object to a real Array
	 * 将假的数组转换成真的数组
	 */
	function toArray(list, start) {
		start = start || 0;
		var i = list.length - start;
		var ret = new Array(i);
		while(i--) {
			ret[i] = list[i + start];
		}
		return ret
	}
	
	/**
	 * 浅拷贝
	 * 对象浅拷贝，参数（to, _from) 循环_from的值，会覆盖掉to的值
	 */
	function extend(to, _from) {
		for (var key in _from) {
			to[key] = _from[key]
		}
		return to
	}
	/** 
	 * 合并对象数组 到 一个简单的对象
	 * Merge an Array of Objects into a single Object
	 */
	function toObject(arr) {
		var res = {}
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]) {
				extend(res,arr[i]);
			}
		}
		return res
	}
	
	/**
	 * 不执行任何操作
	 * 在不留下无用的转译代码的情况下，stub参数使Flow满足
	 * (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
	 */
	function noop(a, b, c) {}
	
	/**
	 * Always return false
	 * 返回假的
	 */
	var no = function (a, b, c) {
		return false
	};
	
	/**
	 * Return same value
	 * 返回相同值
	 */
	var identity = function(_) {
		return _;
	};
	
	/**
	 * 从编译器模块中生成一个静态键字符串
	 * [{ staticKeys: 1 }, { staticKeys: 2 }, { staticKeys: 3 }]
	 *  连接数组对象中的 staticKeys key 值，连接成一个字符串 str="1,2,3"
	 * 
	 */
	function genStaticKeys(modules) {
		return modules.reduce(
			function(key, m) {
				// 累加 staticKeys 的值变成数组
				return keys.concat(m.staticKeys || [])
			},
			[]
		).join(',') // 转换成字符串
	}
	
	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape
	 * 检查两个值是否松散相等 ==
	 * 如果它们是普通的对象， 它们有相同的结构吗
	 * 检测a和b的数据类型，是否是数组或对象，对象的key长度一样即可，数组长度一样即可
	 */
	function looseEqual(a, b) {
		if (a === b) {
			return true
		} // 如果 a 和 b 是完全相等 则 true
		var isObjectA = isObject(a);
		var isObjectB = isObject(b);
		// 如果a和b都是对象
		if (isObjectA && isObjectB) {
			try {
				var isArrayA = Array.isArray(a);
				var isArrayB = Array.isArray(b);
				if (isArrayA && isArrayB) {
					// 如果a和b都是数组
					// every 条件判断
					return a.length === b.length && a.every(function(e, i) {
						// 如果a长度和b长度一样的时候
						return looseEqual(e, b[i]) // 递归
					})
				} else if (!isArrayA && !isArrayB) {
					// 或者a和b都不是数组
					// 获取到a的key值 变成一个数组
					var keysA = Object.keys(a);
					// 获取到b的key值 变成一个数组
					var keysB = Object.keys(b);
					// 他们的对象key值长度是一样的时候，则加载every条件函数
					return keysA.length === keysB.length && keysA.every(function(key) {
						// 递归a和b的值
						return looseEqual(a[key], b[key])
					})
				} else {
					// 如果不是对象跳槽循环
					/* istanbul ignore next */
					return false
				}
			} catch (e) {
				// 如果不是对象跳槽循环
				/* istanbul ignore next */
				return false
			}
		} else if (!isObjectA && !isObjectB) {
			// b 和 a 都不是对象的时候
			// 把a和b变成字符串，判断他们是否相同
			return String(a) === String(b)
		} else {
			return false
		}
	}
	
	// 判断 arr 数组中的数组 是否和val相等
	// 或者 arr 数组中对象，或者对象数组 是否和val相等
	function looseIndexOf(arr, val) {
		for (var i = 0 ; i < arr.length; i++) {
			if (looseEqual(arr[i], val)) {
				return i
			}
		}
		return -1
	}
	
	/**
	 * Ensure a function is called only once
	 * 确保该函数只调用一次，闭包函数
	 */
	function once(fn) {
		var called = false;
		return function() {
			if (!called) {
				called = true;
				fn.apply(this, arguments)'
'			}
		}
	}
	
	// ssr 标记属性
	var SSR_ATTR = 'data-server-rendered';
	var ASSET_TYPES = [
		'component', // 组建指令
		'directive', // 定义指令
		'filter', // 过滤器指令
	];
	
	var LIFECYCLE_HOOKS = [
		'beforeCreate', // 生命周期 开始实例化 vue 指令
		'created', // 生命周期 结束实例化完 vue 指令
		// 生命周期 开始渲染虚拟dom，挂载event 事件指令
		'beforeMount',
		// 生命周期 渲染虚拟dom，挂载event 事件 完指令
		'mounted',
		// 生命周期 开始更新 view 数据指令
		'beforeUpdate',
		// 生命周期 结束更新 view 数据指令
		'updated',
		// 生命周期，开始销毁 new 实例 指令
		'beforeDestroy',
		// 生命周期，结束销毁 new 实例 指令
		'destroyed',
		// 生命周期 结束销毁 new 实例 指令
		'activated', // keep-alive组件激活时调用
		'deactivated', // deactivated keep-alive组件停用调用
		'errorCaptured', // 具有此钩子的组件捕获其子组件树（不包括其自身）中的所有错误（不包括在异步回调中调用的那些）
	];
	
	var conifg = ({
		/**
		 * 选项合并策略（在core/util/options中使用）
		 */
		optionMergeStrategies: Object.create(null),
		
		/**
		 * Whether to suppress warnings
		 * 是否禁止警告
		 */
		silent: false,
		
		/**
		 * Show production mode tip message on boot?
		 * 在引导时显示生产模式提示消息？
		 * webpack打包判断执行环境是不是生产环境
		 * 如果是生产环境会压缩并且没有提示警告之类的东西
		 */
		productionTip: 'development' !== 'production',
		
		/**
		 * Whether to enable devtools
		 * 是否启用DevTools
		 */
		devtools: 'development' !== 'production',
		
		/**
		 * Whether to record perf
		 * 是否记录PERF
		 */
		performance: false,
		
		/**
		 * Error handler for watcher errors
		 * 监视器错误的错误处理程序
		 */
		errorHandler: null,
		
		/**
		 * Warn handler for watcher warns
		 * 观察加警告处理
		 */
		warnHandler: null,
		
		/**
		 * Ignore certain custom elements
		 * 忽略某些自定义元素
		 */
		ignoredElements: [],
		
		/**
		 * Custom user key aliases for v-on
		 * 用于V-on的自定义用户密钥别名 键盘码
		 */
		keyCodes: Object.create(null),
		
		/**
		 * Check if a tag is reserved so that it cannot be registered as a component. This is platform-dependent and may be overwritten.
		 * 检查是否保留了一个标签，使其不能注册为组件。这是平台相关的，可能会被覆盖。
		 */
		isReservedTag: no,
		
		/**
		 * Check if an attribute is reserved so that it cannot be used as a component prop. This is platform-dependent and may be overwritten.
		 * 检查属性是否被保留，使其不能用作组件支持。这是平台相关的，可能会被覆盖。
		 */
		isReservedAttr: no,
		
		/**
		 * Check is a tag is an unknown element.
		 * Platform-dependent.
		 * Check if a tag is an unknown element. Platform-dependent.
		 * 检查标签是否为未知元素依赖于平台的检查，如果标签是未知元素。平台相关的
		 */
		isUnknownElement: no,
		
		/**
		 * Get the namespace of an element
		 * 获取元素的命名空间
		 */
		getTagNamespace: noop,
		
		/**
		 * Parse the real tag name for the specific platform
		 * 解析真实的标签平台
		 */
		parsePlatformTagName: identity,
		
		/**
		 * Check if an attribute must be bound using property, e.g. value
		 * 检查属性是否必须使用属性绑定，例如依赖于平台的属性
		 */
		mustUseProp: no,
		
		/**
		 * Exposed for legacy reasons
		 * 因遗产原因暴露
		 * 声明周期对象
		 */
		_lifecycleHooks: LIFECYCLE_HOOKS,
		
	})
	
	/**
	 * Check if a string starts with $ or _
	 * 检查一个字符串是否以 $ 或者 _ 开头
	 */
	function isReserved(str) {
		var c = (str + '').charCodeAt(0);
		return c === 0x24 || c === 0x5F
	}
	
	/**
	 * Define a property
	 * 用 defineProperty 定义属性
	 * 第一个参数是对象
	 * 第二个是key
	 * 第三个是vue
	 * 第四个是 是否可以枚举
	 */
	function def(obj, key, val, enumerable) {
		Object.defineProperty(obj, key, {
			value: val, // 值
			enumerable: !!enumerable, // 定义了对象的属性是否可以在 for...in 循环 和 Object.keys() 中被枚举
			writable: true, // 可以改写value
			configurable: true, // configurable特性表示对象的属性是否可以被删除，以及除writable特性外的其它特性是否可以被修改
		});
	}
	
	/**
	 * Parse simple path
	 * 解析
	 */
	var bailRE = /[^\w.$]/; // 匹配不是 数字字母下划线 $ 符号 开头的为 true
	
	function parsePath(path) {
		if (bailRE.test((path)) {
			// 匹配上返回true
			return
		})
		// 匹配不上 path在已点分割
		var segments = path.split('.');
		return function(obj) {
			for (var i = 0; i < segments.length; i++) {
				// 如果没有参数则返回
				if (!obj) {
					return
				}
				// 将对象中的一个key值，赋值给该对象 相当于 obj = obj[segments[segments.length-1]];
				obj = obj[segments[i]];
			}
			// 否则返回一个对象
			return obj
		}
	}
	
	/**
	 * can we use __proto__?
	 */
	var hasProto = '__proto__' in {};
	
	/**
	 * Browser environment sniffing
	 * 判断设备和浏览器
	 */
	var inBrowser = typeof window !== 'undefined';
	
	// 如果不是浏览器
	var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform; // weex 环境 一个vue做app包的框架
	var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase(); // weex 环境 一个vue做app包的框架
	
	// window.navigator.userAgent属性包含了浏览器类型，版本，操作系统类型，浏览器引擎类型等信息，通过这个属性来判断浏览器类型
	var UA = inBrowser && window.navigator.userAgent.toLowerCase(); // 获取浏览器
	var isIE = UA && /msie|trident/.test(UA); // ie
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0; // ie9
	var isEdge = UA && UA.indexOf('edge/') > 0; // ie10以上
	var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android'); // 安卓
	var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')
	var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge; // 谷歌浏览器
	
	// Firefox has a 'watch' function on Object.prototype...
	
})))


























