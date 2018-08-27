export default () => ({
  SET_IS_SIDEBAR_COLLAPSED: (state, isSidebarCollapsed) => {
    state.isSidebarCollapsed = isSidebarCollapsed
  },
  SET_ENVIRONMENT: (state, environment) => {
    state.environment = environment
  },
})
