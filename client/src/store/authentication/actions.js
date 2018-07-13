import AuthenticationService from '@/services/authentication'
import UtilsAuthentication from '@/utils/authentication/utils.authentication'

export default () => {
  const actions = {}
  const authenticationService = AuthenticationService()
  const utilsAuthentication = UtilsAuthentication()

  actions.SIGN_IN = async ({ commit }, { email, password }) =>
    authenticationService.signIn(email, password).then(({ user, token }) => {
      const { exp } = utilsAuthentication.decodeToken(token)

      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      commit('SET_TOKEN_EXPIRES_AT', new Date(exp * 1000).toISOString())

      return { user, token }
    })

  return actions
}
