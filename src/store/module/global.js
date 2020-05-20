import { Message } from 'element-ui'
import fetch from '../../utils/fetch'
import api from '../../global/api'
import router from '../../router/router'
import * as urls from '../../router/routePath'
import { dataURLtoBlob, downloadLocalFile } from '../../utils/utils'

const info = sessionStorage.getItem('userInfo')
const keepAlive = sessionStorage.getItem('keepAlive') || []
const global = {
  state: {
    material: { // material 选择物料时候用
      list: [],
      total: 0
    },
    bom: { // bom 带有工艺路线
      list: [],
      total: 0
    },
    history: {
      historyList: [], // 历史列表
      total: 0
    },
    process: { // 全局工艺路线
      list: [],
      total: 0
    },
    companyCode: '', // 公司code
    templateList: [], // 打印模板列表
    printerList: [], // 打印机列表
    badTypeList: [], // 所有不良类型
    equipmentList: [], // 所有的设备
    materialTypeList: [], // 物料类型
    unitList: [], // 单位
    houseList: [], // 仓库
    customerList: [], // 客户
    supplierList: [], // 供应商
    staffList: [], // 员工
    matUnitList: [], //  根据物料Id 获取主副计量比
    approvalFlowList: [], // 审核处理 - 处理审批流
    userInfo: info ? JSON.parse(info) : {},
    keepAlive,
    isUpdateCom: false,
    btnLoading: false,
    modalLoading: false,
    tableLoading: false,
    sidebarLoading: false,
    visible: false,
    uploadAction: `${process.env.VUE_APP_BASE_URL}${api.global.upload}` || '',
    uploadHeaders: {
      Authorization: sessionStorage.getItem('token') || ''
    },
    miniLightToken: '',
    imgDomain: `${process.env.VUE_APP_BASE_URL}/fs/` // 图片前缀
  },
  mutations: {
    // 设置token
    SET_TOKEN (state, payload = '') {
      state.uploadHeaders.Authorization = payload
    },
    // 设置生成小程序二维码token
    SET_MINITOKEN (state, payload = '') {
      state.miniLightToken = payload
    },
    SET_COMPANY_CODE (state, payload = '') {
      state.companyCode = payload
    },
    // 设置缓存组件
    SET_KEEP_ALIVE (state, payload = []) {
      state.keepAlive = payload
    },
    // 设置公共信息
    SET_USER_INFO (state, payload = {}) {
      state.userInfo = payload
    },
    // 是否更新组件
    SET_IS_UPDATE_COM (state, payload = false) {
      state.isUpdateCom = payload
    },
    // 控制 btn Loading
    BTN_LOADING (state, payload = false) {
      state.btnLoading = payload
    },
    // 控制 modal Loading
    MODAL_LOADING (state, payload = false) {
      state.modalLoading = payload
    },
    // 控制 table Loading
    TABLE_LOADING (state, payload = false) {
      state.tableLoading = payload
    },
    // 控制 侧边框 Loading
    SIDEBAR_LOADING (state, payload = false) {
      state.sidebarLoading = payload
    },
    M_SET_GLOBAL_MAT_UNIT_LIST (state, payload = []) {
      state.matUnitList = payload
    },
    // 物料类型主档
    SET_MATERIAL_TYPE_DIC_LIST (state, payload = []) {
      state.materialTypeList = payload
    },
    // 主计量单位
    SET_UNIT_DIC_LIST (state, payload = []) {
      state.unitList = payload
    },
    // 默认仓库
    SET_HOUSE_DIC_LIST (state, payload = []) {
      state.houseList = payload
    },
    // 物料数据
    M_SET_GLOBAL_MATERIAL_LIST (state, payload = []) {
      state.material.list = payload
    },
    // 物料数据总数
    M_SET_GLOBAL_MATERIAL_LIST_TOTAL (state, payload = 0) {
      state.material.total = payload
    },
    // 物料数据
    M_SET_GLOBAL_BOM_LIST (state, payload = []) {
      state.bom.list = payload
    },
    // 物料数据总数
    M_SET_GLOBAL_BOM_LIST_TOTAL (state, payload = 0) {
      state.bom.total = payload
    },
    // 全局工艺路线
    M_SET_GLOBAL_PROCESS_ROUTE_LIST (state, payload = []) {
      state.process.list = payload
    },
    // 全局工艺路线总数
    M_SET_GLOBAL_PROCESS_ROUTE_LIST_TOTAL (state, payload = 0) {
      state.process.total = payload
    },
    // 所有不良类型包含不良原因
    M_SET_GLOBAL_BAD_TYPE_LIST (state, payload = []) {
      state.badTypeList = payload
    },
    // 所有设备
    M_SET_GLOBAL_EQUIPMENT_LIST (state, payload = []) {
      state.equipmentList = payload
    },
    // 所有客户
    M_SET_GLOBAL_CUSTOMER_LIST (state, payload = []) {
      state.customerList = payload
    },
    // 所有供应商
    M_SET_GLOBAL_SUPPLIER_LIST (state, payload = []) {
      state.supplierList = payload
    },
    // 员工
    M_SET_GLOBAL_STAFF_LIST (state, payload = []) {
      state.staffList = payload
    },
    // 审核处理 - 处理历史列表
    M_SET_GLOBAL_HISTORY (state, payload = []) {
      state.history.historyList = payload
    },
    M_SET_GLOBAL_HISTORY_TOTAL (state, payload = 0) {
      state.history.total = payload
    },
    // 审核处理 - 处理审批流
    M_SET_GLOBAL_APPROVAL_FLOW (state, payload = []) {
      state.approvalFlowList = payload
    },
    // 设置打印模板列表
    M_SET_GLOBAL_TEMPLATES (state, payload = []) {
      state.templateList = payload
    },
    // 平台 设置打印机列表
    M_SET_GLOBAL_PRINTERS (state, payload = []) {
      state.printerList = payload
    }
  },
  // 全局请求(字典项接口，公共接口等)
  actions: {
    // 销售订单打印数据
    async A_GET_PRINT_SALE_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.sale, { params: payload })
    },
    // 采购订单打印数据
    async A_GET_PRINT_PURCHASE_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.purchase, { params: payload })
    },
    // 生产订单打印数据
    async A_GET_PRINT_PROD_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.prod, { params: payload })
    },
     // 成品委外订单打印数据
     async A_GET_PRINT_OUTSOURCE_OUT_PRODUCT_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.outsourceOutProduct, { params: payload })
    },
    // 工序委外订单打印数据
     async A_GET_PRINT_OUTSOURCE_PROCESS_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.outsourceProcess, { params: payload })
    },
    // 入库订单打印数据
    async A_GET_PRINT_WAREHOUSE_IN_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.warehouseIn, { params: payload })
    },
    // 出库订单打印数据
    async A_GET_PRINT_WAREHOUSE_OUT_DATA ({ commit }, payload) {
      return fetch.get(api.printDetailApi.warehouseOut, { params: payload })
    },
      // 调拨订单打印数据
      async A_GET_PRINT_ALLOCATION_DATA ({ commit }, payload) {
        return fetch.get(api.printDetailApi.allocation, { params: payload })
      },
      // 盘点订单打印数据
      async A_GET_PRINT_INVENTORY_DATA ({ commit }, payload) {
        return fetch.get(api.printDetailApi.inventory, { params: payload })
      },
    // 平台 获取打印模板列表
    async GET_GLOBAL_TEMPLATES ({ commit }, payload) {
      try {
        const { status, data } = await fetch.post(api.manager.template, payload)
        if (status === 0) {
          commit('M_SET_GLOBAL_TEMPLATES', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 平台 获取打印机列表
    async GET_GLOBAL_PRINTERS ({ commit }, payload) {
      try {
        const { status, data } = await fetch.post(api.manager.printers, payload)
        if (status === 0) {
          commit('M_SET_GLOBAL_PRINTERS', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 平台 打印
    GET_GLOBAL_PRINT ({ commit }, payload) {
      return fetch.post(api.manager.print, payload)
    },
    // 导出
    async A_GET_GLOBAL_EXPORT ({ commit }, payload) {
      try {
        const { status, data } = await fetch.post(api.exportApi[payload.moduleType], payload)
        if (status === 0) {
          if (payload.moduleType === 'bom') {
            const myUrl = dataURLtoBlob(data.base64Str)
            downloadLocalFile(myUrl, data.fileName)
          } else {
            const myUrl = dataURLtoBlob(data)
            downloadLocalFile(myUrl, `${payload.exportName}.xls`)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 用户信息
    async A_GET_USER_INFO ({ commit, dispatch }) {
      try {
        const { status, data } = await fetch.get(api.global.userInfo)
        if (status === 0) {
          commit('SET_USER_INFO', data)
          sessionStorage.setItem('userInfo', JSON.stringify(data))
          if (data.companyId) {
            dispatch('A_GET_COMPANY_CODE', { companyId: data.companyId })
            router.push(urls.BASE_MATERIAL)
          } else {
            Message.warning('抱歉，您还没有企业，请先去平台创建企业')
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取公司code
    async A_GET_COMPANY_CODE ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.login.companyCode, { params: payload })
        if (status === 0) {
          sessionStorage.setItem('companyCode', data.companyCode)
          commit('SET_COMPANY_CODE', data.companyCode)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取各模块的物料编码
    A_GET_MATERIAL_CODE_LIST ({ commit }, payload) {
      return fetch.get(api.global.encodingGeneration, { params: payload })
    },
    // 物料列表 带有工艺路线的接口
    async A_GET_GLOBAL_MATERIAL_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { status, data } = await fetch.post(api.global.materialList, payload)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_GLOBAL_MATERIAL_LIST', data.records)
          commit('M_SET_GLOBAL_MATERIAL_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // 所有的不良类型
    async A_GET_GLOBAL_BAD_TYPE_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.allBadType, payload)
        if (status === 0) {
          commit('M_SET_GLOBAL_BAD_TYPE_LIST', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 根据物料Id 获取主副计量比
    async A_GET_GLOBAL_MAT_UNIT_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.matUnitList, { params: payload })
        if (status === 0) {
          commit('M_SET_GLOBAL_MAT_UNIT_LIST', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // 所有的设备
    async A_GET_GLOBAL_EQUIPMENT_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.allEquipment, payload)
        if (status === 0) {
          commit('M_SET_GLOBAL_EQUIPMENT_LIST', data)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        return {}
      }
    },
    // BOM母件列表 带有工艺路线的接口
    async A_GET_GLOBAL_BOM_LIST ({ commit }, payload) {
      try {
        commit('TABLE_LOADING', true)
        const { pageIndex, pageSize, ...arg } = payload
        const { status, data } = await fetch.post(`${api.global.bomList}?pageIndex=${pageIndex}&pageSize=${pageSize}`, arg)
        commit('TABLE_LOADING')
        if (status === 0) {
          commit('M_SET_GLOBAL_BOM_LIST', data.records)
          commit('M_SET_GLOBAL_BOM_LIST_TOTAL', data.total)
        }
        return { status, data }
      } catch (e) {
        console.log(e)
        commit('TABLE_LOADING')
        return {}
      }
    },
    // 全局工艺路线列表
    async A_GET_GLOBAL_PROCESS_ROUTE_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.processRoute, { params: payload })
        if (status === 0) {
          commit('M_SET_GLOBAL_PROCESS_ROUTE_LIST', data.records)
          commit('M_SET_GLOBAL_PROCESS_ROUTE_LIST_TOTAL', data.total)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 物料类型主档列表
    async A_GET_MATERIAL_TYPE_DIC_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.materialDic, { params: payload })
        if (status === 0) {
          commit('SET_MATERIAL_TYPE_DIC_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 计量单位主档列表
    async A_GET_UNIT_DIC_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.unitDic, { params: payload })
        if (status === 0) {
          commit('SET_UNIT_DIC_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取所有客户
    async GET_GLOBAL_CUSTOMER_LIST ({ commit }) {
      try {
        const { status, data } = await fetch.get(api.global.customerList)
        if (status === 0) {
          commit('M_SET_GLOBAL_CUSTOMER_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取所有供应商
    async A_GET_GLOBAL_SUPPLIER_LIST ({ commit }) {
      try {
        const { status, data } = await fetch.get(api.global.supplierList)
        if (status === 0) {
          commit('M_SET_GLOBAL_SUPPLIER_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 所有人员
    async A_GET_GLOBAL_STAFF_LIST ({ commit }, payload = { accountFlag: false }) {
      try {
        const { status, data } = await fetch.get(api.platform.userAll, { params: payload })
        if (status === 0) {
          commit('M_SET_GLOBAL_STAFF_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 仓库主档列表
    async A_GET_HOUSE_DIC_LIST ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.houseDic, { params: payload })
        if (status === 0) {
          commit('SET_HOUSE_DIC_LIST', data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    POST_GLOBAL_AUDITOR ({ commit }, payload) {
      return fetch.post(api.global.censorShip, payload)
    },
    // 撤回送审
    POST_GLOBAL_RECALL_AUDIT ({ commit }, payload) {
      return fetch.get(api.global.recallAudit, { params: payload })
    },
    // 审核处理 - 处理历史列表
    async POST_GLOBAL_HISTORY ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.history, { params: payload })
        if (status === 0) {
          commit('M_SET_GLOBAL_HISTORY', data.records)
          commit('M_SET_GLOBAL_HISTORY_TOTAL', data.total)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 审核处理 - 处理审批流
    async POST_GLOBAL_APPROVAL_FLOW ({ commit }, payload) {
      try {
        const { status, data } = await fetch.get(api.global.approvalFlow, { params: payload })
        if (status === 0) {
          commit('M_SET_GLOBAL_APPROVAL_FLOW', data || [])
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
export default global
