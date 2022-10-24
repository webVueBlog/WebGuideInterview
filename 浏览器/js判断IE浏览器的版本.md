由于项目不支持低版本IE，为了更好的用户体验，对使用低版本IE访问项目的用户，我们需要给他们展示一个温馨提示的页面。

怎么去看浏览器的内核等信息，js的全局对象 window 子属性 navigator.userAgent，这个属性是包含了浏览器信息的相关信息，包括我们需要的浏览器内核

navigator.userAgent 这个值取出来是个字符串，可以通过 string 的 indexOf 方法或者正则匹配来验证关键字字符串。
比如 /gai([\w]+?)over([\d]+)/ 
匹配 gainover123 
$1= 括号里的 n 
$2= 第2个括号里的 123


// 判断用户使用的IE版本

// 获取IE版本
function IEVersion() {
	// 取得浏览器的 userAgent 字符串
	var userAgent = navigator.userAgent;
	
	// 判断是否为小于IE11的浏览器
	var isLessIE11 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
	
	// 判断是否为IE的Edge浏览器
	var isEdge = userAgent.indexOf('Edge') > -1 && !isLessIE11;
	
	// 判断是否为IE11浏览器
	var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
	
	// 如果小于IE11
	if (isLessIE11) {
		var IEReg = new RegExp('MSIE (\\d+\\.\\d+);');
		// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
		// 正则表达式 匹配 浏览器的 userAgent 字符串中 MSIE 后的数字部分
		IEReg.test(userAgent);
		
		// 取正则表达式中第一个小括号里匹配到的值
		var IEVersionNum = parseFloat(RegExp['$1']);
		if (IEVersionNum === 7) {
			// IE7
			return 7
		} else if (IEVersionNum === 8) {
			// IE8
			return 8
		} else if (IEVersionNum === 9) {
			// IE9
			return 9
		} else if (IEVersionNum === 10) {
			// IE10
			return 10
		} else {
			// IE版本 < 7
			return 6
		}
	} else if (isEdge) {
		// edge
		return 'edge'
	} else if (isIE11) {
		// IE11
		return 11
	} else {
		// 不是ie浏览器
		return -1
	}
}