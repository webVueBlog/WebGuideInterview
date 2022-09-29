<template>
</template>

<script>
	// 注册一个全局自定义指令 v-userdefined
	Vue.directive('userdefined', {
		// 当被绑定的元素插入到 DOM 中时。。。
		inserted: function (el) {
			// 聚焦元素
			el.addEventListener('click', function() {
				alert(1)
			})
		}
	})
	
	// 创建一个vue的实例
	new Vue({
		el: '#demo',
		data: {
			userDefined: 'userDefined',
			list: []
		},
		methods: {
			clickEvent() {}
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