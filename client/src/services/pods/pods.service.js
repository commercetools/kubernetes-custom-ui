import axios from 'axios'

export default () => ({
  getLog: async name => axios.get(`/pods/${name}/log`).then(res => res.data),
})
