<!-- 下推订单 -->
<template>
  <div ref='pushDown'>
    <tzHeadline title="下推订单" :isShowBack="false">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="batchPushDownProd">下推生产订单</el-button>
        <el-button round size="medium" class="tz-btn-add" @click="addBtn">新增生产订单</el-button>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="销售单号">
            <el-input
              placeholder="请输入"
              v-model.trim="filterData.saleCode"
              clearable
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="销售人员">
            <el-select
              clearable
              filterable
              class="w100"
              v-model="filterData.salerStuffId"
              placeholder="负责人"
            >
              <el-option
                v-for="(staff, index) in staffList"
                :key="index"
                :label=" staff.realname"
                :value=" staff.stuffNo"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-select clearable filterable v-model="filterData.baseCustomerId" placeholder="客户名称">
              <el-option
                v-for="(customer, index) in customerList"
                :key="index"
                :label="customer.customerName"
                :value="customer.baseCustomerId"
              />
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料类型">
            <el-select v-model.trim="filterData.materialType" placeholder="全部" clearable>
              <el-option
                v-for="(item,index) in materialTypeList"
                :key="index"
                :value="item.typeName"
                :label="item.typeName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              v-model.trim="filterData.materialName"
              clearable
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              placeholder="请输入"
              v-model.trim="filterData.materialCode"
              clearable
              @keyup.enter.native="search"
            />
          </el-form-item>
          <br />
          <el-form-item label="物料图号">
            <el-input
              placeholder="请输入"
              v-model.trim="filterData.picNum"
              clearable
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="计划日期">
            <el-date-picker
              v-model="filterData.time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              value-format="yyyy-MM-dd"
              style="width: 400px"
            ></el-date-picker>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      border
      :data="list"
      style="width: 100%"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      header-align="center"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="saleCode" label="销售订单" align="center">
        <template slot-scope="scope">
          <span class="yellow" @click="goSales(scope.row)">{{scope.row.saleCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salerStuff" label="销售人员" align="center" />
      <el-table-column prop="baseCustomerName" label="客户" align="center" />
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="materialSpec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="materialPicNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column prop="sendDate" label="交期" align="center">
        <template slot-scope="scope">{{scope.row.sendDate | momentTime}}</template>
      </el-table-column>
      <el-table-column prop="buyQuantity" label="订单数量" align="center" />
      <el-table-column prop="processQuantity" label="已下推数量" align="center" />
      <el-table-column prop="unitName" label="单位" align="center" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="warning"
            @click.stop.prevent="pushDownProd(scope.row)"
          >下推生产订单</el-link>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :currentPage="pageIndex"
      :page-size="pageSize"
      :total="total"
      @_currentPageChange="pageChange"
      @_pageSizeChange="pageSizeChange"
    >
      <tzBtn style="padding-left: 0" icon="tz-icon-summary" @click="viewOrderSum">销售订单汇总</tzBtn>
    </tzPagination>
    <orderSum :visible="visible" @cancel="cancel" />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapActions, mapState } from 'vuex'
import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'
import orderSum from './component/orderSum'
import { unique, removeEmpty } from '../../../utils/utils'

export default {
  name: 'prodPushDown', // 生产
  // import引入的组件需要注入到对象中才能使用
  components: { orderSum },
  mixins: [dic, keepAlive, copyParams],
  data () {
    // 这里存放数据
    return {
      filterData: {},
      visible: false,
      selected: [],
      pageIndex: 1,
      pageSize: 10
    }
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      list: state => state.product.pushDown.list,
      total: state => state.product.pushDown.total,
      tableLoading: state => state.global.tableLoading
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.copyParamsFun(this.filterData)
    this.getData()
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    ...mapActions(['A_GET_PUSH_DOWN_LIST']),
    // 去销售订单
    goSales (row) {
      const arg = {
        path: `${this.$urls.SALE_DETAIL}/detail`,
        query: { id: row.saleOrderId }
      }
      this.$router.push(arg)
    },
    // 新增订单
    addBtn (type) {
      this.type = type
      this.$router.push({
        name: 'addProd',
        params: { type: 'add' }
      })
    },
    // 批量下推
    batchPushDownProd () {
      if (this.selected.length === 0) {
        this.$message.error('请选择要下推订单')
        return
      }
      const ids = this.selected.map(it => it.baseMaterialId)
      if (unique(ids).length > 1) {
        this.$message.error('下推生产必须是同一物料')
        return
      }
      const saleOrderMaterialIdStr = this.selected
        .map(it => it.saleOrderMaterialId)
        .join()
      this.$router.push({
        name: 'addProd',
        params: {
          type: 'add'
        },
        query: { saleOrderMaterialIdStr, materialId: ids[0] }
      })
    },
    // 下推生产
    pushDownProd (row) {
      this.$router.push({
        name: 'addProd',
        params: { type: 'add' },
        query: {
          saleOrderMaterialIdStr: row.saleOrderMaterialId,
          materialId: row.baseMaterialId
        }
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.selected = val
    },
    // 设置请求参数
    setParams () {
      const { pageIndex, pageSize, filterData } = this
      const { time, ...newVal } = filterData
      const [startSendDate, endSendDate] = time || []
      const arg = {
        ...newVal,
        startSendDate,
        endSendDate,
        pageIndex,
        pageSize
      }
      return removeEmpty(arg)
    },
    // 获取列表数据
    getData () {
      this.filterData = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_PUSH_DOWN_LIST(arg)
    },
    // 查询
    search () {
      this.pageIndex = 1
      this.copyParamsFun(this.filterData)
      this.getData()
    },
    // 清空
    clear () {
      this.filterData = {}
      this.pageIndex = 1
      this.pageSize = 10
      this.copyParamsFun(this.filterData)
      this.getData()
    },
    // 查看销售订单汇总
    viewOrderSum () {
      this.visible = true
    },
    // 查看销售订单汇总 关闭
    cancel () {
      this.visible = false
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.$refs.pushDown.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.$refs.pushDown.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
