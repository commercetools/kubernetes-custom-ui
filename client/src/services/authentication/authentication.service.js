import axios from 'axios'

export default () => ({
  signIn: async (email, password) =>
    axios.post('/auth/signin', { email, password }).then(res => res.data),
})
