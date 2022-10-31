
当一个Vue实例创建时，Vue会遍历data中的属性，用 Object.defineProperty（vue3.0使用proxy ）将它们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。

轻量级框架：只关注视图层，是一个构建数据的视图集合，大小只有几十 kb ；
简单易学：国人开发，中文文档，不存在语言障碍 ，易于理解和学习；
双向数据绑定：保留了 angular 的特点，在数据操作方面更为简单；
组件化：保留了 react 的优点，实现了 html 的封装和重用，在构建单页面应用方面有着独特的优势；
视图，数据，结构分离：使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作；
虚拟DOM：dom 操作是非常耗费性能的，不再使用原生的 dom 操作节点，极大解放 dom 操作，但具体操作的还是 dom 不过是换了另一种方式；
运行速度更快：相比较于 react 而言，同样是操作虚拟 dom，就性能而言， vue 存在很大的优势。

Vue响应式的原理
利用Object.defineProperty劫持对象的访问器，在属性值发生变化时我们可以获取变化

发布订阅是一种消息范式
区别就在于，不同于观察者和被观察者，发布者和订阅者是互相不知道对方的存在的，发布者只需要把消息发送到订阅器里面，订阅者只管接受自己需要订阅的内容

响应式原理
Vue响应式的原理就是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

Observe(被劫持的数据对象) Compile(vue的编译器) Watcher(订阅者) Dep(用于收集Watcher订阅者们)
1.需要给Observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的属性，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。
2.Compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3.Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: ①在自身实例化时往属性订阅器(Dep)里面添加自己 ②自身必须有一个update()方法 ③待属性变动dep.notice() 通知时，能调用自身的update() 方法，并触发Compile中绑定的回调，则功成身退。
4.MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

Object.defineProperty的使用方式，有什么缺点
Object.defineProperty( obj, prop, descriptor )
obj 要定义的对象
prop 要定义或修改的属性名称或 Symbol
descriptor 要定义或修改的属性描述符(配置对象)

get 属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。默认为 [undefined] set 属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。默认为 [undefined]

缺点：

在对一些属性进行操作时，使用这种方法无法拦截，比如通过下标方式修改数组数据或者给对象新增属性，这都不能触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作。更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 Vue 内部通过重写函数的方式解决了这个问题。

在 Vue3.0 中已经不使用这种方式了，而是通过使用 Proxy 对对象进行代理，从而实现数据劫持。使用Proxy 的好处是它可以完美的监听到任何方式的数据改变，唯一的缺点是兼容性的问题，因为 Proxy 是 ES6 的语法。

Object.defineProperty(target, key, options)，options可传什么参数？
value：给target[key]设置初始值
get：调用target[key]时触发
set：设置target[key]时触发
writable：规定target[key]是否可被重写，默认false
enumerable：规定了key是否会出现在target的枚举属性中，默认为false
configurable：规定了能否改变options，以及删除key属性，默认false

M: model数据模型, V:view视图模型, C: controller控制器

MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。

View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了
通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知View视图更新。

model数据模型, V:view视图模型, P: Presenter 控制器

MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。在 MVC 模式中使用观察者模式，来实现当 Model 层数据发生变化的时候，通知 View 层的更新。这样 View 层和 Model 层耦合在一起，当项目逻辑变得复杂的时候，可能会造成代码的混乱，并且可能会对代码的复用性造成一些问题。

MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。MVC 中的Controller 只知道 Model 的接口，因此它没有办法控制 View 层的更新，MVP 模式中，View 层的接口暴露给了 Presenter 因此可以在 Presenter 中将 Model 的变化和 View 的变化绑定在一起，以此来实现 View 和 Model 的同步更新。这样就实现了对 View 和 Model 的解耦，Presenter 还包含了其他的响应逻辑。

MVVM 分为 Model、View、ViewModel：

Model代表数据模型，数据和业务逻辑都在Model层中定义；
View代表UI视图，负责数据的展示；
ViewModel负责监听Model中数据的改变并且控制视图的更新，处理用户交互操作；

Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定的联系。因此当Model中的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的数据也会在Model中同步。

这种模式实现了 Model和View的数据自动同步，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作DOM。

 v-if、v-show、v-html 的原理
 
v-if会调用addIfCondition方法，生成vnode的时候会忽略对应节点，render的时候就不会渲染；

v-show会生成vnode，render的时候也会渲染成真实节点，只是在render过程中会在节点的属性中修改show属性值，也就是常说的display；

v-html会先移除节点下的所有节点，调用html方法，通过addProp添加innerHTML属性，归根结底还是设置innerHTML为v-html的值。

## v-show和v-if的区别
 
v-show和v-if的区别? 分别说明其使用场景?

相同点：v-show 和v-if都是true的时候显示，false的时候隐藏

不同点1：原理不同

v-show:一定会渲染，只是修改display属性

v-if:根据条件渲染

不同点2：应用场景不同

频繁切换用v-show,不频繁切换用v-if

v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建，操作的实际上是dom元素的创建或销毁。

v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换 它操作的是display:none/block属性。

一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

1.vue在渲染的时候,会 先把 新DOM 与 旧DOM 进行对比， 如果dom结构一致，则vue会复用旧的dom。（此时可能造成数据渲染异常）

2.使用key可以给dom添加一个标识符，让vue强制更新dom

因为在不使用 key 或者列表的 index 作为 key 的时候，每个元素对应的位置关系都是 index，直接导致我们插入的元素到后面的全部元素，对应的位置关系都发生了变更，所以全部都会执行更新操作, 这是不可取的

而在使用唯一 key 的情况下，每个元素对应的位置关系就是 key，来看一下使用唯一 key 值的情况下

这样如图中的 li3 和 li4 就不会重新渲染，因为元素内容没发生改变，对应的位置关系也没有发生改变。

这也是为什么 v-for 必须要写 key，而且不建议开发中使用数组的 index 作为 key 的原因

为什么不建议用index索引作为key?

使用index 作为 key和没写基本上没区别，因为不管数组的顺序怎么颠倒，index 都是 0, 1, 2...这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。

v-model 是如何实现的，语法糖实际是什么？

（1）作用在表单元素上 动态绑定了 input 的 value 指向了 messgae 变量，并且在触发 input 事件的时候去动态把 message设置为目标值：

<input v-model="sth"/>
// 等同于
<input v-bind:value="message" v-on:input="message=$event.target.value">

$event 指代当前触发的事件对象；
$event.target 指代当前触发的事件对象的dom；
$event.target.value 就是当前dom的value值；
在 @input 方法中，value => sth;
在 :value 中，sth => value;

（2）作用在组件上 在自定义组件中，v-model 默认会利用名为 value 的 prop和名为 input 的事件

本质是一个父子组件通信的语法糖，通过prop和$.emit实现。 因此父组件 v-model 语法糖本质上可以修改为：

<child :value="message" @input="function(e){message = e}"></child>

在组件的实现中，可以通过 v-model属性来配置子组件接收的prop名称，以及派发的事件名称。

// 父组件
<aa-input v-model="aa"></aa-input>
// 等价于
<aa-input v-bind:value="aa" v-on:input="aa=$event.target.value"></aa-input>

// 子组件
<input v-bind:value="aa" v-on:input="onmessage"></aa-input>
props: { value: aa, }
methods: {
	onmessage(e) {
		$emit('input', e.target.value)
	}
}

默认情况下，一个组件上的v-model 会把 value 用作 prop且把 input 用作 event。但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。js 监听input 输入框输入数据改变，用oninput，数据改变以后就会立刻出发这个事件。通过input事件把数据$emit 出去，在父组件接受。父组件设置v-model的值为input $emit过来的值。

v-model 可以被用在自定义组件上吗？如果可以，如何使用？
可以。v-model 实际上是一个语法糖，用在自定义组件上也是同理：

<custom-input v-model="searchText"></custom-input>

相当于

<custom-input v-bind:value="searchText" v-on:input="searchText=$event"></custom-input>

父组件将searchText变量传入custom-input 组件，使用的 prop 名为value；

custom-input 组件向父组件传出名为input的事件，父组件将接收到的值赋值给searchText；

Vue.component('custom-input', {
	props: ['value'],
	template: `
		<input v-bind:value="value" v-on:input="$emit('input', $event.target.value)"
	`
})

v-model和.sync的对比
v-model与.sync的共同点：都是语法糖，都可以实现父子组件中的数据的双向通信。
一个组件只能绑定一个v-model
v-model针对更多的是最终操作结果，是双向绑定的结果，是value，是一种change操作。

.sync：
2.一个组件可以多个属性用.sync修饰符，可以同时"双向绑定多个“prop”

Computed：
它支持缓存，只有依赖的数据发生了变化，才会重新计算
不支持异步，当Computed中有异步操作时，无法监听数据的变化
computed的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data声明过，或者父组件传递过来的props中的数据进行计算的。
如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用computed
如果computed属性的属性值是函数，那么默认使用get方法，函数的返回值就是属性的属性值；在computed中，属性有一个get方法和一个set方法，当数据发生变化时，会调用set方法。

Watch：
它不支持缓存，数据变化时，它就会触发相应的操作
支持异步监听
监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
当一个属性发生变化时，就需要执行相应的操作
监听数据必须是data中声明的或者父组件传递过来的props中的数据，当发生变化时，会触发其他操作，函数有两个的参数：
immediate：组件加载立即触发回调函数
deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep无法监听到数组和对象内部的变化。
当想要执行异步或者昂贵的操作以响应不断的变化时，就需要使用watch。

computed 计算属性 : 依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。

watch 侦听器 : 更多的是观察的作用，无缓存性，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。

## 运用场景：

当需要进行数值计算,并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时都要重新计算。

当需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许执行异步操作 ( 访问一个 API )，限制执行该操作的频率，并在得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

## Computed 和 Methods 的区别

可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的

不同点：

computed: 计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值；

method 调用总会执行该函数。

## 什么是组件
组件就是把图形、非图形的各种逻辑均抽象为一个统一的概念（组件）来实现开发的模式，在Vue中每一个.vue文件都可以视为一个组件

组件的优势
降低整个系统的耦合度，在保持接口不变的情况下，我们可以替换不同的组件快速完成需求

调试方便，由于整个系统是通过组件组合起来的，在出现问题的时候，可以用排除法直接移除组件，或者根据报错的组件快速定位问题，之所以能够快速定位，是因为每个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单

提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代码进行优化可获得系统的整体升级

##什么是插件
插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：

添加全局方法或者属性。如: vue-custom-element

添加全局资源：指令/过滤器/过渡等。如 vue-touch

添加全局公共组件 Vue.component()

添加全局公共指令 Vue.directive()

通过全局混入来添加一些组件选项。如vue-router

添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。

一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如vue-router

18.2 Vue2和Vue3怎么注册全局组件
Vue2使用 Vue.component('组件名'，组件对象)

Vue3使用
const app = createApp(App)
app.component('组件名', 组件对象)

18.3 Vue2、Vue3怎么封装自定义插件并使用/ Vue.use() （install）

## Vue2

在compoents.index.js里，定义一个函数或对象，在里面可以使用Vue.compoent全局注册组件，并暴露出去

在main.js里使用Vue.use( )，参数类型必须是 object 或 Function

## Vue3

在compoents.index.ts里，定义一个函数或对象，在里面可以使用app.compoent全局注册组件，并暴露出去

在main.ts里使用app.use( )，参数类型必须是 object 或 Function

如果是 Function 那么这个函数就被当做 install 方法

如果是 object 则需要定义一个 install 方法










