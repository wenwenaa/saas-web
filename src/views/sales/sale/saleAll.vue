<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="销售订单">
      <template slot="btn">
        <!-- <tzBtn icon="tz-icon-planProduct" @click="planProduct">计划生产</tzBtn>
        <tzBtn icon="tz-icon-bulkShipment" @click="batch">批量发货</tzBtn>-->
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="!batchPrint" @click="batchPrintFun">批量打印</tzBtn>
        <tzBtn
          icon="tz-icon-print"
          v-show="batchPrint"
          @click="closePrint(tableData, 'formData')"
        >取消打印</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="batchPrint" @click="printFun">打印</tzBtn>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link pointer">
            <i class="tz-icon-more tz-button-icon ml20"></i>
            更多操作
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="7">计划生产</el-dropdown-item>
            <el-dropdown-item :command="8">批量发货</el-dropdown-item>
            <el-dropdown-item :command="1">发起成品采购申请</el-dropdown-item>
            <el-dropdown-item :command="2">发起子件采购申请</el-dropdown-item>
            <el-dropdown-item :command="3">发起成品采购单</el-dropdown-item>
            <el-dropdown-item :command="4">发起子件采购单</el-dropdown-item>
            <el-dropdown-item :command="5">批量退货入库</el-dropdown-item>
            <el-dropdown-item :command="6">批量委外</el-dropdown-item>
            <!-- <el-dropdown-item :command="7">导入</el-dropdown-item>
            <el-dropdown-item :command="8">导出</el-dropdown-item>-->
            <!-- <el-dropdown-item>下载模版</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear" :isShowExtend="true">
        <template slot="content">
          <el-form-item label="销售订单号">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.saleCode"
            />
          </el-form-item>
          <el-form-item label="客户" prop="baseCustomerId">
            <el-select
              v-model.trim="formData.baseCustomerId"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                :key="item.baseCustomerId"
                :label="item.customerName"
                v-for="item in customerList"
                :value="item.baseCustomerId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户订单号">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.customerCode"
            />
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料类型">
            <el-select v-model.trim="formData.queryTypeName" clearable filterable placeholder="请选择">
              <el-option
                :key="item.baseMaterialTypeId"
                :label="item.typeName"
                v-for="item in materialTypeList"
                :value="item.typeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.queryMaterialCode"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.queryMaterialName"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <br />
          <el-form-item label="物料图号">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.queryPicNum"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              clearable
              v-model="formData.time"
              :editable="false"
              @change="getTime"
              start-placeholder="创建时间"
              end-placeholder="结束时间"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <br />
          <div class="checked">
            <el-form-item label="订单状态">
              <el-checkbox-group v-model="formData.statusList">
                <el-checkbox
                  class="checkbox"
                  v-for="item in orderState"
                  :key="item.type"
                  :label="item.type"
                  name="type"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="发货状态"
              v-if="formData.statusList.includes('APPROVED') || formData.statusList.includes('CLOSED')"
            >
              <el-checkbox-group v-model="formData.pushStatusList">
                <el-checkbox
                  class="checkbox"
                  v-for="item in deliveryStatus"
                  :key="item.type"
                  :label="item.type"
                  name="type"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      ref="formData"
      :data="tableData"
      v-loading="tableLoading"
      @expand-change="expandChange"
      @selection-change="partSelectC"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column type="expand" v-if="!batchPrint">
        <template slot-scope="scope">
          <el-table
            border
            @select="select"
            class="el-table-expand"
            :ref="`next${scope.row.index}`"
            @select-all="selectAll(scope.row)"
            :row-style="{'background-color': '#F3F5F7'}"
            :header-cell-style="{'background-color': '#F3F5F7'}"
            :data="scope.row.saleOrderMaterialDtoList"
          >
            <el-table-column align="center" type="selection" v-if="!batchPrint" width="46"></el-table-column>
            <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="picNum" label="物料图号" show-overflow-tooltip></el-table-column>
            <el-table-column
              align="center"
              prop="customerMaterialCode"
              label="客户料号"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="unitPrice" label="含税单价"></el-table-column>
            <el-table-column align="center" prop="materialStock" label="库存数量">
              <template slot-scope="scope">{{scope.row.materialStock || 0}}</template>
            </el-table-column>
            <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
            <el-table-column align="center" prop="quantity" label="订单数量">
              <template slot-scope="scope">{{scope.row.quantity}}</template>
            </el-table-column>
            <el-table-column align="center" prop="sendDate" label="交期">
              <template slot-scope="scope">{{scope.row.sendDate | momentTime('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column align="center" prop="deliveryQuantity" label="已发货数量">
              <template slot-scope="scope">{{scope.row.deliveryQuantity}}</template>
            </el-table-column>
            <el-table-column align="center" prop="returnQuantity" label="退货数量">
              <template slot-scope="scope">{{scope.row.returnQuantity}}</template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column align="center" prop="saleCode" label="销售订单号" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="yellow" @click="goTo('detail', scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="customerCode" label="客户订单号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="salerStuff" label="销售人员" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="baseCustomerName" label="客户" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="totalPrice" label="订单总价"></el-table-column>
      <el-table-column align="center" prop="status" label="订单状态">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.status"
            :content="scope.row.status | filterDic(dics.auditStatus)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="pushStatus" label="发货状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'DRAFT'">——</div>
          <div v-else>
            <tzStatus
              :status="scope.row.pushStatus"
              :content="scope.row.pushStatus | filterDic(dics.completionStatus4)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | momentTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="buttons">
            <div
              class="btns pointer"
              v-if="scope.row.status === 'DRAFT'"
              @click="checkReview(scope.row)"
            >送审</div>
            <div
              class="btns pointer"
              v-if="scope.row.status === 'DRAFT'"
              @click="goTo('edit', scope.row.saleOrderId)"
            >编辑</div>
            <div
              class="btns yellow"
              style="cursor: pointer;"
              @click="goTo('detail', scope.row.saleOrderId)"
            >详情</div>
            <div
              class="btns yellow"
              v-if="scope.row.status === 'DRAFT'"
              @click="comfirmSalesDel(scope.row)"
            >删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :total="total"
      :current-page="formData.pageIndex"
      :pageSize="formData.pageSize"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange"
    >
      <template #default>
        <div @click="allExpand" class="expand">
          <img src="../../../assets/images/icon/expand.png" alt />
          <span>{{expandText}}</span>
        </div>
      </template>
    </tzPagination>
    <tzImport
      title="导入销售模板"
      :visible="importVisible"
      type="sale"
      @close="importVisible = false"
      @success="clear"
    />
    <tzPrint
      :orders="printList.map(it => ({ code: it.saleCode, id: it.saleOrderId }))"
      :visible="printVisible"
      type="sale"
      @cancle="closePrint(tableData, 'formData')"
    />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import print from '../../../mixins/print'
import dics from '../../../global/dictionary'
import { unique } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'saleAll',
  mixins: [keepAlive, dic, copyParams, print],
  data () {
    return {
      garbage: 0,
      expandText: '全部展开',
      throttle: false,
      isCheckAll: false,
      dics, // 引入全局
      importVisible: false,
      orderState: dics.auditStatus,
      deliveryStatus: dics.completionStatus4,
      formData: {
        time: '',
        pageIndex: 1,
        pageSize: 10,
        saleCode: '',
        queryPicNum: '',
        customerCode: '',
        queryTypeName: '',
        endCreateTime: '',
        beginCreateTime: '',
        baseCustomerName: '',
        queryMaterialName: '',
        queryMaterialCode: '',
        pushStatusList: ['NONE', 'PARTIAL', 'FULL'],
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED']
      },
      selectedId: [], // 批量删除的id
      expandRowKeys: [],
      materialType: '',
      type: 'img',
      total: 0,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getSalelist()
  },
  activated () {
    const { type } = this.formData
    if (type === 'add') {
      this.clear()
    } else {
      this.formData = { ...this.copyParamsObj }
      this.getSalelist()
    }
  },
  methods: {
    ...mapMutations(['TABLE_LOADING']),
    ...mapActions([
      'GET_SALES_LIST',
      'DEL_SALES_lIST',
      'POST_GLOBAL_AUDITOR',
      'A_GET_GLOBAL_EXPORT'
    ]),
    printFun () {
      if (!this.printList.length) {
        this.$message.error('请选择销售单号')
        return
      }
      this.openPrint()
    },
    allExpand () {
      this.tableData.forEach((row) => {
        this.$refs.formData.toggleRowExpansion(
          row,
          this.expandText === '全部展开'
        )
      })
      this.expandText =
        this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    // 全选
    selectAll (selection) {
      const { index } = selection
      const childLength = this.tableData[index].saleOrderMaterialDtoList.length
      const trueLength = this.tableData[index].saleOrderMaterialDtoList.filter(
        item => item.toggleChecked
      ).length
      if (childLength === trueLength) {
        this.tableData[index].toggleChecked = false
        for (
          let i = 0;
          i < this.tableData[index].saleOrderMaterialDtoList.length;
          i += 1
        ) {
          this.tableData[index].saleOrderMaterialDtoList[
            i
          ].toggleChecked = false
        }
      } else {
        this.tableData[index].toggleChecked = true
        for (
          let i = 0;
          i < this.tableData[index].saleOrderMaterialDtoList.length;
          i += 1
        ) {
          this.tableData[index].saleOrderMaterialDtoList[
            i
          ].toggleChecked = true
        }
      }
    },
    // 单选
    select (selection, row) {
      const { parIndex, index, toggleChecked } = row
      const childLength = this.tableData[parIndex].saleOrderMaterialDtoList
        .length
      this.tableData[parIndex].saleOrderMaterialDtoList[
        index
      ].toggleChecked = !toggleChecked
      const falseLength = this.tableData[
        parIndex
      ].saleOrderMaterialDtoList.filter(item => !item.toggleChecked).length
      if (childLength === falseLength) {
        this.tableData[parIndex].toggleChecked = false
      } else {
        this.tableData[parIndex].toggleChecked = true
      }
    },
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getSalelist()
    },
    // 获取创建时间
    getTime (e) {
      [this.formData.beginCreateTime, this.formData.endCreateTime] = e
    },
    // 清空列表
    clear () {
      this.formData = {
        time: '',
        pageIndex: 1,
        pageSize: 10,
        saleCode: '',
        queryPicNum: '',
        customerCode: '',
        queryTypeName: '',
        endCreateTime: '',
        beginCreateTime: '',
        baseCustomerName: '',
        queryMaterialName: '',
        queryMaterialCode: '',
        pushStatusList: ['NONE', 'PARTIAL', 'FULL'],
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED']
      }
      this.copyParamsFun(this.formData)
      this.getSalelist()
    },
    // 获取销售订单列表
    async getSalelist () {
      try {
        this.TABLE_LOADING(true)
        this.expandText = '全部展开'
        const { status, data } = await this.GET_SALES_LIST(this.formData)
        if (status === 0) {
          data.records = data.records.map((item, index) => {
            const saleOrderMaterialDtoList = item.saleOrderMaterialDtoList.map(
              (inItem, inIndex) => ({
                ...inItem,
                parIndex: index, // 父元素的index
                index: inIndex, // 子元素的index
                toggleChecked: false
              })
            )
            return {
              index,
              ...item,
              toggleChecked: false,
              saleOrderMaterialDtoList
            }
          })
          this.total = data.total
          this.tableData = data.records
        }
        this.TABLE_LOADING(false)
      } catch (e) {
        this.TABLE_LOADING(false)
        console.log(e)
      }
    },
    // 确认删除销售订单
    async comfirmSalesDel (item) {
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.salesDel(item.saleOrderId)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除销售订单
    async salesDel (saleOrderId) {
      try {
        const { status } = await this.DEL_SALES_lIST({ saleOrderId })
        if (status === 0) {
          this.$message.success('删除成功')
          this.getSalelist()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    goTo (type, id = '') {
      this.formData.type = type
      let arg = {
        path:
          type === 'detail'
            ? `${urls.SALE_DETAIL}/${type}`
            : `${urls.SALE_ADD}/${type}`
      }
      if (id) {
        const query = {
          query: { id }
        }
        arg = Object.assign({}, arg, query)
      }
      this.$router.push(arg)
    },
    // 导出方法
    downloadFile () {
      this.formData = { ...this.copyParamsObj }
      this.A_GET_GLOBAL_EXPORT({
        ...this.formData,
        isPersonal: false,
        moduleType: 'sale',
        exportName: '销售'
      })
    },
    importFile () {
      this.importVisible = true
    },
    // 下拉方法
    handleCommand (val) {
      if (val === 7) {
        const arr = []
        const materialId = []
        const statusArr = []
        this.tableData.forEach((item) => {
          if (item.toggleChecked) {
            statusArr.push(item.status)
            item.saleOrderMaterialDtoList.forEach((inItem) => {
              if (inItem.toggleChecked) {
                arr.push(inItem.saleOrderMaterialId)
                materialId.push(inItem.baseMaterialId)
              }
            })
          }
        })
        const newMaterialId = unique(materialId)
        if (
          statusArr.includes('DRAFT') ||
          statusArr.includes('SUBMIT') ||
          statusArr.includes('CLOSED')
        ) {
          this.$message.error('订单必须审核通过状态')
          return
        }
        if (!arr.length && !materialId.length) {
          this.$message.error('请选择销售单号')
          return
        }
        if (newMaterialId.length > 1) {
          this.$message.error('只能选择同一个物料')
          return
        }
        const saleOrderMaterialIdStr = arr.join()
        this.$router.push({
          name: 'addProd',
          params: {
            type: 'add'
          },
          query: { saleOrderMaterialIdStr, materialId: newMaterialId[0] }
        })
      } else if (val === 8) {
        const arr = []
        const statusArr = []
        const materialId = []
        const customerArr = []
        this.tableData.forEach((item) => {
          if (item.toggleChecked) {
            arr.push(item.saleOrderId)
            statusArr.push(item.status)
            customerArr.push(item.baseCustomerId)
            item.saleOrderMaterialDtoList.forEach((inItem) => {
              if (inItem.toggleChecked) {
                materialId.push(inItem.saleOrderMaterialId)
              }
            })
          }
        })
        const newMaterialId = unique(materialId)
        const newCustomerArr = unique(customerArr)
        if (!arr.length && !materialId.length) {
          this.$message.error('请选择销售单号')
          return
        }
        if (
          statusArr.includes('DRAFT') ||
          statusArr.includes('SUBMIT') ||
          statusArr.includes('CLOSED')
        ) {
          this.$message.error('订单必须审核通过状态')
          return
        }
        if (newCustomerArr.length > 1) {
          this.$message.error('客户必须为同一人')
          return
        }
        const saleOrderMaterialIdStr = arr.join()
        this.$router.push({
          name: 'warehouseOutAdd',
          params: {
            type: 'add'
          },
          query: {
            orderIds: saleOrderMaterialIdStr,
            orderMaterialIds: newMaterialId.join(),
            type: 'SALE'
          }
        })
      } else {
        const arr = []
        const statusArr = []
        const materialId = []
        const customerArr = []
        const returnGoods = []
        const orderMaterialId = []
        this.tableData.forEach((item) => {
          if (item.toggleChecked) {
            arr.push(item.saleOrderId)
            statusArr.push(item.status)
            customerArr.push(item.baseCustomerId)
            returnGoods.push(item.pushStatus)
            item.saleOrderMaterialDtoList.forEach((inItem) => {
              if (inItem.toggleChecked) {
                materialId.push(inItem.baseMaterialId)
                orderMaterialId.push(inItem.saleOrderMaterialId)
              }
            })
          }
        })
        // const newMaterialId = unique(materialId)
        const newOrderMaterialId = unique(orderMaterialId)
        if (!arr.length && !materialId.length) {
          this.$message.error('请选择销售单号')
          return
        }
        if (
          statusArr.includes('DRAFT') ||
          statusArr.includes('SUBMIT') ||
          statusArr.includes('CLOSED')
        ) {
          this.$message.error('订单必须审核通过状态')
          return
        }
        // const ids = arr.join(newMaterialId)
        const newCustomerArr = unique(customerArr)
        if (val === 1) {
          this.applyFinished(newOrderMaterialId.join())
        } else if (val === 2) {
          this.applySubpart(newOrderMaterialId.join())
        } else if (val === 3) {
          this.orderFinished(newOrderMaterialId.join())
        } else if (val === 4) {
          this.orderSubpart(newOrderMaterialId.join())
        } else if (val === 5) {
          if (newCustomerArr.length > 1) {
            this.$message.error('客户必须为同一人')
            return
          }
          if (returnGoods.includes('NONE')) {
            this.$message.error('包含未发货订单')
            return
          }
          const saleOrderMaterialIdStr = arr.join()
          this.$router.push({
            name: 'warehouseInAdd',
            params: {
              type: 'add'
            },
            query: {
              orderIds: saleOrderMaterialIdStr,
              orderMaterialIds: newOrderMaterialId.join(),
              type: 'SALE'
            }
          })
        } else if (val === 6) {
          this.$router.push({
            name: 'outsourceProductAdd',
            query: {
              ids: orderMaterialId.join(),
              type: 'SALE'
            }
          })
        }
      }
    },
    // 发起成品采购申请
    applyFinished (ids) {
      this.$router.push({
        name: 'applyFinishedAdd',
        params: {
          type: 'add',
          page: 'finished',
          id: ids
        }
      })
    },
    // 发起子件采购申请
    applySubpart (ids) {
      this.$router.push({
        name: 'applyFinishedAdd',
        params: {
          type: 'add',
          page: 'subpart',
          id: ids
        }
      })
    },
    // 发起成品采购单
    orderFinished (ids) {
      this.$router.push({
        name: 'orderFinishedAdd',
        params: {
          type: 'add',
          page: 'finished',
          id: ids
        }
      })
    },
    // 发起子件采购单
    orderSubpart (ids) {
      this.$router.push({
        name: 'orderFinishedAdd',
        params: {
          type: 'add',
          page: 'subpart',
          id: ids
        }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getSalelist()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getSalelist()
    },
    // 送审
    async checkReview (item) {
      try {
        const arg = {
          targetId: item.saleOrderId,
          targetCode: item.saleCode,
          targetType: 'SALE'
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.$message.success('送审成功')
          this.getSalelist()
        }
      } catch (e) {
        console.log(e)
      }
    },
    expandChange (row, selection) {
      const name = `next${row.index}`
      this.$nextTick(() => {
        if (!this.$refs[name]) {
          this.tableData[row.index].toggleChecked = false
          this.tableData[row.index].saleOrderMaterialDtoList.forEach(
            (item, index) => {
              this.tableData[row.index].saleOrderMaterialDtoList[
                index
              ].toggleChecked = false
            }
          )
        }
      })
      // 展开
      // const name = `next${row.index}`
      // this.$nextTick(() => {
      //   if (row.toggleChecked && this.$refs[name]) {
      //     row.saleOrderMaterialDtoList.forEach((item) => {
      //       if (item.toggleChecked) {
      //         this.$refs[name].toggleRowSelection(item)
      //       }
      //     })
      //   }
      // })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
<style lang="less">
.contain-company .el-table-expand {
  border-left: 4px solid #7ca870 !important;
}
.contain-company .el-table__expanded-cell {
  padding: 0 50px !important;
}
</style>
