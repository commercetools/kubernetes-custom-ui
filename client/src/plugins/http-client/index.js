import axios from 'axios'

export default ({ authStore }) => ({
  install: () => {
    axios.interceptors.request.use(
      config => ({
        ...config,
        baseURL: process.env.API_URL || '/',
        headers: {
          ...config.headers,
          ...(authStore.token && { Authorization: `Bearer ${authStore.token}` }),
        },
      }),
      error => Promise.reject(error),
    )
  },
})
