import fetch from '../utils/exportFn'

const defaultConfig = {
  // baseURL: process.env.VUE_APP_BASE_URL,
  mode: 'cors',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8'
  },
  responseType: 'json'
}
fetch.defaults.timeout = 30000

export const exportPost = (url, data, config) => fetch.post(url, data, Object.assign({}, defaultConfig, config))
export default {
  methods: {
    exportFile (url = '', arg = {}) {
      return exportPost(url, arg, { responseType: 'blob' })
    }
  }
}
