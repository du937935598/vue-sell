import Vue from 'vue'
import App from './App'
import router from './router'
// 引入并使用vue-resource网络请求模块
import VueResource from 'vue-resource'

// 引入css文件
import './common/stylus/index.styl'

Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
