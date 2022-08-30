(window.webpackJsonp=window.webpackJsonp||[]).push([[352],{945:function(s,a,n){"use strict";n.r(a);var e=n(6),t=Object(e.a)({},(function(){var s=this,a=s.$createElement,n=s._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h2",{attrs:{id:"vuecli3项目构建基础"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#vuecli3项目构建基础"}},[s._v("#")]),s._v(" VueCLI3项目构建基础")]),s._v(" "),n("p",[s._v("Vue.js 作为一门轻量级、易上手的前端框架，从入门难度和学习曲线上相对其他框架来说算是占据优势的，越来越多的人开始投入 Vue.js 的怀抱，走进 Vue.js 的世界。")]),s._v(" "),n("h3",{attrs:{id:"依赖工具"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#依赖工具"}},[s._v("#")]),s._v(" 依赖工具")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("# 查看 node 版本\nnode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("v\n\n# 查看 npm 版本\nnpm "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("v\n\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br")])]),n("h3",{attrs:{id:"脚手架"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#脚手架"}},[s._v("#")]),s._v(" 脚手架")]),s._v(" "),n("ol",[n("li",[s._v("什么是脚手架")])]),s._v(" "),n("p",[s._v("很多人可能经常会听到“脚手架”三个字，无论是前端还是后台，其实它在生活中的含义是为了保证各施工过程顺利进行而搭设的工作平台。因此作为一个工作平台，前端的脚手架可以理解为能够帮助我们快速构建前端项目的一个工具或平台。")]),s._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[s._v("vue-cli")])]),s._v(" "),n("p",[s._v("其实说到脚手架，目前很多主流的前端框架都提供了各自官方的脚手架工具，以帮助开发者快速构建起自己的项目，比如 Vue、React 等，这里我们就来介绍下 Vue 的脚手架工具 vue-cli。")]),s._v(" "),n("p",[s._v("我们可以在终端通过以下命令全局安装 vue-cli：")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("# 安装 Vue "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("CLI")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("x\nnpm i "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("g @vue"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("cli\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[s._v("如果你习惯使用 yarn，你也可以：")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("# 没有全局安装yarn需执行此命令\nnpm i "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("g yarn\nyarn global add @vue"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("cli\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])]),n("p",[s._v("注意因为是全局安装，所以 vue-cli 是全局的包，它和我们所处的项目没有关系。同时我们这里介绍的 CLI 版本是最新的 3.x，它和 2.x 版本存在着很大的区别")]),s._v(" "),n("p",[s._v("安装完 vue-cli 后，我们在你想要创建的项目目录地址下执行构建命令：")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("# my"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("project 是你的项目名称\nvue create my"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("project\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[s._v("如果你只想构建一个基础的 Vue 项目，那么使用 Babel、Router、Vuex、CSS Pre-processors 就足够了，最后选择你喜欢的包管理工具 npm or yarn。")]),s._v(" "),n("p",[s._v("启动")]),s._v(" "),n("p",[s._v("等待构建完成后你便可以运行命令来启动你的 Vue 项目：")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("# 打开项目目录\ncd vue"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("project\n\n# 启动项目\nyarn serve\n\n# or\nnpm run serve\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br")])]),n("p",[s._v("需要注意的是如果启动的时候出现报错或者包丢失等情况，最好将 node 或者 yarn （如果使用）的版本更新到最新重新构建。")]),s._v(" "),n("p",[s._v("目录结构")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("├── node_modules     # 项目依赖包目录\n├── "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v("\n│   ├── favicon"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("ico  # ico图标\n│   └── index"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("html   # 首页模板\n├── src \n│   ├── assets       # 样式图片目录\n│   ├── components   # 组件目录\n│   ├── views        # 页面目录\n│   ├── App"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("vue      # 父组件\n│   ├── main"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js      # 入口文件\n│   ├── router"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js    # 路由配置文件\n│   └── store"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js     # vuex状态管理文件\n├── "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("gitignore       # git忽略文件\n├── "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("postcssrc"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js    # postcss配置文件\n├── babel"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("config"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js  # babel配置文件\n├── "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("package")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("json     # 包管理文件\n└── yarn"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("lock        # yarn依赖信息文件\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br")])]),n("p",[s._v("可视化界面")]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[s._v("vue ui\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])])])}),[],!1,null,null,null);a.default=t.exports}}]);