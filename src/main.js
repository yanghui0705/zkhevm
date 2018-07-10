// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import axios from './util/ajax'
import i18n from './util/i18n'
// import 'element-ui/lib/theme-chalk/index.css'
import 'sysStatic/css/theme-default.scss'
import '../mock/index.js'
import './components/install'
import './plugins/install'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  axios,
  store,
  components: { App },
  template: '<App/>'
})
