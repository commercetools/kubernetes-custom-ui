import axios from 'axios'

export default () => ({
  signIn: async (email, password) =>
    axios.post('/auth/signin', { email, password }).then(res => res.data),
  signUp: async ({
    firstName, lastName, email, password,
  }) =>
    axios.post('/auth/signup', {
      firstName, lastName, email, password,
    }).then(res => res.data),
})
