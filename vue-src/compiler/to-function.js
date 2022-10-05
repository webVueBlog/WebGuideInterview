// @flow

import { noop, extend } from 'shared/util'
import { warn as baseWarn, tip } from 'core/util/debug'
import { generateCodeFrame } from './codeframe'

type CompiledFunctionResult = {
	render: Function,
	staticRenderFns: Array<Function>;
};

function createFunction (code, errors) {
	try {
		return new Function(code)
	} catch (err) {
		errors.push({ err, code })
		return noop
	}
}

export function createCompileToFunctionFn (compile: Function): Function {
	/**
	 * 利用闭包缓存
	 * 缓存编译结果，防止重复编译（即当某个公用组件在同一个组件或不同组件重复引入的时候，只会编译一次
	 */
	const cache = Object.create(null)
	/**
	 * 编译的主要过程
	 * 1.将编译模板缓存，以防重复编译
	 * 2.调用compile将模板编译为render函数数字字符串
	 * 3.调用createFunction将render函数数字字符串转为真实渲染函数
	 * 4.打印上述过程产生的错误或提示信息
	 */
	
	/**
	 * 1.执行编译函数，得到编译结果 -> compiled
	 * 2.处理编译期间产生的 error 和 tip，分别输出到控制台
	 * 3.将编译得到的字符串代码通过 new Function(codeStr) 转换成可执行的函数
	 * 4.缓存编译结果
	 * @param { string } template 字符串模板
	 * @param { CompilerOptions } options 编译选项
	 * @param { Component } vm 组件实例
	 * @return { render, staticRenderFns }    
	 */
	return function compileToFunctions (
		template: string,
		options?: CompilerOptions,
		vm?: Component
	): CompiledFunctionResult {
		// 传递进来的编译选项
		options = extend({}, options)
		// 日志
		const warn = options.warn || baseWarn
		delete options.warn
		
		/* istanbul ignore if */
		// 环境策略检测，compiler的编译过程依赖于 new Function()，如果此时用户定义的 策略不支持 new Function，则会提示用户修改策略，或者直接使用render函数编写代码
		if (process.env.NODE_ENV !== 'production') {
			// 检测可能的 CSP 限制
			try {
				new Function('return 1')
			} catch (e) {
				if (e.toString().match(/unsafe-eval|CSP/)) {
					// 看起来你在一个 CSP 不安全的环境中使用完整版的 vue.js，模板编译器不能工作在这样的环境中。
					// 考虑放宽策略限制或者预编译你的 template 为 render 函数
					 warn(
						'It seems you are using the standalone build of Vue.js in an ' +
						'environment with Content Security Policy that prohibits unsafe-eval. ' +
						'The template compiler cannot work in this environment. Consider ' +
						'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
						'templates into render functions.'
					)
					/**
					 * 看起来你正在使用Vue.js的独立构建
					 * 在一个内容安全策略禁止不安全eval的环境中。
					 * 模板编译器无法在此环境中工作。考虑放宽策略，
					 * 允许不安全的eval或预编译你的模板到渲染函数。
					 */
				}
			}
		}
		// check cache
		// 缓存编译结果，防止重复编译
		// 如果有缓存，则跳过编译，直接从缓存中获取上次编译的结果
		const key = options.delimiters
			? String(options.delimiters) + template
			: template
		
		// 如果该模板已被编译，则不会进行重复编译，直接返回 cache 的缓存结果
		if (cache[key]) {
			return cache[key]
		}
		
		// compile
		// compile 函数从 createCompiler 处当作参数传递过来
		// 执行编译函数，得到编译结果
		const compiled = compile(template, options)
		
		// compile函数的作用
		// 1.生成最终编译器选项 finalOptions
		// 2.对错误的收集
		// 3.调用 baseCompile 编译模板
		
		// check compilation errors/tips
		// 打印出模板编译时产生的错误和提示信息
		// 检测编译期间产生的 error 和 tip，分别输出到控制台
		if (process.env.NODE_ENV !== 'production') {
			if (compiled.errors && compiled.errors.length) {
				compiled.errors.forEach(e => {
					warn(
						`Error compiling template:\n\n${e.msg}\n\n` +
						generateCodeFrame(template, e.start, e.end),
						vm
					)
				})
			} else {
				warn(
					`Error compiling template:\n\n${template}\n\n` +
					compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
					vm
				)
			}
		}
		if (compiled.tips && compiled.tips.length) {
			if (options.outputSourceRange) {
				compiled.tips.forEach(e => tip(e.msg, vm))
			} else {
				compiled.tips.forEach(msg => tip(msg, vm))
			}
		}
	}
	// 转换编译得到的字符串代码为函数，通过 new Function(code) 实现
	// 作为最后的结果
	// turn code into functions
	const res = {}
	// 收集 createFunction 产生的错误
	const fnGenErrors = []
	// 将生成的 render 函数字符串 和 staticRenderFns 字符串通过 new function 最终生成为函数
	res.render = createFunction(compiled.render, fnGenErrors)
	res.staticRenderFns = compiled.staticRenderFns.map(code => {
		return createFunction(code, fnGenErrors)
	})
	
	// check function generation errors
	// this should only happen if there is a bug in the compiler itself.
	// mostly for codegen development use
	// 处理上面代码转换过程中出现的错误，这一步一般不会报错，除非编译器本身出错了
	/* istanbul ignore if */
	if (process.env.NODE_ENV !== 'production') {
		if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
			warn(
			  `Failed to generate render function:\n\n` +
			  fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
			  vm
			)
		}
	}
	
	// 缓存编译结果
	return (cache[key] = res)
}

