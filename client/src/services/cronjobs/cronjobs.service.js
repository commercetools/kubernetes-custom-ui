import axios from 'axios'

export default () => ({
  find: async params =>
    axios
      .get('/cronjobs', {
        params,
      })
      .then(res => res.data),
  run: async (name, environment, namespace) => axios.post(`/cronjobs/${name}/run`, {
    environment,
    namespace,
  }).then(res => res.data),
})
