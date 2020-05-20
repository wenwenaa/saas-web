<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="调拨报表" >
      <template slot="btn">
        <tzBtn icon="tz-icon-print" @click="printFun">打印</tzBtn>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear" :isShowExtend="true">
        <template slot="content">
          <el-form-item label="调拨单号">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.exchangeCode">
            </el-input>
          </el-form-item>
          <el-form-item label="调拨人员" prop="managerStuffId">
            <el-select v-model.trim="formData.managerStuffId" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :label="item.val"
                v-for="item in employeeList"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="创建时间">
            <el-date-picker
              clearable
              :editable="false"
              @change="getTime"
              type="daterange"
              range-separator="-"
              v-model="formData.time"
              end-placeholder="结束时间"
              start-placeholder="创建时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      ref="table"
      :data="tableData"
      v-loading="tableLoading"
      @cell-dblclick="cellDblclick"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            border
            class="el-table-expand"
            :row-style="{'background-color': '#F3F5F7'}"
            :header-cell-style="{'background-color': '#F3F5F7'}"
            :data="scope.row.stockExchangeMaterials">
              <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="outWareHouseName" label="所在仓库"></el-table-column>
              <el-table-column align="center" prop="inWareHouseName" label="调拨仓库"></el-table-column>
              <el-table-column align="center" prop="quantity" label="调拨数量">
                <template slot-scope="scope">
                  {{scope.row.quantity || 0}}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column align="center" prop="exchangeCode" label="调拨单号">
        <template slot-scope="scope">
          <div class="yellow" @click="goTo('detail', scope.row.stockExchangeId)">{{scope.row.exchangeCode}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="managerStuff" label="调拨人员"></el-table-column>
      <el-table-column align="center" prop="createTime" label="操作日期">
        <template slot-scope="scope">
          {{scope.row.createTime | momentTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <span class="yellow" @click="goTo('detail', scope.row.stockExchangeId)">详情</span>
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
    <tzPrint
      :orders="printList.map(it => ({ code: it.exchangeCode, id: it.stockExchangeId }))"
      :visible="printVisible"
      type="stock_exchange"
      @cancle="closePrint(tableData, 'table')"
    />
  </div>
</template>
<script>
import {
  mapActions, mapState, mapGetters
} from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import copyParams from '../../../mixins/copyParams'
import print from '../../../mixins/print'

export default {
  name: 'allocation',
  mixins: [keepAlive, dic, copyParams, print],
  data () {
    return {
      formData: {
        teme: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 10,
        startTime: '',
        exchangeCode: '',
        managerStuffId: ''
      }
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      total: state => state.ware.allocation.total,
      tableData: state => state.ware.allocation.getAllocationList,
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getAllocationList()
  },
  activated () {
    this.formData = { ...this.copyParamsObj }
    this.getAllocationList()
  },
  methods: {
    ...mapActions([
      'GET_ALLOCATION_LIST' // 获取调拨列表
    ]),
    printFun () {
      if (!this.printList.length) {
        this.$message.error('请选择调拨订单')
        return
      }
      this.openPrint()
    },
    // 父级别选中一个
    singleSelection (selection, row) {
      // this.cellDblclick(row)
      this.$nextTick(() => {
        this.$refs.next.toggleAllSelection()
      })
    },
    // 双击展开
    cellDblclick (row) {
      if (row.children.length) {
        const index = this.expandRowKeys.indexOf(row.id)
        if (index !== -1) {
          this.expandRowKeys.splice(index, 1)
        } else {
          this.expandRowKeys = [...this.expandRowKeys, row.id]
        }
      } else {
        this.$message.error('没有物料')
        return false
      }
      return true
    },
    // 全选
    handleSelectionChange (data) {
      this.printList = data
      this.selectedId = data.map(item => item.baseEquipmentId)
    },
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getAllocationList()
    },
    // 获取创建时间
    getTime (e) {
      if (!e) return
      [this.formData.startTime, this.formData.endTime] = e
    },
    // 清空列表
    clear () {
      this.formData = {
        teme: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 10,
        startTime: '',
        exchangeCode: '',
        managerStuffId: ''
      }
      this.copyParamsFun(this.formData)
      this.getAllocationList()
    },
    // 获取调拨列表
    getAllocationList () {
      this.GET_ALLOCATION_LIST(this.formData)
    },
    // 进入调拨详情
    goTo (type, id = '') {
      this.formData.type = type
      this.$router.push({
        path: `${urls.ALLOCATION_DETAIL}/${type}`,
        query: { id }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getAllocationList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getAllocationList()
    }
  }
}
</script>
<style lang="less">
  .contain-company .el-table-expand {
    border-left: 4px solid #7CA870!important;
  }
  .contain-company .el-table__expanded-cell {
    padding: 0 50px !important;
  }
</style>
