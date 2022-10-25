# css

min-width: 100%  （当前屏幕宽度）
min-width: 100vw （扩展屏幕宽度）

在标准的盒子模型中，width 指 content 部分的宽度。
在 IE 盒子模型中，width 表示 content+padding+border 这三个部分的宽度。

BFC的原理布局规则

内部的Box会在垂直方向，一个接一个地放置
Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反
BFC的区域不会与float box重叠
BFC是一个独立容器，容器里面的子元素不会影响到外面的元素
计算BFC的高度时，浮动元素也参与计算高度
元素的类型和display属性，决定了这个Box的类型。不同类型的Box会参与不同的Formatting Context。

如何创建BFC？

根元素，即HTML元素
float的值不为none
position为absolute或fixed
display的值为inline-block、table-cell、table-caption
overflow的值不为visible

BFC的使用场景

去除边距重叠现象
清除浮动（让父元素的高度包含子浮动元素）
避免某元素被浮动元素覆盖
避免多列布局由于宽度计算四舍五入而自动换行

js 获取dom元素距离顶部的位置
document.getElementById('filter').getBoundingClientRect().top











