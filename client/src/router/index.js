import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/SignIn'
import Cronjobs from '@/components/Cronjobs'

export default function () {
  Vue.use(Router)

  const scrollBehavior = (to, from, savedPosition) => savedPosition || { x: 0, y: 0 }

  const router = new Router({
    mode: 'history',
    scrollBehavior,
    routes: [
      {
        path: '/',
        name: 'SignIn',
        component: SignIn,
      },
      {
        path: '/cronjobs',
        name: 'Cronjobs',
        component: Cronjobs,
      },
    ],
  })

  return router
}
