import Mutations from '../mutations'
import State from '../state'

describe('General Mutations', () => {
  let mutations
  let state

  beforeEach(() => {
    mutations = Mutations()
    state = State()
  })

  it('should set the sidebar collapsible status', () => {
    mutations.SET_IS_SIDEBAR_COLLAPSED(state, true)

    expect(state.isSidebarCollapsed).toBe(true)
  })
})
