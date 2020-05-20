/**
 * @author: zhangyh-k@glondon.com
 * @description:
 * @Date: 2019/8/13 9:19
 */
import fetch from '../../utils/fetch'
import api from '../../global/api'

const login = {
  state: {},
  mutations: {},
  actions: {
    async A_LOGIN ({ commit, dispatch }, payload) {
      try {
        const { status, data } = await fetch.post(api.login.login, payload)
        if (status === 0) {
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('miniLightToken', data.miniLightToken)
          dispatch('A_GET_USER_INFO')
          commit('SET_TOKEN', data.token)
          commit('SET_MINITOKEN', data.miniLightToken)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
export default login
