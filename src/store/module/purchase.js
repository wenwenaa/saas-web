import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
import router from '../../router/router'

const purchasetype = {
  state: {
    purchaseObj: {
      purchaseAllList: [],
      purchasePersonalList: [],
      purchaseOrderList: [],
      OrderPersonalList: [],
      allTotal: 0,
      personalTotal: 0,
      orderTotal: 0,
      orderPersonalTotal: 0
    }
  },
  mutations: {
    // 改变采购列表全部
    M_SET_ALL_LIST (state, payload) {
      state.purchaseObj.purchaseAllList = payload
    },
    // 改变采购全部数据列表total
    M_SET_All_LIST_TOTAL (state, payload = 0) {
      state.purchaseObj.allTotal = payload
    },
    // 改变采购列表个人
    M_SET_PERSONAL_LIST (state, payload) {
      state.purchaseObj.purchasePersonalList = payload
    },
    // 改变采购个人数据列表total
    M_SET_PERSONAL_LIST_TOTAL (state, payload = 0) {
      state.purchaseObj.personalTotal = payload
    },
    // 改变采购订单列表全部
    M_SET_ORDER_LIST (state, payload) {
      state.purchaseObj.purchaseOrderList = payload
    },
    // 改变采购订单全部数据列表total
    M_SET_ORDER_LIST_TOTAL (state, payload = 0) {
      state.purchaseObj.orderTotal = payload
    },
    // 改变采购订单列表个人
    M_SET_ORDER_PERSONAL_LIST (state, payload) {
      state.purchaseObj.OrderPersonalList = payload
    },
    // 改变采购订单个人数据列表total
    M_SET_ORDER_PERSONAL_LIST_TOTAL (state, payload = 0) {
      state.purchaseObj.orderPersonalTotal = payload
    }
  },
  actions: {
    // 获取采购申请单列表-全部
    async GET_PURCHASE_ALL_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.purchase.allPage, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_ALL_LIST', data.records)
          commit('M_SET_All_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 获取采购申请单列表-个人
    async GET_PURCHASE_PERSONAL_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.purchase.personalPage, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_PERSONAL_LIST', data.records)
          commit('M_SET_PERSONAL_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 新增采购申请单（无来源）
    async ADD_PURCHASE_TYPE (context, payload) {
      try {
        const { status, data } = await fetch.post(api.purchase.addNoSource, payload)
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 获取采购成品详情
    DETAIL_FINISHED_TYPE (context, payload) {
      return fetch.get(api.purchase.detailFinished, { params: payload })
    },
    // 新增采购申请单（成品）
    async ADD_PURCHASE_FINISHED_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.addFinished, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.push({
              name: 'applyPersonal'
            })
          }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return {}
      }
    },
    // 新增采购申请单（非成品）
    async ADD_PURCHASE_NON_FINISHED_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.addNonFinished, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.push({
              name: 'applyPersonal'
            })
          }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return {}
      }
    },
    // 获取采购子件详情
    DETAIL_SUBPART_TYPE (context, payload) {
      return fetch.get(api.purchase.detailSubpart, { params: payload })
    },
    // 删除采购申请
    async DELETE_PURCHASE_TYPE (context, payload) {
      try {
        const { status } = await fetch.post(`${api.purchase.delApply}?purchaseApplyId=${payload}`, payload)
        return { status }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 采购申请详情（无来源、成品、非成品）
    DETAIL_APPLY_TYPE (context, payload) {
      return fetch.get(api.purchase.applyDetail, { params: payload })
    },
    // 编辑采购申请
    async EDIT_APPLY_TYPE (context, payload) {
      try {
        const { status } = await fetch.post(`${api.purchase.applyEdit}`, payload)
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
        return { status }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 获取采购订单列表-全部
    async GET_ORDER_ALL_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.purchase.orderPage, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          // commit('M_SET_ORDER_LIST', data.records)
          commit('M_SET_ORDER_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 获取采购订单列表-个人
    async GET_ORDER_PERSONAL_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.purchase.orderPersonalPage, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_ORDER_PERSONAL_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
        return {}
      }
    },
    // 关闭采购申请
    async CLOSE_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.close}?purchaseApplyId=${payload.purchaseApplyId}`, payload)
    },
    // 打开采购申请
    async OPEN_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.open}?purchaseApplyId=${payload.purchaseApplyId}`, payload)
    },
    // 新增无来源采购订单
    async ADDORDER_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.addOrder, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
        return { }
      }
    },
    // 编辑无来源采购订单
    async EDITORDER_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.editOrder, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          // setTimeout(() => {
          //   router.go(-1)
          // }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
        return { }
      }
    },
    // 无来源采购订单查看详情
    DETAILORDER_PURCHASE_TYPE (context, payload) {
      return fetch.get(api.purchase.detailOrder, { params: payload })
    },
    // 采购订单删除
    DELETEORDER_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.deleteOrder}?purchaseOrderId=${payload}`)
    },
    // 新增采购申请下推采购订单
    async ADDDOWN_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.addDown, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return { }
      }
    },
    // 编辑采购申请下推采购订单
    async EDITDOWN_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.editDown, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return { }
      }
    },
    // 采购申请页面跳转详情
    DETAILDOWN_PURCHASE_TYPE (context, payload) {
      return fetch.post(api.purchase.detailDown, payload)
    },
    // 新增销售非成品下推采购订单
    async NONFINADD_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.NonfinAdd, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return { }
      }
    },
    // 编辑销售非成品下推采购订单
    async NONFINEDIT_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.NonfinEdit, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return { }
      }
    },
    // 新增销售成品下推采购订单
    async FINISHEDADD_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.finishedAdd, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return { }
      }
    },
    // 编辑销售成品下推采购订单
    async FINISHEDEDIT_PURCHASE_TYPE ({ commit }, payload) {
      try {
        commit('MODAL_LOADING', true)
        const { status, data } = await fetch.post(api.purchase.finishedEdit, payload)
        commit('MODAL_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
        return { status, data }
      } catch (e) {
        commit('MODAL_LOADING')
        console.log(e)
        return { }
      }
    },
    // 销售订单下推(采购申请下推)采购订单查看详情
    DETAILQUERY_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.detailQuery}?purchaseOrderId=${payload}`)
    },
    // 送审数据校验（销售成品下推）
    APPROVELIST_PURCHASE_TYPE (context, payload) {
      return fetch.post(api.purchase.approveList, payload)
    },
    // 编辑销售成品下推采购订单
    APPROVESEND_PURCHASE_TYPE (context, payload) {
      return fetch.post(api.purchase.approveSend, payload)
    },
    // 销售订单送审校验
    SALEORDERCENSOR_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.saleOrderCensor}?purchaseOrderId=${payload}`, payload)
    },
    // 销售订单保存并送审时校验
    SALEORDERSAVE_PURCHASE_TYPE (context, payload) {
      return fetch.post(api.purchase.saleOrderSave, payload)
    },
    // 关闭采购订单
    ORDERCLOSE_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.orderClose}?purchaseOrderId=${payload.purchaseOrderId}`, payload)
    },
    // 打开采购订单
    ORDEROPEN_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.orderOpen}?purchaseOrderId=${payload.purchaseOrderId}`, payload)
    },
    // 采购申请单送审校验
    ORDERCENSOR_PURCHASE_TYPE (context, payload) {
      return fetch.get(`${api.purchase.saleOrderDown}?purchaseOrderId=${payload}`, payload)
    },
    // 采购申请单保存并送审时校验
    ORDERSAVEDOWN_PURCHASE_TYPE (context, payload) {
      return fetch.post(api.purchase.saleOrderSaveDown, payload)
    }
  }
}

// 采购数据的组装
const purchase = {
  state: {
    ...purchasetype.state
  },
  mutations: {
    ...purchasetype.mutations
  },
  actions: {
    ...purchasetype.actions
  }
}

export default purchase
