<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="盘点报表">
      <template slot="btn">
        <tzBtn icon="tz-icon-print" @click="printFun">打印</tzBtn>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear" :isShowExtend="true">
        <template slot="content">
          <el-form-item label="盘点单号">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.takingCode">
            </el-input>
          </el-form-item>
          <el-form-item label="盘点仓库">
            <el-select v-model.trim="formData.baseWarehouseId" clearable filterable placeholder="请选择">
              <el-option
                :label="item.warehouseName"
                v-for="item in houseList"
                :key="item.baseWarehouseId"
                :value="item.baseWarehouseId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="盘点人员">
            <el-select v-model.trim="formData.managerStuff" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :label="item.val"
                v-for="item in employeeList"
                :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="盘点结果">
            <el-select v-model.trim="formData.result" clearable filterable placeholder="请选择">
              <el-option
                :key="item.type"
                :label="item.name"
                v-for="item in dics.inventoryResult"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              clearable
              v-model="formData.time"
              :editable="false"
              type="daterange"
              @change="getTime"
              range-separator="-"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="创建时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="tableData"
      ref="wareInTable"
      v-loading="tableLoading"
      @selection-change="partSelectC"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            border
            class="el-table-expand"
            :row-style="{'background-color': '#F3F5F7'}"
            :header-cell-style="{'background-color': '#F3F5F7'}"
            :data="scope.row.stockTakingMaterials">
              <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="quantity" label="盘点前数量">
                <template slot-scope="scope">
                  {{scope.row.quantity}}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="stockPrice" label="帐面金额"></el-table-column>
              <el-table-column align="center" prop="takingQuantity" label="盘点实际数量">
                <template slot-scope="scope">
                  {{scope.row.takingQuantity}}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
              <el-table-column align="center" prop="takingPrice" label="盘点后金额"></el-table-column>
              <el-table-column align="center" prop="result" label="盘点结果">
                <template slot-scope="scope">
                  <div v-if="scope.row.result">{{scope.row.result | filterDic(dics.inventoryResult)}}</div>
                  <div v-else>——</div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="difference" label="差异"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column align="center" prop="takingCode" label="盘点单号">
        <template slot-scope="scope">
          <div class="yellow" @click="goTo('detail', scope.row.stockTakingId)">{{scope.row.takingCode}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="baseWarehouseName" label="盘点仓库"></el-table-column>
      <el-table-column align="center" prop="managerStuff" label="盘点人员"></el-table-column>
      <el-table-column align="center" prop="result" label="盘点结果">
        <template slot-scope="scope">
          <div v-if="scope.row.result">{{scope.row.result | filterDic(dics.inventoryResult)}}</div>
          <div v-else>——</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="stockPrice" label="帐面金额"></el-table-column>
      <el-table-column align="center" prop="takingPrice" label="盘点后金额"></el-table-column>
      <el-table-column align="center" prop="difference" label="差异"></el-table-column>
      <el-table-column align="center" prop="createTime" label="操作日期">
        <template slot-scope="scope">
          {{scope.row.createTime | momentTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <div class="buttons">
            <div class="btns yellow" @click="goTo('detail', scope.row.stockTakingId)">详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :total="total"
      :pageSize="formData.pageSize"
      :current-page="formData.pageIndex"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange">
      <template #default>
        <div @click="allExpand" class="expand">
          <img src="../../../assets/images/icon/expand.png" alt />
          <span>{{expandText}}</span>
        </div>
      </template>
    </tzPagination>
    <tzPrint
      :orders="printList.map(it => ({ code: it.takingCode, id: it.stockTakingId }))"
      :visible="printVisible"
      type="stock_taking"
      @cancle="closePrint(tableData, 'wareInTable')"
    />
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import dics from '../../../global/dictionary'
import copyParams from '../../../mixins/copyParams'
import print from '../../../mixins/print'

export default {
  name: 'inventory',
  mixins: [keepAlive, dic, copyParams, print],
  data () {
    return {
      dics,
      expandText: '全部展开',
      materialTypes: [],
      currentIndex: 0,
      formData: {
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        warehouseId: '',
        materialCode: '',
        materialName: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      total: state => state.ware.inventory.total,
      tableLoading: state => state.global.tableLoading,
      tableData: state => state.ware.inventory.getInventoryList
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.initWarehouse()
  },
  activated () {
    this.formData = { ...this.copyParamsObj }
    this.initWarehouse()
  },
  methods: {
    ...mapActions([
      'GET_INVENTORY_LIST' // 获取盘点列表
    ]),
    printFun () {
      if (!this.printList.length) {
        this.$message.error('请选择盘点订单')
        return
      }
      this.openPrint()
    },
    allExpand () {
      this.tableData.forEach((row) => {
        this.$refs.wareInTable.toggleRowExpansion(row, this.expandText === '全部展开')
      })
      this.expandText = this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    getTime (e) {
      [this.formData.startTime, this.formData.endTime] = e
    },
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.initWarehouse()
    },
    // 清空列表
    clear () {
      this.formData = {
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        warehouseId: '',
        materialCode: '',
        materialName: ''
      }
      this.copyParamsFun(this.formData)
      this.initWarehouse()
    },
    // 获取初始化库存列表
    initWarehouse () {
      this.GET_INVENTORY_LIST(this.formData)
    },
    // 进入库存详情
    goTo (type, id = '') {
      this.formData.type = type
      this.$router.push({
        path: `${urls.INVENTORY_DETAIL}/${type}`,
        query: { id }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.initWarehouse()
       this.expandText = '全部展开'
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.initWarehouse()
      this.expandText = '全部展开'
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
