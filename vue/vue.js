/**
 * vue.js v2.5.16
 * @webVueBlog 手写版本 - 16000+代码
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
	var nativeWatch = ({}).watch;
	
	// 兼容火狐浏览器写法
	var supportsPassive = false;
	if (inBrowser) {
		try {
			var opts = {};
			Object.defineProperty(opts, 'passive', ({
				get: function get() {
					/* istanbul ignore next */
					supportsPassive = true;
				}
			})); // https://github.com/facebook/flow/issues/285
			window.addEventListener('test-passive', null, opts);
		} catch (e) {}
	}
	
	// this needs to be lazy-evaled because vue may be required before
	// vue-server-renderer can set VUE_ENV
	// vue 服务器渲染 可以设置 VUE_ENV
	var _isServer;
	// 判断是不是node服务器环境
	var isServerRendering = function() {
		if (_isServer === undefined) {
			/* istanbul ignore if */
			// 如果不是浏览器并且global对象存在，那么有可能是node脚本
			if (!inBrowser && typeof global !== 'undefined') {
				// 检测vue-server-renderer的存在并加以避免
				// detect presence of vvue-server-renderer and avoid
				// Webpack shimming the process
				// _isServeer 设置是服务器渲染
				_isServer = global['process'].env.VUE_ENV === 'server';
			} else {
				_isServer = false
			}
		}
		return _isServer
	};
	
	// detect devtools
	// 检测开发者工具
	var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
	
	/* istanbul ignore next */
	function isNative(Ctor) {
		// 或者判断该函数不是说系统内置函数
		// 判断一个函数中是否含有 'native code' 字符串，比如
		return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
	}
	
	// 判断是否支持Symbol数据类型
	var hasSymbol =
		// Symbol  es6新出来的一种数据类型，类似于string类型，声明唯一的数据值
		typeof Symbol !== 'undefined' && isNative(Symbol) &&
		// Reflect.ownKeys
		// Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和
		typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
		
	var _Set;
	/**
	 * ES6 提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值
	 * Set本身是一个构造函数，用来生成Set数据结构
	 * 判断是否有set这个方法
	 */
	if (typeof Set !== 'undefined' && isNative(Set)) {
		// use native Set when available.
		_Set = Set;
	} else {
		// 如果没有他自己写一个
		_Set = (function() {
			function Set() {
				this.set = Object.create(null);
			}
			
			Set.prototype.has = function has(key) {
				return this.set[key] === true
			};
			Set.prototype.add = function add(key) {
				this.set[key] = true
			};
			Set.prototype.clear = function clear() {
				this.set = Object.create(null);
			};
			return Set;
		}());
	}
	
	var warn = noop;
	var tip = noop;
	
	var generateComponentTrace = (noop); // work around flow check 绕流检查
	var formatComponentName = (noop);
	
	{
		// 判断是否有console打印输出属性
		var hasConsole = typeof console !== 'undefined';
		var classifyRE = /(?:^|[-_])(\w)/g;
		// 非捕获 匹配不分组。就是可以包含，但是不匹配上
		// 过滤掉class中的 -_ 符号 并且把字母开头的改成大写
		var classify = function(str) {
			return str.replace(classifyRE,
				function(c) {
					return c.toUpperCase();
				}
			).replace(/[-_]/g, '');
		};
		
		/**
		 * warn 警告信息提示
		 * msg 警告信息 vm vue对象
		 */
		warn = function(msg, vm) {
			// vm 如果没有传进来就给空，不然就执行generateComponentTrace收集vue错误码
			var trace = vm ? generateComponentTrace(vm) : '';
			// warnHandler 如果存在 则调用它
			if (config.warnhandler) {
				config.warnHandler.call(null, msg, vm, trace);
			} else if (hasConsole && (!config.silent)) {
				// 如果config.warnHandler 不存在则 console 内置方法打印
				console.error(('[Vue warn]: ' + msg + trace));
			}
		};
		
		// 也是个警告输出方法
		tip = funciton(msg, vm) {
			if (hasConsole && (!config.silent)) {
				console.warn("[Vue tip]: " + msg + (
					vm ? generateComponentTrace(vm) : ''
				));
			}
		};
		
		/**
		 * formatComponentName 格式组件名
		 * msg 警告信息 vm：vue对象
		 */
		formatComponentName = function(vm, includeFile) {
			if (vm.$root === vm) {
				return '<Root>'
			}
			/**
			 * 如果vm === 'function' && vm.cid != null 条件成立 则options等于vm.options
			 * 当vm === 'function' && vm.cid != null条件不成立的时候 vm._isVue ? vm.$options || vm.constructor.opitons : vm || {};
			 */
			var options = typeof vm === 'function' && vm.cid != null ?
			vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm || {};
			var name = options.name || options._componentTag;
			
			var file = options.__file;
			
			if (!name && file) {
				// 匹配.vue 后缀的文件名
				// 如果文件名中含有vue的文件将会被匹配出来 但是会多虑掉 \符号
				var match = file.match(/([^/\\]+)\.vue$/);
				name = match && match[1];
			}
			
			/**
			 * 可能返回 classify(name)
			 * name 组件名称或者是文件名称
			 * classify 去掉-_连接 大些字母连接起来
			 * 如果name存在则返回name
			 * 如果name不存在那么返回'<Anonymous>'+ 如果file存在并且includeFile !== false 的时候 返回 "at " + file 否则为空
			 */
			return (
				(name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
				(file && includeFile !== false ? (" at " + file) : "")
			)
		};
		
		/**
		 * 重复 递归 除2次 方法+ str
		 */
		var repeat = function(str, n) {
			var res = '';
			while (n) {
				if (n % 2 === 1) {
					res += str;
				}
				if (n > 1) {
					str += str;
				}
				n >>= 1;
			}
			return res
		};
		
		/**
		 * generateComponentTrace
		 * 生成组件跟踪 vm = vm.$parent 递归收集到msg出处
		 */
		generateComponentTrace = function(vm) {
			if (vm._isVue && vm.$parent) {
				// 如果_isVue等于真，并且有父亲节点的
				var tree = []; // 记录父节点
				var currentRecursiveSequence = 0;
				while (vm) {
					// 循环 vm 节点
					if (tree.length > 0) {
						// tree如果已经有父节点的
						var last = tree[tree.length - 1];
						if (last.constructor === vm.constructor) {
							// 上一个节点等于父节点
							currentRecursiveSequence++
							vm = vm.$parent;
							continue
						} else if (currentRecursiveSequence > 0) {
							// --
							tree[tree.length - 1] = [last, currentRecursiveSequence];
							currentRecursiveSequence = 0;
						}
					}
					tree.push(vm); // 把vm添加到队列中
					vm = vm.$parent;
				}
				return '\n\nfound in\n\n' + tree.map(function(vm, i) {
					// 如果i是0 则输出 '--->'
					// 如果i 不是0的时候输出组件名称
					return ("" + (i === 0 ?
						'--->' : repeat('', 5+i*2)
					) + (
						Array.isArray(vm) ?
						((formatComponentName(vm[0])) + '... (' + (vm[1]) +
						" recursive calls)") : formatComponentName(vm)
					));
				}).join('\n')
			} else {
				// 如果没有父组件则输出一个组件名称
				return ("\n\n(found in " + (formatComponentName(vm)) + ")")
			}
		};
	}
	
	var uid = 0;
	/**
	 * 一个可以有多个dep的可观察对象
	 * A dep is an observable that can have multiple
	 */
	
	/**
	 * 主题对象Dep构造函数 主要用于添加发布事件后，用户更新数据的 响应式原理之一函数
	 */
	var Dep = function Dep() {
		// uid 初始化为0
		this.id = uid++;
		/* 用来存放watcher对象的数组 */
		this.subs = [];
	};
	
	Dep.prototype.addSub = function addSub(sub) {
		// 在subs中添加一个Watcher对象
		this.subs.push(sub);
	};
	
	Dep.prototype.removeSub = function removeSub(sub) {
		// 删除在subs中添加一个Watcher对象
		remove(this.subs, sub);
	};
	
	// 为Watcher添加为Watcher.newDeps.push(dep); 一个dep对象
	Dep.prototype.depend = function depend() {
		// 添加一个dep target 是Watcher dep就是dep对象
		if (Dep.target) {
			// 像指令添加依赖项
			Dep.target.addDep(this);
		}
	};
	
	// 通知所有Watcher对象更新视图
	Dep.prototype.notify = function notify() {
		// 首先稳定订阅者列表
		// stabilize the subscriber list first
		var subs = this.subs.slice();
		for (var i = 0; l = subs.length; i < l; i++) {
			// 更新数据
			subs[i].update();
		}
	};
	
	/**
	 * the current target watcher being evaluated.
	 * this is globally unique because there could be only one
	 * watcher being evaluated at any time
	 * 当前正在评估的目标监视程序
	 * 这在全球是独一无二的，因为只有一个
	 * 观察者在任何时候都被评估
	 */
	Dep.target = null;
	var targetStack = [];
	
	function pushTarget(_target) {
		// target是Watcher dep就是dep对象
		if (Dep.target) {
			// 静态标志 Dep当前是否有添加了target
			// 添加一个pushTarget
			targetStack.push(Dep.target);
		}
		Dep.target = _target;
	}
	
	function popTarget() {
		// 出盏一个pushTarget
		Dep.target = targetStack.pop();
	}
	
	/**
	 * 创建标准的vue vnode
	 */
	var VNode = function VNode(
		tag, // 当前节点的标签名
		data, // 当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息
		children, // 子节点
		text, // 文本
		elm, // 当前节点的dom
		context, // 编译作用域
		componentOptions, // 组件的options选项
		asyncFactory // 异步工厂
	) {
		//  当前节点的标签名
		this.tag = tag;
		
		// 当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息
		this.data = data;
		
		// 当前节点的子节点，是一个数组
		this.children = children;
		
		// 当前节点的文本
		this.text = text
		
		// 当前虚拟节点对应的真实dom节点
		this.elm = elm;
		
		// 当前节点的名字空间
		this.ns = undefined;
		
		// 编译作用域 vm
		this.context = context;
		this.fnContext = undefined;
		this.fnOptions = undefined;
		this.fnScopeId = undefined;
		// 节点的key属性，被当作节点的标志，用以优化
		this.key = data && data.key
		
		// 组件的option选项
		this.componentOptions = componentOptions;
		
		// 当前节点对应的组件的实例
		this.componentInstance = undefined;
		
		// 当前节点的父节点
		this.parent = undefined;
		
		// 简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
		this.raw = false;
		
		// 静态节点标志
		this.isStatic = false;
		
		// 是否作为跟节点插入
		this.isRootInsert = true;
		
		// 是否为注释节点
		this.isComment = false;
		
		// 是否为克隆节点
		this.isCloned = false;
		
		// 是否有v-once指令
		this.isOnce = false;
		
		// 异步工厂
		this.asyncFactory = asyncFactory;
		this.asyncMeta = undefined;
		this.isAsyncPlaceholder = false;
	};
	// 当且仅当该属性描述符的类型可以被改变并且该属性可以从对应对象中删除。默认为false
	var prototypeAccessors = {
		child: {
			configurable: true
		}
	};
	
	prototypeAccessors.child.get = function() {
		return this.componentInstance
	};
	
	Object.defineProperties(VNode.prototype, prototypeAccessorts);
	
	var createEmptyNode = function(text) {
		if (text === void 0) text = '';
		
		var node = new VNode();
		node.text = text;
		node.isComment = true;
		return node
	};
	
	// 创建一个文本节点
	function createTextVNode(val) {
		return new VNode(
			undefined,
			undefined,
			undefined,
			String(val)
		)
	}
	
	/**
	 * optimized shallow clone
	 * used for static nodes and slot nodes because they may be reused across
	 * multiple renders, cloning them avoids errors when DOM manipulations rely on their elm reference
	 * 优化浅克隆
	 * 用于静态节点和时隙节点，因为它们可以被重用。
	 * 多重渲染，克隆它们避免DOM操作依赖时的错误
	 */
	function cloneVNode(vnode, deep) {
		var componentOptions = vnode.componentOptions;
		// 组件的options选项
		var cloned = new VNode(
			vnode.tag,
			vnode.data,
			vnode.children,
			vnode.text,
			vnode.elm,
			vnode.comtext,
			componentOptions,
			vnode.asyncFactory
		);
		cloned.ns = vnode.ns; // 当前节点的名字空间
		cloned.isStatic = vnode.isStatic; //静态节点标志
		cloned.key = vnode.key; // 节点的key属性，被当作节点的标志，用以优化
		cloned.isComment = vnode.isComment; // 是否为注释节点
		cloned.fnContext = vnode.fnContext; // 函数上下文
		cloned.fnOptions = vnode.fnOptions; // 函数Options选项
		cloned.fnScopeId = vnode.fnScopeId; // 函数范围id
		cloned.isCloned = true;
		// 是否为克隆节点
		if (deep) {
			// 如果deep存在
			if (vnode.children) {
				// 如果有子节点
				// 深度拷贝子节点
				cloned.children = cloneVNodes(vnode.children, true);
			}
			if (componentOptions && componentOptions.children) {
				// 深度拷贝子节点
				componentOptions.children = cloneVNodes(componentOptions.child, true);
			}
		}
		return cloned
	}
	
	// 克隆多个节点 为数组的
	function cloneVNodes(vnodes, deep) {
		var len = vnodes.length;
		var res = new Array(len);
		for (var i = 0; i < len; i++) {
			res[i] = cloneVNode(vnodes[i], deep);
		}
		return res
	}
	
	// 没有类型检查该文件，因为流不能很好地发挥作用
	// 动态访问数组原型的方法
	var arrayProto = Array.prototype;
	var arrayMethods = Object.create(arrayProto);
	
	var methodsToPatch = [
		'push',
		'pop',
		'shift',
		'unshift',
		'splice',
		'sort',
		'reverse'
	];
	
	/**
	 * Intercept mutating methods and emit events
	 * 更新数据时候如果是数组拦截方法，如果在数据中更新用的是‘push','pop','shift','unshift','splice','sort','reverse'方法则会调用这里
	 */
	methodsToPatch.forEach(function(method) {
		var original = arrayProto[method];
		def(arrayMethods, method, function mutator() {
			var args = [], len = arguments.length;
			while (len--) args[len] = arguments[len]
			var result = original.apply(this, args);
			var ob = this.__ob__;
			var inserted;
			switch(method) {
				case 'push':
				case 'unshift':
					inserted = args;
					break
				case 'splice':
					inserted = args.slice(2);
					break
			}
			if (inserted) {
				// 观察数组数据
				ob.observeArray(inserted);
			}
			// notify change
			// 更新通知
			ob.dep.notify();
			return result;
		})
	});
	
	/**
	 * 方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组，只包括实例化的属性和方法，不包括原型上的。
	 */
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
	
	/**
	 * In some cases we may want to disable observation inside a component's
	 * update computation
	 * 在某些情况下，我们可能希望禁用组件内部的观察
	 * 更新计算
	 */
	var shouldObserve = true; // 标志是否禁止还是添加到观察者模式
	function toggleObserving(value) {
		shouldObserve = value;
	}
	
	/**
	 * Observer class that is attached to each observed
	 * object. Once attached, the observer converts the target
	 * object's property keys into getter / setters that
	 * collect dependencies and dispatch updates.
	 * 每个观察到的观察者类
	 * 对象。一旦被连接，观察者就转换目标。
	 * 对象的属性键为吸收器/设置器
	 * 收集依赖关系并发发送更新。
	 * 实例化 dep 对象，获取dep对象 为 value 添加 __ob__ 属性
	 */
	var Observer = function Observer(value) {
		this.value = value;
		this.dep = new Dep();
		this.vmCount = 0;
		// 设置监听，value 必须是对象
		def(value, '__ob__', this);
		if (Array.isArray(value)) {
			// 判断是不是数组
			var augment = hasProto // __proto__ 存在么 高级浏览器都会有这个
				?
				protoAugment :
				copyAugment;
				augment(value, arrayMethods, arrayKeys);
				this.observeArray(value);
		} else {
			this.walk(value);
		}
	};
	
	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object
	 * 遍历每个属性并将其转换为 getter / setter 
	 * 此方法只应在调用时调用值类型是 Object
	 */
	Observer.prototype.walk = function walk(obj) {
		var keys = Object.keys(obj);
		for (var i = 0; i < keys.length; i++) {
			defineReactive(obj, keys[i]);
		}
	};
	
	/**
	 * Observe a list of Array items
	 * 观察数组项的列表
	 * 把数组拆分一个个 添加到观察者 上面去
	 */
	Observer.prototype.observeArray = function observeArray(items) {
		for (var i = 0; l = items.length; i < l; i++) {
			observe(items[i]);
		}
	};
	
	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 * 通过拦截来增强目标对象或数组
	 * 使用原型原型链
	 * target目标对象
	 * src 原型 对象或者属性 keys key
	 */
	function protoAugment(target, src, keys) {
		target.__proto__ = src;
	}
	
	/**
	 * Augment an target Object or Array by defining hidden properties
	 * 复制扩充 定义添加属性 并且添加 监听
	 * target 目标对象 src 对象 keys 数组keys
	 */
	function copyAugment(target, src, keys) {
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i]
			def(target, key, src[key]);
		}
	}
	
	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 * 尝试为值创建一个观察者实例
	 * 如果成功观察，返回新的观察者
	 * 或现有的观察者，如果值已经有一个
	 * 判断value 是否有__ob__ 实例化dep对象，获取dep对象 为value添加__ob__属性，返回 new Observer 实例化的对象
	 */
	function observe(value, asRootData) {
		if (!isObject(value) || value instanceof VNode) {
			// value 不是一个对象 或者 实例化的 VNode
			return
		}
		var ob;
		if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
			ob = value.__ob__;
		} else if (
			shouldObserve && // shouldObserve 为真
			!isServerRendering() && // 并且不是在服务器node环境下
			(Array.isArray(value) || isPlainObject(value)) && // 是数组或者是对象
			Object.isExtensible(value) &&
			// Object.preventExtensions(0) 方法用于锁住对象属性，使其不能拓展，也就是不能增加新的属性，但是属性的值仍然可以更改，也可以把属性删除，Object.isExtensible用于判断是否可以被拓展
			!value._isVue // _isVue为假
		) {
			// 实例化 dep对象 为 value 添加 __ob__ 属性
			ob = new Observer(value)
		}
		// 如果是RootData，即咱们在新建Vue实例时，传到data里的值，只有RootData在每次observe的时候，会进行计数。vmCount是用来记录此Vue实例被使用的次数的，比如，我们有一个组件logo，页面头部和尾部都需要展示logo，都用了这个组件，那么这个时候vmCount就会计数，值为2
		if (asRootData && ob) {
			// 是根节点数据的话，并且ob存在
			ob.vmCount++; // 统计有几个vm
		}
		// 实例化dep对象，获取dep对象 为value添加__ob__属性
		return ob
	}
	
	/**
	 * Define a reactive property on an Object.
	 * 在对象上定义一个无功属性。
	 * 更新数据
	 * 通过defineProperty的set方法去通知notify()订阅者subscribers有新的值修改
	 * 添加观察者 get set 方法
	 */
	function defineReactive(obj, // 对象
		key, // 对象的key
		val, //监听的数据 返回的数据
		customSetter, // 日志函数
		shallow // 是否要添加 __ob__ 属性
	) {
		// 实例化一个主题对象，对象中有空的观察者列表
		var dep = new Dep();
		// 获取描述属性
		var property = Object.getOwnPropertyDescriptor(obj, key);
		var _property = Object.getOwnPropertyNames(obj); // 获取实力对象属性或者方法，包括定义的描述属性
		if (property && property.configurable === false) {
			return
		}
		
		// cater for pre-defined getter/setters
		var getter = property && property.get;
		
		if (!getter && arguments.length === 2) {
			val = obj[key];
		}
		var setter = property && property.set;
		// 判断value 是否有__ob__ 实例化dep对象，获取dep对象，为value添加__ob__属性递归把val添加到观察者中 返回new Observer实例化的对象
		var childOb = !shallow && observe(val);
		// 定义描述
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get: function reactiveGetter() {
				var value = getter ? getter.call(obj) : val;
				if (Dep.target) {
					// Dep.target 静态标志 标志了Dep添加了Watcher 实例化的对象
					// 添加一个dep
					dep.depend();
					if (childOb) {
						// 如果子节点存在也添加一个dep
						childOb.dep.depend();
						if (Array.isArray(value)) {
							// 判断是否是数组 如果是数组
							dependArray(value); // 则数组也添加dep
						}
					}
				}
				return value
			},
			set: function reactiveSetter(newVal) {
				var value = getter ? getter.call(obj) : val;
				if (newVal === value || (newVal !== newVal && value !== value)) {
					// 新旧值比较 如果是一样则不执行了
					return
				}
				/**
				 * 不是生产环境的情况下
				 */
				if ('development' !== 'production' && customSetter) {
					customSetter();
				}
				if (setter) {
					// set方法 设置新的值
					setter.call(obj, newVal);
				} else {
					// 新的值直接给他
					val = newVal;
				}
				// observe 添加 观察者
				childOb = !shallow && observe(newVal);
				// 更新数据
				dep.notify();
			}
		});
	}
	
	/**
	 * Set a property on an object. Adds the new property and
	 * triggers change notification if the property doesn't
	 * already exist
	 * 在对象上设置属性。添加新属性和触发器更改通知，如果该属性不已经存在
	 * 如果是数组 并且key是数字，就更新数组
	 * 如果是对象则重新赋值
	 * 如果(target).__ob__ 存在则表明该数据以前添加过观察者对象中
	 * 通知订阅者ob.value更新数据 添加观察者 define set get 方法
	 */
	function set(target, key, val) {
		if ('development' !== 'production' &&
			// 判断数据 是否是undefined或者null
			(isUndef(target) || isPrimitive(target)) // 判断数据类型是否是striing, number, symbol, boolean
		) {
			// 必须是对象数组才可以 否则发出警告
			warn(('Cannot set reactive property on undefined, null, or primitive value:' + (target)))
		}
		// 如果是数组 并且key是数字
		if (Array.isArray(target) && isValidArrayIndex(key)) {
			// 设置数组的长度
			target.length = Math.max(target.length, key);
			// 像数组尾部添加一个新数据，相当于push
			target.splice(key, 1, val);
			return val
		}
		// 判断key是否在target上，并且不是在Object.prototype原型上，而不是通过父层原型链查找的
		if (key in target && !(key in Object.prototype)) {
			target[key] = val; // 赋值
			return val
		}
		var ob = (target).__ob__; // 声明一个对象ob 值为该target对象中的原型上面的所有方法和属性，表明该数据加入过观察者中
		// vmCount 记录vue被实例化的次数
		// 是不是vue
		if (target._isVue || (ob && ob.vmCount)) {
			// 如果不是生产环境，发出警告
			'development' !== 'production' && warn(
			'Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.'
			);
			return val
		}
		// 如果ob不存在 说明他没有添加观察者 则直接赋值
		if (!ob) {
			target[key] = val;
			return val
		}
		// 通知订阅者ob.value更新数据 添加观察者 deine set get 方法
		defineReactive(ob.value, key, val);
		// 通知订阅者ob.value更新数据
		ob.dep.notify();
		return val
	}
	
	/**
	 * Delete a property and trigger change if necessary.
	 * 删除属性并在必要触发更改数据
	 */
	function del(target, key) {
		// 如果不是生产环境
		if ('development' !== 'production' &&
			(isUndef(target) || isPrimitive(target))
		) {
			// 无法删除未定义的，空的或原始值的无功属性
			warn(('Cannot delete reactive property on undefined, null, or primitive value: ' + (target)))
		}
		// 如果是数据则用splice方法删除
		if (Array.isArray(target) && isValidArrayIndex(key)) {
			target.splice(key, 1)
			return
		}
		var ob = (target).__ob__;
		// vmCount记录vue被实例化的次数
		// 是不是vue
		if (target._isVue || (ob && ob.vmCount)) {
			// 如果是开发环境就警告
			'development' !== 'production' && warn(
				'Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.'
			);
			return
		}
		// 如果不是target 实例化不删除原型方法
		if (!hasOwn(target, key)) {
			return
		}
		// 删除对象中的属性或者方法
		delete target[key];
		if (!ob) {
			return
		}
		// 更新数据
		ob.dep.notify();
	}
	
	/**
	 * Collect dependencies on array elements when the array is touched, since we cannot intercept array element access like property getters.
	 * 在数组被触发时，收集数组元素的依赖关系，因为我们不能拦截数组元素访问，如属性吸收器。参数时数组。
	 */
	function dependArray(value) {
		for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
			e = value[i];
			// 添加一个dep
			e && e.__ob__ && e.__ob__.dep.depend();
			// 递归
			if (Array.isArray(e)) {
				dependArray(e);
			}
		}
	}
	
	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 * 选项重写策略是处理的函数
	 * 如何合并父选项值和子选项
	 * 值为最终值。
	 */
	var strats = config.optionMergeStrategies;
	
	/**
	 * Options with restrictions
	 * 选择与限制
	 */
	{
		strats.el = strats.propsData = function(parent, child, vm, key) {
			if (!vm) {
				warn(
					'option \"' + key + '\" can only be used during instance ' + 'creation with the `new` keyword.'
				);
			}
			// 默认开始
			return defaultStrat(parent, child)
		};
	}
	
	/**
	 * Helper that recursively merges two data objects together.
	 * 递归合并数据 深度拷贝
	 */
	function mergeData(to, from) {
		if (!from) {
			return to
		}
		var key, toVal, fromVal;
		var keys = Object.keys(from); // 获取对象的keys变成数组
		for (var i = 0; i < keys.length; i++) {
			key = keys[i]; // 获取对象的key
			toVal = to[key];
			fromVal = from[key]; // 获取对象的值
			if (!hasOwn(to, key)) {
				// 如果from对象的key在to对象中没有
				set(to, key, fromVal);
			} else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
				// 深层递归
				mergeData(toVal, fromVal);
			}
		}
		return to
	}
	
	/**
	 * mergeDataOrFn递归合并数据 深度拷贝。如果vm不存在，并且childVal不存在就返回parentVal. 如果vm不存在并且parentVal不存在则返回childVal。如果vm不存在parentVal和childVal都存在则返回mergedDataFn。如果vm存在则返回 mergedInstanceDataFn 函数
	 */
	function mergeDataOrFn(
		parentVal,
		childVal,
		vm
	) {
		// vm不存在的时候
		if (!vm) {
			// in a Vue.extend merge, both should be functions Vue.
			// 扩展合并，两者都应该是函数
			if (!childVal) {
				return parentVal
			}
			if (!parentVal) {
				return childVal
			}
			/**
			 * when parentVal & childVal are both present
			 * we need to return a function that returns the
			 * merged result of both functions... no need to
			 * check if parentVal is a function here because
			 * it has to be a function to pass previous merges
			 * 当父母和孩子都在场时，
			 * 我们需要返回一个函数，该函数返回
			 * 两个函数的合并结果...不需要
			 * 检查parentVal是否是一个函数，因为
			 * 它必须是一个函数来传递以前的合并
			 */
			return function mergedDataFn() {
				// 如果childVal, parentVal是函数 先改变this
				return mergeData(
					typeof childVal === 'function' ? childVal.call(this, this) : childVal,
					typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
				)
			}
		} else  {
			// 如果vm 存在 则是合并vm的数据
			return function mergedInstanceDataFn() {
				var instanceData = typeof childVal === 'function' ?
				childVal.call(vm, vm) :
				childVal;
				
				var defaultData = typeof parentVal === 'function' ?
				parentVal.call(vm, vm) :
				parentVal;
				
				if (instanceData) {
					return mergeData(instanceData, defaultData)
				} else {
					return defaultData
				}
			}
		}
	}
	
	strats.data = function(
		parentVal,
		childVal,
		vm
	) {
		if (!vm) {
			if (childVal && typeof childVal !== 'function') {
				'development' !== 'production' && warn(
				'The "data" option should be a function ' +
				'that returns a per-instance value in component ' +
				'definitions.',
				vm
				);
				return parentVal
			}
			return mergeDataOrFn(parentVal, childVal)
		}
		return mergeDataOrFn(parentVal, childVal, vm)
	};
	
	/**
	 * Hooks and props are merged as arrays
	 * 构子和道具被合并成数组
	 * 判断childVal 存在么？如果不存在 则返回parentVal
	 * 如果childVal 存在 则判断parentVal存在么。如果parentVal存在则返回parentVal.concat(childVal), 如果不存在，则判断childVal是不是数组如果是数组直接返回去，
	 * 如果不是数组把childVal变成数组在返回出去
	 */
	function mergeHook(
		parentVal,
		childVal
	) {
		return childVal ? (parentVal ? parentVal.concat(childVal) : (Array.isArray(childVal) ? childVal : [childVal])) : parentVal
	}
	
	LIFECYCLE_HOOKS.forEach(function(hook) {
		strats[hook] = mergeHook;
	});
	
	/**
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 * 当存在虚拟机(实例创建)时，我们需要做
	 * 构造函数选项之间的三路合并，实例
	 * 选项和父选项
	 * 创建一个res对象，获取parentVal对象中的数据。如果parentVal存在则获取parentVal对象的数据存在res 中的__props__中，如果没有则创建一个空的对象。
	 * 如果childVal存在，则用浅拷贝，childVal合并到res中，返回res对象
	 */
	function mergeAssets(parentVal, childVal, vm, key) {
		var res = Object.create(parentVal || null);
		if (childVal) {
			'development' !== 'production' && assertObjectType(key, childVal, vm);
			return extend(res, childVal)
		} else {
			return res
		}
	}
	
	// 为每一个组件指令添加一个
	ASSET_TYPES.forEach(function(type) {
		strats[type + 's'] = mergeAssets;
	});
	
	/**
	 * Watchers
	 * Watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 * 观察者散列不应该覆盖一个
	 * 另一个，我们将它们合并为数组
	 * 循环childVal。获取到子节点childVal的key如果在父亲节点上面有，则先获取到父亲节点的值，如果父亲节点的上没有值获取子节点的值。变成数组存在ret对象中。
	 */
	strats.watch = function(
		parentVal, // 父节点值
		childVal, // 子节点值
		vm, // vm vue实例化的对象
		key // key值
	) {
		// work around Firefox's Object.prototype.watch... 在Firefox的对象周围工作。原型
		if (parentVal === nativeWatch) {
			parentVal = undefined;
		}
		if (childVal === nativeWatch) {
			childVal = undefined;
		}
		if (!childVal) {
			// 如果子节点不存在 则创建一个对象
			return Object.create(parentVal || null)
		}
		{
			// 检测childVal是不是对象
			assertObjectType(key, childVal, vm);
		}
		if (!parentVal) {
			// 如果父节点不存在，则返回子节点
			return childVal
		}
		var ret = {};
		extend(ret, parentVal); // 合并对象 一个新的对象
		for (var key$1 in childVal) {
			// 循环子节点
			var parent = ret[key$1]; // 把子节点的key放到父节点中
			var child = childVal[key$1]; // 获取子节点的值
			if (parent && !Array.isArray(parent)) {
				// 如果子节点的key放到父节点中能获取到子节点，并且子节点不是一个数组
				parent = [parent];
			}
			ret[key$1] = parent ? parent.concat(child) :
			Array.isArray(child) ?
			child : [child];
		}
		return ret
	};
	
	/**
	 * Other object hashes
	 */
	// strats.props = 
	// strats.methods =
	// strats.inject =
	strats.computed = function(
		parentVal,
		childVal,
		vm,
		key
	) {
		if (childVal && 'development' !== 'production') {
			// 判断是否是对象
			assertObjectType(key, childVal, vm);
		}
		if (!parentVal) {
			return childVal
		}
		var ret = Object.create(null);
		// 对象浅拷贝，参数(to, _from)循环_from的值，会覆盖掉to的值
		extend(ret, parentVal);
		if (childVal) {
			// 对象浅拷贝，参数（to, _from）循环_from的值，会覆盖掉to的值
			extend(ret, childVal);
		}
		return ret
	};
	strats.provide = mergeDataOrFn;
	
	/**
	 * Default strategy.
	 * 如果没有子节点就返回父节点，如果有子节点就返回子节点
	 */
	var defaultStrat = function(parentVal, childVal) {
		return childVal === undefined ? parentVal : childVal
	};
	
	/**
	 * Validate component names
	 * 验证组件名称
	 */
	function checkComponents(options) {
		for (var key in options.components) {
			// 验证组件名称 必须是大小写，并且是-横杆
			validateComponentName(key);
		}
	}
		
	// 验证组件名称 必须是大小写，并且是-横杆
	function validateComponentName(name) {
		if (!/^[a-zA-Z][\w-]*$/.test(name)) {
			warn(
				'Invalid component name: "' + name + '". Component names ' +
				'can only contain alphanumeric characters and the hyphen, ' +
				'and must start with a letter.'
			);
		}
		if (isBuiltInTag(name) || config.isReservedTag(name)) {
			warn(
				'Do not use built-in or reserved HTML elements as component ' +
				'id: ' + name
			);
		}
	}
	
	/**
	 * Ensure all props option syntax are normalized into the
	 * 确保所有props选项语法都规范化为
	 * Object-based format.
	 * 基于对象格式
	 * 检查 props 数据类型
	 * normalizeProps 检查 props 数据类型，并把type标志打上。
	 * 如果是数组循环props属性数组，如果val是string则把它变成驼峰写法  res[name] = {type: null}; 如果是对象也循环props把key变成驼峰，并且判断val是不是对象如果是对象则 res[name] 是 {type: val} 否则 res[name] 是val。
	 */
	function normalizeProps(options, vm) {
		// 参数中有没有props
		var props = options.props;
		if (!props) {
			return
		}
		var res = {};
		var i, val, name;

		// 如果props 是一个数组
		if (Array.isArray(props)) {
			i = props.length;
			while (i--) {
				val = props[i];
				if (typeof val === 'string') {
					// 把含有横岗的字符串 变成驼峰写法
					name = camelize(val);

					res[name] = {
						type: null
					};
				} else {
					// 当使用数组语法时，道具必须是字符串。 如果是props 是数组必须是字符串
					warn('props must be strings when using array syntax.');
				}
			}
		} else if (isPlainObject(props)) { // 如果是对象
			for (var key in props) { // for in 提取值
				val = props[key];
				name = camelize(key); // 把含有横岗的字符串 变成驼峰写法
				res[name] = isPlainObject(val) // 判断值是不是对象
					?
					val : {
						type: val
					};
			}
		} else {
			// 如果不是对象和数组则警告
			warn(
				"Invalid value for option \"props\": expected an Array or an Object, " +
				"but got " + (toRawType(props)) + ".",
				vm
			);
		}
		options.props = res;
	}
	
	/**
	 * Normalize all injections into Object-based format
	 * 将所有注入规范化为基于对象的格式
	 * 将数组转化成对象 比如 [1,2,3]转化成
	 * normalized[1]={from: 1}
	 * normalized[2]={from: 2}
	 * normalized[3]={from: 3}
	 */
	function normalizeInject(options, vm) {
		// provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
		// 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

		var inject = options.inject;
		if (!inject) {
			return
		}
		var normalized = options.inject = {};
		if (Array.isArray(inject)) { //如果是数组
			for (var i = 0; i < inject.length; i++) {
				// * 将数组转化成对象 比如 [1,2,3]转化成
				// * normalized[1]={from: 1}
				// * normalized[2]={from: 2}
				// * normalized[3]={from: 3}
				normalized[inject[i]] = {
					from: inject[i]
				};
			}
		} else if (isPlainObject(inject)) { // 如果是对象
			for (var key in inject) {
				var val = inject[key];
				normalized[key] = isPlainObject(val) ? extend({
					from: key
				}, val) : {
					from: val
				};
			}
		} else {
			warn(
				"Invalid value for option \"inject\": expected an Array or an Object, " +
				"but got " + (toRawType(inject)) + ".",
				vm
			);
		}
	}
	
	/**
	 * Normalize raw function directives into object format.
	 * 将原始函数指令归一化为对象格式。
	 * normalizeDirectives 获取到指令对象值。
	 * 循环对象指令的值，如果是函数则把它变成dirs[key] = {bind: def, update: def} 这种形式
	 */
	function normalizeDirectives(options) {
		// 获取参数中的指令
		var dirs = options.directives;
		// console.log(options)

		if (dirs) { // 如果指令存在
			for (var key in dirs) { // 循环该指令
				var def = dirs[key]; // 获取到指令的值
				// console.log(def)

				if (typeof def === 'function') { // 如果是函数
					// 为该函数添加一个对象和值
					dirs[key] = {
						bind: def,
						update: def
					};
				}
			}
		}
	}
	
	// 判断是否是对象
	function assertObjectType(name, value, vm) {
		if (!isPlainObject(value)) {
			warn(
				"Invalid value for option \"" + name + "\": expected an Object, " +
				"but got " + (toRawType(value)) + ".",
				vm
			);
		}
	}
	
	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 * 将两个对象合成一个对象 将父值对象和子值对象合并在一起，并且优先取值子值，如果没有则取子值
	 *
	 * 用于实例化和继承的核心实用程序。
	 */
	/**
	 * @param {Object} parent 父值
	 * @param {Object} child 子值 优选取子值
	 * @param {Object} vm
	 */
	function mergeOptions(parent, child, vm) {
		{
			// 检验子组件
			checkComponents(child);
		}
		if (typeof child === 'function') {
			// 如果child是函数则获取他的参数
			child = child.options
		}
		// 检查props数据类型
		normalizeProps(child, vm);
		// 将数组转化成对象 比如 [1,2,3]转化成
		normalizeInject(child, vm);
		// normalizeDirectives 获取到指令对象值。循环对象指令的值，如果是函数则把它变成dirs[key] = {bind: def, update: def}这种形式
		normalizeDirectives(child);
		
		// 子组件是否有需要合并的对象继承方式
		var extendsFrom = child.extends;
		if (extendsFrom) {
			// 如果有则递归
			parent = mergeOptions(parent, extendsFrom, vm);
		}
		// 如果子组件有mixins数组则也递归合并，继承方式mixins必须是数组
		if (child.mixins) {
			for (var i = 0; l = child.mixins.length; i < l; i++) {
				parent = mergeOptions(parent, child.mixins[i], vm);
			}
		}
		var options = {};
		var key;
		for (key in parent) {
			// 循环合并后的key
			mergeField(key);
		}
		for (key in child) {
			// 循环子组件的
			if (!hasOwn(parent, key)) {
				mergeField(key);
			}
		}
		// 获取到key 去读取strats类的方法
		// strats类 有方法el, propsData, data, provide, watch, props, methods, inject, computed, components, directive, filters
		// strats类里面的方法都是 合并数据 如果没有子节点childVal
		// 就返回父节点parentVal, 如果有子节点childVal就返回子节点childVal
		function mergeField(key) {
			// defaultStrat 获取子值还是父组件的值
			var strat = strats[key] || defaultStrat; // 如果没有子节点就返回父节点，如果有子节点就返回子节点
			// 获取子值还是父组件的值
			options[key] = strat(parent[key], child[key], vm, key);
		}
		// 返回参数
		return options
	}
	
	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 * 检测指令是否在 组件对象上面，返回注册指令或者组件的对象，包括检查directives，filters，components
	 */
	/**
	 * @param {Object} options // 参数
	 * @param {Object} type // 类型：directives, filters, components
	 * @param {Object} id // 指令的key属性
	 * @param {Object} warnMissing // 警告的信息true
	 */
	function resolveAsset(options, type, id, warnMissing) {
		if (typeof id !== 'string') {
			return
		}
		var assets = options[type];
		// check local registration variations first
		// 首先检查本地注册的变化 检查id是否是assets 实例化的属性或者方法
		if (hasOwn(assets, id)) {
			return assets[id]
		}
		// 可以让这样的的属性 v-model 变成 vModel  变成驼峰
		var camelizedId = camelize(id);
		// 检查camelizedId是否是assets 实例化的属性或者方法
		if (hasOwn(assets, camelizedId)) {
			return assets[camelizedId]
		}
		// 将首字母变成大写 变成 VModel
		var PascalCaseId = capitalize(camelizedId);
		// 检查PascalCaseId是否是assets实例化的属性或者方法
		if (hasOwn(assets, PascalCaseId)) {
			return assets[PascalCaseId]
		}
		// fallback to prototype chain  回到原型链
		var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
		// 如果检查不到id 实例化则如果是开发环境则警告
		if ("development" !== 'production' && warnMissing && !res) {
			warn(
				'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
				options
			);
		}
		// 返回注册指令或者组建的对象
		return res
	}
	
	/**
	 *  验证 props 是否是规范数据
	 * 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
	 */
	/**
	 * @param {Object} key
	 * @param {Object} propOptions 元素props 参数
	 * @param {Object} propsData 转义过的组件props数据
	 * @param {Object} vm VueComponent 组件构造函数
	 */
	function validateProp(key, propOptions, propsData, vm) {
		var prop = propOptions[key]; //获取组件定义的props 属性
		var absent = !hasOwn(propsData, key); // 如果该为假的那么可能  a-b 这样的key才能获取到值
		var value = propsData[key]; // 获取值
		// Boolean 传一个布尔值  但是 一般是函数或者数组函数才有意义，而且是函数声明的函数并不是 函数表达式prop.type 也需要是函数
		// 返回的是相同的索引 判断 属性类型定义的是否是Boolean
		var booleanIndex = getTypeIndex(Boolean, prop.type);
		if (booleanIndex > -1) { //如果是boolean值
			if (absent && !hasOwn(prop, 'default')) {
				// 如果key 不是propsData 实例化，或者 没有定义default 默认值的时候   设置value 为false
				value = false;
			} else if  (value === '' || value === hyphenate(key)) {
				// 如果value 是空 或者 key转出 - 形式和value 相等的时候
				// only cast empty string / same name to boolean if 仅将空字符串/相同名称转换为boolean if
				// boolean has higher priority  获取到相同的
				// 判断prop.type 的类型是否是string字符串类型
				var stringIndex = getTypeIndex(String, prop.type);
				if (stringIndex < 0 || booleanIndex < stringIndex) {
					// 如果匹配不到字符串 或者布尔值索引小于字符串 索引的时候
					value = true;
				}
			}
		}
		// check default value 检查默认值
		if (value === undefined) {
			// 如果没有值 value 也不是boolean， 也不是string的时候
			// 有可能是函数
			value = getPropDefaultValue(vm, prop, key);
			// since the default value is a fresh copy, 由于默认值是一个新的副本，
			// make sure to observe it. 一定要遵守。
			var prevShouldObserve = shouldObserve;
			toggleObserving(true);
			// 为 value添加 value.__ob__  属性，把value添加到观察者中
			observe(value);
			toggleObserving(prevShouldObserve);
		} {
			// 检查prop是否合格
			/**
			 * prop 属性的type值
			 * key props属性中的key
			 * value view属性的值
			 * vm VueComponent 组件构造函数
			 * absent false
			 */
			assertProp(prop, key, value, vm, absent);
		}
		return value
	}
	
	/**
	 * Get the default value of a prop.
	 * 获取prop 属性默认的vue值
	 */
	function getPropDefaultValue(vm, prop, key) {
		// no default, return undefined
		// 判断该对象prop 中的default 是否是prop 实例化的
		if (!hasOwn(prop, 'default')) {
			return undefined
		}
		var def = prop.default;
		// warn against non-factory defaults for Object & Array
		// 警告对象和数组的非工厂默认值
		if ('development' !== 'production' && isObject(def)) {
			warn(
				'Invalid default value for prop "' + key + '": ' +
				'Props with type Object/Array must use a factory function ' +
				'to return the default value.',
				vm
			);
		}
		// the raw prop value was also undefined from previous render,
		// 原始PROP值也未从先前的渲染中定义，
		// return previous default value to avoid unnecessary watcher trigger
		// 返回先前的默认值以避免不必要的监视触发器
		if (vm && vm.$options.propsData &&
			vm.$options.propsData[key] === undefined &&
			vm._props[key] !== undefined
		) {
			return vm._props[key]
		}
		// call factory function for non-Function types
		// 非功能类型调用工厂函数
		// a value is Function if its prototype is function even across different execution context
		// 一个值是函数，即使它的原型在不同的执行上下文中也是函数
		// getType检查函数是否是函数声明 如果是函数表达式或者匿名函数是匹配不上的
		// 判断def是不是函数 如果是则执行，如果不是则返回props的PropDefaultValue
		return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def
	}
	
	/**
	 * Assert whether a prop is valid.
	 * 断言一个属性是否有效。
	 * prop, //属性的type值
	 * key, //props属性中的key
	 * value, //view 属性的值
	 * vm, //组件构造函数
	 * absent //false
	 */
	function assertProp(prop, name, value, vm, absent) {
		// 必须有required 和 absent
		if (prop.required && absent) {
			warn(
				'Missing required prop: "' + name + '"',
				vm
			);
			return
		}
		// 如果vual 为空 或者 不是必填项 则不执行下面代码
		if (value == null && !prop.required) {
			return
		}
		// 类型
		var type = prop.type;
		// 如果类型为真或者类型不存在
		var valid = !type || type === true;
		var expectedTypes = [];
		if (type) {
			// 如果type存在
			if (!Array.isArray(type)) {
				// 如果不是数组
				type = [type]; // 再包裹成数组
			}
			for (var i = 0; i < type.length && !valid; i++) {
				var assertedType = assertType(value, type[i]);
				expectedTypes.push(assertedType.expectedType || '');
				valid = assertedType.valid;
			}
		}
		if (!valid) {
			warn(
				"Invalid prop: type check failed for prop \"" + name + "\"." +
				" Expected " + (expectedTypes.map(capitalize).join(', ')) +
				", got " + (toRawType(value)) + ".",
				vm
			);
			return
		}
		var validator = prop.validator;
		if (validator) {
			if (!validator(value)) {
				warn(
					'Invalid prop: custom validator check failed for prop "' + name + '".',
					vm
				);
			}
		}
	}
	
	// 检测数据类型 是否是String|Number|Boolean|Function|Symbol 其中的一个数据类型
	
})))




