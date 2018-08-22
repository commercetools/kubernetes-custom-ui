import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import Header from './Header'

describe('Header Component', () => {
  let wrapper
  let vm

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(BootstrapVue)
    localVue.use(VueRouter)

    wrapper = mount(Header, {
      localVue,
      stubs: ['router-link'],
      store: new Vuex.Store({
        modules: {
          authentication: {
            namespaced: true,
            actions: {},
            state: {},
            mutations: {},
          },
          general: {
            namespaced: true,
            state: {},
            mutations: {},
          },
        },
      }),
      router: new VueRouter({
        routes: [
          {
            path: '/',
            name: 'Home',
          },
        ],
      }),
    })
    // eslint-disable-next-line
    vm = wrapper.vm
  })

  it('should collapse the sidebar', () => {
    const sidebarToggle = wrapper.find('a.sidebar-toggle')

    vm.SET_IS_SIDEBAR_COLLAPSED = jest.fn()

    sidebarToggle.trigger('click')

    expect(vm.SET_IS_SIDEBAR_COLLAPSED).toHaveBeenCalledWith(true)
  })

  it('should sign the user out', () => {
    const signOutLink = wrapper.find('a.sign-out')

    vm.SIGN_OUT = jest.fn()

    signOutLink.trigger('click')

    expect(vm.SIGN_OUT).toHaveBeenCalled()
  })
})
