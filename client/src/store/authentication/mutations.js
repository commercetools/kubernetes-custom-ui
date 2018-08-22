export default () => ({
  SET_TOKEN_EXPIRES_AT: (state, tokenExpiresAt) => {
    state.tokenExpiresAt = tokenExpiresAt
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
})
