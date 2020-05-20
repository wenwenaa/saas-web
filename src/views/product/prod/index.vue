!<!-- 生产订单 -->
<template>
  <div ref="prod" class="prod">
    <tzHeadline title="生产订单" :isShowBack="false">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add')">新增生产订单</el-button>
        <!-- <tzBtn icon="tz-icon-del" @click="batchReview">批量送审</tzBtn> -->
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <tzBtn icon="tz-icon-print" @click="printFun">打印</tzBtn>
        <el-dropdown @command="handleDropDown">
          <span class="gray pointer">
            <i class="el-icon-menu green f16 ml20"></i>
            更多操作
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item :command="1">导出</el-dropdown-item> -->
            <el-dropdown-item :command="2">批量领料</el-dropdown-item>
            <el-dropdown-item :command="3">批量工序委外</el-dropdown-item>
            <el-dropdown-item :command="4">批量入库</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium" label-width="70px" label-position="left">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="生产单号">
            <el-input
              placeholder="请输入"
              v-model.trim="filterData.prodCode"
              clearable
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-select
              clearable
              filterable
              class="w100"
              v-model="filterData.createBy"
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
          <el-form-item label="物料类型">
            <el-select v-model.trim="filterData.typeName" placeholder="全部" filterable clearable>
              <el-option
                v-for="(item,index) in materialTypeList"
                :key="index"
                :value="item.typeName"
                :label="item.typeName"
              />
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
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
          <el-form-item label="物料图号">
            <el-input
              placeholder="请输入"
              v-model.trim="filterData.picNum"
              clearable
              @keyup.enter.native="search"
            />
          </el-form-item>
          <br />
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="filterData.time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              value-format="yyyy-MM-dd"
              style="width: 400px"
            />
          </el-form-item>
          <br />
          <el-form-item label="审核状态">
            <el-checkbox-group v-model="filterData.statusList">
              <el-checkbox
                class="checkbox"
                v-for="(item, i) in dictionary.auditStatus"
                :label="item.type"
                :key="i"
                :value="item.type"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="完成状态" v-show="filterData.statusList.includes('APPROVED') || filterData.statusList.includes('CLOSED')">
            <el-checkbox-group v-model="filterData.pushStatusList">
              <el-checkbox
                class="checkbox"
                v-for="(item, i) in dictionary.completionStatus1"
                :label="item.type"
                :value="item.type"
                :key="i"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      border
      ref="table"
      :data="list"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column prop="prodCode" label="生产订单" align="center">
        <template slot-scope="scope">
          <span
            class="yellow"
            @click.stop.prevent="goDetail(scope.row.prodOrderId)"
          >{{scope.row.prodCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编号" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column prop="planDate" label="计划日期" align="center" />
      <el-table-column prop="quantity" label="库存数量" align="center" />
      <el-table-column prop="processDisplay" label="工艺路线" align="center" show-overflow-tooltip />
      <el-table-column prop="planQuantity" label="计划数量" align="center" />
      <el-table-column prop="prodQuantity" label="已生产数量" align="center" width="100px" />
      <el-table-column prop="stockInQuantity" label="已入库数量" align="center" width="100px" />
      <el-table-column prop="unitName" label="单位" align="center" />
      <el-table-column prop="status" label="审核状态" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.status"
            :content="scope.row.status | filterDic(dictionary.auditStatus)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="pushStatus" label="完成状态" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.pushStatus"
            :content="scope.row.pushStatus | filterDic(dictionary.completionStatus1)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">{{scope.row.createTime | momentTime('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.status === 'DRAFT'"
            class="mr10 pointer"
            @click.stop.prevent="checkReview(scope.row)"
          >送审</span>
          <span class="mr10 pointer" @click.stop.prevent="goDetail(scope.row.prodOrderId)">详情</span>
          <span
            v-if="scope.row.status === 'APPROVED'"
            class="mr10 pointer"
            @click.stop.prevent="qualityTest(scope.row.prodOrderId)"
          >质检</span>
          <span
            v-if="scope.row.status === 'APPROVED'"
            class="yellow mr10"
            @click.stop.prevent="reportTask(scope.row.prodOrderId)"
          >报工</span>
          <span
            v-if="scope.row.status === 'DRAFT'"
            class="mr10 pointer"
            @click.stop.prevent="goEdit(scope.row.prodOrderId)"
          >编辑</span>
          <span
            v-if="scope.row.status === 'DRAFT'"
            class="mr10 yellow"
            @click.stop.prevent="del(scope.row.prodOrderId)"
          >删除</span>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :currentPage="pageIndex"
      :page-size="pageSize"
      :total="total"
      @_currentPageChange="pageChange"
      @_pageSizeChange="pageSizeChange"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下物料已超出生产参考量"
      @submit="review"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column property="saleOrderCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <tzTipDialog
      :visible="processVisible"
      content="请选择您需要委外的工序，"
      submitText="继续委外"
      @submit="outsource"
      @close="processClose"
    >
      <template slot="tipTitle">
        <span>相同工序下，只可以选择单个工序委外</span>
      </template>
      <template slot="tipTable">
        <div style="text-align: center">
          <el-radio-group style="text-align:left" v-model="process">
            <el-radio
              class="radio"
              style="display:block;padding:4px"
              v-for="(item, index) in processList"
              :key="index"
              :label="item.baseSeqId"
            >{{item.baseSeqName}}</el-radio>
          </el-radio-group>
        </div>
      </template>
    </tzTipDialog>
    <tzImport
      title="导入生产订单"
      :visible="visible"
      type="prod"
      @close="visible = false"
      @success="clear"
    />
    <tzPrint
      :orders="selected.map(it => ({ code: it.prodCode, id: it.prodOrderId }))"
      :visible="printVisible"
      type="ProdOrder"
      @cancle="closePrint(list, 'table')"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapActions, mapState } from 'vuex'

import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'
import print from '../../../mixins/print'

import dictionary from '../../../global/dictionary'
import { removeEmpty } from '../../../utils/utils'

export default {
  name: 'prod', // 生产
  mixins: [dic, keepAlive, copyParams, print], // mixins混入
  data () {
    // 这里存放数据
    return {
      visible: false,
      dictionary,
      filterData: {
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED', 'CLOSED'],
        pushStatusList: ['NONE', 'PARTIAL', 'FULL']
      },
      orderList: [],
      tipVisible: false,
      processVisible: false,
      selected: [], // 多选数据
      pageIndex: 1,
      pageSize: 10,
      process: undefined,
      processList: [], // 委外工序重复工序
      curRow: {} // 当前行数据
    }
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      list: state => state.product.prod.list,
      total: state => state.product.prod.total,
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
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      this.getData()
    }
  },
  // 方法集合
  methods: {
    ...mapActions([
      'A_GET_PROD_LIST',
      'A_GET_PROD_DEL',
      'POST_GLOBAL_AUDITOR',
      'PROD_LIST_CHECK_APPROVE',
      'A_GET_GLOBAL_EXPORT'
    ]),
    printFun () {
      if (!this.selected.length) {
        this.$message.error('请选择生产订单')
        return
      }
      this.openPrint()
    },
    processClose () {
      this.processVisible = false
      this.process = undefined
    },
    // 导入
    importFile () {
      this.visible = true
    },
    // 导出
    downloadFile () {
      this.filterData = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_GLOBAL_EXPORT({
        ...arg,
        moduleType: 'prod',
        exportName: '生产订单'
      })
    },
    // 批量工序委外
    batchProOutsource () {
      if (this.selected.length === 0) {
        this.$message.error('请选择要工序委外订单')
        return
      }
      const statusList = this.selected
        .map(it => it.status)
        .filter(it => it !== 'APPROVED')
      if (statusList.length > 0) {
        this.$message.error('请选择审批通过的订单进行工序委外')
        return
      }
      const all = []
      this.selected.forEach((item, i) => {
        all.push(item.prodOrderSeqList || [])
      })
      let temArr = all[0]
      for (let i = 1; i < all.length; i += 1) {
        const arr4 = temArr
        const arr5 = all[i]
        temArr = this.repeat(arr4, arr5)
      }
      if (!temArr.length) {
        this.$message.error('请选择有共同工序的订单进行工序委外')
        return
      }
      this.processList = temArr
      this.processVisible = true
    },
    repeat (arr1, arr2) {
      return arr1.filter(i => arr2.some(q => i.baseSeqId === q.baseSeqId))
    },
    // 工序委外
    outsource () {
      if (!this.process || this.process === '') {
        this.$message.error('请选择要委外的工序')
        return
      }
      const ids = this.selected.map(it => it.prodOrderId).join()
      const res = this.processList.filter(it => it.baseSeqId === this.process)
      const [temp] = res
      this.$router.push({
        name: 'outsourceProcessAdd',
        params: { type: 'add' },
        query: { ids, seqId: temp.baseSeqId }
      })
      this.processVisible = false
    },
    // 新增订单
    addBtn () {
      this.type = 'add'
      this.$router.push({
        name: 'addProd',
        params: { type: 'add' }
      })
    },
    // 修改生产订单
    goEdit (prodOrderId) {
      this.type = 'edit'
      this.$router.push({
        name: 'addProd',
        params: { type: 'edit' },
        query: { prodOrderId }
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.selected = val
    },
    // 查询
    search () {
      this.pageIndex = 1
      this.copyParamsFun(this.filterData)
      this.getData()
    },
    // 清空
    clear () {
      this.pageIndex = 1
      this.pageSize = 10
      this.filterData = {
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED', 'CLOSED'],
        pushStatusList: ['NONE', 'PARTIAL', 'FULL']
      }
      this.copyParamsFun(this.filterData)
      this.getData()
    },
    // 删除
    del (prodOrderId) {
      this.$confirm('此操作将永久删除订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delAction(prodOrderId)
        })
        .catch(() => {})
    },
    // 删除请求接口
    async delAction (prodOrderId) {
      try {
        const { status } = await this.A_GET_PROD_DEL({ prodOrderId })
        if (status === 0) {
          this.$message.success('删除成功')
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    //  更多下拉选择
    handleDropDown (id) {
      switch (id) {
        case 1: // 导出
          this.$message.error('暂不支持该功能')
          break
        case 2: // 批量领料
          this.batchPick()
          break
        case 3: // 批量工序委外
          this.batchProOutsource()
          break
        case 4: // 批量入库
          this.batchInSto()
          break
        default:
          break
      }
    },
    // 批量送审
    // async batchReview () {
    //   try {
    //     if (this.selected.length === 0) {
    //       this.$message.error('请选择要送审订单')
    //       return
    //     }
    //     const result = this.selected.map(it => ({
    //       targetId: it.prodOrderId,
    //       targetCode: it.prodCode,
    //       targetType: 'PROD'
    //     }))
    //     const { status } = await this.POST_GLOBAL_AUDITOR(result)
    //     if (status === 0) {
    //       this.$message.success('送审成功')
    //       this.pageIndex = 1
    //       this.getData()
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // 送审前校验
    async checkReview (row) {
      try {
        this.curRow = row
        const { status, data } = await this.PROD_LIST_CHECK_APPROVE([
          row.prodOrderId
        ])
        if (status === 0) {
          if (data && data.length > 0) {
            this.orderList = data.map(it => ({ saleOrderCode: it }))
            this.tipVisible = true
          } else {
            this.review()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    async review () {
      try {
        this.tipVisible = false
        const { prodOrderId, prodCode } = this.curRow
        const arg = {
          targetId: prodOrderId,
          targetCode: prodCode,
          targetType: 'PROD'
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.$message.success('送审成功')
          this.pageIndex = 1
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 设置请求参数
    setParams () {
      const { filterData, pageIndex, pageSize } = this
      const {
 time, statusList, pushStatusList, ...newVal
} = filterData
      const [createTimeBegin, createTimeEnd] = time || []
      const arg = {
        ...newVal,
        statusList,
        pushStatusList: statusList.includes('APPROVED') || statusList.includes('CLOSED') ? [] : pushStatusList,
        createTimeBegin,
        createTimeEnd,
        pageIndex,
        pageSize
      }
      return removeEmpty(arg)
    },
    // 获取生产订单数据
    getData () {
      this.filterData = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_PROD_LIST(arg)
    },
    // 批量领料
    batchPick () {
      if (this.selected.length === 0) {
        this.$message.error('请选择要领料订单')
        return
      }
      const statusList = this.selected
        .map(it => it.status)
        .filter(it => it !== 'APPROVED')
      if (statusList.length > 0) {
        this.$message.error('请选择审批通过的订单进行领料')
        return
      }
      const ids = this.selected.map(it => it.prodOrderId).join()
      this.$router.push({
        name: 'warehouseOutAdd',
        params: { type: 'add' },
        query: { orderIds: ids, type: 'PROD_MATERIAL' }
      })
    },
    // 批量入库
    batchInSto () {
      if (this.selected.length === 0) {
        this.$message.error('请选择要入库订单')
        return
      }
      const statusList = this.selected
        .map(it => it.status)
        .filter(it => it !== 'APPROVED')
      if (statusList.length > 0) {
        this.$message.error('请选择审批通过的订单进行入库')
        return
      }
      const ids = this.selected.map(it => it.prodOrderId).join()
      this.$router.push({
        name: 'warehouseInAdd',
        params: { type: 'add' },
        query: { orderIds: ids, type: 'PROD' }
      })
    },
    // 报工
    reportTask (prodOrderId) {
      this.$router.push({
        name: 'reportTask',
        params: { id: prodOrderId }
      })
    },
    // 去质检
    qualityTest (prodOrderId) {
      this.$router.push({
        name: 'checkListProdAdd',
        query: { id: prodOrderId }
      })
    },
    // 去详情
    goDetail (prodOrderId) {
      this.$router.push({
        name: 'prodDetail',
        params: { id: prodOrderId }
      })
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.$refs.prod.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.$refs.prod.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
