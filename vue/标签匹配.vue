<template>
	<div id="app">
		<input type="text" v-info v-data/>
	</div>
</template>

<script>
	// 注册一个全局自定义指令 v-focus
	Vue.directive('info', {
		// 当被绑定的元素插入到DOM中时
	})
</script>

<style>
</style>