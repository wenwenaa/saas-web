/**
 * @author: lzx
 * @description:
 * @Date: 2019/8/13 9:19
 */
import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
import router from '../../router/router'
import * as urls from '../../router/routePath'

// bom接口
const bom = {
  state: {
    bom: {
      list: [], // bom数据
      partBom: {}, // bom详情数据
      structureTree: [], // bom结构(跟版本走)
      total: 0, // bom总条数
      childList: [], // bom子件数据(跟版本走)
      versionList: [] // 版本数据
    }
  },
  mutations: {
    // bom 列表数据
    M_SET_BOM_LIST (state, payload = []) {
      state.bom.list = payload
    },
    // bom 列表数据总数
    M_SET_BOM_LIST_TOTAL (state, payload = 0) {
      state.bom.total = payload
    },
    // 母件详情
    M_SET_BOM_DETAIL (state, payload = {}) {
      state.bom.partBom = payload
    },
    // bom子件 列表数据
    M_SET_BOM_CHILD_LIST (state, payload = []) {
      state.bom.childList = payload
    },
    // bom 结构
    M_SET_BOM_STRUCTURE_LIST (state, payload = []) {
      state.bom.structureTree = payload
    },
    // bom 版本
    M_SET_BOM_VERSION_LIST (state, payload = []) {
      state.bom.versionList = payload
    }
  },
  actions: {
    // bom（母件）列表
    async A_GET_BOM_LIST ({ commit }, payload) {
      try {
        const { pageIndex, pageSize, ...arg } = payload
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.bom.list}?pageIndex=${pageIndex}&pageSize=${pageSize}`, arg)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_BOM_LIST', data.records)
          commit('M_SET_BOM_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // bom（母件）新增
    async A_BOM_ADD ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.bom.add}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          router.push({ name: 'bomDetail', params: { id: data.baseBomId }})
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // bom（母件）删除
    A_BOM_DEL ({ commit }, payload) {
      return fetch.get(api.base.bom.del, { params: payload })
    },
    // bom结构数据
    async A_GET_BOM_STRUCTURE_LIST ({ commit, dispatch }, payload) {
      try {
        commit('SIDEBAR_LOADING', true)
        const { status, data } = await fetch.get(api.base.bom.structure, { params: payload })
        commit('SIDEBAR_LOADING')
        if (status === 0) {
          commit('M_SET_BOM_STRUCTURE_LIST', data)
        }
        return { status, data }
      } catch (e) {
        commit('SIDEBAR_LOADING')
        console.log(e)
        return {}
      }
    },
    // bom结构数据 用于复用功能
    async A_GET_BOM_STRUCTURE_LIST_V2 ({ commit, dispatch }, payload) {
      try {
        commit('SIDEBAR_LOADING', true)
        const { status, data } = await fetch.get(api.base.bom.structure, { params: payload })
        commit('SIDEBAR_LOADING')
        return { status, data }
      } catch (e) {
        commit('SIDEBAR_LOADING')
        console.log(e)
        return {}
      }
    },
    // bom复用
    A_GET_BOM_MULTIPLEX ({ commit, dispatch }, payload) {
      return fetch.post(`${api.base.bom.multiplex}`, payload)
    },
    // bom版本数据列表
    async A_GET_BOM_VERSION_LIST ({ commit, dispatch }, payload) {
      try {
        const { status, data } = await fetch.get(api.base.bom.version, { params: payload })
        if (status === 0) {
          commit('M_SET_BOM_VERSION_LIST', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // bom版本数据列表
    A_GET_BOM_VERSION_LIST_V2 ({ commit, dispatch }, payload) {
      return fetch.get(api.base.bom.version, { params: payload })
    },
    // 更新版本名称
    A_UPDATE_BOM_VERSION_NAME ({ commit }, payload) {
      return fetch.post(`${api.base.bom.updateVerName}`, payload)
    },
    // 更新子件用量
    A_UPDATE_BOM_USE_COUNT ({ commit }, payload) {
      return fetch.post(`${api.base.bom.childUpdate}`, payload)
    },
    // bom版本复制
    async A_GET_BOM_VERSION_COPY ({ commit }, payload) {
      return fetch.post(`${api.base.bom.copy}`, payload)
    },
    // 设置bom默认版本
    A_GET_BOM_VERSION_DEFAULT ({ commit }, payload) {
      return fetch.post(`${api.base.bom.setDefault}?baseBomId=${payload.baseBomId}&bomVersionId=${payload.bomVersionId}`, payload)
    },
    // 设置bom是否启用
    A_GET_BOM_VERSION_ENABLE_FLAG ({ commit }, payload) {
      return fetch.post(`${api.base.bom.enableFlag}`, payload)
    },
    // 删除版本
    A_GET_BOM_VERSION_DEL ({ commit, rootState }, payload) {
      return fetch.post(`${api.base.bom.verDel}`, payload)
    },
    // bom（母件）详情   bom结构中的母件详情
    async A_BOM_PART_DETAIL ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.base.bom.detail, { params: payload })
        if (status === 0) {
          commit('M_SET_BOM_DETAIL', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // bom（子件）详情   bom结构中的子件件详情
    async A_BOM_CHILD_DETAIL ({ commit }, payload) {
      try {
        const { status, data } = await fetch.post(`${api.base.bom.childDetail}`, payload)
        if (status === 0) {
          commit('M_SET_BOM_DETAIL', data)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // bom（子件）列表
    async A_GET_BOM_CHILD_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.post(`${api.base.bom.childList}`, payload)
        if (status === 0) {
          commit('M_SET_BOM_CHILD_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // bom（子件）新增
    A_BOM_CHILD_ADD ({ commit }, payload) {
      return fetch.post(`${api.base.bom.childAdd}`, payload)
    },
    // bom（子件）删除
    A_BOM_CHILD_DEL ({ commit }, payload) {
      return fetch.post(`${api.base.bom.childDel}`, payload)
    }
  }
}

// 物料主档接口
const material = {
  state: {
    material: {
      list: [], // 物料数据
      materialCode: '',
      total: 0, // 物料总条数
      batchIds: []
    }
  },
  mutations: {
    // material 列表数据
    M_SET_MATERIAL_LIST (state, payload = []) {
      state.material.list = payload
    },
    // material 列表数据总数
    M_SET_MATERIAL_LIST_TOTAL (state, payload = 0) {
      state.material.total = payload
    },
    // material 批量删除
    M_SET_MATERIAL_DELETE (state, payload = 0) {
      state.material.batchIds = payload
    }
  },
  actions: {
    // 物料主档列表
    async A_GET_MATERIAL_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.material.page}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_MATERIAL_LIST', data.records)
          commit('M_SET_MATERIAL_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // 物料主档新增
    async A_MATERIAL_ADD ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.material.add}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          router.push({ path: urls.BASE_MATERIAL, query: { id: data }})
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 物料主档编辑
    async A_MATERIAL_EDIT ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.material.update}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          router.push({ path: urls.BASE_MATERIAL, query: { id: data }})
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 物料批量删除
    async A_MATERIAL_DELETE ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.material.delete}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_MATERIAL_DELETE', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 物料查看详情
    A_GET_MATERIAL_DETAIL ({ commit }, payload) {
      return fetch.get(api.base.material.detail, { params: payload })
    }
  }
}

// 工序主档接口
const process = {
  state: {
    process: {
      list: [], // 工序数据
      total: 0, // 工序总条数
      batchIds: []
    }
  },
  mutations: {
    // 工序列表数据
    M_SET_PROCESS_LIST (state, payload = []) {
      state.process.list = payload
    },
    // 工序列表数据总数
    M_SET_PROCESS_LIST_TOTAL (state, payload = 0) {
      state.process.total = payload
    },
    // 工序批量删除
    M_SET_PROCESS_DELETE (state, payload = 0) {
      state.process.batchIds = payload
    }
  },
  actions: {
    // 工序列表
    async A_GET_PROCESS_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { pageIndex, pageSize, ...arg } = payload
        const { status, data } = await fetch.post(`${api.base.process.page}?pageIndex=${pageIndex}&pageSize=${pageSize}`, arg)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_PROCESS_LIST', data.records)
          commit('M_SET_PROCESS_LIST_TOTAL', data.total)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 工序主档新增
    async A_PROCESS_ADD ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.process.add}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          router.push({ path: urls.BASE_PROCESS, query: { id: data }})
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 工序主档编辑
    async A_PROCESS_EDIT ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.process.edit}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          router.push({ path: urls.BASE_PROCESS, query: { id: data }})
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 工序批量删除
    async A_PROCESS_DELETE ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.process.deleteList}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_PROCESS_DELETE', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // 工序查看详情
    A_GET_PROCESS_DETAIL ({ commit }, payload) {
      return fetch.get(api.base.process.detail, { params: payload })
    }
  }
}

// 图号主档接口
const drawNum = {
  state: {
    drawNum: {
      list: [], // 工序数据
      total: 0, // 工序总条数
      batchIds: []
    }
  },
  mutations: {
    // 图号列表数据
    M_SET_DRAW_NUM_LIST (state, payload = []) {
      state.drawNum.list = payload
    },
    // 图号列表数据总数
    M_SET_DRAW_NUM_LIST_TOTAL (state, payload = 0) {
      state.drawNum.total = payload
    },
    // 图号批量删除
    M_SET_DRAW_NUM_DELETE (state, payload = 0) {
      state.drawNum.batchIds = payload
    }
  },
  actions: {
    // 图号列表
    async A_GET_DRAW_NUM_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.drawNum.page}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_DRAW_NUM_LIST', data.records)
          commit('M_SET_DRAW_NUM_LIST_TOTAL', data.total)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 图号主档编辑
    async A_DRAW_NUM_EDIT ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.drawNum.update}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          router.push({ path: urls.BASE_DRAW_NUM, query: { id: data }})
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 图号批量删除
    async A_DRAW_NUM_DELETE ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.drawNum.deleteList}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_DRAW_NUM_DELETE', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // 图号查看详情
    A_GET_DRAW_NUM_DETAIL ({ commit }, payload) {
      return fetch.get(api.base.drawNum.detail, { params: payload })
    }
  }
}

// 工艺路线接口
const routing = {
  state: {
    routing: {
      list: [], // 工序数据
      total: 0, // 工序总条数
      batchIds: []
    }
  },
  mutations: {
    // 工艺路线列表数据
    M_SET_ROUTING_LIST (state, payload = []) {
      state.routing.list = payload
    },
    // 工艺路线列表数据总数
    M_SET_ROUTING_LIST_TOTAL (state, payload = 0) {
      state.routing.total = payload
    },
    // 工艺路线批量删除
    M_SET_ROUTING_DELETE (state, payload = 0) {
      state.routing.batchIds = payload
    }
  },
  actions: {
    // 工艺路线列表
    async A_GET_ROUTING_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { pageIndex, pageSize, ...arg } = payload
        const { status, data } = await fetch.post(`${api.base.routing.page}?pageIndex=${pageIndex}&pageSize=${pageSize}`, arg)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_ROUTING_LIST', data.records)
          commit('M_SET_ROUTING_LIST_TOTAL', data.total)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 工艺路线新增
    async A_ROUTING_ADD ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(`${api.base.routing.add}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 工艺路线主档编辑
    async A_ROUTING_EDIT ({ commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(`${api.base.routing.edit}`, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 工艺路线批量删除
    async A_ROUTING_DELETE ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(`${api.base.routing.deleteList}`, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_ROUTING_DELETE', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // 工艺路线查看详情
    A_GET_ROUTING_DETAIL ({ commit }, payload) {
      return fetch.get(api.base.routing.detail, { params: payload })
    },
    // 查询所有工序（不分页）
    A_GET_ROUTING_NO_LIST ({ commit }, payload) {
      return fetch.get(api.base.routing.list, { params: payload })
    }
  }
}

// 设备主档
const equipment = {
  state: {
    total: 0,
    equipmentList: []
  },
  mutations: {
    // 改变设备数据列表
    changeEquipmentList (state, payload) {
      state.total = payload.total
      state.equipmentList = payload.records
    }
  },
  actions: {
    // 获取设备列表
    async GET_EQUIPMENT_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const url = `${api.base.equipment.equipmentList}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
        const { status, data } = await fetch.post(url, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeEquipmentList', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增设备
    async ADD_EQUIPMENT ({ dispatch, commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const url = payload.type === 'add' ? api.base.equipment.equipmentAdd : api.base.equipment.equipmentUpdate
        const { status } = await fetch.post(url, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('A_GET_GLOBAL_EQUIPMENT_LIST')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除设备
    DEL_EQUIPMENT (context, payload) {
      return fetch.post(api.base.equipment.equipmentDel, payload)
    },
    // 获取设备详情
    GET_EQUIPMENT_DETAIL (context, payload) {
      return fetch.get(api.base.equipment.equipmentDetail, { params: payload })
    }
  }
}

// 物料类型主档
const materialtype = {
  state: {
    materialtypeList: []
  },
  mutations: {
    // 改变设备数据列表
    changeMaterialtype (state, payload) {
      state.materialtypeList = payload
    }
  },
  actions: {
    // 获取设备列表
    async GET_MATERIAL_TYPE_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.base.materialtype.materialtypeList, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeMaterialtype', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增设备
    async ADD_MATERIAL_TYPE ({ dispatch, commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(api.base.materialtype.materialtypeAdd, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('A_GET_MATERIAL_TYPE_DIC_LIST')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除设备
    DEL_MATERIAL_TYPE (context, payload) {
      const url = `${api.base.materialtype.materialtypeDel}?id=${payload.baseMaterialTypeId}`
      return fetch.get(url)
    }
  }
}

// 计量单位主档
const metering = {
  state: {
    meterUnitList: []
  },
  mutations: {
    // 改变计量单位数据列表
    changeMetering (state, payload) {
      state.meterUnitList = payload
    }
  },
  actions: {
    // 获取计量单位列表
    async GET_METERING_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.base.metering.meteringList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeMetering', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增计量单位
    async ADD_METERING_TYPE ({ dispatch, commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(api.base.metering.meteringAdd, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('A_GET_UNIT_DIC_LIST')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 计量单位删除
    DEL_METERING_TYPE (context, payload) {
      const url = `${api.base.metering.meteringDel}?id=${payload.baseUnitId}`
      return fetch.get(url)
    }
  }
}

// 客户主档
const customer = {
  state: {
    total: 0,
    customerList: []
  },
  mutations: {
    // 改变客户主档列表
    changeCustomerList (state, payload) {
      state.total = payload.total
      state.customerList = payload.records
    }
  },
  actions: {
    // 获取客户主档
    async GET_CUSTOMER_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const url = `${api.base.customer.customerList}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
        const { status, data } = await fetch.post(url, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeCustomerList', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增客户主档
    async ADD_CUSTOMER ({ commit, dispatch }, payload) {
      try {
        commit('BTN_LOADING', true)
        const url = payload.type === 'add' ? api.base.customer.customerAdd : api.base.customer.customerUpdate
        const { status } = await fetch.post(url, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('GET_GLOBAL_CUSTOMER_LIST')
          const backNum = payload.type === 'detail' ? -2 : -1
          setTimeout(() => {
            router.go(backNum)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除客户主档
    DEL_CUSTOMER (context, payload) {
      return fetch.post(api.base.customer.customerDel, payload)
    },
    // 获取客户详情
    GET_CUSTOMER_DETAIL (context, payload) {
      return fetch.get(api.base.customer.customerDetail, { params: payload })
    },
    // 生成编码code
    GET_SYSTEM_CODE () {
      return fetch.get(api.base.customer.getSystemCode)
    }
  }
}

// 供应商主档
const supplier = {
  state: {
    total: 0,
    supplierList: []
  },
  mutations: {
    // 改变供应商主档列表
    changeSupplierList (state, payload) {
      state.total = payload.total
      state.supplierList = payload.records
    }
  },
  actions: {
    // 获取供应商主档
    async GET_SUPPLIER_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const url = `${api.base.supplier.supplierList}?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
        const { status, data } = await fetch.post(url, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeSupplierList', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增供应商主档
    async ADD_SUPPLIER ({ dispatch, commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const url = payload.type === 'add' ? api.base.supplier.supplierAdd : api.base.supplier.supplierUpdate
        const { status } = await fetch.post(url, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('A_GET_GLOBAL_SUPPLIER_LIST')
          const backNum = payload.type === 'detail' ? -2 : -1
          setTimeout(() => {
            router.go(backNum)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除供应商主档
    DEL_SUPPLIER (context, payload) {
      return fetch.post(api.base.supplier.supplierDel, payload)
    },
    // 获取供应商主档详情
    GET_SUPPLIER_DETAIL (context, payload) {
      return fetch.get(api.base.supplier.supplierDetail, { params: payload })
    }
  }
}

// 仓库主档
const warehouse = {
  state: {
    warehouseList: []
  },
  mutations: {
    // 改变设备数据列表
    changeWarehouse (state, payload) {
      state.warehouseList = payload
    }
  },
  actions: {
    // 获取设备列表
    async GET_WAREHOUSE_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.get(api.base.warehouse.warehouseList, { params: payload })
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('changeWarehouse', data)
        }
      } catch (e) {
        commit('TABLE_LOADING')
        console.log(e)
      }
    },
    // 新增设备
    async ADD_WAREHOUSE ({ dispatch, commit }, payload) {
      try {
        commit('BTN_LOADING', true)
        const { status } = await fetch.post(api.base.warehouse.warehouseAdd, payload)
        commit('BTN_LOADING')
        if (status === 0) {
          Message.success('保存成功')
          dispatch('A_GET_HOUSE_DIC_LIST')
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      } catch (e) {
        commit('BTN_LOADING')
        console.log(e)
      }
    },
    // 删除设备
    DEL_WAREHOUSE (context, payload) {
      const url = `${api.base.warehouse.warehouseDel}?id=${payload.baseWarehouseId}`
      return fetch.get(url)
    }
  }
}

// 所有基础数据的组装
const base = {
  state: {
    ...bom.state,
    ...material.state,
    ...process.state,
    ...drawNum.state,
    ...routing.state,
    ...equipment.state,
    ...materialtype.state,
    ...metering.state,
    ...customer.state,
    ...supplier.state,
    ...warehouse.state
  },
  mutations: {
    ...bom.mutations,
    ...material.mutations,
    ...process.mutations,
    ...drawNum.mutations,
    ...routing.mutations,
    ...equipment.mutations,
    ...materialtype.mutations,
    ...metering.mutations,
    ...customer.mutations,
    ...supplier.mutations,
    ...warehouse.mutations
  },
  actions: {
    ...bom.actions,
    ...material.actions,
    ...process.actions,
    ...drawNum.actions,
    ...routing.actions,
    ...equipment.actions,
    ...materialtype.actions,
    ...metering.actions,
    ...customer.actions,
    ...supplier.actions,
    ...warehouse.actions
  }
}

export default base
