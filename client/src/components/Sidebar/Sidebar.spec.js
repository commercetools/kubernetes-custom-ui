import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import Sidebar from './Sidebar'

describe('Sidebar Component', () => {
  let wrapper
  let vm

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(BootstrapVue)

    wrapper = mount(Sidebar, {
      localVue,
      stubs: ['router-link'],
      store: new Vuex.Store({
        modules: {
          general: {
            namespaced: true,
            state: {},
            mutations: {},
          },
        },
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
})
