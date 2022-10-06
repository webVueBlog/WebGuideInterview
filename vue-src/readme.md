2.6.14 版本 手写vue源码 添加注解

## vue packages

- vue-server-renderer
- vue-template-compiler
- weex-template-compiler
- weex-vue-framework
 
文件结构

compiler (编译器)，编译相关模块，也就是template模块转换为render函数的地方

core，核心c模块，vue的初始化，整个生命周期都在这里实现

platforms (平台)，平台化模块，分为web和weex，而我们只需要关注web即可

server，服务端渲染模块，我们可以无需关注

sfc，对 单文件组件 的处理模块。同样，无需关注

shared (共享)，一些公用的工具方法

compiler, core, platforms, shared

## compiler文件

整个compiler的核心作用就是生成render函数。而在该模块中的重点逻辑为 HTMLParser html解析器，parse 解析，optimization 优化，generate 生成。

在该文件中，会存在大量的高阶函数，充分学习到函数式编程的思想。

codegen，主要功能是用AST生成render函数字符串。

directives，存放一些指令的处理逻辑，如 v-bind，v-model，v-on 等。

parser，主要功能是将 template 模板编译为 AST。

index，compiler 的入口文件

optimizer，用来对 AST 做一些剪枝操作的标记处理，会在 codenden 和 vnode 的path中用到

to-function，将 codegen 生成的 render 函数字符串用 new Function 的方式最终生成 render 函数。

## core(核心) 文件

core 模块为整个 vue 的核心模块，其中几乎包含了 vue 的所有核心内容。如 vue 实例化的选项合并，data、computed 等属性的初始化，Watcher、Observer 的实现，vue实例的挂载等等。内容很多，因此我们需要 重点分析 该模块

components，它不是组件创建或更新相关的模块，在其内部只存在一个 keep-alive

glodbal-api，存在一些全局api，如 extend，mixin 等等，也包括 assets 属性（component，directive）的初始化逻辑

instance，core 模块中的核心，也是整个 vue 初始化的地方。包括了各种属性，事件的初始化，以及钩子函数的调用。其中的index文件，就是 vue 构造函数所在。而其他的文件，就像是一个个工厂，对 vue 进行层层加工，即初始化参数，初始化属性和方法等等。

observer，响应式的实现所在，也就是数据劫持，依赖添加的具体逻辑实现。Watcher，Dep，Observer 都存放在这个文件中

util，工具文件。各种工具函数的所在。其中 nextTick 函数就存放在这儿

vdom，也就是虚拟 DOM (vnode) 相关内容模块。包括普通节点 vnode，component vnode，functional component 等的初始化，path 函数等等。

## platforms文件 和 shard文件

platforms文件的逻辑不多，也不复杂 其中最主要的就是改写 mount 函数，合并一些初始化选项，做一些差异化的处理，如属性和指令等。

shared 文件用来存放一些共享的工具函数（喜欢的 cache 函数就是放在这里）

## 入口 instance/index

initMixin -> instance/init

stateMixin -> instance/state

eventsMixin -> instance/events

> eventsMixin较为独立，就只是一个eventEmitter的实现。 initMixin先于stateMixin，stateMixin应该穿插在 initMixin 当中。

lifecycleMixin -> instance/lifecycle

renderMixin -> instance/render

> lifecycleMixin 和 renderMixin 放在 mount 的时候看

initMixin文件：

1.选项合并。逻辑上简单，但是这里会牵涉很多需要全局了解的属性，因此优先看data，props等属性的处理合并策略，对于暂时不了解的战术上轻视，战略上重视。

2.各种init，优先initInjections，initState，initProvide

3.mount放在vue初始化流程结束之后再看

> 响应式相关，initState时穿插看 observer文件

global-api文件需要在初始化之后，mount之前

通过mount会牵涉到 _render 和 _update

$mount -> compiler 文件编译 -> _render -> vnode -> _update -> patch -> dom

> observer文件 -> Dep -> notify -> Watcher -> update -> nextTick

Watcher 一共分为三类，watch，computed，以及当前组件实例。


