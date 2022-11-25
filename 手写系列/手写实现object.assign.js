/**
实现object.assign

target目标对象
...source源对象
可以是一个或多个，返回修改后的目标对象。

浅拷贝Object.assign

主要是将所有可枚举属性的值从一个或多个源对象中复制到目标对象，同时返回目标对象。语法：

Object.assign(target, ...source);
其中target是目标对象，...source是源对象，可以是一个或多个，返回修改后的目标对象。如果目标对象和源对象具有相同属性，则目标对象的该属性将会被源对象的相同属性覆盖，后来的源对象的属性将会类似地覆盖早先的属性。

浅拷贝就是拷贝对象的第一层的基本类型值，以及第一层的引用类型地址。

Object.assign模拟实现
1. 判断原生Object是否支持该函数，如果不存在的话创建一个函数assign，并使用Object.defineProperty将该函数绑定到Object上。
2. 判断参数是否正确（目标对象不能为空，我们可以直接设置{}传递进去，但必须设置值）。
3. 使用Object()转成对象，并保存为newObj，最后返回这个对象。
4. 使用for...in循环遍历出所有可枚举的自有属性，并复制给新的目标对象（hasOwnProperty返回非原型链上的属性）
 */

const assign = (target, ...sources) => {
 if (target === null) {
  throw new TypeError('无法将 null 转换为对象');
 }
 // 基本类型包装成对象
 const newObj = Object(target);
 for (let i = 0; i < sources.length; i++) {
  const source = sources[i]
  // 过滤掉 null 和 undefined
  if (source) {
   // Object.assign 方法只会拷贝源对象，可枚举的 和 自身的 属性到目标对象
   // 首先获取所有可枚举的属性
   for (let key in source) {
    // 然后，检查是否在目标对象的自身的属性
    // 由于目标对象可能是由 Object.create(null) 构建
    // 所以这里不可以直接使用 source.hasOwnProperty(key)
    if (Object.prototype.hasOwnProperty.call(source, key)) {
     // 覆盖目标对象中的属性
     newObj[key] = source[key];
    }
   }
  }
 }
 return newObj;
}