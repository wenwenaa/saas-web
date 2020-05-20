import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
// import router from '../../router/router'
// import * as urls from '../../router/routePath'

const schedule = {
  state: {
    members: [],
    waitList: [],
    waitTotal: 0,
    finishTotal: 0,
    finishList: []
  },
  mutations: {
    // 审核流所有数据
    M_SET_CHECKERS (state, payload = []) {
      state.members = payload
    },
    M_SET_WAIT_LIST (state, payload = {}) {
      state.waitList = payload.records
      state.waitTotal = payload.total
    },
    M_SET_FINISH_LIST (state, payload = {}) {
      state.finishList = payload.records
      state.finishTotal = payload.total
    }
  },
  actions: {
    async A_GET_CHECKERS ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.schedule.allCheckers, { params: payload })
        if (status === 0) {
          commit('M_SET_CHECKERS', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async A_GET_WAIT_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.schedule.waitCheck, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_WAIT_LIST', data)
        }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
      }
    },
    async A_GET_FINISH_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.schedule.finishCheck, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_FINISH_LIST', data)
        }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
      }
    },
    async A_ADD_CHECK ({ commit }, payload) {
      try {
        const { status } = await fetch.post(api.schedule.addCheck, payload)
        if (status === 0) {
          Message.success('审批成功')
        }
        return { status }
      } catch (e) {
        console.log(e)
        return {}
      }
    }

  }
}
const orderCheck = {
  state: {
    ...schedule.state
  },
  mutations: {
    ...schedule.mutations
  },
  actions: {
    ...schedule.actions
  }
}

export default orderCheck
