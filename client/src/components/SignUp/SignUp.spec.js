import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueProgressBar from 'vue-progressbar'
import SignUp from './SignUp'

describe('SignUp Component', () => {
  let wrapper
  let vm

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueProgressBar)

    wrapper = shallowMount(SignUp, {
      localVue,
      mocks: {
        $route: {
          path: '/dashboard',
          name: 'Dashboard',
        },
        $router: {
          push: jest.fn(),
        },
      },
      stubs: ['router-link'],
    })
    // eslint-disable-next-line
    vm = wrapper.vm
  })

  describe('when submitting the form', () => {
    let form

    beforeEach(() => {
      form = wrapper.find('form')
    })

    describe('when all required values are set', () => {
      beforeEach(() => {
        vm.firstName = 'dummy-firstName'
        vm.lastName = 'dummy-lastName'
        vm.email = 'dummy-email@commercetools.de'
        vm.password = '12345'
        vm.confirmPassword = '12345'

        vm.SIGN_UP = jest.fn().mockResolvedValue({
          user: {
            id: 'id1',
            email: 'dummy-email@commercetools.de',
            password: '12345',
          },
          token: 'abcdefg123456789',
        })

        form.trigger('submit')
      })

      it('should register the user', (done) => {
        expect(vm.SIGN_UP).toHaveBeenCalledWith({
          firstName: 'dummy-firstName',
          lastName: 'dummy-lastName',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        })
        done()
      })
    })
    describe('when the required fields are NOT set', () => {
      beforeEach(() => {
        vm.SIGN_UP = jest.fn()

        form.trigger('submit')
      })

      it('should not register the user', (done) => {
        expect(vm.SIGN_UP).not.toHaveBeenCalled()
        done()
      })
    })
    describe('when the "Password" and "Confirm Password" fields don\'t match', () => {
      beforeEach(() => {
        vm.firstName = 'dummy-firstName'
        vm.lastName = 'dummy-lastName'
        vm.email = 'dummy-email@commercetools.de'
        vm.password = '11111'
        vm.confirmPassword = '22222'

        vm.SIGN_UP = jest.fn()

        form.trigger('submit')
      })

      it('should show the error message', (done) => {
        vm.$nextTick(() => {
          expect(wrapper.find('.error-message').isVisible()).toBe(true)
          done()
        })
      })

      it('should show the "Password and Confirm password fields don\'t match" message', (done) => {
        vm.$nextTick(() => {
          // prettier-ignore
          expect(wrapper.find('.error-message').text())
            .toBe('"Password" and "Confirm password" fields don\'t match')
          done()
        })
      })

      it('should not register the user', (done) => {
        expect(vm.SIGN_UP).not.toHaveBeenCalled()
        done()
      })
    })
    describe('when there is already a user with the email requested', () => {
      beforeEach(() => {
        vm.firstName = 'dummy-firstName'
        vm.lastName = 'dummy-lastName'
        vm.email = 'dummy-email@commercetools.de'
        vm.password = '11111'
        vm.confirmPassword = '11111'

        vm.SIGN_UP = jest.fn().mockRejectedValue({
          response: {
            status: 400,
            data: {
              errors: [
                {
                  code: 'DuplicateField',
                  field: 'email',
                },
              ],
            },
          },
        })

        form.trigger('submit')
      })

      it('should show the error message', (done) => {
        vm.$nextTick(() => {
          expect(wrapper.find('.error-message').isVisible()).toBe(true)
          done()
        })
      })

      it('should show the "There is already a user with email "<email>"', (done) => {
        vm.$nextTick(() => {
          // prettier-ignore
          expect(wrapper.find('.error-message').text())
            .toBe('There is already a user with email "dummy-email@commercetools.de"')
          done()
        })
      })
    })
    describe('when there is an unhandled error in the response', () => {
      beforeEach(() => {
        vm.firstName = 'dummy-firstName'
        vm.lastName = 'dummy-lastName'
        vm.email = 'dummy-email@commercetools.de'
        vm.password = '12345'
        vm.confirmPassword = '12345'

        vm.SIGN_UP = jest.fn().mockRejectedValue({
          response: {
            status: 500,
          },
        })

        form.trigger('submit')
      })

      it('should show the error message', (done) => {
        vm.$nextTick(() => {
          expect(wrapper.find('.error-message').isVisible()).toBe(true)
          done()
        })
      })

      // prettier-ignore
      it(
        'should show "Opsss, something went wrong. Please contact the administrator" message'
        , (done) => {
          vm.$nextTick(() => {
          // prettier-ignore
            expect(wrapper.find('.error-message').text())
              .toBe('Opsss, something went wrong. Please contact the administrator')
            done()
          })
        },
      )
    })
  })
})
