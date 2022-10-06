/* @flow */

import { warn } from 'core/util/index'

/**
 * 这种形式的事件绑定，是不可以带修饰符的：
 * <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
 * 注意：v-on在parse的时候就已经处理过一次，但是其只会处理 v-on: 或者 @ 的事件绑定
 * 而此处的 v-on 单独出现。因此并不会在parse解析的时候被处理，而是放在了directives 的generate中再做处理。 v-bind类似。
 */

// 简而言之，就是vue区别对待了以下这两种语法：
// v-on:click="handler" | @click="handler"  与  v-on="{click:handler,mousemove:moveHandler}"
// v-bind:params="params" | :params="params"  与  v-bind="{params:params}"
export default function on (el: ASTElement, dir: ASTDirective) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn(`v-on without argument does not support modifiers.`)
  }
  el.wrapListeners = (code: string) => `_g(${code},${dir.value})`
}
