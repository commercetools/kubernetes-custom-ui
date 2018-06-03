import nock from 'nock'
import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import AuthenticationService from '../authentication.service'

describe('Authentication service', () => {
  let authenticationService
  let baseUrl

  beforeAll(() => {
    baseUrl = 'http://localhost'
    axios.defaults.host = baseUrl
    axios.defaults.adapter = httpAdapter
  })

  beforeEach(() => {
    authenticationService = AuthenticationService()
  })

  describe('when sign in a user', () => {
    describe('when success', () => {
      let response

      beforeEach(async () => {
        nock(baseUrl)
          .post('/auth/signin', {
            email: 'dummy-email@commercetools.de',
            password: '12345',
          })
          .reply(200, {
            user: {
              id: 'id1',
              email: 'dummy-email@commercetools.de',
              password: '12345',
            },
            token: 'abcdefg123456789',
          })

        response = await authenticationService.signIn('dummy-email@commercetools.de', '12345')
      })

      it('should get the user', () =>
        expect(response.user).toEqual({
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        }))

      it('should get the token', () => expect(response.token).toBe('abcdefg123456789'))
    })
  })
  describe('when signing up a user', () => {
    describe('when success', () => {
      let response

      beforeEach(async () => {
        nock(baseUrl)
          .post('/auth/signup', {
            firstName: 'dummy-firstName',
            lastName: 'dummy-lastName',
            email: 'dummy-email@commercetools.de',
            password: '12345',
          })
          .reply(200, {
            user: {
              id: 'id1',
              email: 'dummy-email@commercetools.de',
              password: '12345',
            },
            token: 'abcdefg123456789',
          })

        response = await authenticationService.signUp({
          firstName: 'dummy-firstName',
          lastName: 'dummy-lastName',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        })
      })

      it('should get the user', () =>
        expect(response.user).toEqual({
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        }))

      it('should get the token', () => expect(response.token).toBe('abcdefg123456789'))
    })
  })
})
