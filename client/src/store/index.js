import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import authentication from './authentication'

export default function () {
  Vue.use(Vuex)

  return new Vuex.Store({
    modules: {
      authentication: {
        namespaced: true,
        ...authentication(),
      },
    },
    plugins: [
      createPersist({
        namespace: 'kubernetes-custom-ui',
        initialState: {},
        expires: 24 * 60 * 60 * 1000, // one day
      }),
    ],
    strict: process.env.NODE_ENV !== 'production',
  })
}
