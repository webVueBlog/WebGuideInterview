(window.webpackJsonp=window.webpackJsonp||[]).push([[449],{1042:function(e,t,a){"use strict";a.r(t);var r=a(6),n=Object(r.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h2",{attrs:{id:"数据驱动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#数据驱动"}},[e._v("#")]),e._v(" 数据驱动")]),e._v(" "),a("h3",{attrs:{id:"_1-new-vue"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-new-vue"}},[e._v("#")]),e._v(" 1. new Vue")]),e._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("var")]),e._v(" app "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("new")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("Vue")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("el")]),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'#app'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("data")]),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[e._v("message")]),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'Hello Vue!'")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br"),a("span",{staticClass:"line-number"},[e._v("2")]),a("br"),a("span",{staticClass:"line-number"},[e._v("3")]),a("br"),a("span",{staticClass:"line-number"},[e._v("4")]),a("br"),a("span",{staticClass:"line-number"},[e._v("5")]),a("br"),a("span",{staticClass:"line-number"},[e._v("6")]),a("br")])]),a("h3",{attrs:{id:"_2-init"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-init"}},[e._v("#")]),e._v(" 2. init")]),e._v(" "),a("ul",[a("li",[e._v("调用 this._init(options) 进行初始化\n"),a("ul",[a("li",[e._v("mergeOptions 合并配置")]),e._v(" "),a("li",[e._v("initLifecycle(vm) 初始化生命周期，调用生命周期钩子函数 callHook(vm, 'beforeCreate')")]),e._v(" "),a("li",[e._v("initEvents(vm) 初始化事件中心")]),e._v(" "),a("li",[e._v("initRender(vm) 初始化渲染")]),e._v(" "),a("li",[e._v("初始化 data、props、computed、watcher 等等")])])])]),e._v(" "),a("h3",{attrs:{id:"_3-vue-实例挂载-mount"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-vue-实例挂载-mount"}},[e._v("#")]),e._v(" 3. Vue 实例挂载 $mount")]),e._v(" "),a("p",[e._v("$mount 这个方法的实现是和平台、构建方式都相关的。我们分析带 compiler 版本的 $mount 实现。在 Vue 2.0 版本中，所有 Vue 的组件最终都会转换成 render 方法。")]),e._v(" "),a("ul",[a("li",[e._v("它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上。")]),e._v(" "),a("li",[e._v("如果没有定义 render 方法，则会调用 compileToFunctions 方法把 el 或者 template 字符串转换成 render 方法。")]),e._v(" "),a("li",[e._v("mountComponent：核心就是先实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法，在此方法中调用 vm._render 方法先生成虚拟 Node，最终调用 vm._update 更新 DOM。")]),e._v(" "),a("li",[e._v("将 vm._isMounted 设置为 true，表示已经挂载")]),e._v(" "),a("li",[e._v("执行 mounted 钩子函数：callHook(vm, 'mounted')")])]),e._v(" "),a("h3",{attrs:{id:"_4-compile"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-compile"}},[e._v("#")]),e._v(" 4. compile")]),e._v(" "),a("p",[e._v("在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 compileToFunctions 方法实现的。")]),e._v(" "),a("h3",{attrs:{id:"_5-render"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-render"}},[e._v("#")]),e._v(" 5. render")]),e._v(" "),a("p",[e._v("render: Vue 的 _render 方法是实例的一个私有方法，最终会把实例渲染成一个虚拟 Node。")]),e._v(" "),a("p",[e._v("vm._render 最终是通过执行 createElement 方法并返回的是 vnode，它是一个虚拟 Node")]),e._v(" "),a("h3",{attrs:{id:"_6-virtual-dom-虚拟-dom"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_6-virtual-dom-虚拟-dom"}},[e._v("#")]),e._v(" 6. Virtual DOM（虚拟 dom）")]),e._v(" "),a("p",[e._v("Virtual DOM（虚拟 dom）: 本质上是一个原生的 JS 对象，用 class 来定义。")]),e._v(" "),a("ul",[a("li",[e._v("核心定义：几个关键属性，标签名、数据、子节点、键值等，其它属性都是都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。")]),e._v(" "),a("li",[e._v("映射到真实的 DOM ，实际上要经历 VNode 的 create、diff、patch 等过程。")]),e._v(" "),a("li",[e._v("createElement： 创建 VNode")])]),e._v(" "),a("blockquote",[a("p",[e._v("创建VNode")])]),e._v(" "),a("ul",[a("li",[e._v("children 的规范化：由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。因为子节点 children 是任意类型的，因此需要把它们规范成 VNode 类型。\n"),a("ul",[a("li",[e._v("simpleNormalizeChildren：调用场景是 render 函数是编译生成的。")]),e._v(" "),a("li",[e._v("normalizeChildren\n"),a("ul",[a("li",[e._v("一个场景是 render 函数是用户手写的，当 children 只有一个节点的时候，Vue.js 从接口层面允许用户把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 createTextVNode 创建一个文本节点的 VNode。")]),e._v(" "),a("li",[e._v("另一个场景是当编译 slot、v-for 的时候会产生嵌套数组的情况，会调用 normalizeArrayChildren 方法，遍历 children (可能会递归调用 normalizeArrayChildren )。")])])]),e._v(" "),a("li",[e._v("总结\n"),a("ul",[a("li",[e._v("经过对 children 的规范化，children 变成了一个类型为 VNode 的 Array")])])])])]),e._v(" "),a("li",[e._v("VNode 的创建\n"),a("ul",[a("li",[e._v("规范化 children 后，会去创建一个 VNode 的实例。")]),e._v(" "),a("li",[e._v("或者通过 createComponent 创建一个组件类型的 VNode，本质上它还是返回了一个 VNode。")]),e._v(" "),a("li",[e._v("总结\n"),a("ul",[a("li",[e._v("每个 VNode 有 children，children 每个元素也是一个 VNode，这样就形成了一个 VNode Tree，它很好的描述了我们的 DOM Tree。")])])])])]),e._v(" "),a("li",[e._v("update：通过 Vue 的 _update 方法，_update 方法的作用是把 VNode 渲染成真实的 DOM。_update 的核心就是调用 vm.patch 方法，__patch__在不同的平台，比如 web 和 weex 上的定义是不一样的。")])]),e._v(" "),a("h3",{attrs:{id:"_7-update-的核心"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_7-update-的核心"}},[e._v("#")]),e._v(" 7. update 的核心")]),e._v(" "),a("p",[e._v("update 的核心：调用 vm.patch 方法")]),e._v(" "),a("p",[e._v("update：通过 Vue 的 _update 方法，_update 方法的作用是把 VNode 渲染成真实的 DOM。_update 的核心就是调用 vm.patch 方法，__patch__在不同的平台，比如 web 和 weex 上的定义是不一样的。")]),e._v(" "),a("ul",[a("li",[e._v("首次渲染\n"),a("ul",[a("li",[e._v("通过 createElm 方法，把虚拟节点创建真实的 DOM 并插入到它的父节点中。")]),e._v(" "),a("li",[e._v("然后调用 createChildren 方法去创建子元素，实际上是遍历子虚拟节点，递归调用 createElm。")]),e._v(" "),a("li",[e._v("接着再调用 invokeCreateHooks 方法执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue")]),e._v(" "),a("li",[e._v("最后调用 insert 方法把 DOM 插入到父节点中，因为是递归调用，子元素会优先调用 insert，所以整个 vnode 树节点的插入顺序是先子后父。")]),e._v(" "),a("li",[e._v("总结\n"),a("ul",[a("li",[e._v("其实就是调用原生 DOM 的 API 进行 DOM 操作，Vue 就是这样动态创建的 DOM。")])])])])]),e._v(" "),a("li",[e._v("数据更新")])]),e._v(" "),a("h3",{attrs:{id:"_8-dom"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_8-dom"}},[e._v("#")]),e._v(" 8. DOM")]),e._v(" "),a("p",[e._v("DOM：Vue 最终创建的 DOM。")]),e._v(" "),a("h3",{attrs:{id:"_9-总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_9-总结"}},[e._v("#")]),e._v(" 9. 总结")]),e._v(" "),a("p",[e._v("初始化 Vue 到最终渲染的整个过程：")]),e._v(" "),a("p",[e._v("new Vue => init => $mounted => compile => render => vnode => patch => DOM")])])}),[],!1,null,null,null);t.default=n.exports}}]);