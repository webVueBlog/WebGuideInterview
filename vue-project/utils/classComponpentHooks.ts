import Component from 'vue-class-component';
// 组件内的守卫
Component.registerHooks([ 
	// 组件内的守卫
	'beforeRouteEnter',
	'beforeRouteLeave',
	'beforeRouteUpdate'
])
