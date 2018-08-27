export default ({ authenticationService, utilsAuthentication }) => {
  const actions = {}

  actions.setAuthenticationValues = (user, token, { commit }) => {
    const { exp } = utilsAuthentication.decodeToken(token)

    commit('SET_USER', user)
    commit('SET_TOKEN', token)
    commit('SET_TOKEN_EXPIRES_AT', new Date(exp * 1000).toISOString())
  }

  actions.SIGN_IN = async ({ commit }, { email, password }) =>
    authenticationService.signIn(email, password).then(({ user, token }) => {
      actions.setAuthenticationValues(user, token, { commit })
      return { user, token }
    })

  actions.SIGN_UP = async ({ commit }, {
    firstName, lastName, email, password,
  }) =>
    authenticationService
      .signUp({
        firstName,
        lastName,
        email,
        password,
      })
      .then(({ user, token }) => {
        actions.setAuthenticationValues(user, token, { commit })
        return { user, token }
      })

  actions.SIGN_OUT = ({ commit }) => {
    commit('SET_USER', null)
    commit('SET_TOKEN', '')
    commit('SET_TOKEN_EXPIRES_AT', '')
    commit('general/SET_IS_SIDEBAR_COLLAPSED', true, { root: true })
    commit('general/SET_ENVIRONMENT', '', { root: true })
  }

  return actions
}
