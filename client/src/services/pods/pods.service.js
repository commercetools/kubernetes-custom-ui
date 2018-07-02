import axios from 'axios'

export default () => ({
  getLog: async (name, environment, namespace) => axios.get(`/pods/${name}/log`, {
    params: {
      environment,
      namespace,
    },
  }).then(res => res.data),
})
