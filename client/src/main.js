import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueProgressBar from 'vue-progressbar'
import App from './App'
import Store from './store'
import Router from './router'
import UtilsAuthentication from './utils/authentication/utils.authentication'
import Authentication from './plugins/authentication'

Vue.config.productionTip = false

const store = Store()
const utilsAuthentication = UtilsAuthentication()
const authentication = Authentication({
  authStore: store.state.authentication,
  utilsAuthentication,
})
const router = Router({ authentication })

Vue.use(BootstrapVue)
Vue.use(VueProgressBar, { color: '#3371e3', failedColor: 'red', thickness: '2px' })
Vue.use(authentication)

axios.defaults.baseURL = process.env.API_URL || '/'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
})
