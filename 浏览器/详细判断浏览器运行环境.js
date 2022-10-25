// 国际五大浏览器品牌：按照全球使用率降序排列

/**
Google Chrome：Windows、MacOS、Linux、Android、iOS
Apple Safari：MacOS、iOS
Linux、Android、iOS
ASA Opera：Windows、MacOS、Linux、Android、iOS
Microsoft Internet Explorer或Microsoft Edge：Windows

微信浏览器
QQ浏览器
UC浏览器
360浏览器
2345浏览器
搜狗浏览器
猎豹浏览器
遨游浏览器

使用场景
判断用户浏览器是桌面端还是移动端，显示对应的主题样式
判断用户浏览器是Android端还是iOS端，跳转到对应的App下载链接
判断用户浏览器是微信端还是H5端，调用微信分享或当前浏览器分享
获取用户浏览器的内核和载体，用于统计用户设备平台分布区间
获取用户浏览器的载体版本，用于提示更新信息

原理
浏览器指纹
浏览器指纹就是UserAgent
就是一个特殊字符串头，使得服务器能够识别客户使用的操作系统及版本、CPU类型、浏览器载体及版本、浏览器渲染引擎、浏览器语言、浏览器插件等。

一个比较全面的解决方案。这个方案包含浏览器系统及版本、浏览器平台、浏览器内核及版本、浏览器载体及版本、浏览器外壳及版本。
基于navigator.userAgent获取相关浏览器信息

const ua = navigator.userAgent.toLowerCase();

// 输出
"mozilla/5.0 (iphone; cpu iphone os 11_0 like mac os x) applewebkit/604.1.38 (khtml, like gecko) version/11.0 mobile/15a372 safari/604.1"

"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"

浏览器信息：权重按照以下降序排列: 系统、平台、内核、载体、外壳
浏览器系统：所运行的操作系统，包含Windows、MacOS、Linux、Android、iOS
浏览器平台：所运行的设备平台，包含Desktop桌面端、Mobile移动端
浏览器内核：浏览器渲染引擎，包含Webkit、Gecko、Presto、Trident
浏览器载体：五大浏览器品牌，包含Chrome、Safari、Firefox、Opera、IExplore/Edge

获取UserAgent是否包含字段：判断是否包含系统、平台、内核、载体、外壳的特有字段
const testUa = regexp => regexp.test(ua);

获取UserAgent对应字段的版本
const testVs = regexp => ua.match(regexp).toString().replace(/[^0-9|_.]/g, "").replace(/_/g, ".");

按照权重(系统 + 系统版本 > 平台 > 内核 + 载体 + 内核版本 + 载体版本 > 外壳 + 外壳版本)

 */
// 系统
let system = 'unknow';
if (testUa(/windows|win32|win64|wow32|wow64/g)) {
	system = 'windows'; // windows系统
} else if (testUa(/macintosh|macintel/g)) {
	system = 'macos'; // macos系统
} else if (testUa(/x11/g)) {
	
}