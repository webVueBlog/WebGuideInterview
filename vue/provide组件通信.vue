<template>
	<div>
		{{ message }}
		<div v-for="(item, index) in list"></div>
	</div>
</template>

<script>
	Vue.component('button-counter', {
		props: ['id'],
		functional: true,
		inject: ['foo'],
		data: function() {
			return {
				count: 0
			}
		},
		mounted: () => {
			// 挂载元素，获取到DOM节点
		},
		template: '<button>按钮</button>'
	})
	
	new Vue({el: '#components-demo'})
	
	var app = new Vue({
		provide: {
			foo: 'bar'
		},
		beforeCreate() {
			
		},
		created() {
			
		},
		beforeMount() {
			
		},
		mounted() {
			setTimeout(() => {
				console.log('xxx')
			})
		},
		beforeUpdate() {
			
		},
		updated() {
			
		},
		beforeDestroy() {
			
		},
		destroyed() {
			
		}
	})
</script>

<style>
</style>