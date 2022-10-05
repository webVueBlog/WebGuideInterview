// flow
import { parse } from './parser/index'; // 解析
import { optimize } from './optimizer'; // 优化
import { generate } from './codegen/index'; // 生成
import { createCompilerCreator } from './create-compiler'

/**
 * createCompilerCreator allows creating compilers that use alternative
 * createCompilerCreator 允许创建使用 alternative 的编译器
 * parser/optimizer/codegen, e.g the SSR optimizing compiler.
 * parser/optimizer/codegen，例如SSR优化编译器
 * Here we just export a default
 * 这里我们只是默认部分导出一个默认编译器
 */

/**
 * 在这之前做的所有的事情，只有一个目的，就是为了构建平台特有的编译选项(options)，比如web平台
 * 1. 将html模板解析成ast
 * 2. 对ast树进行静态标记
 * 3. 将ast生成渲染函数
 *  
 * 静态渲染函数放到 code.staticRenderFns 数组中
 * code.render 为动态渲染函数
 * 在将来渲染时执行渲染函数得到 vnode
 */
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 调用 parse 解析函数将字符串模板解析成抽象语法树(AST)
  
  /**
   * 将模板解析为AST，每个节点的 ast 对象上都设置了元素的所有信息，比如，标签信息，属性信息，插槽信息，父节点，子节点等
   * 具体有哪些属性，查看 options.start 和 options.end 这两个处理开始和结束标签的方法
   */
  const ast = parse(template.trim(), options)
  // 调用 optimize 优化函数优化 ast
  // 为节点加上 static 和 staticRoot 属性，表示其记子节点是否都为”普通标签“
  
  /**
   * 优化，遍历 ast 抽象语法树 ，为每个节点做静态标记
   * 标记每个节点是否为静态节点，然后进一步标记出静态根节点
   * 这样在后续更新中就可以跳过这些静态节点了
   * 标记静态根 用于生成渲染函数阶段，生成静态根节点的渲染函数
   */
  if (options.optimize !== false) {
	// 优化 optimize 函数优化 ast 抽象语法树，参数
    optimize(ast, options)
  }
  // 调用 generate 函数将 ast 编译成渲染函数数字字符串（真正的变成 render 的过程是在
  // compileToFunctions
  // ast 编译成渲染函数数字字符串
  
  /**
   * 代码生成，将 ast 转换成可执行的 render 函数的字符串形式
   */
  // code = {
	 //  render: `with(this){return ${_c(tag, data, children, normalizationType)}}`,
	 //  staticRenderFns: [_c(tag, data, children, normalizationType), ...]
  // }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});
