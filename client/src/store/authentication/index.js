import State from './state'
import Mutations from './mutations'
import Actions from './actions'

export default () => ({
  state: State(),
  mutations: Mutations(),
  actions: Actions(),
})
