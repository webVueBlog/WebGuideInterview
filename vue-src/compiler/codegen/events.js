/* @flow */

// 匹配箭头函数或普通函数
const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/
// 匹配函数括号内的形参
const fnInvokeRE = /\([^)]*?\);*$/
// 匹配绑定变量形式的事件，如：
// <button @click="this.handler" @click="this['handler'|'handler'|'handler']" @click="handler"></button>
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/

// KeyboardEvent.keyCode aliases
const keyCodes: { [key: string]: number | Array<number> } = {
	esc: 27,
	tab: 9,
	enter: 13,
	space: 32,
	up: 38,
	left: 37,
	right: 39,
	down: 40,
	'delete': [8, 46]
}

// keyboardEvent.key aliases
// 关键的别名

const keyNames: { [key: string]: stirng | Array<string> } = {
	// #7880: IE11和Edge使用' Esc '作为Escape键名。
	// #7880: IE11 and Edge use `Esc` for Escape key name.
	esc: ['Esc',  'Escape'],
	tab: 'Tab',
	enter: 'Enter',
	// #9112: IE11 uses `Spacebar` for Space key name.
	// #9112: IE11使用'空格键'作为空格键名。
	space: [' ', 'Spacebar'],
	// #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
	// #7806: IE11使用没有箭头前缀的键名作为方向键。
	up: ['Up', 'ArrowUp'],
	left: ['Left', 'ArrowLeft'],
	right: ['Right', 'ArrowRight'],
	down: ['Down', 'ArrowDown'],
	// #9112: IE11 uses `Del` for Delete key name.
	// #9112: IE11使用' Del '作为删除键名。
	'delete': ['Backspace', 'Delete', 'Del']
}

// #4868:阻止监听器执行的修饰符
// #4868: modifiers that prevent the execution of the listener
// 需要显式返回null，以便我们可以确定是否删除
// need to explicitly return null so that we can determine whether to remove
// 监听器。once
// the listener for .once
const genGuard = condition => `if(${condition})return null;`

const modifierCode: { [key: string]: string } = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard(`$event.target !== $event.currentTarget`),
  ctrl: genGuard(`!$event.ctrlKey`),
  shift: genGuard(`!$event.shiftKey`),
  alt: genGuard(`!$event.altKey`),
  meta: genGuard(`!$event.metaKey`),
  // 注意，只有button的event对象中， 才会存在button属性
  left: genGuard(`'button' in $event && $event.button !== 0`),
  middle: genGuard(`'button' in $event && $event.button !== 1`),
  right: genGuard(`'button' in $event && $event.button !== 2`)
}

/**
 * 生成自定义事件的代码
 * 动态：'nativeOn | on_d(staticHandlers, [dynamicHandlers])'
 * 静态：'nativeOn | on${staticHandlers}'
 */
export function genHandlers (
	events: ASTElementHandlers,
	isNative: boolean
): string {
	// 根据isNative判断添加至nativeOn还是on属性上
	// 原生: nativeOn, 否则为 on
	const prefix = isNative ? 'nativeOn' : 'on:'
	// 静态
	let staticHandlers = ``
	// 动态
	let dynamicHandlers = ``
	// 遍历 events 数组
	// events = [{ name: {value: 回调函数名， ... } }]
	for (const name in events) {
		// 通过genHandler解析生成每一个事件的回调
		// 获取指定事件的回调函数名,即 this.methodName 或者 [this.methodName1, ...]
		const handlerCode = genHandler(events[name])
		if (events[name] && events[name].dynamic) {
			// 动态，dynamicHandles = `eventName,handleCode,...`
			dynamicHandlers += `${name},${handlerCode},`
		} else {
			// 静态，staticHandles = `"eventName": handleCode,`
			staticHandlers += `"${name}":${handlerCode},`
		}
	}
	// 如果不是dynamic，则直接将其返回为对象的键值形式
	// 去掉末尾的逗号
	staticHandlers = `{${staticHandlers.slice(0, -1)}}`
	if (dynamicHandlers) {
		// _d: bindDynamicKeys 函数
		// _VUEs\_vue\src\core\instance\render-helpers\bind-dynamic-keys.js
		// 通过 baseObj[dynamic] 的方式处理 dynamic 事件名
		// 动态， on_d(statickHandles, [dynamicHandlers])
		// 通过 baseObj[dynamic] 的方式处理dynamic事件名
		return prefix + `_d(${staticHandlers}, [${dynamicHandlers.slice(0, -1)}])`
	} else {
		// 静态，`on${staticHandlers}`
		return prefix + staticHandlers
	}
}

// 在Weex上生成带有绑定参数的处理程序代码
/* istanbul ignore next */
function genWeexHandler (params: Array<any>, handlerCode: string) {
  let innerHandlerCode = handlerCode
  const exps = params.filter(exp => simplePathRE.test(exp) && exp !== '$event')
  const bindings = exps.map(exp => ({ '@binding': exp }))
  const args = exps.map((exp, i) => {
    const key = `$_${i + 1}`
    innerHandlerCode = innerHandlerCode.replace(exp, key)
    return key
  })
  args.push('$event')
  return '{\n' +
    `handler:function(${args.join(',')}){${innerHandlerCode}},\n` +
    `params:${JSON.stringify(bindings)}\n` +
    '}'
}

/**
 * 得到：'[可执行的事件回调函数]'
 * @param {*} handler 
 * @returns 
 */
function genHandler (handler: ASTElementHandler | Array<ASTElementHandler>): string {
  if (!handler) {
    return 'function(){}'
  }

  // 如果handler是一个数组，则将其每一项都做genHandler操作，并拼接成数组的形式
  // 当同一个事件名绑定多个回调的时候，其最终就会生成为数组的形式
  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(handler)).join(',')}]`
  }
  
  // isMethodPath: 事件为methods中的属性
  const isMethodPath = simplePathRE.test(handler.value)
  // isFunctionExpression：事件为自己写的箭头函数或普通函数
  const isFunctionExpression = fnExpRE.test(handler.value)
  // isFunctionInvocation：为带有参数的methods事件，如：@click="handler(row)"
  const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''))
  
  // 如果不带修饰符
  if (!handler.modifiers) {
	// 如果是methods函数或者手写函数，直接返回
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, handler.value)
    }
	/**
	 * @param {Object} $event
	 * 否则，即是带参数的methods
	 * 之所以这么处理，是因为vue在事件触发时会默认可以用$event传递event对象
	 * 或者也可以传递其他自己想要的参数，因此，如：
	 * @click="handler($event)" 和 @click="handler(row)"在此情形下都能正常传递
	 */
    return `function($event){${
      isFunctionInvocation ? `return ${handler.value}` : handler.value
    }}` // inline statement
  } else {
    let code = ''
    let genModifierCode = ''
    const keys = []
	// 将所有modifierCode中的key modifiers，拼接至genModifierCode
	// stop,prevent,self,ctrl,shift,alt,meta,left,middle,right
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) {
          keys.push(key)
        }
		// .exact修饰符允许你控制由精确的系统修饰符组合触发的事件。
      } else if (key === 'exact') {
        const modifiers: ASTModifiers = (handler.modifiers: any)
		// 如果使用了
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(keyModifier => !modifiers[keyModifier])
            .map(keyModifier => `$event.${keyModifier}Key`)
            .join('||')
        )
      } else {
		// 不符合上述条件,则全部加入至keys中,统一处理
        keys.push(key)
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
	// 确保像prevent和stop这样的修饰符在键过滤后被执行
    if (genModifierCode) {
      code += genModifierCode
    }
    const handlerCode = isMethodPath
      ? `return ${handler.value}.apply(null, arguments)`
      : isFunctionExpression
        ? `return (${handler.value}).apply(null, arguments)`
        : isFunctionInvocation
          ? `return ${handler.value}`
          : handler.value
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, code + handlerCode)
    }
    return `function($event){${code}${handlerCode}}`
  }
}


function genKeyFilter (keys: Array<string>): string {
  return (
	// 确保键过滤器只适用于KeyboardEvents
	// #9441:不能在$event中使用'keyCode'，因为Chrome自动填充会触发假的
	// 没有keyCode属性的键事件…
    // make sure the key filters only apply to KeyboardEvents
    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
    // key events that do not have keyCode property...
	// 如果event.type为key开头的事件(即键盘事件)
    `if(!$event.type.indexOf('key')&&` +
    `${keys.map(genFilterCode).join('&&')})return null;`
  )
}

// 将key转换为10进制整
function genFilterCode (key: string): string {
  const keyVal = parseInt(key, 10)
  // 如果不可以转换为10进制数,则返回NaN,而NaN转换为Boolean为false
  if (keyVal) {
    return `$event.keyCode!==${keyVal}`
  }
  const keyCode = keyCodes[key]
  const keyName = keyNames[key]
  // _k函数: checkKeyCodes
  // _VUEs\_vue\src\core\instance\render-helpers\check-keycodes.js
  // 其作用是根据keyCode或keyName去判断按键是否为event中的keyCode|key。
  // 优先级为：keyCode>keyName
  // 在不同浏览器中，key的name并不总是相同，而keyCode可以保证为一
  // 优先使用keyCode，总会更加稳妥
  return (
    `_k($event.keyCode,` +
    `${JSON.stringify(key)},` +
    `${JSON.stringify(keyCode)},` +
    `$event.key,` +
    `${JSON.stringify(keyName)}` +
    `)`
  )
}

