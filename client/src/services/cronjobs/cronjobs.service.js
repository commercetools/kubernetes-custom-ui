import axios from 'axios'

export default () => ({
  find: async params =>
    axios
      .get('/cronjobs', {
        params,
      })
      .then(res => res.data),
})
