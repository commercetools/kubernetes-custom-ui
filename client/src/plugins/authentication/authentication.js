export default ({ authStore, utilsAuthentication }) => {
  const auth = {
    isUserAuthenticated: () =>
      !utilsAuthentication.isTokenExpired(authStore.token, authStore.tokenExpiresAt),

    getUser: () => authStore.user,
  }

  return {
    // Makes the auth methods available in components via this.$auth.getUser for example
    install: Vue => Object.defineProperty(Vue.prototype, '$auth', { value: auth }),
    ...auth,
  }
}
