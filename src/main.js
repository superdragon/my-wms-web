import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router'
import store from "@/store";
import { checkPermission } from "@/utils/check";

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

// 列表高度
Vue.prototype.$baseTableHeight = (toolHeight) => {
  let height = window.innerHeight
  const logoHeight = 60
  const pageHeight = 80
  return height - logoHeight - pageHeight - toolHeight
}

// 内容区高度
Vue.prototype.$contentHeight = () => {
  let height = window.innerHeight
  const logoHeight = 60
  return height - logoHeight
}

// 三级权限判断
Vue.prototype.$checkPermission = (key) => {
  return checkPermission(key)
}
