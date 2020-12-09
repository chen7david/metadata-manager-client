import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import http from './plugins/http'
import config from './../config'

Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$http = http({
  baseURL: config.api.meta.url,
  timeout: config.api.meta.timeout,
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
