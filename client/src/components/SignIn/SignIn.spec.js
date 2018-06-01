import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueProgressBar from 'vue-progressbar'
import SignIn from './SignIn'

describe('Component', () => {
  let wrapper
  let vm

  beforeEach(() => {
    const localVue = createLocalVue()

    localVue.use(VueProgressBar)

    wrapper = shallowMount(SignIn, {
      localVue,
    })
    // eslint-disable-next-line
    vm = wrapper.vm
  })

  describe('when submitting the form', () => {
    let form

    beforeEach(() => {
      form = wrapper.find('form')
    })

    describe('when email and password are set', () => {
      beforeEach(() => {
        vm.email = 'dummy-email@commercetools.de'
        vm.password = '12345'

        vm.SIGN_IN = jest.fn().mockReturnValue(Promise.resolve({
          user: {
            id: 'id1',
            email: 'dummy-email@commercetools.de',
            password: '12345',
          },
          token: 'abcdefg123456789',
        }))

        form.trigger('submit')
      })

      it('should sign in the user', () =>
        expect(vm.SIGN_IN).toHaveBeenCalledWith({
          email: 'dummy-email@commercetools.de',
          password: '12345',
        }))
    })
    describe('when email and password are NOT set', () => {
      beforeEach(() => {
        vm.SIGN_IN = jest.fn()

        form.trigger('submit')
      })

      it('should not sign in the user', () => expect(vm.SIGN_IN).not.toHaveBeenCalled())
    })
  })
})
