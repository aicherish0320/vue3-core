import axios from 'axios'

axios.defaults.baseURL = '/api'

axios.interceptors.request.use((config) => {
  return config
})

axios.interceptors.response.use(
  (response) => {
    const retData = response.data
    if (retData.code !== 0) {
      return Promise.reject('失败')
    } else {
      return retData.data
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axios
