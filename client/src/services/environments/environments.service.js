import axios from 'axios'

export default () => ({
  find: async params =>
    axios
      .get('/environments', {
        params,
      })
      .then(res => res.data),
})
