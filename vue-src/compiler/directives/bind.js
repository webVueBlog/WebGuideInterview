/* @flow */

/**
 * <div v-bind={params:params, name:name}> </div>
 * _b函数：bindObjectProps
 * src\core\instance\render-helpers\bind-object-props.js
 * 其作用是将不同的属性名添加至不同的位置。如class，style会直接添加至data
 * 指定prop或者其必须为prop的属性，添加至domProps，其他情况添加至attrs
 * 注意：其优先级低于单独绑定的属性，也就是之前没有出现过的属性名，才会添加，否则则忽略。如：
 * <div :params="paramsA" v-bind={params:paramsB, name:name} > </div>
 * 为元素添加wrapData方法
 */
export default function bind (el: ASTElement, dir: ASTDirective) {
  el.wrapData = (code: string) => {
    return `_b(${code},'${el.tag}',${dir.value},${
      dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
    }${
      dir.modifiers && dir.modifiers.sync ? ',true' : ''
    })`
  }
}
