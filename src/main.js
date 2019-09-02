// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './utils/store'
import axios from 'axios';
// 导入YDui
import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';
// 导入mintUi Picker组件
import { Picker } from 'mint-ui';
import "mint-ui/lib/picker/style.css"
Vue.use(YDUI);
Vue.prototype.$axios = axios;
// 请求方法
import utils from './utils/assist'
// import api from './utils/httpClient'

// var VConsole = require('../static/vConsole-3.0.0/dist/vconsole.min');
// var vConsole = new VConsole();
// 清除微信浏览器点击延时
/* document.addEventListener('DOMContentLoaded', function () {
  typeof FastClick === 'function' && FastClick.attach(document.body);
}, false); */

Vue.config.productionTip = false

/* router.beforeEach((to, from, next) => {
  //显示加载中动画
  if ((to.path == '/index' && from.path == '/')||(to.path == '/rechargeCards' && from.path == '/')||(to.path == '/rechargeCardsOp' && from.path == '/')||(to.path == '/rechargeCardsPay' && from.path == '/')) {
    store.commit('updateLoadingStatus', true);
  }
  var userInfo = JSON.parse(unescape((utils.getCookie('userInfo'))));
  var token = JSON.parse(unescape((utils.getCookie('token'))));
  //登录拦截
  if (!(to.path == '/login')) {
    if ((to.path == '/loginCenter') || (to.path == '/bandCard') || (to.path == '/phoneLogin') || (to.path == '/index') ||　(to.path == '/declare')||(to.path == '/rechargeCards')||(to.path == '/rechargeCardsOp')||(to.path == '/rechargeCardsPay')) {
      next();
    } else {
      if (userInfo == null || token == null) {
        next({ path: '/login' });
      }
    }
  }
  next();
}); */

router.afterEach(route => {
  /* 隐藏加载中动画 */
  store.commit('updateLoadingStatus', false);
});



Vue.prototype.$axios = axios;

Vue.component(Picker.name, Picker);
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
