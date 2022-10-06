// @flow

import { makeMap, isBuiltInTag, cached, no } from 'shared/util'

let isStaticKey
let isPlatformReservedTag

const genStaticKeysCached = cached(genStaticKeys)

/**
 * 优化的目标：遍历生成的模板AST树，并检测纯静态的子树，即从不需要更改的DOM
 * 一旦我们检测到这些子树，我们可以：
 * 1.把它们提升为常熟，这样我们就不再需要它们了
 * 在每次重渲染时为它们创建新节点。
 * 2.在补丁过程中完全跳过它们。
 */

/**
 * 优化：
 * 遍历AST，标记每个节点时静态节点还是动态节点，然后标记静态根节点
 * 这样在后续更新的过程中就不需要再关注这些节点
 */
export function optimize(root: ?ASTElement, options: CompilerOptions) {
	if (!root) return
	/**
	 * options.staticKeys = 'staticClass,staticStyle'
	 * isStaticKey = function(val) { return map[val] }
	 */
	// isStaticKey 会变成一个function，输入key后判断其是否为map中设定的
	isStaticKey = genStaticKeysCached(options.staticKeys || '')
	// 平台保留标签
	// 检查给定的标签是否是保留的标签。（HTML标签或SVG相关标签）
	isPlatformReservedTag = options.isReservedTag || no
	// 遍历所有节点，给每个节点设置 static 属性，标识其是否为静态节点
	// first pass: mark all non-static nodes.
	// "!或许!" 会递归某些节点，对其和其子元素都进行 markStatic 操作
	markStatic(root)
	/**
	 * 进一步标记静态根，一个节点要成为静态根节点，需要具体以下条件：
	 * 节点本身是静态节点，而且有子节点，而且子节点不只是一个文本节点，则标记为静态根
	 * 静态根节点不能只有静态文本的子节点，因为这样收益太低，这种情况下始终更新它就好了
	 */
	// second pass: mark static roots.
	// "!或许!" 会递归某些节点，对其和其子元素都进行 markStaticRoots 操作
	markStaticRoots(root, false)
}

function genStaticKeys(keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
    (keys ? ',' + keys : '')
  );
}

/**
 * 在所有节点上设置 static 属性，用来标识是否为静态节点
 * 注意：如果有子节点为动态节点，则父节点也被认为是动态节点
 * @param {*} node
 * @returns
 */
function markStatic(node: ASTNode) {
	/**
	 * 如果type为3(纯文本或注释内容)，或者pre为true，或者
	 * 没有v-bind，v-for，v-if，且tag不为slot或component，且tag为HTML标签或SVG相关标签。
	 * 且祖先元素不为tag，template带for属性，且属性的每一项都 isStaticKey
	 */
	// 通过 node.static 来标识节点是否为 静态节点
	node.static = isStatic(node)
	// 如果时标签节点
	if (node.type === 1) {
		/**
		 * do not make componentslot conent static. this avoids
		 * 不将组件槽内容设置为静态。这就避免了
		 * 1. components not able to mutate slot nodes
		 * 1。组件不能改变槽位节点
		 * 2. static slot content fails for hot-reloading
		 * 2。静态槽内容在热重新加载时失败
		 */
		
		/**
		 * 不要将组件的插槽内容设置为静态节点，这样可以避免
		 * 1. 组件不能改变插槽节点
		 * 2. 静态插槽内容在热重载时失败
		 */
		
		/**
		 * 如果不是HTML标签或者SVG相关标签，且tag不为slot，并且inline-template属性为null
		 * 如果tag为slot，则可能会被替换为插槽的其他内容，因此无法确定替换过后的标签为什么，不可直接退出，inline-template类似
		 * 可以简单理解为只要元素和（HTML标签或SVG相关标签）不沾边，那么不用再对其后代元素进行
		 * markStatic操作
		 */
		if (
			// HTML标签或SVG相关标签
			!isPlatformReservedTag(node.tag) &&
			node.tag !== 'slot' &&
			node.attrsMap['inline-template'] = null
		) {
			// 递归终止条件，如果节点不是平台保留标签 && 也不是 slot 标签 && 也不是内联模板，则直接结束
			return
		}
		/**
		 * 递归遍历其后代元素的每一项，若全部都为static，则其才为static
		 * 后代元素的形式有两种：children属性中，ifConditions属性中
		 */
		// 遍历子节点，递归调用 markStatic 来标记这些子节点的 static 属性
		for (let i = 0, l = node.children.length; i < l; i++) {
			const child = node.children[i]
			markStatic(child)
			// 如果子节点是非静态节点，则将父节点更新为非静态节点
			if (!child.static) {
				node.static = false
			}
		}
		// 如果节点存在 v-if, v-else-if, v-else 这些指令，则依次标记 block 中节点的 static 属性
		if (node.ifConditions) {
			for (let i = 1, l = node.ifConditions.length; i < l; i++) {
				const block = node.ifConditions[i].block
				markStatic(block)
				if (!block.static) {
					node.static = false
				}
			}
		}
	}
}

/**
 * 进一步标记静态根，一个节点要成为静态根节点，需要具体以下条件：
 * 节点本身是静态节点，而且有子节点，而且子节点不只是一个文本节点，则标记为静态根
 * 静态根节点不能只有静态文本子节点，因为这样收益太低，这种情况下始终更新它就好了
 * @param { ASTElement } node 当前节点
 * @param { boolean } isInFor 当前节点是否被包裹在 v-for 指令所在的节点内 
 */
function markStaticRoots(node: ASTNode, isInFor: boolean) {
	if (node.type === 1) {
		if (node.static || node.once) {
			// 节点是静态的 或者 节点上有 v-once 指令，标记 node.staticInFor = true or false
			// 该节点是否存在 for 属性
			node.staticInFor = isInFor
		}

		/**
		 * For a node to qualify as a static root, it should have children that
		 * are not just static text. Otherwise the const of hoisting out will
		 * outweigh the benefits and it's better off to just always render it fresh.
		 * 
		 * 一个节点要符合静态根的条件，它应该有子节点that
		 * 不仅仅是静态文本。否则吊装的费用将会增加
		 * 大于好处，最好总是保持新鲜。
		 */
		
		/**
		 * 如果此 root的static为true，并且存在子节点，子节点不为文本节点
		 * 这是一个先序遍历，若找到第一个static为true，且存在子节点且子节点不为唯一的文本节点
		 * 则staticRoot置为true，并取消对其子节点的递归
		 */
		if (node.static && node.children.length && !(
			node.children.length === 1 &&
			node.children[0].type === 3
		)) {
			// 节点本身是静态节点，而且有子节点，而且子节点不只是一个文本节点，则标记为静态根 =》 node.staticRoot = true, 否则为非静态根
			node.staticRoot = true
			return
		} else {
			node.staticRoot = false
		}
		// 当前节点不是静态根节点的时候，递归遍历其子节点，标记静态根
		if (node.children) {
			for (let i = 0, l = node.children.length; i < l; i++) {
				markStaticRoots(node.children[i], isInFor || !!node.for)
			}
		}
		// 如果节点存在 v-if, v-else-if, v-else 指令，则为block节点标记静态根
		if (node.ifConditions) {
			for (let i = 1, l = node.ifConditions.length; i < l; i++) {
				markStaticRoots(node.ifConditions[i].block, isInFor)
			}
		}
	}
}

/**
 * 判断节点是否为静态节点：
 * 通过自定义的 node.type 来判断
 * 表达式 => 动态
 * 文本 => 静态
 * 凡是有 v-bind, v-if, v-for 等指令的都属于动态节点
 * 组件为动态节点
 * 父节点为含有 v-for 指令的 template 标签，则为动态节点
 * @param {*} node
 * @returns boolean
 */
/**
 * 如果type为3(纯文本或注释内容)，或者pre为true，且
 * 没有v-bind，v-for，v-if，且tag不为slot或component，且tag为HTML标签或SVG相关标签,
 * 且祖先元素不为tag:template带for属性，且属性的每一项都isStaticKey
 */
function isStatic(node: ASTNode): boolean {
	if (node.type === 2) {
		// expression
		// 比如：{{ msg }}
		return false
	}
	if (node.type === 3) {
		// text
		return true
	}
	return !!(node.pre || (
		!node.hasBindings && // no dynamic bindings
		!node.if && !node.for && // not v-if or v-for or v-else
		// slot 和 component
		!isBuiltInTag(node.tag) && // not a built-in
		// HTML标签或SVG相关标签
		!isPlatformReservedTag(node.tag) && // not a component
		!isDirectChildOfTemplateFor(node) &&
		Object.keys(node).every(isStaticKey)
	))
}

function isDirectChildOfTemplateFor(node: ASTElement): boolean {
	while (node.parent) {
		node = node.parent
		// 如果某个祖先元素节点不为 template, return false
		if (node.tag !== 'template') {
			return false
		}
		// 如果某个祖先节点存在 for, return true
		if (node.for) {
			return true
		}
	}
	// 如果遍历完成还没找到带 for 且为 template 的祖先元素，返回 false
	return false
}


