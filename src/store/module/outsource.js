/**
 * @author: zhangyh-k@glondon.com
 * @description:
 * @Date: 2020/3/13 17:12
 */
import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
import router from '../../router/router'

// 工序委外订单
const process = {
  state: {
    process: {
      list: [], // 工序委外订单数据列表
      total: 0, // 订单数据列表total
      detail: {} // 工序委外详情数据
    }
  },
  mutations: {
    // 改变工序委外订单数据列表
    M_SET_OUTSOURCE_PROCESS_LIST (state, payload = []) {
      state.process.list = payload
    },
    // 改变工序委外订单数据列表total
    M_SET_OUTSOURCE_PROCESS_LIST_TOTAL (state, payload = 0) {
      state.process.total = payload
    },
    // 工序委外订单数据 详情
    M_SET_OUTSOURCE_PROCESS_DETAIL (state, payload = {}) {
      state.process.detail = payload
    }
  },
  actions: {
    // 获取工序委外订单列表
    async A_GET_OUTSOURCE_PROCESS_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.outsource.process.list, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_OUTSOURCE_PROCESS_LIST', data.records)
          commit('M_SET_OUTSOURCE_PROCESS_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 新增工序委外订单
    async A_GET_OUTSOURCE_PROCESS_ADD ({ commit, dispatch }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.outsource.process.add, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          if (payload.type === 1) {
            Message.success('保存成功')
            setTimeout(() => {
              router.push({ name: 'outsourceProcess' })
            }, 500)
          } else {
            const arg = (data && [{
              targetId: data.supplySeqId,
              targetCode: data.supplySeqCode,
              targetType: 'SUPPLY_SEQ'
            }]) || []
            const res = await dispatch('POST_GLOBAL_AUDITOR', arg)
            if (res.status === 0) {
              Message.success('保存并送审成功')
              setTimeout(() => {
                router.push({ name: 'outsourceProcess' })
              }, 500)
            }
          }
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 工序委外订单送审检查
    OUTSOURCE_PROCESS_SAVE_CHECK_APPROVE ({ commit }, payload) {
      return fetch.post(api.outsource.process.check, payload)
    },
    // 工序委外订单列表送审前检查
    OUTSOURCE_PROCESS_LIST_CHECK_APPROVE ({ commit }, payload) {
      return fetch.post(api.outsource.process.listCheck, payload)
    },
    // 更新工序委外订单
    async A_GET_OUTSOURCE_PROCESS_UPDATE ({ commit, dispatch }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(api.outsource.process.update, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          if (payload.type === 1) {
            Message.success('保存成功')
            setTimeout(() => {
              router.push({ name: 'outsourceProcess' })
            }, 500)
          } else {
            const arg = [{
              targetId: payload.supplySeqId,
              targetCode: payload.supplyCode,
              targetType: 'SUPPLY_SEQ'
            }] || {}
            const res = await dispatch('POST_GLOBAL_AUDITOR', arg)
            if (res.status === 0) {
              Message.success('保存并送审成功')
              setTimeout(() => {
                router.push({ name: 'outsourceProcess' })
              }, 500)
            }
          }
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除工序委外订单
    A_GET_OUTSOURCE_PROCESS_DEL ({ commit }, payload) {
      return fetch.get(api.outsource.process.del, { params: payload })
    },
    // 关闭工序委外订单
    A_GET_OUTSOURCE_PROCESS_CLOSE ({ commit }, payload) {
      return fetch.get(api.outsource.process.close, { params: payload })
    },
    // 打开工序委外订单
    A_GET_OUTSOURCE_PROCESS_OPEN ({ commit }, payload) {
      return fetch.get(api.outsource.process.open, { params: payload })
    },
    // 工序委外订单关联生产订单
    A_GET_OUTSOURCE_PROCESS_RELEVANCE_DOC ({ commit }, payload) {
      return fetch.get(api.outsource.process.relevanceDoc, { params: payload })
    },
    // 获取委外收回初始化数据
    A_GET_OUTSOURCE_PROCESS_TAKE_BACK_INIT ({ commit }, payload) {
      return fetch.get(api.outsource.process.takeBackInit, { params: payload })
    },
    // 获取委外收回校验
    A_GET_OUTSOURCE_PROCESS_TAKE_BACK_CHECK ({ commit }, payload) {
      return fetch.post(api.outsource.process.takeBackCheck, payload)
    },
    // 获取委外收回新增
    A_GET_OUTSOURCE_PROCESS_TAKE_BACK_ADD ({ commit }, payload) {
      return fetch.post(api.outsource.process.takeBackAdd, payload)
    },
    // 获取委外收回新增
    A_GET_OUTSOURCE_PROCESS_TAKE_BACK_DEL ({ commit }, payload) {
      return fetch.get(api.outsource.process.takeBackDel, { params: payload })
    },
    // 获取工序委外订单详情
    async A_GET_OUTSOURCE_PROCESS_DETAIL ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.outsource.process.detail, { params: payload })
        if (status === 0) {
          commit('M_SET_OUTSOURCE_PROCESS_DETAIL', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    }
  }
}

// 成品
const outProduct = {
  state: {
    list: [],
    total: 0
  },
  mutations: {
  },
  actions: {
    A_GET_OUT_PRODUCT_LIST ({ commit }, payload) {
      return fetch.post(`${api.outsource.outProduct.list}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`, payload)
    },
    A_ADD_OUT_PRODUCT ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        return fetch.post(api.outsource.outProduct.addProduct, payload)
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
        return {}
      }
    },
    A_GET_SALE_OUT_DETAIL ({ commit }, payload) {
      return fetch.post(api.outsource.outProduct.getSaleDetail, payload)
    },
    A_DEL_OUT_PRODUCT_ORDER ({ commit }, payload) {
      return fetch.get(api.outsource.outProduct.del, { params: payload })
    },
    A_GET_OUT_PRODUCT_ORDER_DETAIL ({ commit }, payload) {
      return fetch.get(api.outsource.outProduct.detail, { params: payload })
    },
    A_GET_CHANGE_OPEN ({ commit }, payload) {
      return fetch.get(api.outsource.outProduct.open, { params: payload })
    },
    A_GET_CHANGE_CLOSE ({ commit }, payload) {
      return fetch.get(api.outsource.outProduct.close, { params: payload })
    },
    A_EDIT_OUT_PRODUCT_ORDER ({ commit }, payload) {
      return fetch.post(api.outsource.outProduct.edit, payload)
    },
    A_CHECK_OUT_PRODUCT_ORDER ({ commit }, payload) {
      return fetch.post(api.outsource.outProduct.saveCheck, payload)
    },
    A_CHECK_OUT_PRODUCT_ORDER_LIST ({ commit }, payload) {
      return fetch.post(api.outsource.outProduct.check, payload)
    },
    A_GET_ORDER_PLAN ({ commit }, payload) {
      return fetch.get(api.outsource.outProduct.orderPlan, { params: payload })
    }
  }
}

// 所有基础数据的组装
const outsource = {
  state: {
    ...process.state,
    ...outProduct.state
  },
  mutations: {
    ...process.mutations,
    ...outProduct.mutations
  },
  actions: {
    ...process.actions,
    ...outProduct.actions
  }
}

export default outsource
