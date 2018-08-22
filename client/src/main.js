import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueProgressBar from 'vue-progressbar'
import notifications from 'vue-notification'
import App from './App'
import Store from './store'
import Router from './router'
import UtilsAuthentication from './utils/authentication/utils.authentication'
import Authentication from './plugins/authentication'
import HttpClient from './plugins/http-client'

Vue.config.productionTip = false

const store = Store()
const utilsAuthentication = UtilsAuthentication()
const authStore = store.state.authentication
const authentication = Authentication({
  authStore,
  utilsAuthentication,
})
const router = Router({ authentication })
const httpClient = HttpClient({ authStore, router })

Vue.use(BootstrapVue)
Vue.use(VueProgressBar, { color: '#3371e3', failedColor: 'red', thickness: '2px' })
Vue.use(authentication)
Vue.use(httpClient)
Vue.use(notifications)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
})
