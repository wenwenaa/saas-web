import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
// import router from '../../router/router'
// import * as urls from '../../router/routePath'

const check = {
  state: {
    list: [],
    staffList: [],
    total: 0
  },
  mutations: {
    // 审核流所有数据
    M_SET_CHECK_LIST (state, payload = []) {
      state.list = payload
    },
    M_SET_STAFF_LIST (state, payload = {}) {
      state.staffList = payload.records
      state.total = payload.total
    }
  },
  actions: {
    async A_GET_CHECK_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.setting.all, payload)
        if (status === 0) {
          commit('M_SET_CHECK_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async A_GET_STAFF_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.platform.users, { params: payload })
        if (status === 0) {
          commit('M_SET_STAFF_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async A_ADD_CHECK_POINT ({ dispatch }, payload) {
      try {
        const { status } = await fetch.post(api.setting.add, payload)
        if (status === 0) {
          Message.success('新增成功')
          dispatch('A_GET_CHECK_LIST')
        }
        return { status }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    async A_DEL_CHECK_POINT ({ dispatch }, payload) {
      try {
        const { status } = await fetch.get(api.setting.del, { params: payload })
        if (status === 0) {
          Message.success('删除成功')
          dispatch('A_GET_CHECK_LIST')
        }
      } catch (e) {
        console.log(e)
      }
    },
    async A_CHANGE_CHECK_POINT ({ dispatch }, payload) {
      try {
        const { status } = await fetch.get(api.setting.stopCheck, { params: payload })
        if (status === 0) {
          Message.success('状态更新成功')
          dispatch('A_GET_CHECK_LIST')
        }
      } catch (e) {
        console.log(e)
      }
    },
    async A_EDIT_CHECK_POINT ({ dispatch }, payload) {
      try {
        const { status } = await fetch.post(api.setting.edit, payload)
        if (status === 0) {
          dispatch('A_GET_CHECK_LIST')
        }
        return { status }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    async A_ADD_CLASS ({ commit }, payload) {
        try {
            const { status } = await fetch.post(api.setting.addClass, payload)
            if (status === 0) {
              Message.success('班次保存成功')
            }
            return new Promise((resolve) => {
              resolve(status)
            })
        } catch (e) {
            console.log(e)
            return {}
        }
    }
  }
}
const webSetting = {
  state: {
    ...check.state
  },
  mutations: {
    ...check.mutations
  },
  actions: {
    ...check.actions
  }
}

export default webSetting
