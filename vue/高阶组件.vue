<template>
	<div id="app">
		<input v-model="query"/>
		<my-transition :query="query" :list="list">
			<li
				v-for="(item, index) in computedList"
				:key="item.msg"
				:data-index="index"
				{{item.msg}}
			>
			</li>
		</my-transition>
	</div>
</template>

<script>
	Vue.component('my-transition', {
		functional: true,
		render: function(h, ctx) {
			var data = {
				props: {
					tag: 'ul',
					css: false
				},
				on: {
					beforeEnter: function(el) {
						el.style.opacity = 0
						el.style.height = 0
					},
					enter: function(el, done) {
						var delay = el.dataset.index * 150
						setTimeout(function() {
							Volocity(el, 
							{opacity: 1, height: '1.6em'},
							{complete: done})
						}, delay)
					},
					leave: function(el, done) {
						var delay = el.dataset.index * 150
						setTimeout(function() {
							Velocity(el, 
							{opacity: 0, height: 0},
							{complete: done})
						}, delay)
					}
				}
			}
			return h('transition-group', data, ctx.children)
		},
		props: ['query', 'list']
	})
	
	var app = new Vue({
		
	})
</script>

<style>
</style>