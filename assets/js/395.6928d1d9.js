(window.webpackJsonp=window.webpackJsonp||[]).push([[395],{988:function(s,n,t){"use strict";t.r(n);var a=t(6),r=Object(a.a)({},(function(){var s=this,n=s.$createElement,t=s._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"_4-median-of-two-sorted-arrays"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-median-of-two-sorted-arrays"}},[s._v("#")]),s._v(" "),t("a",{attrs:{href:"https://leetcode.com/problems/median-of-two-sorted-arrays/submissions/",target:"_blank",rel:"noopener noreferrer"}},[s._v("4. Median of Two Sorted Arrays"),t("OutboundLink")],1)]),s._v(" "),t("h2",{attrs:{id:"description"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#description"}},[s._v("#")]),s._v(" Description")]),s._v(" "),t("p",[s._v("Difficulty: "),t("strong",[s._v("Hard")])]),s._v(" "),t("p",[s._v("Related Topics: "),t("a",{attrs:{href:"https://leetcode.com/tag/array/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Array"),t("OutboundLink")],1),s._v(", "),t("a",{attrs:{href:"https://leetcode.com/tag/binary-search/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Binary Search"),t("OutboundLink")],1),s._v(", "),t("a",{attrs:{href:"https://leetcode.com/tag/divide-and-conquer/",target:"_blank",rel:"noopener noreferrer"}},[s._v("Divide and Conquer"),t("OutboundLink")],1)]),s._v(" "),t("p",[s._v("Given two sorted arrays "),t("code",[s._v("nums1")]),s._v(" and "),t("code",[s._v("nums2")]),s._v(" of size "),t("code",[s._v("m")]),s._v(" and "),t("code",[s._v("n")]),s._v(" respectively, return "),t("strong",[s._v("the median")]),s._v(" of the two sorted arrays.")]),s._v(" "),t("p",[s._v("The overall run time complexity should be "),t("code",[s._v("O(log (m+n))")]),s._v(".")]),s._v(" "),t("p",[t("strong",[s._v("Example 1:")])]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("p",[t("strong",[s._v("Example 2:")])]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("Input: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("p",[t("strong",[s._v("Constraints:")])]),s._v(" "),t("ul",[t("li",[t("code",[s._v("nums1.length == m")])]),s._v(" "),t("li",[t("code",[s._v("nums2.length == n")])]),s._v(" "),t("li",[t("code",[s._v("0 <= m <= 1000")])]),s._v(" "),t("li",[t("code",[s._v("0 <= n <= 1000")])]),s._v(" "),t("li",[t("code",[s._v("1 <= m + n <= 2000")])]),s._v(" "),t("li",[s._v("-10"),t("sup",[s._v("6")]),s._v(" <= nums1[i], nums2[i] <= 10"),t("sup",[s._v("6")])])]),s._v(" "),t("h2",{attrs:{id:"solution"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#solution"}},[s._v("#")]),s._v(" Solution")]),s._v(" "),t("p",[s._v("Language: "),t("strong",[s._v("JavaScript")])]),s._v(" "),t("div",{staticClass:"language-javascript line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n 当两个有序数组的长度之和为奇数的时候，中位数只有1个，将它返回；\n 当两个有序数组的长度之和为偶数的时候，中位数有2个，返回合并、排序以后位于中间的两个数的平均数。\n \n 方法一：暴力求解\n 先合并两个有序数组\n 然后排序找到中位数\n 没有使用数组有序这一条件\n \n 方法二：合并两个有序数组\n 借鉴归并排序的关键步骤【合并两个有序数组】（参考【力扣88题】），将时间复杂度降到O(m+n)\n 后面的部分和【暴力解法】一样\n 事实上，也可以不用合并完，就能得到答案。\n \n 方法三：二分查找\n 中位数：在只有一个有序数组的时候，中位数把数组分割成两个部分。\n 根据定义，分数组长度为奇数和偶数的讨论。\n \n 数组长度为偶数时，中位数有两个，其中一个是左边数组的最大值，另一个是右边数组的最小值。\n 数组长度为奇数时，中位数有1个，我们不妨把中位数分到左边数组。\n \n 中位数：在有两个有序数组的时候，仍然可以把两个数组分割成两个部分。\n 我们使用一条分割线把两个数组分别分割成两部分。\n 1.红线左边和右边的元素个数相等，或者左边元素的个数比右边元素的个数多1个；\n 2.红线左边的所有元素的数值<=红线右边的所有元素的数值；\n 那么中位数就一定只与红线两侧的元素有关，确定这条红线的位置使用二分查找。\n \n 分割线左边5个元素，分割线右边4个元素\n 当两个数组的元素个数之和为奇数的时候，有l[size]=r[size]+1\n 分割线左边元素的最大值就是数组的中位数\n \n 分割线左边5个元素，分割线右边5个元素\n 当两个数组的元素个数之和为偶数的时候，有l[size]=r[size]\n 分割线左边的元素的最大值就是其中的一个中位数\n 分割线右边的元素的最小值就是另外一个中位数\n \n 又由于这两个数组都是有序的数组，分割线左边的这两个元素的较大值，就是分割线左边的所有元素的最大值，它是其中一个中位数；分割线右边的这两个元素的较小值，就是分割线右边的所有元素的最小值，它是另外一个中位数。\n \n 假设数组1的长度为m，假设数组2的长度为n\n 当m+n为偶数的时候，l[size]=(m+n)/2=(m+n+1)/2\n 当m+n为奇数的时候，由于我们之前假设中位数被分到左边，l[size]=(m+n+1)/2;\n 因此，可以把以上两种写法合并，l[size]=(m+n+1)/2\n 得到这个结论的好处是，不用分奇数讨论，只需要确定其中一个数组的分割线位置，另一个数组的分割线位置可以通过公式计算出来。\n 此时满足的中位数分割线的第1个条件。\n \n 接下来我们看中位数要保持的第2个条件：红线左边的所有元素数值<=红线右边的所有元素数值。\n 由于两个数组都是有序数组，在同一个数组内，分割线一定满足左边的所有元素小于右边的所有元素。\n 在不同的数组之间，应该保证交叉小于等于关系成立。\n \n 第一个数组在分割线左边的最大值要小于等于第二个数组在分割线右边的最小值，并且第二个数组在分割线左边的最大值也要小于等于第一个数组在分割线右边的最小值，这样的分割线才是我们需要的。\n 那么，只要不符合交叉小于等于关系，我们就需要适当调整分割线的位置。\n \n 分情况：\n \n 中位数分割线右边的数太小\n 调整方案：将中位数分割线在数组1的位置右移\n 说明：第二个数组的分割线左边的最大值 大于 第一个数组在分割线右边的最小值\n \n 中位数分割线左边的数太大\n 调整方案：将中位数分割线在数组1的位置左移\n 说明：第一个数组的分割线左边的最大值 大于 第二个数组的分割线右边的最小值\n \n m=2,n=9,左6右5               m=3,n=9,左6右6\n 由于我们需要通过访问“中间数分割线”左右两边的元素，因此应该在较短的数组上确定“中间数分割线”的位置。\n \n 当两个数组长度相等的时候\n \n 定义分割线：\n 分割线在第1个数组右边的第1个元素的下标i=分割线在第1个数组左边的元素个数\n 分割线在第2个数组右边的第1个元素的下标j=分割线在第2个数组左边的元素个数\n \n totalLeft = i+j = (m+n+1)/2\n 在nums1的区间[0, m]里查找恰当的分割线\n 使得nums1[i-1] <= nums2[j] && nums2[j-1] <= num1[i]\n left = 0, right = m;\n i = left + (right-left+1)/2;\n j = totalLeft - i\n \n 下一轮搜索的区间[left, i-1]\n 下一轮搜索的区间[i, right]\n nums[i-1]>nums2[j] ? right = i-1 : left = i\n */")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function-variable function"}},[s._v("findMedianSortedArrays")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("nums1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" nums2")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("nums1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" nums2"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("findMedianSortedArrays")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("nums2"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" nums1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    \n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("m"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("nums1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" nums2"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("left"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" right"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" min"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" max"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" m"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("Infinity")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("Infinity")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    \n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("while")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("left "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<=")]),s._v(" right"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" i "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("left "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" right"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>>")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" j "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("m "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" n "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" i"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        \n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("i "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" min "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" nums1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" i "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" m "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" max "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" nums1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("i"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("j "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" min "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" nums2"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("j"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" j "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" n "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" max "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" nums2"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("j"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n        \n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" leftMax "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" Math"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("max")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L2")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("m"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v("n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("%")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" leftMax "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("leftMax "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" Math"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("min")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R2")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n        \n        "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("L1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("R2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("right "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" i "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("left "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" i "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br"),t("span",{staticClass:"line-number"},[s._v("35")]),t("br"),t("span",{staticClass:"line-number"},[s._v("36")]),t("br"),t("span",{staticClass:"line-number"},[s._v("37")]),t("br"),t("span",{staticClass:"line-number"},[s._v("38")]),t("br"),t("span",{staticClass:"line-number"},[s._v("39")]),t("br"),t("span",{staticClass:"line-number"},[s._v("40")]),t("br"),t("span",{staticClass:"line-number"},[s._v("41")]),t("br"),t("span",{staticClass:"line-number"},[s._v("42")]),t("br"),t("span",{staticClass:"line-number"},[s._v("43")]),t("br"),t("span",{staticClass:"line-number"},[s._v("44")]),t("br"),t("span",{staticClass:"line-number"},[s._v("45")]),t("br"),t("span",{staticClass:"line-number"},[s._v("46")]),t("br"),t("span",{staticClass:"line-number"},[s._v("47")]),t("br"),t("span",{staticClass:"line-number"},[s._v("48")]),t("br"),t("span",{staticClass:"line-number"},[s._v("49")]),t("br"),t("span",{staticClass:"line-number"},[s._v("50")]),t("br"),t("span",{staticClass:"line-number"},[s._v("51")]),t("br"),t("span",{staticClass:"line-number"},[s._v("52")]),t("br"),t("span",{staticClass:"line-number"},[s._v("53")]),t("br"),t("span",{staticClass:"line-number"},[s._v("54")]),t("br"),t("span",{staticClass:"line-number"},[s._v("55")]),t("br"),t("span",{staticClass:"line-number"},[s._v("56")]),t("br"),t("span",{staticClass:"line-number"},[s._v("57")]),t("br"),t("span",{staticClass:"line-number"},[s._v("58")]),t("br"),t("span",{staticClass:"line-number"},[s._v("59")]),t("br"),t("span",{staticClass:"line-number"},[s._v("60")]),t("br"),t("span",{staticClass:"line-number"},[s._v("61")]),t("br"),t("span",{staticClass:"line-number"},[s._v("62")]),t("br"),t("span",{staticClass:"line-number"},[s._v("63")]),t("br"),t("span",{staticClass:"line-number"},[s._v("64")]),t("br"),t("span",{staticClass:"line-number"},[s._v("65")]),t("br"),t("span",{staticClass:"line-number"},[s._v("66")]),t("br"),t("span",{staticClass:"line-number"},[s._v("67")]),t("br"),t("span",{staticClass:"line-number"},[s._v("68")]),t("br"),t("span",{staticClass:"line-number"},[s._v("69")]),t("br"),t("span",{staticClass:"line-number"},[s._v("70")]),t("br"),t("span",{staticClass:"line-number"},[s._v("71")]),t("br"),t("span",{staticClass:"line-number"},[s._v("72")]),t("br"),t("span",{staticClass:"line-number"},[s._v("73")]),t("br"),t("span",{staticClass:"line-number"},[s._v("74")]),t("br"),t("span",{staticClass:"line-number"},[s._v("75")]),t("br"),t("span",{staticClass:"line-number"},[s._v("76")]),t("br"),t("span",{staticClass:"line-number"},[s._v("77")]),t("br"),t("span",{staticClass:"line-number"},[s._v("78")]),t("br"),t("span",{staticClass:"line-number"},[s._v("79")]),t("br"),t("span",{staticClass:"line-number"},[s._v("80")]),t("br"),t("span",{staticClass:"line-number"},[s._v("81")]),t("br"),t("span",{staticClass:"line-number"},[s._v("82")]),t("br"),t("span",{staticClass:"line-number"},[s._v("83")]),t("br"),t("span",{staticClass:"line-number"},[s._v("84")]),t("br"),t("span",{staticClass:"line-number"},[s._v("85")]),t("br"),t("span",{staticClass:"line-number"},[s._v("86")]),t("br"),t("span",{staticClass:"line-number"},[s._v("87")]),t("br"),t("span",{staticClass:"line-number"},[s._v("88")]),t("br"),t("span",{staticClass:"line-number"},[s._v("89")]),t("br"),t("span",{staticClass:"line-number"},[s._v("90")]),t("br"),t("span",{staticClass:"line-number"},[s._v("91")]),t("br"),t("span",{staticClass:"line-number"},[s._v("92")]),t("br"),t("span",{staticClass:"line-number"},[s._v("93")]),t("br"),t("span",{staticClass:"line-number"},[s._v("94")]),t("br"),t("span",{staticClass:"line-number"},[s._v("95")]),t("br"),t("span",{staticClass:"line-number"},[s._v("96")]),t("br"),t("span",{staticClass:"line-number"},[s._v("97")]),t("br"),t("span",{staticClass:"line-number"},[s._v("98")]),t("br"),t("span",{staticClass:"line-number"},[s._v("99")]),t("br"),t("span",{staticClass:"line-number"},[s._v("100")]),t("br"),t("span",{staticClass:"line-number"},[s._v("101")]),t("br"),t("span",{staticClass:"line-number"},[s._v("102")]),t("br"),t("span",{staticClass:"line-number"},[s._v("103")]),t("br"),t("span",{staticClass:"line-number"},[s._v("104")]),t("br"),t("span",{staticClass:"line-number"},[s._v("105")]),t("br"),t("span",{staticClass:"line-number"},[s._v("106")]),t("br"),t("span",{staticClass:"line-number"},[s._v("107")]),t("br"),t("span",{staticClass:"line-number"},[s._v("108")]),t("br"),t("span",{staticClass:"line-number"},[s._v("109")]),t("br")])])])}),[],!1,null,null,null);n.default=r.exports}}]);