import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
import router from '../../router/router'

const wareIn = {
  state: {
    wareInList: [],
    total: 0,
    detail: {}
  },
  mutations: {
    M_SET_WARE_IN_LIST (state, payload = {}) {
      state.wareInList = payload.records
      state.total = payload.total
    },
    M_SET_DETAIL (state, payload = {}) {
      state.detail = payload
    }
  },
  actions: {
    async A_GET_WARE_IN_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.wareIn.list}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_WARE_IN_LIST', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    async A_ADD_WARE_IN ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.wareIn.addWareIn, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('新增成功')
          if (payload.status === 'stockIn') {
            return { data }
          }
          router.push({ name: 'warehouseIn', type: 'add' })
        }
        return {}
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
        return {}
      }
    },
    async A_GET_DETAIL ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.wareIn.detail, { params: payload })
        if (status === 0) {
          commit('M_SET_DETAIL', data)
          return { data }
        }
        return {}
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    A_GET_ORDER_DETAIL ({ commit }, payload) {
      return fetch.post(api.wareIn.orderDetail, payload)
    },
    A_GET_WARE_MATERIAL_DETAIL ({ commit }, payload) {
      return fetch.get(api.wareIn.materialDetail, { params: payload })
    },
    A_GET_WARE_MATERIAL_IN ({ commit }, payload) {
      return fetch.post(api.wareIn.materialWareIn, payload)
    }
  }
}
const wareOut = {
  state: {
    wareOutList: [],
    outTotal: 0,
    wareDetail: {}
  },
  mutations: {
    M_SET_WARE_OUT_LIST (state, payload = {}) {
      state.wareOutList = payload.records
      state.outTotal = payload.total
    },
    M_SET_WARE_OUT_DETAIL (state, payload = {}) {
      state.wareDetail = payload
    }
  },
  actions: {
    async A_GET_WARE_OUT_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.wareOut.list}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_WARE_OUT_LIST', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    async A_ADD_WARE_OUT ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(api.wareOut.addWareOut, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('新增成功')
          if (payload.status === 'stockOut') {
            return { data }
          }
          router.push({ name: 'warehouseOut', type: 'add' })
        } else {
          commit('BTN_LOADING')
        }
        return {}
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
        return {}
      }
    },
    A_GET_WARE_OUT_MATERIAL_DETAIL ({ commit }, payload) {
      return fetch.get(api.wareOut.materialDetail, { params: payload })
    },
    A_GET_WARE_MATERIAL_OUT ({ commit }, payload) {
      return fetch.post(api.wareOut.materialWareOut, payload)
    },
    async A_GET_WARE_OUT_DETAIL ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.wareOut.detail, { params: payload })
        if (status === 0) {
          commit('M_SET_WARE_OUT_DETAIL', data)
          return { data }
        }
        return {}
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    A_GET_WARE_MATERIAL_AMOUNT ({ commit }, payload) {
      return fetch.post(api.wareOut.materialAmount, payload)
    }

  }
}

const allocation = {
  state: {
    allocation: {
      total: 0,
      getAllocationList: []
    }
  },
  mutations: {
    CHANGE_ALLOCATION_LIST (state, payload) {
      state.allocation.total = payload.total
      state.allocation.getAllocationList = payload.records
    }
  },
  actions: {
    // 获取调拨列表
    async GET_ALLOCATION_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.allocation.list, { params: payload })
        if (status === 0) {
          commit('CHANGE_ALLOCATION_LIST', data)
        }
        commit('TABLE_LOADING')
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增调拨
    ADD_ALLOCATION_LIST (context, payload) {
      return fetch.post(api.allocation.add, payload)
    },
    // 调拨详情
    DETAIL_ALLOCATION (context, payload) {
      return fetch.get(api.allocation.detail, { params: payload })
    }
  }
}

// 库存报表
const report = {
  state: {
    report: {
      getReportList: [],
      total: 0
    }
  },
  mutations: {
    CHANGE_REPORT_LIST (state, payload) {
      state.report.total = payload.total
      state.report.getReportList = payload.records
    }
  },
  actions: {
    // 获取库存报表
    async GET_REPORT_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(`${api.report.list}`, { params: payload })
        if (status === 0) {
          commit('CHANGE_REPORT_LIST', data)
        }
        commit('TABLE_LOADING')
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
      }
    },
    // 获取库存详情
    GET_REPORT_DETAIL ({ commit }, payload) {
      const url = `${api.report.detail}?id=${payload.id}`
      return fetch.post(url)
    },
    // 获取出入库记录
    GET_RECORD_PAGES ({ commit }, payload) {
      return fetch.get(api.report.record, { params: payload })
    }
  }
}

// 初始化库存
const initialization = {
  state: {
    initialization: {
      total: 0,
      showBtn: false,
      getInitializationList: []
    }
  },
  mutations: {
    CHANGE_INITIALIZATION_LIST (state, payload) {
      state.initialization.total = payload.total
      state.initialization.showBtn = payload.showBtn
      state.initialization.getInitializationList = payload.records
    }
  },
  actions: {
    // 获取初始化库存
    async GET_INITIALIZATION_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.initialization.list, { params: payload })
        if (status === 0) {
          data.showBtn = data.records.length === 0
          commit('CHANGE_INITIALIZATION_LIST', data)
        }
        commit('TABLE_LOADING')
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
      }
    },
    // 获取仓库主档
    GET_STOCK_WAREHOUSE_LIST ({ commit }, payload) {
      return fetch.get(api.global.houseDic)
    },
    // 获取库存详情
    async GET_WAREHOUSE_DETAIL ({ commit }, payload) {
      const url = `${api.initialization.detail}?id=${payload.id}`
      return fetch.post(url)
    }
    // 初始化库存
    // async GET_UPLOAD_TEMPLATE ({ commit }, payload) {
    //   return fetch.post(api.initialization.init, payload, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   })
    // }
  }
}

// 盘点
const inventory = {
  state: {
    inventory: {
      total: 0,
      getInventoryList: []
    }
  },
  mutations: {
    CHANGE_INVENTORY_LIST (state, payload) {
      state.inventory.total = payload.total
      state.inventory.getInventoryList = payload.records
    }
  },
  actions: {
    // 获取盘点列表
    async GET_INVENTORY_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const url = `${api.inventory.list}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
        const { status, data } = await fetch.post(url, payload)
        if (status === 0) {
          commit('CHANGE_INVENTORY_LIST', data)
        }
        commit('TABLE_LOADING')
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 获取盘点列表
    ADD_INVENTORY_LIST ({ commit }, payload) {
      return fetch.post(api.inventory.add, payload)
    },
    // 获取盘点详情
    DETAIL_INVENTORY_ORDER ({ commit }, payload) {
      return fetch.get(api.inventory.detail, { params: payload })
    },
    // 获取当前仓库列表
    GET_ALL_MATERIAL ({ commit }, payload) {
      const url = `${api.inventory.allList}?warehouseId=${payload.baseWarehouseId}`
      return fetch.get(url)
    }
  }
}

const ware = {
  state: {
    ...wareIn.state,
    ...wareOut.state,
    ...allocation.state,
    ...report.state,
    ...initialization.state,
    ...inventory.state
  },
  mutations: {
    ...wareIn.mutations,
    ...wareOut.mutations,
    ...allocation.mutations,
    ...report.mutations,
    ...initialization.mutations,
    ...inventory.mutations
  },
  actions: {
    ...wareIn.actions,
    ...wareOut.actions,
    ...allocation.actions,
    ...report.actions,
    ...initialization.actions,
    ...inventory.actions
  }
}

export default ware
