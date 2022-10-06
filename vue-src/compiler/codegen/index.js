/* @flow */

import { genHandlers } from './events'
import baseDirectives from '../directives/index'
import { camelize, no, extend } from 'shared/util'
import { baseWarn, pluckModuleFunction } from '../helpers'
import { emptySlotScopeToken } from '../parser/index'

type TransformFunction = (el: ASTElement, code: string) => string;
type DataGenFunction = (el: ASTElement) => string;
type DirectiveFunction = (el: ASTElement, dir: ASTDirective, warn: Function) => boolean;

// target._o = markOnce;
// target._n = toNumber;
// target._s = toString;
// target._l = renderList;
// target._t = renderSlot;
// target._q = looseEqual;
// target._i = looseIndexOf;
// target._m = renderStatic;
// target._f = resolveFilter;
// target._k = checkKeyCodes;
// target._b = bindObjectProps;
// target._v = createTextVNode;
// target._e = createEmptyVNode;
// target._u = resolveScopedSlots;
// target._g = bindObjectListeners;
// target._d = bindDynamicKeys;
// target._p = prependModifier;
export class CodegenState {
  options: CompilerOptions;
  warn: Function;
  transforms: Array<TransformFunction>;
  dataGenFns: Array<DataGenFunction>;
  directives: { [key: string]: DirectiveFunction };
  maybeComponent: (el: ASTElement) => boolean;
  onceId: number;
  staticRenderFns: Array<string>;
  pre: boolean;

  constructor(options: CompilerOptions) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
	// dataGenFns 用来处理 staticStyle，styleBinding，和 staticClass，classBinding
	
	// if (el.staticClass) {
	//   data += `staticClass:${el.staticClass},`;
	// }
	// if (el.classBinding) {
	//   data += `class:${el.classBinding},`;
	// }
	// if (el.staticStyle) {
	//   data += `staticStyle:${el.staticStyle},`;
	// }
	// if (el.styleBinding) {
	//   data += `style:(${el.styleBinding}),`;
	// }
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    this.directives = extend(extend({}, baseDirectives), options.directives)
	// isReservedTag: 检查给定的标签是否是保留的标签。（HTML标签或SVG相关标签）
    const isReservedTag = options.isReservedTag || no
    this.maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)
    this.onceId = 0
    this.staticRenderFns = []
    this.pre = false
  }
}

export type CodegenResult = {
  render: string,
  staticRenderFns: Array<string>
};

/**
 * 从 AST 生成渲染函数
 * @returns {
 *   render: `with(this){return _c(tag, data, children)}`,
 *   staticRenderFns: state.staticRenderFns
 * } 
 */
export function generate(
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  // 实例化 CodegenState 对象，生成代码的时候需要用到其中的一些东西
  const state = new CodegenState(options);
  // fix #11483, Root level <script> tags should not be rendered.
  
  // 生成字符串格式的代码，比如：'_c(tag, data, children, normalizationType)'
  // data 为节点上的属性组成 JSON 字符串，比如 '{ key: xx, ref: xx, ... }'
  // children 为所有子节点的字符串格式的代码组成的字符串数组，格式：
  //     `['_c(tag, data, children)', ...],normalizationType`，
  //     最后的 normalization 是 _c 的第四个参数，
  //     表示节点的规范化类型，不是重点，不需要关注
  // 当然 code 并不一定就是 _c，也有可能是其它的，比如整个组件都是静态的，则结果就为 _m(0)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
	/**
	 * @param {Object} this
	 * 最终返回的render函数是包裹在with语法中的
	 * 因为在new Function的时候会存在作用域的问题，因此，需要在render函数内部就创建一个基于 this 的作用域，以致内部的方法和属性的正常获取
	 */
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}


export function genElement(el: ASTElement, state: CodegenState): string {
  if (el.parent) {
	// 节点是否在 v-pre 包裹之下
    el.pre = el.pre || el.parent.pre
  }
  
  /**
   * 每对一个元素进行了某项generate操作，都会将其标志位以进行该项操作(staticProcessed),防止再次进行重复操作从而递归死循环调用
   * processed属性只是为了防止在genElement函数中的重复操作，但是在很多生成函数中还会
   * 存在调用其他函数的情况，但是此时是不会被阻止调用的
   * 如在once中会调用if，在if中也会调用once，其目的是当解析的once元素中存在if属性的时候
   * 将其先处理完if后再回到once做once处理
   * generateElement的本质就是对元素进行递归解析，生成相应的render函数字符串
   */
  if (el.staticRoot && !el.staticProcessed) {
    /**
     * 处理静态根节点，生成节点的渲染函数
     *   1、将当前静态节点的渲染函数放到 staticRenderFns 数组中
     *   2、返回一个可执行函数 _m(idx, true or '') 
     */
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    /**
     * 处理带有 v-once 指令的节点，结果会有三种：
     *   1、当前节点存在 v-if 指令，得到一个三元表达式，condition ? render1 : render2
     *   2、当前节点是一个包含在 v-for 指令内部的静态节点，得到 `_o(_c(tag, data, children), number, key)`
     *   3、当前节点就是一个单纯的 v-once 节点，得到 `_m(idx, true of '')`
     */
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    /**
     * 处理节点上的 v-for 指令  
     * 得到 `_l(exp, function(alias, iterator1, iterator2){return _c(tag, data, children)})`
     */
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    /**
     * 处理带有 v-if 指令的节点，最终得到一个三元表达式：condition ? render1 : render2
     */
    return genIf(el, state)
	/**
	 * 如果是template元素，在进行once、for、if解析之后，如果不是插槽，则跳过其本身，解析生成其子元素
	 */
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    /**
     * 当前节点不是 template 标签也不是插槽和带有 v-pre 指令的节点时走这里
     * 生成所有子节点的渲染函数，返回一个数组，格式如：
     * [_c(tag, data, children, normalizationType), ...] 
     */
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    /**
     * 生成插槽的渲染函数，得到
     * _t(slotName, children, attrs, bind)
     */
    return genSlot(el, state)
  } else {
    // component or element
    // 处理动态组件和普通元素（自定义组件、原生标签）
    let code
	// 如果是component(is)元素
    if (el.component) {
      /**
       * 处理动态组件，生成动态组件的渲染函数
       * 得到 `_c(compName, data, children)`
       */
      code = genComponent(el.component, el, state)
    } else {
      // 自定义组件和原生标签走这里
      let data
	  // (el.pre && state.maybeComponent(el) : 在v-pre标签内的component
	  // !el.plain：v-pre标签内元素，或者没有key，没有scopedSlots，没有attrsList 的元素
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        // 非普通元素或者带有 v-pre 指令的组件走这里，处理节点的所有属性，返回一个 JSON 字符串，
        // 比如 '{ key: xx, ref: xx, ... }'
        data = genData(el, state)
      }

      // 处理子节点，得到所有子节点字符串格式的代码组成的数组，格式：
      // `['_c(tag, data, children)', ...],normalizationType`，
      // 最后的 normalization 表示节点的规范化类型，不是重点，不需要关注
	  // 如果声明了inlineTemplate，则不会对其后代在做解析，因为其在genData中已经做了区别处理。其他情况下，会对其子节点做递归解析
      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      // 得到最终的字符串格式的代码，格式：
      // '_c(tag, data, children, normalizationType)'
	  
	  /**
	   * 最终生成的代码字符串，即为render函数中我们书写的代码形式：
	   * h('div',{key:'001',ref:"div001",attrs:{},domProps:{}},[children])
	   */
      code = `_c('${el.tag}'${data ? `,${data}` : '' // data
        }${children ? `,${children}` : '' // children
        })`
    }
    // 如果提供了 transformCode 方法， 
    // 则最终的 code 会经过各个模块（module）的该方法处理，
    // 不过框架没提供这个方法，不过即使处理了，最终的格式也是 _c(tag, data, children)
	
	// 此处gen函数生成的code即为平时书写的h函数的字符串形式，如：
	// h("div", { props: { data: _this.data }, style: "color:red", key: key }, [
	//   h("div", [h("div", "333")]),
	//   h("div", "123"),
	// ]);

    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}

/**
 * 生成静态节点的渲染函数
 *   1、将当前静态节点的渲染函数放到 staticRenderFns 数组中
 *   2、返回一个可执行函数 _m(idx, true or '') 
 */
// hoist static sub-trees out
function genStatic(el: ASTElement, state: CodegenState): string {	
  // 标记当前静态节点已经被处理过了
  // 标识已经genStatic过
  el.staticProcessed = true
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  const originalPreState = state.pre
  /**
   * 如果元素设置了v-pre，则将static置为true，并在gen完其后代元素后将pre状态回归至解析该元素之前的状态originalPreState
   */
  if (el.pre) {
    state.pre = el.pre
  }
  // 将其及其后代的解析结果存放至staticRenderFns中
  // 将静态根节点的渲染函数 push 到 staticRenderFns 数组中，比如：
  // [`with(this){return _c(tag, data, children)}`]
  state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
  state.pre = originalPreState
  /**
   * _m函数：renderStatic
   * src\core\instance\render-helpers\render-static.js
   * 其作用就是缓存，给节点加上key
   */
  // 返回一个可执行函数：_m(idx, true or '')
  // idx = 当前静态节点的渲染函数在 staticRenderFns 数组中下标
  return `_m(${state.staticRenderFns.length - 1
    }${el.staticInFor ? ',true' : ''
    })`
}

/**
 * 处理带有 v-once 指令的节点，结果会有三种：
 *   1、当前节点存在 v-if 指令，得到一个三元表达式，condition ? render1 : render2
 *   2、当前节点是一个包含在 v-for 指令内部的静态节点，得到 `_o(_c(tag, data, children), number, key)`
 *   3、当前节点就是一个单纯的 v-once 节点，得到 `_m(idx, true of '')`
 */
function genOnce(el: ASTElement, state: CodegenState): string {
  // 标记当前节点的 v-once 指令已经被处理过了
  // 标识已经genOnce过
  el.onceProcessed = true
  if (el.if && !el.ifProcessed) {
    // 如果含有 v-if 指令 && if 指令没有被处理过，则走这里
    // 处理带有 v-if 指令的节点，最终得到一个三元表达式，condition ? render1 : render2 
	// 如果其包含if语句，则在先在genIf中做处理，完毕后再回到genOnce处理
    return genIf(el, state)
	// 在optimization中，除了为static元素加上了staticInFor属性，也为once的元素
	// 加上了该属性
  } else if (el.staticInFor) {
    // 说明当前节点是被包裹在还有 v-for 指令节点内部的静态节点
    // 获取 v-for 指令的 key
    let key = ''
    let parent = el.parent
	// 遍历其祖先元素，找到 v-for 的那一个，并将其的key作为此元素的key
    while (parent) {
      if (parent.for) {
        key = parent.key
        break
      }
      parent = parent.parent
    }
    // key 不存在则给出提示，v-once 节点只能用于带有 key 的 v-for 节点内部
	// 如果其声明了v-for的父级元素没有带key，则报错
    if (!key) {
      process.env.NODE_ENV !== 'production' && state.warn(
        `v-once can only be used inside v-for that is keyed. `,
        el.rawAttrsMap['v-once']
      )
	  // 不解析v-once，继续解析下一个属性或元素
      return genElement(el, state)
    }
	// _o函数: markOnce
	// src\core\instance\render-helpers\render-static.js
	// 其作用是给node生成key，并标记上isOnce
    // 生成 `_o(_c(tag, data, children), number, key)`
    return `_o(${genElement(el, state)},${state.onceId++},${key})`
  } else {
    // 上面几种情况都不符合，说明就是一个简单的静态节点，和处理静态根节点时的操作一样,
    // 得到 _m(idx, true or '')
	// 返回_m函数，将其当作静态内容处理
    return genStatic(el, state)
  }
}

/**
 * 处理带有 v-if 指令的节点，最终得到一个三元表达式，condition ? render1 : render2 
 */
export function genIf(
  el: any,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  // 标记当前节点的 v-if 指令已经被处理过了，避免无效的递归
  el.ifProcessed = true // avoid recursion
  // 得到三元表达式，condition ? render1 : render2
  // 浅拷贝其ifConditions，然后进行gen操作
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

/**
 * 最终的返回格式为一个三目运算符：
 * a? genElement(condition.block):
 * b? genElement(condition.block):
 * genElement(condition.block)
 */
function genIfConditions(
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  // 长度若为空，则直接返回一个空节点渲染函数
  // 如果其conditions为空，则返回空模板_e
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  // 从 conditions 数组中拿出第一个条件对象 { exp, block }
  // 从前往后出栈，因为ifConditions中的顺序为 if - elseif -elseif - else
  const condition = conditions.shift()
  // 返回结果是一个三元表达式字符串，condition ? 渲染函数1 : 渲染函数2
  // 如果其存在表达式，及exp，则代表其为 if 或者 elseif
  if (condition.exp) {
    // 如果 condition.exp 条件成立，则得到一个三元表达式，
    // 如果条件不成立，则通过递归的方式找 conditions 数组中下一个元素，
    // 直到找到条件成立的元素，然后返回一个三元表达式
	// 对其后面的ifConditions项做递归处理
    return `(${condition.exp})?${genTernaryExp(condition.block)
      }:${genIfConditions(conditions, state, altGen, altEmpty)
      }`
  } else {
    return `${genTernaryExp(condition.block)}`
  }
  
  // 如果是once元素，则在其处理完if属性后再次回到genOnce处理
  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp(el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

/**
 * 处理节点上的 v-for 指令  
 * 得到 `_l(exp, function(alias, iterator1, iterator2){return _c(tag, data, children)})`
 */
/**
 * for的生成函数为 _l = renderList()
 * src\core\instance\render-helpers\render-list.js
 * renderList函数将其按照不同的exp循环之后，调用传入的第二个参数，即返回生成函数的函数
 * 在for元素中，其子元素能使用item，index等属性的原因是其在函数内部形成了闭包
 * 最终返回形式： v-for = (item,key,index) in arr为例
 */
// `_l( arr , function(item,key,index){
//     return genElement(el, state)
// })`;
export function genFor(
  el: any,
  state: CodegenState,
  altGen?: Function,
  altHelper?: string
): string {
  // v-for 的迭代器，比如 一个数组
  const exp = el.for
  // 迭代时的别名
  const alias = el.alias
  // iterator 为 v-for = "(item ,idx) in obj" 时会有，比如 iterator1 = idx
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
  
  // 处理其没有key的情况
  // 提示，v-for 指令在组件上时必须使用 key
  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
      `v-for should have explicit keys. ` +
      `See https://vuejs.org/guide/list.html#key for more info.`,
      el.rawAttrsMap['v-for'],
      true /* tip */
    )
  }

  // 标记当前节点上的 v-for 指令已经被处理过了
  el.forProcessed = true // avoid r
  // 得到 `_l(exp, function(alias, iterator1, iterator2){return _c(tag, data, children)})`
  return `${altHelper || '_l'}((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
    `return ${(altGen || genElement)(el, state)}` +
    '})'
}

/**
 * 处理节点上的众多属性，最后生成这些属性组成的 JSON 字符串，比如 data = { key: xx, ref: xx, ... } 
 */
// data即为h函数中的第二个参数，一般形式为:{key,class,style,props:{name:_this.name},attrs:{id:'div'}}
export function genData(el: ASTElement, state: CodegenState): string {
  // 节点的属性组成的 JSON 字符串
  // 创建data的起始边界
  let data = '{'

  // 首先先处理指令，因为指令可能在生成其它属性之前改变这些属性
  // 执行指令编译方法，比如 web 平台的 v-text、v-html、v-model，然后在 el 对象上添加相应的属性，
  // 比如 v-text： el.textContent = _s(value, dir)
  //     v-html：el.innerHTML = _s(value, dir)
  // 当指令在运行时还有任务时，比如 v-model，则返回 directives: [{ name, rawName, value, arg, modifiers }, ...}] 
  // directives first.
  // directives may mutate the el's other properties before they are generated.
  // 先处理direCtives属性
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','

  // key，data = { key: xx }
  if (el.key) {
    data += `key:${el.key},`
  }
  // ref，data = { ref: xx }
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  // 带有 ref 属性的节点在带有 v-for 指令的节点的内部， data = { refInFor: true }
  if (el.refInFor) {
    data += `refInFor:true,`
  }
  // pre，v-pre 指令，data = { pre: true }
  if (el.pre) {
    data += `pre:true,`
  }
  // 动态组件，data = { tag: 'component' }
  // record original tag name for components using "is" attribute
  // 如果使用了is属性，则会将其原始的tag保存在data中
  if (el.component) {
    data += `tag:"${el.tag}",`
  }
  // 为节点执行模块(class、style)的 genData 方法，
  // 得到 data = { staticClass: xx, class: xx, staticStyle: xx, style: xx }
  // module data generation functions
  
  // dataGenFns 用来处理staticStyle，styleBinding，和staticClass，classBinding

  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el)
  }
  
  // vue会将所有的attrs(没有声明props修饰符，且不是必须定义为DOM props的属性)都添加至data的attrs中。而我们平时习惯上，会将组件间的传值使用props属性存放
  // 这是因为，最终在生成真实html的时候，vue会根据当前节点是html标签，还是组件，去做
  
  // 其它属性，得到 data = { attrs: 静态属性字符串 } 或者 
  // data = { attrs: '_d(静态属性字符串, 动态属性字符串)' }
  // attributes
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`
  }
  // DOM props，结果同 el.attrs
  // props会被处理为domProps
  if (el.props) {
    data += `domProps:${genProps(el.props)},`
  }
  // event handlers
  
  // 处理events和nativeEvents，二者处理方式基本相同，唯一的区别是前者返回
  // on:{},而后者返回nativeOn
  // 如果某个事件绑定了了多个回调，则其会变成数组的形式
  
  // 自定义事件，data = { `on${eventName}:handleCode` } 或者 { `on_d(${eventName}:handleCode`, `${eventName},handleCode`) }
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  // 带 .native 修饰符的事件，
  // data = { `nativeOn${eventName}:handleCode` } 或者 { `nativeOn_d(${eventName}:handleCode`, `${eventName},handleCode`) }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  // slot target
  // only for non-scoped slots
  
  // 如果其为静态插槽(非作用域插槽)，则为其添加slot属性，值为slotTarget
  // <template v-slot:name></template> 即为非作用域插槽
  // <template v-slot:name="data"></template>即为作用域插槽。
  // 二者的区别在于此组件是否接受了子组件的插槽传值

  // 非作用域插槽，得到 data = { slot: slotName }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  // scoped slots
  // scoped slots，作用域插槽，data = { scopedSlots: '_u(xxx)' }
  if (el.scopedSlots) {
    data += `${genScopedSlots(el, el.scopedSlots, state)},`
  }
  // component v-model
  // 在directives处理中，若component绑定了v-model，则会为其添加model属性
  
  // 处理 v-model 属性，得到
  // data = { model: { value, callback, expression } }
  // component v-model
  if (el.model) {
    data += `model:{value:${el.model.value
      },callback:${el.model.callback
      },expression:${el.model.expression
      }},`
  }
  // inline-template
  // 会生成inlineTemplate属性和staticRenderFns属性，值对应的就是其子节点generate
  // 返回的值
  
  // inline-template，处理内联模版，得到
  // data = { inlineTemplate: { render: function() { render 函数 }, staticRenderFns: [ function() {}, ... ] } }
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state)
    if (inlineTemplate) {
      data += `${inlineTemplate},`
    }
  }
  // 移除掉末尾的 ","
  
  // 删掉 JSON 字符串最后的 逗号，然后加上闭合括号 }
  data = data.replace(/,$/, '') + '}'
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  
  // _b函数：bindObjectProps
  // src\core\instance\render-helpers\bind-object-props.js
  
  // 处理dynamicAttrs，即：v-bind:[dynamicKey]="value",并根据key最终不同的情况
  // 选择将其添加的为位置(是data，或attrs，或domProps)
  if (el.dynamicAttrs) {
    // 存在动态属性，data = `_b(data, tag, 静态属性字符串或者_d(静态属性字符串, 动态属性字符串))`
    data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
  }
  // v-bind data wrap
  // 注意：以下两种情况在directives就定义了方法，但是会在实际解析data的最后
  // 在执行，其目的就是为了等到其他标准属性处理完毕再处理bind和on(优先级低于标准属性)
  
  // wrapData方法定义位置：src\compiler\directives\bind.js
  // 其作用就是处理 v-bind="{}"中的内容。
  if (el.wrapData) {
    data = el.wrapData(data)
  }
  // v-on data wrap
  // wrapListeners方法定义位置 
  // _vue\src\compiler\directives\on.js
  // 其作用就是处理v-on="{}"中的内容
  if (el.wrapListeners) {
    data = el.wrapListeners(data)
  }
  return data
}


/**
 * 运行指令的编译方法，如果指令存在运行时任务，则返回 directives: [{ name, rawName, value, arg, modifiers }, ...}] 
 */
function genDirectives(el: ASTElement, state: CodegenState): string | void {
  // 获取指令数组
  // 此时directives"或许应该"存放着 model | text | html | 自定义指令 | clock | show 等
  const dirs = el.directives
  // dirs为一个数组(如有)，item为如下：以v-myDir:[fantasy].happy.sad="play" 为例
  
  // 没有指令则直接结束
  if (!dirs) return
  // 指令的处理结果
  let res = 'directives:['
  // 标记，用于标记指令是否需要在运行时完成的任务，比如 v-model 的 input 事件
  let hasRuntime = false
  let i, l, dir, needRuntime
  
  // 遍历指令数组
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i]
	/**
	 * @param {Object} gen
	 * 每次循环都会将needRuntime默认值置为true，对应着自定义directives永远默认添加，而v-[model|html|text|on|bind|clock]根据具体的generate结果决定是否添加
	 */
	
    needRuntime = true
	// static中directives属性的来源：
	// src\platforms\web\compiler\directives\index.js（v-model,v-html,v-text）
	// src\compiler\directives\index.js (v-on,v-bind,v-clock)
	
	// 用户自定义的directives并不会在此做处理，而是直接拼接至res中
    // 获取节点当前指令的处理方法，比如 web 平台的 v-html、v-text、v-model
	// (needRuntime默认值为true)
    const gen: DirectiveFunction = state.directives[dir.name]
    if (gen) {
      // 执行指令的编译方法，如果指令还需要运行时完成一部分任务，则返回 true，比如 v-model
	  
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn)
    }
	
	// needRuntime的为：输入框，下拉框，单选框，多选框的model；自定义指令
    if (needRuntime) {
      // 表示该指令在运行时还有任务
      hasRuntime = true
      // res = directives:[{ name, rawName, value, arg, modifiers }, ...]
      res += `{name:"${dir.name}",rawName:"${dir.rawName}"${dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
        }${dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
        }${dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
        }},`
    }
  }
  
  if (hasRuntime) {
    // 也就是说，只有指令存在运行时任务时，才会返回 res
    return res.slice(0, -1) + ']'
  }
}


function genInlineTemplate(el: ASTElement, state: CodegenState): ?string {
  const ast = el.children[0]
  // inline template 只能有且只有一个子节点
  if (process.env.NODE_ENV !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn(
      'Inline-template components must have exactly one child element.',
      { start: el.start }
    )
  }

  // 对其子节点做generate处理，同模板处理一样，只不过最终放置的位置为inlineTemplate
  if (ast && ast.type === 1) {
	// 属性中，和staticRenderFns中
    const inlineRenderFns = generate(ast, state.options)
    return `inlineTemplate:{render:function(){${inlineRenderFns.render
      }},staticRenderFns:[${inlineRenderFns.staticRenderFns.map(code => `function(){${code}}`).join(',')
      }]}`
  }
}


function genScopedSlots(
  el: ASTElement,
  slots: { [key: string]: ASTElement },
  state: CodegenState
): string {
  // by default scoped slots are considered "stable", this allows child
  // components with only scoped slots to skip forced updates from parent.
  // but in some cases we have to bail-out of this optimization
  // for example if the slot contains dynamic names, has v-if or v-for on them...
  
  // 当插槽中任意一项满足return的表达式，或者当前元素有v-for指令，则needsForceUpdate为true
  let needsForceUpdate = el.for || Object.keys(slots).some(key => {
    const slot = slots[key]
    return (
      slot.slotTargetDynamic ||
      slot.if ||
      slot.for ||
      containsSlotChild(slot) // is passing down slot from parent which may be dynamic
    )
  })

  // #9534: if a component with scoped slots is inside a conditional branch,
  // it's possible for the same component to be reused but with different
  // compiled slot content. To avoid that, we generate a unique key based on
  // the generated code of all the slot contents.
  
  // 如果当前元素存在v-if指令，则needsKey为true
  let needsKey = !!el.if

  // OR when it is inside another scoped slot or v-for (the reactivity may be
  // disconnected due to the intermediate scope variable)
  // #9438, #9506
  // TODO: this can be further optimized by properly analyzing in-scope bindings
  // and skip force updating ones that do not actually use scope variables.
  
  /**
   * 如果在上述判断中，needsForceUpdate不为true，则会进入第二次判断：从祖先元素中遍历，如果祖先元素中存在v-if指令的元素，则needsKey为true
   * 如果祖先元素作为其他元素的插槽内容，或者祖先元素存在v-for指令，则needsForceUpdate为true
   */

  if (!needsForceUpdate) {
    let parent = el.parent
    while (parent) {
      if (
        (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
        parent.for
      ) {
        needsForceUpdate = true
        break
      }
      if (parent.if) {
        needsKey = true
      }
      parent = parent.parent
    }
  }
  
  // key为slotTarget(没有设定则为default)，fn为最终生成的回调函数，也就是在子组件中this.$scopeSlots调用之时的函数
  
  /**
   * _u函数：resolveScopedSlots
   * src\core\instance\render-helpers\resolve-scoped-slots.js
   */
  
  // 最终的返回值为：
  // scopedSlots: {
  //  $stable: !needsForceUpdate,
  //  $key: hash(generatedSlots),
  //  [slot.key]: slot.fn,
  //  [slot.key]: slot.fn,
  // }

  const generatedSlots = Object.keys(slots)
    .map(key => genScopedSlot(slots[key], state))
    .join(',')
	
  return `scopedSlots:_u([${generatedSlots}]${needsForceUpdate ? `,null,true` : ``
    }${!needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``
    })`
}

function hash(str) {
  let hash = 5381
  let i = str.length
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0
}

function containsSlotChild(el: ASTNode): boolean {
  if (el.type === 1) {
    if (el.tag === 'slot') {
      return true
    }
    return el.children.some(containsSlotChild)
  }
  return false
}

// 是否是传统语法，即 slot-scope 语法
function genScopedSlot(
  el: ASTElement,
  state: CodegenState
): string {
  const isLegacySyntax = el.attrsMap['slot-scope']
  if (el.if && !el.ifProcessed && !isLegacySyntax) {
    return genIf(el, state, genScopedSlot, `null`)
  }
  if (el.for && !el.forProcessed) {
    return genFor(el, state, genScopedSlot)
  }
  /**
   * 是否是作用域插槽
   * 这里的处理是为了 v-slot:name 的情况。
   * 在生成AST的时候，即使v-slot没有使用作用域，也会为其补全一个emptySlotScopeToken。
   * 从而导致看起来不是作用域插槽却实际添加至父节点的 scopeSlots处
   */
  const slotScope = el.slotScope === emptySlotScopeToken
    ? ``
    : String(el.slotScope)
  /**
   * 生成一个以slotScope为参数的函数返回值即为父组件插槽中的内容。
   * 如果是template的形式，则最终会生成其children而忽略此标签，否则则是将整个标签都给生成
   * 最终返回形式为一个函数，slotScope为参数。以  v-slot:fantasy="{name}"为例
   * function({name}) {
	   return _d('div', name)
   }
   * 这也就是为什么在模板内容内部可以使用作用域插槽传递值的原因
   */
  const fn = `function(${slotScope}){` +
    `return ${el.tag === 'template'
      ? el.if && isLegacySyntax
        ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`
	
  // reverse proxy v-slot without scope on this.$slots
  // 此处设置了.proxy为true，是为了在之后生成vNode的时候，同时生成$slots属性，而非单纯的$slotScopes属性
  const reverseProxy = slotScope ? `` : `,proxy:true`
  return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
}


/**
 * 生成所有子节点的渲染函数，返回一个数组，格式如：
 * [_c(tag, data, children, normalizationType), ...] 
 */
/**
 * 返回形式为一个数组，对应render函数中h函数的第三个参数
 * [children.map(item => genElement(item))]
 */
export function genChildren(
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  // 所有子节点
  const children = el.children
  if (children.length) {
    // 第一个子节点
    const el: any = children[0]
    // optimize single v-for
	// 如果children唯一，并且有v-for指令
    if (children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      // 优化，只有一个子节点 && 子节点的上有 v-for 指令 && 子节点的标签不为 template 或者 slot
      // 优化的方式是直接调用 genElement 生成该节点的渲染函数，不需要走下面的循环然后调用 genCode 最后得到渲染函数
      const normalizationType = checkSkip
        ? state.maybeComponent(el) ? `,1` : `,0`
        : ``
      return `${(altGenElement || genElement)(el, state)}${normalizationType}`
    }
    // 获取节点规范化类型，返回一个 number 0、1、2，不是重点， 不重要
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0

    // 函数，生成代码的一个函数
    const gen = altGenNode || genNode
	// 将其children遍历，做genNode处理,然后再用","连接,放在一个数组中
	
    // 返回一个数组，数组的每个元素都是一个子节点的渲染函数，
    // 格式：['_c(tag, data, children, normalizationType)', ...]
    return `[${children.map(c => gen(c, state)).join(',')}]${normalizationType ? `,${normalizationType}` : ''
      }`
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed

function getNormalizationType(
  children: Array<ASTNode>,
  maybeComponent: (el: ASTElement) => boolean
): number {
  let res = 0
  
  // 遍历每一个子元素
  for (let i = 0; i < children.length; i++) {
    const el: ASTNode = children[i]
	
	// 如果子元素都不为标签节点，则返回值为1；
    if (el.type !== 1) {
      continue
    }
	
	// 元素满足：el.for !== undefined || el.tag === "template" || el.tag === "slot";
	
	// 或者存在v-if指令，且v-if中有任意一项满足上述，则返回2
    if (needsNormalization(el) ||
      (el.ifConditions && el.ifConditions.some(c => needsNormalization(c.block)))) {
      res = 2
      break
    }
	
	// 如果元素是component，或者v-if中的元素是component，则返回1
    if (maybeComponent(el) ||
      (el.ifConditions && el.ifConditions.some(c => maybeComponent(c.block)))) {
      res = 1
    }
  }
  return res
}

function needsNormalization(el: ASTElement): boolean {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode(node: ASTNode, state: CodegenState): string {
  if (node.type === 1) {
	// 如果type为1(标签元素)，则genElement
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
	// 如果type为3，且节点的isComment为true，genComment
    return genComment(node)
  } else {
	// 否则(type为2或者3，即带有字面量表达式的文本节点，或者纯文本节点)，则genText
    return genText(node)
  }
}

/**
 * _v函数：createTextVNode
 * src\core\vdom\vnode.js
 * 直接生成一个只有text的vnode节点
 * 如果type是2(包含字面量的表达式)
 */
export function genText(text: ASTText | ASTExpression): string {

  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
    })`
}

/**
 * _e函数：createEmptyVNode
 * src\core\vdom\vnode.js
 * 生成一个包含text，且isComment为true的vnode节点
 */
export function genComment(comment: ASTText): string {
  return `_e(${JSON.stringify(comment.text)})`
}

// genSlot对应的函数为renderSlot
// src\core\instance\render-helpers\render-slot.js

// 最终返回值为：_t(slotName, function(){ return [genElement(children1)]} , attr , bind)

// 会被toFunction解析为 this.$createElement("template", { slot: target }, this.$scopedSlots[name]);

/**
 * 生成插槽的渲染函数，得到
 * _t(slotName, children, attrs, bind)
 */
function genSlot(el: ASTElement, state: CodegenState): string {
  // 插槽名称
  const slotName = el.slotName || '"default"'
  // children为默认显示的内容
  // 生成所有的子节点
  const children = genChildren(el, state)
  // 结果字符串，_t(slotName, children, attrs, bind)
  let res = `_t(${slotName}${children ? `,${children}` : ''}`
  const attrs = el.attrs || el.dynamicAttrs
    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
      // slot props are camelized
      name: camelize(attr.name),
      value: attr.value,
      dynamic: attr.dynamic
    })))
    : null
  const bind = el.attrsMap['v-bind']
  // 有attrs属性(即h函数中的props)或者v-bind属性，且无后代节点，则为上一个参数children的生成函数填充上null
  if ((attrs || bind) && !children) {
    res += `,null`
  }
  // 将attrs(数组)添加至_t的参数中
  if (attrs) {
    res += `,${attrs}`
  }
  // 将v-bind添加至_t函数的参数中，且若attrs没有的话，为其填充上一个参数null
  if (bind) {
    res += `${attrs ? '' : ',null'},${bind}`
  }
  // 补全最终生成函数的括号，并返回
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement

/**
 * 生成动态组件的渲染函数
 * 返回 `_c(compName, data, children)`
 */

// genComponent只是用到了_c函数，也就是createElement(h)函数
// 手动去创建一个和is绑定的值(componentName)相应的render函数节点，并将第二个参数完全
// 转移至新节点
// 如果声明了inlineTemplate属性，则忽略其子节点，否则将component的子节点移接到创建的新
// render函数节点中

function genComponent(
  componentName: string,
  el: ASTElement,
  state: CodegenState
): string {
  // 所有的子节点
  const children = el.inlineTemplate ? null : genChildren(el, state, true)
  // 返回 `_c(compName, data, children)`
  // compName 是 is 属性的值
  return `_c(${componentName},${genData(el, state)}${children ? `,${children}` : ''
    })`
}

// 其返回值可能如下：
// static props 返回一个对象， {key:value, key2:value2, key3:value3}
// 若有dynamic props 返回 _d({key:value}, [key1,value1,key2,value2])

// 最终将动态属性作为   attrs[key]的形式赋值给attrs (注意：在vue中，parse阶段的props
// 代表的是原生属性，而在render阶段，attrs才代表将会被添加成为原生属性，而props代表的是
// 自定义的属性)
// 在次进行这一步操作的原因是，某个动态属性  key , value，其key动态映射的是字段 “name”
// 若直接 attrs.key 则属性名变成了key而非真实的name
// 而若使用attrs[key]，则最终添加上的属性名仍为name

/**
 * 遍历属性数组 props，得到所有属性组成的字符串
 * 如果不存在动态属性，则返回：
 *   'attrName,attrVal,...'
 * 如果存在动态属性，则返回：
 *   '_d(静态属性字符串, 动态属性字符串)' 
 */
function genProps(props: Array<ASTAttr>): string {
  // 静态属性
  let staticProps = ``
  // 动态属性
  let dynamicProps = ``
  // 遍历属性数组
  for (let i = 0; i < props.length; i++) {
    // 属性
    const prop = props[i]
	// text.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
    // 属性值
    const value = __WEEX__
      ? generateValue(prop.value)
      : transformSpecialNewlines(prop.value)
    if (prop.dynamic) {
      // 动态属性，`dAttrName,dAttrVal,...`
      dynamicProps += `${prop.name},${value},`
    } else {
      // 静态属性，'attrName,attrVal,...'
      staticProps += `"${prop.name}":${value},`
    }
  }
  // 去掉静态属性最后的逗号
  staticProps = `{${staticProps.slice(0, -1)}}`
  if (dynamicProps) {
	// _d函数：bindDynamicKeys
	// src\core\instance\render-helpers\bind-dynamic-keys.js
	
    // 如果存在动态属性则返回：
    // _d(静态属性字符串，动态属性字符串)
    return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
  } else {
    // 说明属性数组中不存在动态属性，直接返回静态属性字符串
    return staticProps
  }
}

/* istanbul ignore next */
function generateValue(value) {
  if (typeof value === 'string') {
    return transformSpecialNewlines(value)
  }
  return JSON.stringify(value)
}

// #3895, #4268
function transformSpecialNewlines(text: string): string {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

