<template>
  <div class="wareHouseIn" ref="mainContainer">
    <tzHeadline title="采购订单">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add','order',0)">新增采购</el-button>
        <!-- <tzBtn icon="tz-icon-del" @click="downloadBtn">批量送审</tzBtn> -->
        <tzBtn icon="tz-icon-ware" @click="batch('in')">批量入库</tzBtn>
        <tzBtn icon="tz-icon-return" @click="batch('out')">批量退货</tzBtn>
        <tzBtn icon="tz-icon-export" @click="downloadBtn">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importVisible=true">导入</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="!batchPrint" @click="batchPrintFun">批量打印</tzBtn>
        <tzBtn
          icon="tz-icon-print"
          v-show="batchPrint"
          @click="closePrint(tableData, 'purchaseTable')"
        >取消打印</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="batchPrint" @click="printFun">打印</tzBtn>
      </template>
    </tzHeadline>
    <el-form
      :inline="true"
      size="medium"
      label-position="right"
      label-width="85px"
      ref="tzHeadline"
      id="tzHeadline"
    >
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="采购订单号">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.purchaseCode"
              @keyup.enter.native="search"
              maxlength="25"
              clearable
            />
          </el-form-item>
          <el-form-item label="采购类型">
            <el-select v-model.trim="searchObj.purchaseType" placeholder="全部" filterable clearable>
              <el-option
                v-for="(item, i) in dictionary.completionStatus7"
                :label="item.name"
                :key="i"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-select v-model.trim="searchObj.baseSupplierId" placeholder="全部" clearable>
              <el-option
                v-for="item in supplierList"
                :key="item.baseSupplierId"
                :label="item.supplierName"
                :value="item.baseSupplierId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料类型">
            <el-select v-model.trim="searchObj.queryTypeName" placeholder="全部" filterable clearable>
              <el-option
                v-for="(item,index) in materialTypeList"
                :key="index"
                :value="item.typeName"
                :label="item.typeName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.queryMaterialCode"
              @keyup.enter.native="search"
              maxlength="15"
              clearable
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.queryMaterialName"
              @keyup.enter.native="search"
              maxlength="15"
              clearable
            />
          </el-form-item>
          <div>
            <el-form-item label="创建日期">
              <el-date-picker
                v-model="searchObj.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="订单状态">
              <el-checkbox-group v-model="searchObj.statusList" @change="getOrderStatus">
                <el-checkbox
                  class="checkbox"
                  v-for="(item, i) in dictionary.auditStatus"
                  :label="item.type"
                  :key="i"
                  :value="item.name"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="入库状态"
              class="ml50"
              v-if="searchObj.statusList.includes('APPROVED') || searchObj.statusList.includes('CLOSED')"
            >
              <el-checkbox-group v-model="searchObj.pushStatusList">
                <el-checkbox
                  class="checkbox"
                  v-for="(item, i) in dictionary.completionStatus1"
                  :label="item.type"
                  :value="item.name"
                  :key="i"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      border
      :data="tableData"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      ref="purchaseTable"
      @expand-change="expandChange"
      @selection-change="partSelectC"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column :type="columnType" v-if="!batchPrint">
        <template slot-scope="props">
          <el-table
            :data="props.row.purchaseOrderMaterialVos"
            class="el-table-expand"
            @select="handleSelectionChange"
            row-class-name="warning-row"
            @select-all="selectAll(props.row.purchaseOrderMaterialVos)"
            @selection-change="selectionChange"
            :row-style="{'background-color': '#F3F5F7'}"
            :header-cell-style="{'background-color': '#F3F5F7'}"
          >
            <el-table-column type="selection" v-if="!batchPrint" />
            <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
            <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
            <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
            <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
            <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
            <el-table-column prop="quantity" label="订单数量" align="center" />
            <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
            <el-table-column prop="sendDate" label="采购交期" align="center">
              <template slot-scope="scope">{{scope.row.sendDate | momentTime('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="含税单价" align="center"></el-table-column>
            <el-table-column prop="totalPrice" label="含税总价" align="center">
              <template
                slot-scope="scope"
              >{{(scope.row.totalPrice = (scope.row.quantity * scope.row.unitPrice)||0).toFixed(6)}}</template>
            </el-table-column>
            <el-table-column prop="stockQuantity" label="已入库数量" align="center"></el-table-column>
            <el-table-column prop="returnQuantity" label="退货数量" align="center"></el-table-column>
            <!-- <el-table-column prop="sendDate" label="最后入库日期" align="center">
            </el-table-column>-->
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column label="采购订单号" prop="purchaseCode" align="center">
        <template slot-scope="scope">
          <span
            class="yellow"
            @click="addBtn(scope.row.purchaseType,'order',scope.row.purchaseOrderId)"
          >{{scope.row.purchaseCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购类型" prop="purchaseType" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.purchaseType | filterDic(dictionary.completionStatus7)}}</template>
      </el-table-column>
      <el-table-column label="供应商" prop="supplierName" align="center" />
      <el-table-column label="订单金额" prop="totalPrice" align="center" />
      <el-table-column label="创建日期" prop="createTime" align="center">
        <template slot-scope="scope">{{scope.row.createTime | momentTime('YYYY-MM-DD HH:mm')}}</template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.status"
            :content="scope.row.status | filterDic(dictionary.auditStatus)"
          />
        </template>
      </el-table-column>
      <el-table-column label="入库状态" prop="pushStatus" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.pushStatus"
            :content="scope.row.pushStatus | filterDic(dictionary.completionStatus1)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <div class="btn">
            <span
              class="pointer mr10"
              @click="approveBtn(scope.row)"
              v-if="scope.row.status === 'DRAFT'"
            >送审</span>
            <span
              class="pointer mr10"
              @click="addBtn(scope.row.purchaseType,'order',scope.row.purchaseOrderId)"
            >详情</span>
            <span class="yellow" @click="delBtn(scope.row.purchaseOrderId)">删除</span>
          </div>
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
      <template #default>
        <div @click="allExpand" class="expand">
          <img src="../../../assets/images/icon/expand.png" alt />
          <span>{{expandText}}</span>
        </div>
      </template>
    </tzPagination>
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下物料已超出采购参考数量"
      @submit="approveFn(curRow)"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList"
        >
          <el-table-column
            property="materialName"
            label="物料名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <tzImport
      title="导入采购订单"
      :visible="importVisible"
      type="purchase"
      @close="importVisible = false"
      @success="clear"
    />
    <tzPrint
      :orders="printList.map(it => ({ code: it.purchaseCode, id: it.purchaseOrderId }))"
      :visible="printVisible"
      type="PurchaseOrder"
      @cancle="closePrint(tableData, 'purchaseTable')"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dictionary from '../../../global/dictionary'
import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import { removeEmpty, unique } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'
import print from '../../../mixins/print'

export default {
  name: 'orderPersonal',
  mixins: [dic, keepAlive, copyParams, print],
  data () {
    return {
      importVisible: false,
      dictionary,
      columnType: 'expand',
      expandText: '全部展开',
      pageIndex: 1,
      pageSize: 10,
      searchObj: {
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED'],
        pushStatusList: ['NONE', 'PARTIAL', 'FULL']
      },
      curRow: [],
      checkList: [],
      tableData: [],
      showStatusFlag: true,
      type: '',
      selectIds: [],
      selectParent: [],
      selectParentItem: [],
      tipVisible: false,
      orderList: [],
      flag: false
    }
  },
  created () {
    // this.getData()
    this.copyParamsFun(this.searchObj)
  },
  computed: {
    ...mapState({
      total: state => state.purchase.purchaseObj.orderPersonalTotal,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      this.searchObj = { ...this.copyParamsObj }
      this.getData()
      this.selectParent = []
    }
  },
  methods: {
    expandChange (row, rows) {
      const arr = rows.filter(
        item => item.purchaseOrderId === row.purchaseOrderId
      )
      if (arr.length === 0) {
        this.selectParent = this.selectParent.filter(
          item => item.purchaseOrderId !== row.purchaseOrderId
        )
      }
    },
    // 所有异步请求
    ...mapActions([
      'GET_ORDER_PERSONAL_LIST',
      'DELETEORDER_PURCHASE_TYPE',
      'SALEORDERCENSOR_PURCHASE_TYPE',
      'ORDERCENSOR_PURCHASE_TYPE',
      'POST_GLOBAL_AUDITOR',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    printFun () {
      if (!this.printList.length) {
        this.$message.error('请选择采购订单')
        return
      }
      this.openPrint()
    },
    // 设置请求参数
    setParams () {
      const { copyParamsObj, pageIndex, pageSize } = this
      const { time, ...newVal } = copyParamsObj
      const [startCreateTime, endCreateTime] = time || []

      const arg = {
        ...newVal,
        startCreateTime,
        endCreateTime,
        pageIndex,
        pageSize
      }
      return removeEmpty(arg)
    },
    // 暂未开发
    downloadBtn () {
      const arg = this.setParams()
      this.searchObj = { ...this.copyParamsObj }
      this.A_GET_GLOBAL_EXPORT({
        ...arg,
        isPersonal: true,
        moduleType: 'purchase',
        exportName: '采购订单'
      })
    },
    // 新增
    addBtn (type, page, id) {
      this.type = type
      this.$router.push({
        name: 'orderPersonalAdd',
        params: {
          type,
          page,
          id
        }
      })
    },
    // 改变订单状态
    getOrderStatus (val) {
      this.showStatusFlag = val.includes('APPROVED') || val.includes('CLOSED')
    },
    // 获取采购列表个人数据
    async getData () {
      this.expandText = '全部展开'
      let arg = this.setParams()
      arg = {
        ...arg,
        statusList: arg.statusList.toString(),
        pushStatusList: this.showStatusFlag ? arg.pushStatusList.toString() : ''
      }
      const { status, data } = await this.GET_ORDER_PERSONAL_LIST(arg)
      if (status === 0) {
        this.tableData = data.records
        for (let i = 0; i < this.tableData.length; i += 1) {
          this.tableData[i].purchaseOrderMaterialVos = this.tableData[
            i
          ].purchaseOrderMaterialVos.map(item => ({
            ...item,
            supplierName: this.tableData[i].supplierName,
            status: this.tableData[i].status,
            pushStatus: this.tableData[i].pushStatus
          }))
        }
      }
    },
    // 查询
    search () {
      this.pageIndex = 1
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 清空
    clear () {
      this.pageIndex = 1
      this.searchObj = {
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED'],
        pushStatusList: ['NONE', 'PARTIAL', 'FULL']
      }
      this.copyParamsFun(this.searchObj)
      this.showStatusFlag = true
      this.getData()
    },
    // table全部展开
    allExpand () {
      this.tableData.forEach((row) => {
        this.$refs.purchaseTable.toggleRowExpansion(
          row,
          this.expandText === '全部展开'
        )
      })
      this.expandText =
        this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.DELETEORDER_PURCHASE_TYPE(val)
      if (status === 0) {
        this.$message.success('删除成功')
        this.getData()
      }
    },
    // 删除
    delBtn (val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示')
        .then((res) => {
          if (res === 'confirm') {
            this.delFn(val)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 送审方法
    async approveFn (item) {
      try {
        const arg = {
          targetType: 'PURCHASE',
          targetCode: item.purchaseCode,
          targetId: item.purchaseOrderId
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.tipVisible = false
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    async approveBtn (item) {
      this.curRow = item
      if (item.purchaseType === 'SALE_PROD') {
        const { status, data } = await this.SALEORDERCENSOR_PURCHASE_TYPE([
          item.purchaseOrderId
        ])
        if (status === 0) {
          if (data.length > 0) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.approveFn(item)
          }
        }
      } else if (item.purchaseType === 'APPLY') {
        const { status, data } = await this.ORDERCENSOR_PURCHASE_TYPE([
          item.purchaseOrderId
        ])
        if (status === 0) {
          if (data.length) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.approveFn(item)
          }
        }
      } else {
        this.approveFn(item)
      }
    },
    // 获取checkbox值
    handleSelectionChange (val, row) {
      const arr = this.selectParent.filter(
        item => item.purchaseOrderMaterialId === row.purchaseOrderMaterialId
      )
      if (arr.length === 0) {
        this.selectParent.push(row)
      } else {
        this.selectParent = this.selectParent.filter(
          item => item.purchaseOrderMaterialId !== row.purchaseOrderMaterialId
        )
      }
    },
    selectAll (v) {
      v.forEach((i) => {
        const arr = this.selectParent.filter(
          item => item.purchaseOrderMaterialId === i.purchaseOrderMaterialId
        )
        if (arr.length && this.flag) {
          this.selectParent = this.selectParent.filter(
            item => item.purchaseOrderMaterialId !== i.purchaseOrderMaterialId
          )
        } else {
          this.selectParent.push(i)
        }
      })
      this.flag = false
    },
    selectionChange (val) {
      if (val.length === 0) {
        this.flag = true
      }
    },
    // 批量入库
    batch (status) {
      const supplierArr = []
      const orderStatus = []
      const idArr = []
      for (let index = 0; index < this.selectParent.length; index += 1) {
        const element = this.selectParent[index]
        supplierArr.push(element.supplierName)
        orderStatus.push(element.status)
        idArr.push(element.purchaseOrderId)
      }
      const newSupplierArr = unique(supplierArr)
      const newOrderStatus = unique(orderStatus)
      const newIdArr = unique(idArr)
      if (this.selectParent.length > 0) {
        if (newSupplierArr.length > 1) {
          this.$message.error('供应商必须为同一人')
          return
        }
        if (
          !(newOrderStatus.length === 1 && newOrderStatus.includes('APPROVED'))
        ) {
          this.$message.error(
            `您选择了未审核的单据，发起${
              status === 'in' ? '入' : '出'
            }库只可以选择审核通过的单据，请重新选择`
          )
          return
        }
        const orderId = this.selectParent.map(item => item.purchaseOrderId)
        const orderMaterialIds = this.selectParent.map(
          item => item.purchaseOrderMaterialId
        )
        const curRows =
          this.tableData
            .filter(it => newIdArr.includes(it.purchaseOrderId))
            .map(it => it.pushStatus) || []
        if (status === 'out' && curRows.includes('NONE')) {
          this.$message.error(
            '您选择的采购订单存在未入库的情况，请选择已入库的采购订单进行退货！'
          )
          return
        }
        this.$router.push({
          name: status === 'in' ? 'warehouseInAdd' : 'warehouseOutAdd',
          params: { type: 'add' },
          query: {
            orderIds: unique(orderId).join(),
            orderMaterialIds: unique(orderMaterialIds).join(),
            type: 'PURCHASE'
          }
        })
      } else {
        this.$message.error('请选择物料信息')
      }
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      document.getElementsByClassName(
        'el-table__body-wrapper'
      )[0].scrollTop = 0 // 分页时滚动到表达顶部
      this.searchObj = { ...this.copyParamsObj }
      this.getData()
      this.$refs.mainContainer.scrollTop = 0
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.getData()
      this.$refs.mainContainer.scrollTop = 0
    }
  }
}
</script>

<style lang="less">
.wareHouseIn {
  .el-table-expand {
    border-left: 4px solid #7ca870;
  }
  .expand:hover {
    cursor: pointer;
  }
}
.wareHouseIn .el-table__expanded-cell {
  padding: 0 50px !important;
}
</style>>
