
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

（1）props / $emit (父子)
父组件通过props向子组件传递数据，子组件通过$emit和父组件通信

props只能是父组件向子组件进行传值，props使得父子组件之间形成了一个单向下行绑定。子组件的数据会随着父组件不断更新。

props 可以显示定义一个或一个以上的数据，对于接收的数据，可以是各种数据类型，同样也可以传递一个函数。

props属性名规则：若在props中使用驼峰形式，模板中需要使用短横线的形式

// 父组件
<template>
	<div id="father">
		<son :msg="msgData" :fn="myFunction"></son>
	</div>
</template>
<script>
import son from './son.vue';
export default {
	name: 'father',
	data() {
		msgData: '父组件数据';
	},
	methods: {
		myFunction() {
			console.log('vue');
		}
	},
	components: {
		son
	}
};
</script>

// 子组件
<template>
	<div id="son">
		<p>{{msg}}</p>
		<button @click="fn">按钮</button>
	</div>
</template>
<script>
export default {
	name: 'son',
	props: ['msg', 'fn']
}
</script>

子组件向父组件传值

$emit绑定一个自定义事件，当这个事件被执行的时就会将参数传递给父组件，而父组件通过v-on监听并接收参数。

（2）依赖注入 provide / inject（父子、祖孙）
provide / inject是Vue提供的两个钩子，和data、methods是同级的。并且provide的书写形式和data一样。
provide 钩子用来发送数据或方法
inject钩子用来接收数据或方法

provide() {
	return {
		num: this.num
	};
}

在子组件中：

inject: ['num']

还可以这样写，这样写就可以访问父组件中的所有属性：

provide() {
	return {
		app: this
	};
}
data() {
	return {
		num: 1
	};
}

inject: ['app'];
console.log(this.app.num)

注意： 依赖注入所提供的属性是非响应式的。

（3）ref / $refs （父子，兄弟）
ref：这个属性用在子组件上，它的引用就指向了子组件的实例。
可以通过实例来访问组件的数据和方法。

这种方式也是实现兄弟组件之间的通信。子组件1通过this.$emit通知父组件调用函数，父组件的函数里用this.$refs拿到子组件2的方法，这样就实现兄弟组件之间的通信。

在子组件中:
export default {
	data() {
		return {
			name: 'JavaScript'
		}
	},
	methods: {
		sayHello() {
			console.log('hello')
		}
	}
}


在父组件中：
<template>
	<child ref="child"></child>
</template>
import child from './child.vue';
export default {
	components: { child },
	mounted() {
		console.log(this.$refs.child.name); // JavaScript
		this.$refs.child.sayHello();
	}
}


（4）$parent / $children (父子)

使用$parent可以让组件访问父组件的实例
使用$children可以让组件访问子组件的实例
$children并不能保证顺序，并且访问的数据也不是响应式的。

<template>
	<div>
		<span>{{message}}</span>
		<p>{{parentVal}}</p>
	</div>
</template>
<script>
export default {
	data() {
		return {
			message: 'Vue'
		}
	},
	computed: {
		parentVal() {
			return this.$parent.msg;
		}
	}
}
</script>

// 父组件中
<template>
	<div class="hello_world">
		<div>{{msg}}</div>
		<child></child>
		<button @click="change">点击改变子组件值</button>
	</div>
</template>
<script>
import child from './child.vue'
export default {
	components: { child },
	data() {
		return {
			msg: 'Welcome'
		}
	},
	methods: {
		change() {
			// 获取到子组件
			this.$children[0].message = 'JavaScript'
		}
	}
}
</script>

通过$parent访问到的是上一级父组件的实例，可以使用$root来访问根组件的实例

在组件中使用$children拿到的是所有的子组件的实例，它是一个数组，并且是无序的

在根组件#app上拿$parent得到的是new Vue()的实例，在这实例上再拿$parent得到的是undefined，而在最底层的子组件拿$children是个空数组

$children 的值是数组，而$parent是个对象

（5）$attrs / $listeners (祖孙)

A父 - B父 - C父

A -> C 传递数据

如果使用事件总线，在多人开发或者项目较大的时候，维护起来很麻烦
如果使用Vuex，的确也可以，但是如果仅仅是传递数据，那可能就有点浪费了。

Vue引入了$attrs / $listeners，实现组件之间的跨代通信。

先来看一下inheritAttrs，它的默认值true，继承所有的父组件属性除props之外的所有属性；inheritAttrs：false 只继承class属性 。

$attrs：继承所有的父组件属性（除了prop传递的属性、class 和 style ），一般用在子组件的子元素上

$listeners：该属性是一个对象，里面包含了作用在这个组件上的所有监听器，可以配合 v-on="$listeners" 将所有的事件监听器指向这个组件的某个特定的子元素。（相当于子组件继承父组件的事件）

A组件（APP.vue):

<template>
	<div id="app">
		// 此处监听了两个事件，可以在B组件或者C组件中直接触发
		<child1 :p-child1="child1" :p-child2="child2" @test1="onTest1" @test2="onTest2" ></child1>
	</div>
</template>
import Child1 from './Child1.vue';
export default {
	components: { Child1 },
	methods: {
		onTest1() {
			console.log('test1 running');
		},
		onTest2() {
			console.log('test2 running');
		}
	}
}

B组件（Child1.vue）：
<template>
	<div class="child-1">
		<p>props: {{pChild1}}</p>
		<p>$attrs: {{$attrs}}</p>
		<child2 v-bind="$attrs" v-on="$listeners"></child2>
	</div>
</template>
<script>
import Child2 from './Child2.vue';
export default {
	props: ['pChild1'],
	components: { Child2 },
	inheritAttrs: false,
	mounted() {
		this.$emit('test1'); // 触发APP.vue中的test1方法
	}
}
</script>

C组件（Child2.vue）
<template>
	<div class="child-2">
		<p>props: {{pChild2}}</p>
		<p>$attrs: {{$attrs}}</p>
	</div>
</template>
export default {
	props: ['pChild2'],
	inheritAttrs: false,
	mounted() {
		this.$emit('test2'); // 触发
	}
}

（6）eventBus事件总线（$emit / $on）（任意组件通信）
eventBus事件总线适用于父子组件、非父子组件等之间的通信

创建事件中心管理组件之间的通信
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

（7）总结
（1）父子组件间通信

子组件通过 props 属性来接受父组件的数据，然后父组件在子组件上注册监听事件，子组件通过 emit 触发事件来向父组件发送数据。

通过 ref 属性给子组件设置一个名字。父组件通过 $refs 组件名来获得子组件，子组件通过 $parent 获得父组件，这样也可以实现通信。

使用 provide/inject，在父组件中通过 provide提供变量，在子组件中通过 inject 来将变量注入到组件中。不论子组件有多深，只要调用了 inject 那么就可以注入 provide中的数据。

（2）兄弟组件间通信

使用 eventBus 的方法，它的本质是通过创建一个空的 Vue 实例来作为消息传递的对象，通信的组件引入这个实例，通信的组件通过在这个实例上监听和触发事件，来实现消息的传递。

通过 $parent/$refs 来获取到兄弟组件，也可以进行通信。

（3）任意组件之间

使用 eventBus ，其实就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。

子组件可以直接改变父组件的数据吗？
子组件不可以直接改变父组件的数据。这样做主要是为了维护父子组件的单向数据流。每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。如果这样做了，Vue 会在浏览器的控制台中发出警告。

Vue提倡单向数据流，即父级 props 的更新会流向子组件，但是反过来则不行。这是为了防止意外的改变父组件状态，使得应用的数据流变得难以理解，导致数据流混乱。如果破坏了单向数据流，当应用复杂时，debug 的成本会非常高。

只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

vue的声明周期常见的主要分为4大阶段8大钩子函数

第一阶段：创建前 / 后

beforeCreate（创建前） ：数据观测和初始化事件还未开始，此时 data 的响应式追踪、event/watcher 都还没有被设置，也就是说不能访问到data、computed、watch、methods上的方法和数据。

created（创建后） ：实例创建完成，实例上配置的 options 包括 data、computed、watch、methods 等都配置完成，但是此时渲染得节点还未挂载到 DOM，所以不能访问到 $el 属性。

第二阶段: 渲染前 / 后

beforeMount（挂载前） ：在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。此时还没有挂载html到页面上。

mounted（挂载后） ：在el被新创建的 vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html 页面中。此过程中进行ajax交互。

第三阶段: 更新前 / 后

beforeUpdate（更新前） ：响应式数据更新时调用，此时虽然响应式数据更新了，但是对应的真实 DOM 还没有被渲染。

updated（更新后） ：在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。此时 DOM 已经根据响应式数据的变化更新了。调用时，组件 DOM已经更新，所以可以执行依赖于DOM的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。

第四阶段: 销毁前 / 后

beforeDestroy（销毁前） ：实例销毁之前调用。这一步，实例仍然完全可用，this 仍能获取到实例。

destroyed（销毁后） ：实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务端渲染期间不被调用。

另外还有 keep-alive 独有的生命周期，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 activated 钩子函数。

errorCapured钩子，当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

加载渲染过程：

父组件 beforeCreate
父组件 created
父组件 beforeMount
子组件 beforeCreate
子组件 created
子组件 beforeMount
子组件 mounted
父组件 mounted

更新过程：

父组件 beforeUpdate
子组件 beforeUpdate
子组件 updated
父组件 updated

销毁过程：

父组件 beforeDestroy
子组件 beforeDestroy
子组件 destroyed
父组件 destoryed

created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。

mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。

一般在哪个生命周期请求异步数据
我们可以在钩子函数created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面加载时间，用户体验更好；

SSR不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。

组件缓存 keep-alive
组件缓存

组件的缓存可以在进行动态组件切换的时候对组件内部数据进行缓存,而不是走销毁流程

使用场景: 多表单切换,对表单内数据进行保存

keep-alive的参数(include,exclude)
include(包含): 名称匹配的组件会被缓存-->include的值为组件的name。
exclude(排除): 任何名称匹配的组件都不会被缓存。
max - 数量 决定最多可以缓存多少组件。

keep-alive的使用
搭配<component></component>使用
搭配路由使用 ( 需配置路由meta信息的keepAlive属性 )
清除缓存组件
在组件跳转之前使用后置路由守卫判断组件是否缓存
( beforeRouteLeave( to, from, next ){ from.meta.keepAlive = false }

使用keep-alive会将数据保留在内存中，如果要在每次进入页面的时候获取最新的数据，需要在 activated阶段获取数据，承担原来created钩子函数中获取数据的任务。


activated	deactivated
在 keep-alive 组件激活时调用	在keep-alive 组件停用时调用
该钩子函数在服务器端渲染期间不被调用	该钩子在服务器端渲染期间不被调用


使用 exclude 排除之后，就算被包裹在 keep-alive 中，这两个钩子函数依然不会被调用！在服务端渲染时，此钩子函数也不会被调用。

设置了缓存的组件钩子调用情况：

第一次进入：beforeRouterEnter ->created->…->activated->…->deactivated> beforeRouteLeave

后续进入时：beforeRouterEnter ->activated->deactivated> beforeRouteLeave

keep-alive主要流程
判断组件 name ，不在 include 或者在 exclude 中，直接返回 vnode，说明该组件不被缓存。
获取组件实例 key ，如果有获取实例的 key，否则重新生成。
key生成规则，cid +"∶∶"+ tag ，仅靠cid是不够的，因为相同的构造函数可以注册为不同的本地组件。
如果缓存对象内存在，则直接从缓存对象中获取组件实例给 vnode ，不存在则添加到缓存对象中。5.最大缓存数量，当缓存组件数量超过 max 值时，清除 keys 数组内第一个组件

slot是什么
slot又名插槽，是Vue的内容分发机制，组件内部的模板引擎使用slot元素作为承载分发内容的出口。插槽slot是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。

通过插槽可以让用户可以拓展组件，去更好地复用组件和对其做定制化处理

通过slot插槽向组件内部指定位置传递内容，完成这个复用组件在不同场景的应用

比如布局组件、表格列、下拉选、弹框显示内容等

Vue为什么采用异步渲染呢？
Vue 是组件级更新，如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染，所以为了性能，Vue 会在本轮数据更新后，在异步更新视图。核心思想nextTick 。

dep.notify（） 通知 watcher进行更新，subs[i].update 依次调用 watcher 的update ，queueWatcher 将watcher 去重放入队列， nextTick（flushSchedulerQueue ）在下一tick中刷新watcher队列（异步）。

## $nextTick 原理及作用
其实一句话就可以把$nextTick这个东西讲明白：就是你放在$nextTick当中的操作不会立即执行，而是等数据更新、DOM更新完成之后再执行，这样我们拿到的肯定就是最新的了。

Vue的响应式并不是只数据发生变化之后，DOM就立刻发生变化，而是按照一定的策略进行DOM的更新。

DOM更新有两种选择，一个是在本次事件循环的最后进行一次DOM更新，另一种是把DOM更新放在下一轮的事件循环当中。Vue优先选择第一种，只有当环境不支持的时候才触发第二种机制。

虽然性能上提高了很多，但这个时候问题就出现了。我已经把数据改掉了，但是它的更新异步的，而我在获取的时候，它还没有来得及改，这个时候就需要用到nextTick

原理：

Vue 的 nextTick 其本质是对 JavaScript 执行原理 EventLoop 的一种应用。

Vue2刚开始的时候, $nextTick是宏任务(setTimeout)，但是宏任务的性能太差。
后来改成了微任务Mutation Observer，但是还是有一些问题：
	速度太快了，在一些特殊场景下，DOM还没更新就去获取了
	兼容性不好，很多浏览器不支持
后来又更新成了微宏并行阶段：先判断是否支持Mutation Observer，如果支持就使用，否则使用宏任务
Vue2.5版本之后，修复了微任务的那些问题，目前最新的$nextTick采用的是纯微任务。

在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的DOM结构的时候，这个操作就需要方法在nextTick()的回调函数中。

在vue生命周期中，如果在created()钩子进行DOM操作，也一定要放在nextTick()的回调函数中。

因为在created()钩子函数中，页面的DOM还未渲染，这时候也没办法操作DOM，所以，此时如果想要操作DOM，必须将操作的代码放在nextTick()的回调函数中。

##描述下Vue2的自定义指令

钩子函数：指令定义对象提供钩子函数
bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
inSerted：被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。
update：所在组件的VNode更新时调用，但是可能发生在其子VNode更新之前调用。指令的值可能发生了改变，也可能没有。但是可以通过比较更新前后的值来忽略不必要的模板更新。
ComponentUpdate：指令所在组件的 VNode及其子VNode全部更新后调用。
unbind：只调用一次，指令与元素解绑时调用。

钩子函数的参数 ：

name: 指令名，不包括 v- 前缀。
value: 指令的绑定值， 例如：v-my-directive="1 + 1", value 的值是2。
oldValue: 指令绑定的前一个值，仅在 update 和 componentUpdated钩子中可用。无论值是否改变都可用。
expression: 绑定值的表达式或变量名。例如 v-my-directive="1 + 1",    expression 的值是 "1 + 1"。
arg: 传给指令的参数。例如 v-my-directive:foo， arg 的值是 "foo"。
modifiers: 一个包含修饰符的对象。例如：v-my-directive.foo.bar, 修饰符对象 modifiers 的值是 { foo: true, bar: true }。
el：指令所绑定的元素，可以用来直接操作 DOM
bing：一个对象，包含以下属性：
vnode：编译生成的虚拟节点
oldVnode：上一个虚拟节点（更新钩子函数中才有用）

## data为什么是一个函数而不是对象

对象为引用类型，当复用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象（Object的实例），引用地址不同，则不会出现这个问题。

## 动态给vue的data添加一个新的属性时会发生什么？怎样解决？
问题: 数据虽然更新了, 但是页面没有更新

原因:

vue2是用过Object.defineProperty实现数据响应式
当我们访问定义的属性或者修改属性值的时候都能够触发setter与getter
但是我们为obj添加新属性的时候，却无法触发事件属性的拦截
原因是一开始obj的要定义的属性被设成了响应式数据，而新增的属性并没有通过Object.defineProperty设置成响应式数据

解决方案:

Vue.set()
通过Vue.set向响应式对象中添加一个property，并确保这个新 property同样是响应式的，且触发视图更新

Object.assign()
直接使用Object.assign()添加到对象的新属性不会触发更新
应创建一个新的对象，合并原对象和混入对象的属性

$forceUpdate
如果你发现你自己需要在 Vue中做一次强制更新，99.9% 的情况，是你在某个地方做错了事

$forceUpdate迫使Vue 实例重新渲染
PS：仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

总结

如果为对象添加少量的新属性，可以直接采用Vue.set()
如果需要为新对象添加大量的新属性，则通过Object.assign()创建新对象
如果你实在不知道怎么操作时，可采取$forceUpdate()进行强制刷新 (不建议)

PS：vue3是用过proxy实现数据响应式的，直接动态添加新属性仍可以实现数据响应式

##Vue data 中某一个属性的值发生改变后，视图会立即同步执行重新渲染吗
不会立即同步执行重新渲染。Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化， Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。

如果同一个watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环tick中，Vue 刷新队列并执行实际（已去重的）工作。

##vue如何监听(检测)对象或者数组某个属性的变化
当在项目中直接设置数组的某一项的值，或者直接设置对象的某个属性值，这个时候，你会发现页面并没有更新。这是因为Object.defineProperty()限制，监听不到变化。

解决方式：

this.$set(你要改变的数组/对象，你要改变的位置/key，你要改成什么value)


调用以下几个数组的方法

splice()、 push()、pop()、shift()、unshift()、sort()、reverse()

vue源码里缓存了array的原型链，然后重写了这几个方法，触发这几个方法的时候会observer数据，意思是使用这些方法不用我们再进行额外的操作，视图自动进行更新。推荐使用splice方法会比较好自定义,因为splice可以在数组的任何位置进行删除/添加操作

## vm.$set 的实现原理是：

如果目标是数组，直接使用数组的 splice 方法触发相应式；

如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

##assets和static的区别
相同点： assets 和 static 两个都是存放静态资源文件。项目中所需要的资源文件图片，字体图标，样式文件等都可以放在这两个文件下，这是相同点

不相同点： assets 中存放的静态资源文件在项目打包时，也就是运行 npm run build 时会将 assets 中放置的静态资源文件进行打包上传，所谓打包简单点可以理解为压缩体积，代码格式化。而压缩后的静态资源文件最终也都会放置在 static 文件中跟着 index.html 一同上传至服务器。static 中放置的静态资源文件就不会要走打包压缩格式化等流程，而是直接进入打包好的目录，直接上传至服务器。因为避免了压缩直接进行上传，在打包时会提高一定的效率，但是 static 中的资源文件由于没有进行压缩等操作，所以文件的体积也就相对于 assets 中打包后的文件提交较大点。在服务器中就会占据更大的空间。

建议： 将项目中 template需要的样式文件js文件等都可以放置在 assets 中，走打包这一流程。减少体积。而项目中引入的第三方的资源文件如iconfoont.css 等文件可以放置在 static 中，因为这些引入的第三方文件已经经过处理，不再需要处理，直接上传。

##Vue的性能优化(项目优化)有哪些 
（1）编码阶段
尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher
v-if和v-for不能连用
如果需要使用v-for给每项元素绑定事件时使用事件代理
SPA 页面采用keep-alive缓存组件
在更多的情况下，使用v-if替代v-show
key保证唯一
使用路由懒加载、异步组件
防抖、节流
第三方模块按需导入
长列表滚动到可视区域动态加载
图片懒加载

（2）SEO优化
预渲染
服务端渲染SSR

（3）打包优化
压缩代码
Tree Shaking/Scope Hoisting
使用cdn加载第三方模块
多线程打包happypack
splitChunks抽离公共文件
sourceMap优化

（4）用户体验
骨架屏
PWA
还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。

##Vue的template模版编译原理
vue中的模板template无法被浏览器解析并渲染，因为这不属于浏览器的标准，不是正确的HTML语法，所有需要将template转化成一个JavaScript函数，这样浏览器就可以执行这一个函数并渲染出对应的HTML元素，就可以让视图跑起来了，这一个转化的过程，就成为模板编译。模板编译又分三个阶段，解析parse，优化optimize，生成generate，最终生成可执行函数render。

解析阶段：使用大量的正则表达式对template字符串进行解析，将标签、指令、属性等转化为抽象语法树AST。

优化阶段：遍历AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行diff比较时，直接跳过这一些静态节点，优化runtime的性能。

生成阶段：将最终的AST转化为render函数字符串。

##template和jsx的有什么分别？
对于 runtime 来说，只需要保证组件存在 render 函数即可，而有了预编译之后，只需要保证构建过程中生成 render 函数就可以。在 webpack 中，使用vue-loader编译.vue文件，内部依赖的vue-template-compiler模块，在 webpack 构建过程中，将template预编译成 render 函数。与 react 类似，在添加了jsx的语法糖解析器babel-plugin-transform-vue-jsx之后，就可以直接手写render函数。

所以，template和jsx的都是render的一种表现形式，不同的是：JSX相对于template而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。

##讲讲什么是 JSX ？
jsx是JavaScript的一种语法扩展，它跟模板语言很接近，但是它充分具备JavaScript的能力 当 Facebook 第一次发布 React 时，他们还引入了一种新的 JS 方言 JSX，将原始 HTML 模板嵌入到 JS 代码中。JSX 代码本身不能被浏览器读取，必须使用Babel和webpack等工具将其转换为传统的JS。JSX中的标签可以是单标签，也可以是双标签，但必须保证标签是闭合的。


##对SSR的理解
SSR也就是服务端渲染，也就是将Vue在客户端把标签渲染成HTML的工作放在服务端完成，然后再把html直接返回给客户端

SSR的优势：
更好的SEO
首屏加载速度更快

SSR的缺点：
开发条件会受到限制，服务器端渲染只支持beforeCreate和created两个钩子；
当需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于Node.js的运行环境；
更多的服务端负载。

##vue初始化页面闪动问题
使用vue开发时，在vue初始化之前，由于div是不归vue管的，所以我们写的代码在还没有解析的情况下会容易出现花屏现象，看到类似于{{message}}的字样，虽然一般情况下这个时间很短暂，但是还是有必要让解决这个问题的。

首先：在css里加上以下代码：
[v-cloak]{display: none;}
如果没有彻底解决问题，则在根元素加上style="display: none;" :style="{display: 'block'}"

##Promise 是什么？
具体表达：

从语法上来说：Promise 是一个构造函数
从功能上来说：Promise 对象用来封装一个异步操作并可以获取其结果






