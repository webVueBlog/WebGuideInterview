js判断是否为mac电脑还是windows操作系统

// 是否为mac系统(包含iphone手机)
var isMac = function() {
	return /macintosh|mac os x/i.test(navigator.userAgent);
}():

// 是否为 windows 系统
var isWindows = function() {
	return /windows|win32/i.test(navigator.userAgent);
}();

