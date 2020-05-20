/**
 * @author: lzx
 * @description:
 * @Date: 2019/8/13 9:19
 */
// import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
// import router from '../../router/router'
// import * as urls from '../../router/routePath'

// 供应商主档
const sales_list = {
  state: {
    sales_list: {
      total: 0,
      salesList: []
    }
  },
  mutations: {
    // 改变销售列表
    changeSalesList (state, payload) {
      state.sales_list.total = payload.total
      state.sales_list.salesList = payload.records
    }
  },
  actions: {
    // 新增销售
    ADD_SALES_ORDER ({ dispatch }, payload) {
      const url = payload.type === 'add' ? api.sales.singleSale.addSalesOrder : api.sales.singleSale.updateSalesOrder
      return fetch.post(url, payload)
    },
    // 获取销售主档列表
    GET_SALES_LIST ({ commit }, payload) {
      // try {
      const url = `${api.sales.singleSale.listSalesOrder}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
      return fetch.post(url, payload)
      // const { status, data } = await fetch.post(url, payload)
      // if (status === 0) {
      //   data.records = data.records.map((item, index) => ({
      //     index,
      //     ...item
      //   }))
      //   commit('changeSalesList', data)
      // }
      // } catch (e) {
      //   console.log(e)
      // }
    },
    // 获取销售个人主档列表
    GET_SALES_SINGLE_LIST ({ commit }, payload) {
      // try {
      const url = `${api.sales.singleSale.listSingleOrder}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
      return fetch.post(url, payload)
    },
    // 删除销售订单
    DEL_SALES_lIST (context, payload) {
      const url = `${api.sales.singleSale.deleteSalesOrder}?saleOrderId=${payload.saleOrderId}`
      return fetch.post(url)
    },
    // 获取销售订单详情
    DETAIL_SALES_ORDER (context, payload) {
      const url = `${api.sales.singleSale.detailSalesOrder}?saleOrderId=${payload.id}`
      return fetch.get(url)
    },
    // 获取关联数据
    GET_RELATION_lIST (context, payload) {
      let url = ''
      switch (payload.type) {
        case 'product':
          url = api.sales.singleSale.relationProduct
          break
        case 'outStock':
          url = api.sales.singleSale.relationOutStock
          break
        case 'returnGoods':
          url = api.sales.singleSale.relationReturnGoods
          break
        case 'outsourcing':
          url = api.sales.singleSale.relationOutsourcing
          break
        case 'apply':
          url = api.sales.singleSale.relationApply
          break
        case 'purchase':
          url = api.sales.singleSale.relationPurchase
          break
        default:
          break
      }
      const requestUrl = `${url}?saleOrderId=${payload.id}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
      return fetch.get(requestUrl)
    },
    // 打开销售订单
    OPEN_SALES_LIST (context, payload) {
      const url = `${api.sales.singleSale.open}?saleOrderId=${payload.saleOrderId}`
      return fetch.post(url)
    },
    // 关闭销售订单
    CLOSE_SALES_LIST (context, payload) {
      const url = `${api.sales.singleSale.close}?saleOrderId=${payload.saleOrderId}`
      return fetch.post(url)
    }
  }
}

// 所有基础数据的组装
const sales = {
  state: {
    ...sales_list.state
  },
  mutations: {
    ...sales_list.mutations
  },
  actions: {
    ...sales_list.actions
  }
}

export default sales
