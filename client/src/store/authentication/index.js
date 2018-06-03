import AuthenticationService from '@/services/authentication'
import UtilsAuthentication from '@/utils/authentication/utils.authentication'
import State from './state'
import Mutations from './mutations'
import Actions from './actions'

export default () => {
  const authenticationService = AuthenticationService()
  const utilsAuthentication = UtilsAuthentication()

  return {
    state: State(),
    mutations: Mutations(),
    actions: Actions({ authenticationService, utilsAuthentication }),
  }
}
