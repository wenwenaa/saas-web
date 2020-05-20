import fetch from '../../utils/fetch'
import api from '../../global/api'

const globalQuality = {
  state: {
    globalQuality: {
    }
  },
  mutations: {
  },
  actions: {
    // 新增全局质检
    A_GET_GLOBAL_QUALITY_ADD ({ commit }, payload) {
      return fetch.post(api.globalQuality.add, payload)
    },
    // 全局质检列表
    A_GET_GLOBAL_QUALITY_LIST ({ commit }, payload) {
      return fetch.get(api.globalQuality.list, { params: payload })
    },
    // 删除全局质检列表
    A_GET_GLOBAL_QUALITY_DEL ({ commit }, payload) {
      return fetch.get(api.globalQuality.del, { params: payload })
    },
    // 全局质检列表详情
    A_GET_GLOBAL_QUALITY_DETAIL ({ commit }, payload) {
      return fetch.get(api.globalQuality.detail, { params: payload })
    },
    // 全局质检编辑
    A_GET_GLOBAL_QUALITY_EDIT ({ commit }, payload) {
      return fetch.post(api.globalQuality.edit, payload)
    },
    // 物料质检列表
    A_GET_MATERIAL_QUALITY_LIST ({ commit }, payload) {
      return fetch.get(api.materialQuality.list, { params: payload })
    },
    // 物料质检详情
    A_GET_MATERIAL_QUALITY_DETAIL ({ commit }, payload) {
      return fetch.get(api.materialQuality.detail, { params: payload })
    },
    // 检验单列表
    A_GET_QUALITY_CHECK_LIST ({ commit }, payload) {
      return fetch.get(api.checkList.list, { params: payload })
    },
    // 全局质检列表 无分页
    A_GET_QUALITY_GLOBAL_NO_PAGE_LIST ({ commit }, payload) {
      return fetch.get(api.checkList.globalNoPageList, { params: payload })
    },
    // 查询物料的质检方案名称
    A_GET_QUERY_MATERIAL_NAME ({ commit }, payload) {
      return fetch.get(api.checkList.queryMaterialName, { params: payload })
    },
    // 出入库检全局物料初始化
    A_GET_IN_QUALITY_GLOBAL_INIT ({ commit }, payload) {
      let url = ''
      if (payload.formType === 'IN') {
        url = payload.checkType === 1 ? api.checkList.inQualityGlobalInit : api.checkList.inQualityMaterialInit
      } else {
        url = api.checkList.qualityAllInit
      }
      return fetch.get(url, { params: payload })
    },
    // 新增来料检和出库检
    A_ADD_QUALITY_INIT ({ commit }, payload) {
      return fetch.post(api.checkList.add, payload)
    },
    // 获取跳转信息
    A_PROD_QUALITY_INFO ({ commit }, payload) {
      return fetch.get(api.checkList.prodJump, { params: payload })
    },
    // 获取工序信息
    A_PROD_WORKING_PROCEDURE ({ commit }, payload) {
      return fetch.get(api.checkList.prodWork, { params: payload })
    },
    // 新增过程检
    A_PROD_ADD_QUALITY ({ commit }, payload) {
      return fetch.post(api.checkList.prodAdd, payload)
    },
    // 过程检详情
    A_PROD_QUALITY_VIEW_DETAIL ({ commit }, payload) {
      return fetch.get(api.checkList.prodDetail, { params: payload })
    },
    // 出入库详情
    A_IN_OUT_QUALITY_DETAIL ({ commit }, payload) {
      const url = payload.formType === 'IN' ? api.checkList.inDetail : api.checkList.outDetail
      return fetch.get(url, { params: payload })
    }
  }
}

const ware = {
  state: {
    ...globalQuality.state
  },
  mutations: {
    ...globalQuality.mutations
  },
  actions: {
    ...globalQuality.actions
  }
}

export default ware
