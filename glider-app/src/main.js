import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Part from './models/Part.js'

Vue.config.productionTip = false

const gliderVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
