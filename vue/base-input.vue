<template>
	<div id="demo">
		<li :class="[isClass ? 'class-a' : 'class-b']" v-if="index" v-for="(item, index) in list" v-userdefined>
			<input type="text" v-model="item.url"/>
			<input type="checkbox" :value="index" v-model="checkbox"/>
		</li>
		<select v-model="select">
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
		</select>
	</div>
	<base-input v-model="lovingVue"></base-input>

</template>

<script>
	// 注册一个全局自定义指令 v-focus
	Vue.directive('userdefined', {
		// 当被绑定的元素插入到 DOM 中时...
		inserted: function(el) {
			// 聚焦元素
			el.addEventListener('click', function() {
				alert(1)
			});
		}
	})
	
	// 关键是在 $emit('change', $event.target.checked)
	// change 或者 input 就是更新 model 事件
	Vue.component('base-input', {
		model: {
			prop: 'text',
			event: 'input',
		},
		props: {
			text: String
		},
		template: `<iinput type="text" v-bind:value="text" v-on:input="$emit('input', $event.target.value)" />`
	})
	
	new Vue({
		el: '#demo',
		comments: true,
		data: {
			
		},
		methods: {
			
		},
		beforeCreate() {
			
		},
		created() {
			
		},
		beforeMount() {
			
		},
		mounted() {
			// 挂载元素，获取到DOM节点
		},
		beforeUpdate() {
			
		},
		updated() {
			// 挂载元素，获取到DOM节点
		},
		beforeDestroy() {
			
		},
		destroyed() {
			
		},
	})
</script>

<style>
</style>