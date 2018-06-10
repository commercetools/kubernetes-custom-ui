import axios from 'axios'

export default () => ({
  find: async params =>
    axios
      .get('/cronjobs', {
        params,
      })
      .then(res => res.data),
  run: async name => axios.post(`/cronjobs/${name}/run`).then(res => res.data),
})
