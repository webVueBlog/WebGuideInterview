import "normalize.css";
require("animate.css");
Vue.prototype.$bus = new Vue();
// 异步加载
import("moment").then((moment) => {
  const _moment = moment.default;
  Vue.filter(
    "globalTimeFormatter",
    function (dataStr: any, pattern = "YYYY-MM-DD HH:mm:ss") {
      return _moment(dataStr).format(pattern);
    }
  );
});

