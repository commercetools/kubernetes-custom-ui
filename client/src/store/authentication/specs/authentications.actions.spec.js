import AuthenticationService from '@/services/authentication'
import UtilsAuthentication from '@/utils/authentication/utils.authentication'
import Actions from '../actions'

describe('Authentication actions', () => {
  let actions
  let commit
  let authenticationService
  let utilsAuthentication

  beforeEach(() => {
    authenticationService = AuthenticationService()
    utilsAuthentication = UtilsAuthentication()
    actions = Actions({ authenticationService, utilsAuthentication })

    // Returning  '1982-02-11T00:00:00.000Z' in seconds
    utilsAuthentication.decodeToken = jest.fn().mockReturnValue({ exp: 382233600 })
    commit = jest.fn()
  })

  describe('when signing a user in', () => {
    let response

    beforeEach(async () => {
      authenticationService.signIn = jest.fn().mockResolvedValue({
        user: {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        token: 'abcdefg123456789',
      })

      actions.setAuthenticationValues = jest.fn()

      response = await actions.SIGN_IN(
        { commit },
        { email: 'dummy-email@commercetools.de', password: '12345' },
      )
    })

    it('should set the authentication values in the store', () =>
      expect(actions.setAuthenticationValues).toHaveBeenCalledWith(
        {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        'abcdefg123456789',
        { commit },
      ))

    it('should sign the user in', () =>
      expect(authenticationService.signIn).toHaveBeenCalledWith(
        'dummy-email@commercetools.de',
        '12345',
      ))

    it('should return the user and token', () =>
      expect(response).toEqual({
        user: {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        token: 'abcdefg123456789',
      }))
  })
  describe('when signing the user up', () => {
    let response

    beforeEach(async () => {
      authenticationService.signUp = jest.fn().mockResolvedValue({
        user: {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        token: 'abcdefg123456789',
      })

      actions.setAuthenticationValues = jest.fn()

      response = await actions.SIGN_UP(
        { commit },
        {
          firstName: 'dummy-firstName',
          lastName: 'dummy-lastName',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
      )
    })

    it('should sign the user up', () =>
      expect(authenticationService.signUp).toHaveBeenCalledWith({
        firstName: 'dummy-firstName',
        lastName: 'dummy-lastName',
        email: 'dummy-email@commercetools.de',
        password: '12345',
      }))

    it('should set the authentication values in the store', () =>
      expect(actions.setAuthenticationValues).toHaveBeenCalledWith(
        {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        'abcdefg123456789',
        { commit },
      ))

    it('should return the user and token', () =>
      expect(response).toEqual({
        user: {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        token: 'abcdefg123456789',
      }))
  })
  describe('when setting the authentication values', () => {
    beforeEach(() => {
      actions.setAuthenticationValues(
        {
          id: 'id1',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        },
        'abcdefg123456789',
        { commit },
      )
    })

    it('should set the user in the store', () =>
      expect(commit).toHaveBeenCalledWith('SET_USER', {
        id: 'id1',
        email: 'dummy-email@commercetools.de',
        password: '12345',
      }))

    it('should set the token in the store', () =>
      expect(commit).toHaveBeenCalledWith('SET_TOKEN', 'abcdefg123456789'))

    it('should set the token expiration date in the store', () =>
      expect(commit).toHaveBeenCalledWith('SET_TOKEN_EXPIRES_AT', '1982-02-11T00:00:00.000Z'))
  })
  describe('when signing the user out', () => {
    beforeEach(() => {
      actions.SIGN_OUT({ commit })
    })

    it('should reset the user', () => expect(commit).toHaveBeenCalledWith('SET_USER', null))

    it('should reset the token', () => expect(commit).toHaveBeenCalledWith('SET_TOKEN', ''))

    it('should reset the token expiraton date', () =>
      expect(commit).toHaveBeenCalledWith('SET_TOKEN_EXPIRES_AT', ''))

    it('should collapse the sidebar', () =>
      expect(commit).toHaveBeenCalledWith('general/SET_IS_SIDEBAR_COLLAPSED', true, {
        root: true,
      }))
  })
})
