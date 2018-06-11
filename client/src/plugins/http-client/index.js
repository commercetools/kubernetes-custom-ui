import axios from 'axios'

export default ({ authStore, router }) => ({
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
    axios.interceptors.response.use(
      response => response,
      (error) => {
        if (error.response.status === 401)
          router.push({ name: 'Home' })

        return Promise.reject(error)
      },
    )
  },
})
