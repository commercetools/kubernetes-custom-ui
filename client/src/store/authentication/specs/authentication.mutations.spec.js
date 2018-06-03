import Mutations from '../mutations'
import State from '../state'

describe('Authentication Mutations', () => {
  let mutations
  let state

  beforeEach(() => {
    mutations = Mutations()
    state = State()
  })

  it('should set the "expiresAt" date', () => {
    mutations.SET_TOKEN_EXPIRES_AT(state, '1982-02-11T00:00:00.000Z')

    expect(state.tokenExpiresAt).toBe('1982-02-11T00:00:00.000Z')
  })

  it('should set the token', () => {
    mutations.SET_TOKEN(state, '123456789ABCDEF')

    expect(state.token).toBe('123456789ABCDEF')
  })

  it('should set the user', () => {
    mutations.SET_USER(state, {
      id: 'id1',
      email: 'javier.ortizsaorin@gmail.com',
    })

    expect(state.user).toEqual({
      id: 'id1',
      email: 'javier.ortizsaorin@gmail.com',
    })
  })
})
