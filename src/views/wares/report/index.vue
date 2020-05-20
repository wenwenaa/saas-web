<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="库存报表">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="goTo('add')">调拨</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear" isShowExtend>
        <template slot="content">
          <el-form-item label="物料类型" prop="typeName">
            <el-select v-model.trim="formData.typeName" clearable filterable placeholder="请选择">
              <el-option
                :label="item.typeName"
                :key="item.baseMaterialTypeId"
                v-for="item in materialTypeList"
                :value="item.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.materialCode">
            </el-input>
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.materialName">
            </el-input>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="在库数量">
            <el-select v-model.trim="formData.hide" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :label="item.name"
                v-for="item in hideList"
                :value="item.hide">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="tableData"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="safetyStock" label="安全库存">
        <template slot-scope="scope">
          {{scope.row.safetyStock}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="allQuantity" label="当前在库数量">
        <template slot-scope="scope">
          {{scope.row.allQuantity || 0}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <span class="yellow" @click="goTo('detail', scope.row.baseMaterialId)">详情</span>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :total="total"
      :pageSize="formData.pageSize"
      :current-page="formData.pageIndex"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import { becomeString } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'report',
  mixins: [keepAlive, dic, copyParams],
  data () {
    return {
      formData: {
        hide: 1,
        type: '',
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        materialCode: '',
        materialName: ''
      },
      transmitData: [],
      hideList: [
        {
          id: 1,
          hide: 1,
          name: '大于零'
        }, {
          id: 2,
          hide: '',
          name: '全部'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      total: state => state.ware.report.total,
      tableLoading: state => state.global.tableLoading,
      tableData: state => state.ware.report.getReportList
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getReportList()
  },
  activated () {
    const { type } = this.formData
    if (type === 'add') {
      this.clear()
      this.getReportList()
    } else {
      this.formData = { ...this.copyParamsObj }
      this.getReportList()
    }
  },
  methods: {
    ...mapActions([
      'GET_REPORT_LIST', // 获取库存报表列表
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 清空库存列表
    clear () {
      this.formData = {
        type: '',
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        materialCode: '',
        materialName: '',
        hide: 1
      }
      this.copyParamsFun(this.formData)
      this.getReportList()
    },
    // 导出方法
    downloadFile () {
      this.formData = { ...this.copyParamsObj }
      this.A_GET_GLOBAL_EXPORT({
        ...this.formData,
        exportName: '库存报表',
        moduleType: 'exportWarehouse'
      })
    },
    // 查询库存列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getReportList()
    },
    // 选中
    handleSelectionChange (e) {
      this.transmitData = e
    },
    // 获取库存列表
    getReportList () {
      this.GET_REPORT_LIST(this.formData)
    },
    // 进入调拨或者库存详情
    goTo (type, id = '') {
      if (type === 'add') {
        // 没有库存不能调拨
        if (!this.transmitData.length) {
          this.$message('请选择调拨物料')
          return
        }
        for (let i = 0; i < this.transmitData.length; i += 1) {
          if (this.transmitData[i].stockMaterials.length === 0) {
            this.$message(`${this.transmitData[i].materialName}没有库存，不能调拨`)
            return
          }
        }
      }
      this.formData.type = type
      let arg = {
        path: type === 'detail' ? `${urls.REPORTDETAIL}/${type}` : `${urls.ALLOCATION_ADD}/${type}`
      }
      if (id) {
        arg = Object.assign({}, arg, {
          query: { id }
        })
      } else {
        arg = Object.assign({}, arg, {
          query: { data: becomeString(this.transmitData) }
        })
      }
      this.$router.push(arg)
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getReportList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getReportList()
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/ .el-table__expand-column {
//   display: none;
// }
// /deep/ .el-table [class*=el-table__row--level] .el-table__expand-icon {
//   display: none;
// }
</style>
