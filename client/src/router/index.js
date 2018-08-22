import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/SignIn'
// import SignUp from '@/components/SignUp'
import Cronjobs from '@/components/Cronjobs'
import Dashboard from '@/components/Dashboard'

export default ({ authentication }) => {
  Vue.use(Router)

  const scrollBehavior = (to, from, savedPosition) => savedPosition || { x: 0, y: 0 }

  const checkAuthentication = (to, from, next) => {
    if (
      to.matched.some(record => record.meta.requiresAuthentication) &&
      !authentication.isUserAuthenticated()
    )
      // if not authenticated we redirect to the Home page
      return next({ name: 'Home' })

    return next()
  }

  const ifToHomeAndAuthenticated = (to, from, next) => {
    if (to.name === 'Home' && authentication.isUserAuthenticated())
      // if Home and authenticated we redirect to the Cronjobs page
      return next({ name: 'Cronjobs' })

    return next()
  }

  const router = new Router({
    mode: 'history',
    scrollBehavior,
    routes: [
      {
        path: '/',
        name: 'Home',
        component: SignIn,
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        redirect: { name: 'Cronjobs' },
        children: [
          {
            path: 'cronjobs',
            name: 'Cronjobs',
            component: Cronjobs,
            meta: { requiresAuthentication: true },
          },
        ],
      },
    ],
  })

  router.beforeResolve(checkAuthentication)
  router.beforeResolve(ifToHomeAndAuthenticated)

  return router
}
