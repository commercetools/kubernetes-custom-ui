import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Store from '../index'

describe('Authentication Store', () => {
  let authenticationStore
  const localVue = createLocalVue()

  localVue.use(Vuex)

  beforeEach(() => {
    authenticationStore = new Vuex.Store(Store())
  })

  describe('state', () => {
    it('should have default values', () => {
      expect(authenticationStore.state).toEqual({
        tokenExpiresAt: '',
        token: '',
        user: null,
      })
    })
  })

  describe('mutations', () => {
    it('should set the "expiresAt" date', () => {
      authenticationStore.commit(
        'SET_TOKEN_EXPIRES_AT',
        '1982-02-11T00:00:00.000Z',
      )
      expect(authenticationStore.state).toEqual({
        tokenExpiresAt: '1982-02-11T00:00:00.000Z',
        token: '',
        user: null,
      })
    })

    it('should set the token', () => {
      authenticationStore.commit('SET_TOKEN', '123456789ABCDEF')
      expect(authenticationStore.state).toEqual({
        tokenExpiresAt: '',
        token: '123456789ABCDEF',
        user: null,
      })
    })

    it('should set the user', () => {
      const user = {
        id: 'id1',
        email: 'javier.ortizsaorin@gmail.com',
      }

      authenticationStore.commit('SET_USER', user)
      expect(authenticationStore.state).toEqual({
        tokenExpiresAt: '',
        token: '',
        user,
      })
    })
  })
})
