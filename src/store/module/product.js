import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
import router from '../../router/router'

// 不良主档
const bad = {
  state: {
    total: 0,
    badList: []
  },
  mutations: {
    // 改变不良数据列表
    changeBadList (state, payload) {
      state.total = payload.total
      state.badList = payload.records
    }
  },
  actions: {
    // 获取不良列表
    async GET_BAD_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.bad.badList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeBadList', data)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 新增不良
    async ADD_BAD ({ dispatch, commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const url = payload.type === 'add' ? api.product.bad.badAdd : api.product.bad.badUpdate
        const { status } = await fetch.post(url, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('A_GET_GLOBAL_BAD_TYPE_LIST')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除不良
    DEL_BAD (context, payload) {
      return fetch.post(api.product.bad.badDel, payload)
    },
    // 获取不良详情
    GET_BAD_DETAIL (context, payload) {
      return fetch.get(api.product.bad.badDetail, { params: payload })
    }
  }
}
// 生产订单
const prod = {
  state: {
    prod: {
      list: [], // 生产订单数据列表
      total: 0, // 订单数据列表total
      detail: {}, // 生产详情数据
      relevanceDoc: [], // 关联单据
      reportTaskDetail: {}, // 报工详情数据
      outsource: { // 成品委外数据
        list: [], // 生产详情关联成品委外数据
        total: 0 // 生产详情关联成品委外数据总数
      },
      processOutsource: { // 工序委外数据
        list: [], // 生产详情关联工序委外数据
        total: 0 // 生产详情关联工序委外数据总数
      },
      reportTask: { // 报工数据
        list: [], // 生产详情关联报工数据
        total: 0 // 生产详情关联报工数据总数
      },
      qualityTest: { // 质检数据
        list: [], // 生产详情关联质检数据
        total: 0 // 生产详情关联质检数据总数
      },
      outbound: { // 领料出库数据
        list: [], // 生产详情关联领料出库数据
        total: 0 // 生产详情关联领料出库数据总数
      },
      putStorage: { // 生产入库数据
        list: [], // 生产详情关联生产入库数据
        total: 0 // 生产详情关联生产入库数据总数
      },
      subHisData: { // 子件操作数据
        list: [], // 子件操作数据
        total: 0 // 子件操作数据总数
      }
    }
  },
  mutations: {
    // 改变生产订单数据列表
    M_SET_PROD_LIST (state, payload = []) {
      state.prod.list = payload
    },
    // 改变生产订单数据列表total
    M_SET_PROD_LIST_TOTAL (state, payload = 0) {
      state.prod.total = payload
    },
    // 生产订单数据 详情
    M_SET_PROD_DETAIL (state, payload = {}) {
      state.prod.detail = payload
    },
    // 生产订单数据 报工详情
    M_SET_PROD_REPORT_TASK_DETAIL (state, payload = {}) {
      state.prod.reportTaskDetail = payload
    },
    // 设置生产订单关联单据
    SET_PROD_RELEVANCE_DOC (state, payload = []) {
      state.prod.relevanceDoc = payload
    },

    // 生产订单关联的   成品委外订单  数据列表
    M_SET_RELEVANCE_OUTSOURCE_LIST (state, payload = []) {
      state.prod.outsource.list = payload
    },
    // 生产订单关联的  成品委外订单  数据列表total
    M_SET_RELEVANCE_OUTSOURCE_LIST_TOTAL (state, payload = 0) {
      state.prod.outsource.total = payload
    },

    // 生产订单关联的   工序委外  订单数据列表
    M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST (state, payload = []) {
      state.prod.processOutsource.list = payload
    },
    // 生产订单关联的  工序委外  订单数据列表total
    M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST_TOTAL (state, payload = 0) {
      state.prod.processOutsource.total = payload
    },

    // 生产订单关联的  报工  数据列表
    M_SET_RELEVANCE_REPORT_TASK_LIST (state, payload = []) {
      state.prod.reportTask.list = payload
    },
    // 生产订单关联的  报工  数据列表total
    M_SET_RELEVANCE_REPORT_TASK_LIST_TOTAL (state, payload = 0) {
      state.prod.reportTask.total = payload
    },

    // 生产订单关联的  质检  数据数据列表
    M_SET_RELEVANCE_QUALITY_TEST_LIST (state, payload = []) {
      state.prod.qualityTest.list = payload
    },
    // 生产订单关联的  质检  数据列表total
    M_SET_RELEVANCE_QUALITY_TEST_LIST_TOTAL (state, payload = 0) {
      state.prod.qualityTest.total = payload
    },

    // 生产订单关联的  领料出库  数据列表
    M_SET_RELEVANCE_OUTBOUND_LIST (state, payload = []) {
      state.prod.outbound.list = payload
    },
    // 生产订单关联的  领料出库  数据列表total
    M_SET_RELEVANCE_OUTBOUND_LIST_TOTAL (state, payload = 0) {
      state.prod.outbound.total = payload
    },

    // 生产订单关联的  生产入库  数据列表
    M_SET_RELEVANCE_PUT_STORAGE_LIST (state, payload = []) {
      state.prod.putStorage.list = payload
    },
    // 生产订单关联的  生产入库  数据列表total
    M_SET_RELEVANCE_PUT_STORAGE_TOTAL (state, payload = 0) {
      state.prod.putStorage.total = payload
    },
    // 子件操作记录数据
    M_GET_PROD_SUB_HIS_LIST (state, payload = []) {
      state.prod.subHisData.list = payload
    },
    // 子件操作记录数据total
    M_GET_PROD_SUB_HIS_TOTAL (state, payload = 0) {
      state.prod.subHisData.total = payload
    }
  },
  actions: {
    // 获取生产订单列表
    async A_GET_PROD_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const url = `${api.product.prod.list}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
        const { status, data } = await fetch.post(url, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_PROD_LIST', data.records)
          commit('M_SET_PROD_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 子件操作历史
    async A_GET_PROD_SUB_HIS ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.product.prod.subHis, { params: payload })
        if (status === 0) {
          commit('M_GET_PROD_SUB_HIS_LIST', data.records)
          commit('M_GET_PROD_SUB_HIS_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 获取生产任务数   母件和子件信息
    A_GET_PROD_PART_SUB_INFO ({ commit }, payload) {
      return fetch.get(api.product.prod.task, { params: payload })
    },
    // 获取生产订单关联订单
    async A_GET_PROD_RELEVANCE_DOC ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.product.prod.relevanceDoc, { params: payload })
        if (status === 0) {
          commit('SET_PROD_RELEVANCE_DOC', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 新增生产订单
    async A_GET_PROD_ADD ({ commit, dispatch }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.product.prod.add, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          if (payload.type === 1) {
            Message.success('保存成功')
            setTimeout(() => {
              router.push({ name: 'prod' })
            }, 500)
          } else {
            const arg = (data && [{
              targetId: data.prodOrderId,
              targetCode: data.prodCode,
              targetType: 'PROD'
            }]) || []
            const res = await dispatch('POST_GLOBAL_AUDITOR', arg)
            if (res.status === 0) {
              Message.success('保存并送审成功')
              setTimeout(() => {
                router.push({ name: 'prod' })
              }, 500)
            }
          }
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 生产订单送审检查
    PROD_SAVE_CHECK_APPROVE ({ commit }, payload) {
      return fetch.post(api.product.prod.saveCheck, payload)
    },
    // 生产订单列表送审前检查
    PROD_LIST_CHECK_APPROVE ({ commit }, payload) {
      return fetch.post(api.product.prod.listCheck, payload)
    },
    // 更新生产订单
    async A_GET_PROD_UPDATE ({ commit, dispatch }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.product.prod.update, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          if (payload.type === 1) {
            Message.success('保存成功')
            setTimeout(() => {
              router.push({ name: 'prod' })
            }, 500)
          } else {
            const arg = (data && [{
              targetId: data.prodOrderId,
              targetCode: data.prodCode,
              targetType: 'PROD'
            }]) || {}
            const res = await dispatch('POST_GLOBAL_AUDITOR', arg)
            if (res.status === 0) {
              Message.success('保存并送审成功')
              setTimeout(() => {
                router.push({ name: 'prod' })
              }, 500)
            }
          }
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除生产订单
    A_GET_PROD_DEL ({ commit }, payload) {
      return fetch.get(api.product.prod.del, { params: payload })
    },
    // 关闭生产订单
    A_GET_PROD_CLOSE ({ commit }, payload) {
      return fetch.get(api.product.prod.close, { params: payload })
    },
    // 打开生产订单
    A_GET_PROD_OPEN ({ commit }, payload) {
      return fetch.get(api.product.prod.open, { params: payload })
    },
    // 获取生产订单详情
    async A_GET_PROD_DETAIL ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.product.prod.detail, { params: payload })
        if (status === 0) {
          commit('M_SET_PROD_DETAIL', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 生产订单关联的成品委外订单
    async A_GET_RELEVANCE_OUTSOURCE_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.prod.outsourceList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_RELEVANCE_OUTSOURCE_LIST', data.records)
          commit('M_SET_RELEVANCE_OUTSOURCE_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 生产订单关联的工序委外订单
    async A_GET_RELEVANCE_PROCESS_OUTSOURCE_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.prod.processOutsourceList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST', data.records)
          commit('M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 生产订单关联的报工数据
    async A_GET_RELEVANCE_REPORT_TASK_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.prod.reportTaskList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_RELEVANCE_REPORT_TASK_LIST', data.records)
          commit('M_SET_RELEVANCE_REPORT_TASK_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 生产订单关联的质检数据
    async A_GET_RELEVANCE_QUALITY_TEST_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.prod.qualityTestList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_RELEVANCE_QUALITY_TEST_LIST', data.records)
          commit('M_SET_RELEVANCE_QUALITY_TEST_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 生产订单关联的领料出库
    async A_GET_RELEVANCE_OUTBOUND_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.prod.outboundList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_RELEVANCE_OUTBOUND_LIST', data.records)
          commit('M_SET_RELEVANCE_OUTBOUND_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 生产订单关联的生产入库
    async A_GET_RELEVANCE_PUT_STORAGE_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.prod.putStorageList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_RELEVANCE_PUT_STORAGE_LIST', data.records)
          commit('M_SET_RELEVANCE_PUT_STORAGE_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 报工初始化数据
    A_GET_REPORT_TASK_INIT ({ commit }, payload) {
      return fetch.get(api.product.prod.reportTaskInit, { params: payload })
    },
    // 新增报工
    async A_GET_PROD_ADD_REPORT_TASK ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(api.product.prod.reportTaskAdd, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.push({
              name: 'prodDetail',
              query: { type: 'reportTask' },
              params: { id: payload.prodOrderId }
            })
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除报工
    REPORT_TASK_DEL ({ commit }, payload) {
      return fetch.get(api.product.prod.reportTaskDel, { params: payload })
    }
  }
}

// 下推订单 PUSH_DOWN
const pushDown = {
  state: {
    pushDown: {
      list: [], // 下推列表
      total: 0, // 下推总数
      sumList: [], // 下推汇总数据
      sumTotal: 0 // 下推汇总数据总数
    }
  },
  mutations: {
    // 改变下推数据列表
    M_SET_PUSH_DOWN_LIST (state, payload = []) {
      state.pushDown.list = payload
    },
    // 改变下推数据列表 total
    M_SET_PUSH_DOWN_LIST_TOTAL (state, payload = 0) {
      state.pushDown.total = payload
    },
    // 改变下推数据汇总列表
    M_SET_SALE_ORDER_SUM_LIST (state, payload = []) {
      state.pushDown.sumList = payload
    },
    // 改变下推数据汇总列表 total
    M_SET_SALE_ORDER_SUM_LIST_TOTAL (state, payload = 0) {
      state.pushDown.sumTotal = payload
    }
  },
  actions: {
    // 获取下推订单列表
    async A_GET_PUSH_DOWN_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.pushDown.list, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_PUSH_DOWN_LIST', data.records)
          commit('M_SET_PUSH_DOWN_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 获取下推订单汇总列表
    async A_GET_SALE_ORDER_SUM_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.product.pushDown.saleOdSum, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_SALE_ORDER_SUM_LIST', data.records)
          commit('M_SET_SALE_ORDER_SUM_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    }
  }
}

// 所有基础数据的组装
const product = {
  state: {
    ...bad.state,
    ...prod.state,
    ...pushDown.state
  },
  mutations: {
    ...bad.mutations,
    ...prod.mutations,
    ...pushDown.mutations
  },
  actions: {
    ...bad.actions,
    ...prod.actions,
    ...pushDown.actions
  }
}

export default product
