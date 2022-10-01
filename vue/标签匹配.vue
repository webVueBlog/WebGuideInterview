<template>
	<div id="app">
		<input type="text" v-info v-data/>
	</div>
</template>

<script>
	// 注册一个全局自定义指令 v-focus
	Vue.directive('info', {
		// 当被绑定的元素插入到DOM中时...
		inserted: function(el) {
			el.addEventListener('change', function() {
				console.log(this.value)
			}, false)
		}
	})
	
	// 注册一个全局自定义指令 v-focus
	Vue.directive('data', {
		// 当被绑定的元素插入到DOM中时...
		inserted: function(el) {
			el.addEventListener('change', function() {
				console.log(this.value)
			}, false)
		}
	})
	
	new Vue({
		el: '#app',
		data: {
			message: 'Hello'
		},
		directives: {
			focus: {
				// 指令的定义
				inserted: function(el) {
					el.focus()
				}
			}
		}
	})
</script>

<style>
</style>