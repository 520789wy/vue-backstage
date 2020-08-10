import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入ElementUI
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
//引入字体图标
import "./assets/font/iconfont.css"
// 引入全局css
import "./assets/css/global.css"

import axios from "axios"
//配置请求的根路径
axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/"
Vue.prototype.$http=axios

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
