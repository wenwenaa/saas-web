<template>
  <div class="wareHouseIn" ref="mainContainer">
    <tzHeadline title="成品委外订单">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('NONE')">新建委外单</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadBtn">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importVisible=true">导入</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="!batchPrint" @click="batchPrintFun">批量打印</tzBtn>
        <tzBtn
          icon="tz-icon-print"
          v-show="batchPrint"
          @click="closePrint(tableData, 'wareInTable')"
        >取消打印</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="batchPrint" @click="printFun">打印</tzBtn>
        <el-dropdown @command="handleDropDown">
          <span class="el-dropdown-link pointer">
            <i style="fontSize: 16px;color: #7CA870;margin-left: 16px" class="el-icon-menu"></i>
            更多操作
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">批量发料</el-dropdown-item>
            <el-dropdown-item :command="2">批量退货</el-dropdown-item>
            <el-dropdown-item :command="3">批量入库</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium" label-position="right" label-width="85px">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="委外单号">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.supplyCode"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
          <el-form-item label="委外来源">
            <el-select v-model.trim="searchObj.supplyType" placeholder="全部" filterable clearable>
              <el-option
                v-for="(item, i) in dictionary.outSourceTypes"
                :label="item.origin"
                :key="i"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-select clearable filterable v-model="searchObj.baseSupplierIds" placeholder="供应商">
              <el-option
                v-for="(supplier, index) in supplierList"
                :key="index"
                :label=" supplier.supplierName"
                :value="supplier.baseSupplierId"
              />
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料类型">
            <el-select v-model.trim="searchObj.typeName" placeholder="全部" filterable clearable>
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
              v-model.trim="searchObj.materialCode"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialName"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
          <div>
            <el-form-item label="负责人">
              <el-select clearable filterable v-model="searchObj.managerStuffId" placeholder="负责人">
                <el-option
                  v-for="(staff, index) in staffList"
                  :key="index"
                  :label=" staff.realname"
                  :value=" staff.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
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
              <el-checkbox-group v-model="searchObj.statusList">
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
              v-if="searchObj.statusList.includes('APPROVED') || searchObj.statusList.includes('CLOSED')"
            >
              <el-checkbox-group v-model="searchObj.pushStatusList">
                <el-checkbox
                  class="checkbox"
                  :label="item.type"
                  v-for="(item,index) in dictionary.completionStatus1"
                  :key="index"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      border
      ref="wareInTable"
      :data="tableData"
      v-loading="tableLoading"
      @expand-change="expandChange"
      @selection-change="partSelectC"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column :type="columnType" v-if="!batchPrint">
        <template slot-scope="scope">
          <el-table
            @select="select"
            style="width: 100%"
            class="el-table-expand"
            row-class-name="warning-row"
            :ref="`next${scope.row.index}`"
            @select-all="selectAll(scope.row)"
            :data="scope.row.supplyOrderMaterial"
            :header-cell-style="{'background-color': '#F3F5F7'}"
          >
            <el-table-column align="center" type="selection" v-if="!batchPrint"></el-table-column>
            <el-table-column
              prop="typeName"
              label="物料类型"
              width="180"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="materialCode"
              label="物料编码"
              width="180"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="supplyOrderQuantity" label="委外数量" align="center"></el-table-column>
            <el-table-column prop="unitPrice" label="委外单价" align="center"></el-table-column>
            <el-table-column prop="stockInQuantity" label="入库数量" align="center"></el-table-column>
            <el-table-column prop="returnQuantity" label="退货数量" align="center"></el-table-column>
            <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column label="委外订单号" prop="supplyCode" align="center">
        <template slot-scope="scope">
          <span class="yellow" @click="toDetail(scope.row)">{{scope.row.supplyCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委外来源" prop="supplyType" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.supplyType | filterDic(dictionary.outSourceTypes,'type','origin')}}</template>
      </el-table-column>
      <el-table-column label="供应商" prop="supplierName" align="center"></el-table-column>
      <el-table-column label="负责人" prop="managerStuff" align="center"></el-table-column>
      <el-table-column label="创建日期" prop="createTime" align="center">
        <template slot-scope="scope">{{scope.row.createTime | momentTime('YYYY-MM-DD HH:mm')}}</template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.status"
            :content="scope.row.status | filterDic(dictionary.auditStatus)"
          ></tzStatus>
        </template>
      </el-table-column>
      <el-table-column label="入库状态" prop="pushStatus" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.pushStatus"
            :content="scope.row.pushStatus | filterDic(dictionary.completionStatus1)"
          ></tzStatus>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <span
            class="pointer mr10"
            @click="approveBtn(scope.row)"
            v-if="scope.row.status === 'DRAFT'"
          >送审</span>
          <span class="pointer mr10" @click="toDetail(scope.row)">详情</span>
          <span
            class="yellow"
            @click="delBtn(scope.row.supplyOrderId)"
            v-if="scope.row.status==='DRAFT'"
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
    >
      <template #default>
        <div @click="allExpand" class="expand">
          <img src="../../../assets/images/icon/expand.png" alt />
          <span>{{expandText}}</span>
        </div>
      </template>
    </tzPagination>
    <tzTipDialog :visible="tipVisible" :singleBtn="singleBtn" @close="handleClose">
      <template v-slot:tipTitle>您提交的订单中，以下单据未审核，请重新选择</template>
      <template v-slot:tipTable>
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList"
        >
          <el-table-column property="supplyCode" label="委外订单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <tzTipDialog :visible="tipVisible1" :singleBtn="singleBtn" @close="handleClose">
      <template v-slot:tipTitle>您提交的订单中，以下单据已关闭，请重新选择</template>
      <template v-slot:tipTable>
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList"
        >
          <el-table-column property="supplyCode" label="委外订单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <tzTipDialog
      :visible="tipVisible2"
      :singleBtn="singleBtn"
      @close="handleClose"
      @submit="tipVisible2=false"
    >
      <template v-slot:tipTitle>您选择的{{orderList.length}}条委外订单未入库，无需退货</template>
    </tzTipDialog>
    <tzTipDialog
      :visible="tipVisible3"
      :singleBtn="singleBtn3"
      @close="handleClose"
      @submit="dialogSubmit"
    >
      <template
        v-slot:tipTitle
      >您选择的{{orderList.length}}条委外订单中，包含{{inOrderList.length}}条单据是未入库状态,继续操作只会对已入库的委外订单生效</template>
    </tzTipDialog>
    <tzTipDialog
      :visible="tipVisible4"
      :singleBtn="singleBtn4"
      @close="handleClose"
      @submit="dialogSubmit1"
    >
      <template v-slot:tipTitle>您提交的订单中，以下单据已超出委外参考量</template>
      <template v-slot:tipTable>
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList4"
        >
          <el-table-column property="materialName" label="物料名称" align="center"></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <tzImport
      title="导入成品委外订单"
      :visible="importVisible"
      type="supply"
      @close="importVisible = false"
      @success="clear"
    />
    <tzPrint
      :orders="printList.map(it => ({ code: it.supplyCode, id: it.supplyOrderId }))"
      :visible="printVisible"
      type="SupplyOrder"
      @cancle="closePrint(tableData, 'wareInTable')"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dictionary from '../../../global/dictionary'

import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'
import print from '../../../mixins/print'

import { removeEmpty, unique } from '../../../utils/utils'

export default {
  name: 'outsourceProduct',
  mixins: [dic, keepAlive, copyParams, print],
  data () {
    return {
      importVisible: false,
      singleBtn: true,
      singleBtn3: false,
      dictionary,
      columnType: 'expand',
      expandText: '全部展开',
      pageIndex: 1,
      pageSize: 10,
      searchObj: {
        statusList: ['DRAFT', 'SUBMIT', 'APPROVED'],
        pushStatusList: ['NONE', 'PARTIAL', 'FULL']
      },
      checkList: [],
      tableData: [],
      tipVisible: false,
      tipVisible1: false,
      tipVisible2: false,
      tipVisible3: false,
      orderList: [],
      selectParentItem: [],
      approveList: {},
      total: 0,
      inOrderList: [],
      outOrderList: [],
      type: '',
      tipVisible4: false,
      singleBtn4: false,
      orderList4: []
    }
  },
  created () {
    this.copyParamsFun(this.searchObj)
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      this.getData()
    }
  },
  computed: {
    ...mapState({
      tableLoading: state => state.global.tableLoading
    })
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_GET_OUT_PRODUCT_LIST',
      'APPROVELIST_PURCHASE_TYPE',
      'POST_GLOBAL_AUDITOR',
      'A_DEL_OUT_PRODUCT_ORDER',
      'A_CHECK_OUT_PRODUCT_ORDER_LIST',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 同步vuex数据
    ...mapMutations(['TABLE_LOADING']),
    printFun () {
      if (!this.printList.length) {
        this.$message.error('请选择成品委外订单')
        return
      }
      this.openPrint()
    },
    // 设置请求参数
    setParams () {
      const { copyParamsObj, pageIndex, pageSize } = this
      const { time, ...newVal } = copyParamsObj
      const [startTime, endTime] = time || []

      const arg = {
        ...newVal,
        startTime,
        endTime,
        pageIndex,
        pageSize
      }
      return removeEmpty(arg)
    },
    //  更多下拉选择
    handleDropDown (val) {
      const arr = []
      const materialId = []
      const orderMaterialId = []
      const orders = []
      this.tableData.forEach((item) => {
        if (item.toggleChecked) {
          orders.push(item)
          arr.push(item.supplyOrderId)
          item.supplyOrderMaterial.forEach((inItem) => {
            if (inItem.toggleChecked) {
              materialId.push(inItem.baseMaterialId)
              orderMaterialId.push(inItem.supplyOrderMaterialId)
            }
          })
        }
      })
      const newOrderMaterialId = unique(orderMaterialId)
      if (!arr.length && !materialId.length) {
        this.$message.error('请选择委外成品单')
        return
      }
      const supplierIds = orders.map(it => it.baseSupplierId)
      if (unique(supplierIds).length > 1) {
        this.$message.error('请选择同一家供应商')
        return
      }
      const orders1 = orders.filter(
        i => i.status === 'DRAFT' || i.status === 'SUBMIT'
      )
      if (orders1.length) {
        this.tipVisible = true
        this.orderList = orders1
        return
      }
      const orders2 = orders.filter(i => i.status === 'CLOSED')
      if (orders2.length) {
        this.tipVisible1 = true
        this.orderList = orders2
      }
      if (val === 3) {
        this.$router.push({
          name: 'warehouseInAdd',
          params: {
            type: 'add'
          },
          query: {
            orderIds: arr.join(),
            orderMaterialIds: newOrderMaterialId.join(),
            type: 'SUPPLY'
          }
        })
      }
      if (val === 1) {
        this.$router.push({
          name: 'warehouseOutAdd',
          params: {
            type: 'add'
          },
          query: {
            orderIds: arr.join(),
            orderMaterialIds: newOrderMaterialId.join(),
            type: 'SUPPLY_MATERIAL'
          }
        })
      }
      if (val === 2) {
        if (orders.every(i => i.pushStatus === 'NONE')) {
          this.tipVisible2 = true
          this.orderList = orders
          return
        }
        this.inOrderList = orders.filter(i => i.pushStatus === 'NONE')
        this.outOrderList = orders.filter(i => i.pushStatus !== 'NONE')
        if (this.outOrderList.length !== orders.length && orders.length) {
          this.tipVisible3 = true
          this.orderList = orders
          return
        }
        this.$router.push({
          name: 'warehouseOutAdd',
          params: {
            type: 'add'
          },
          query: {
            orderIds: arr.join(),
            orderMaterialIds: newOrderMaterialId.join(),
            type: 'SUPPLY'
          }
        })
      }
    },
    dialogSubmit1 () {
      this.tipVisible4 = false
      this.approveFn(this.approveList)
    },
    // 全选
    selectAll (selection) {
      const { index } = selection
      const childLength = this.tableData[index].supplyOrderMaterial.length
      const trueLength = this.tableData[index].supplyOrderMaterial.filter(
        item => item.toggleChecked
      ).length
      if (childLength === trueLength) {
        this.tableData[index].toggleChecked = false
        for (
          let i = 0;
          i < this.tableData[index].supplyOrderMaterial.length;
          i += 1
        ) {
          this.tableData[index].supplyOrderMaterial[i].toggleChecked = false
        }
      } else {
        this.tableData[index].toggleChecked = true
        for (
          let i = 0;
          i < this.tableData[index].supplyOrderMaterial.length;
          i += 1
        ) {
          this.tableData[index].supplyOrderMaterial[i].toggleChecked = true
        }
      }
    },
    // 单选
    select (selection, row) {
      const { parIndex, index, toggleChecked } = row
      const childLength = this.tableData[parIndex].supplyOrderMaterial.length
      this.tableData[parIndex].supplyOrderMaterial[
        index
      ].toggleChecked = !toggleChecked
      const falseLength = this.tableData[parIndex].supplyOrderMaterial.filter(
        item => !item.toggleChecked
      ).length
      if (childLength === falseLength) {
        this.tableData[parIndex].toggleChecked = false
      } else {
        this.tableData[parIndex].toggleChecked = true
      }
    },
    // 暂未开发
    downloadBtn () {
      const arg = this.setParams()
      this.searchObj = {
        ...this.copyParamsObj
      }
      this.A_GET_GLOBAL_EXPORT({
        ...arg,
        moduleType: 'supply',
        exportName: '成品委外订单'
      })
    },
    // 新增
    toDetail (row) {
      this.$router.push({
        name: 'outsourceProductDetail',
        query: {
          id: row.supplyOrderId,
          type: row.supplyType
        }
      })
    },
    dialogSubmit () {
      this.tipVisible3 = false
      let materialId = []
      const orderId = this.outOrderList.map(item => item.supplyOrderId)
      this.outOrderList.forEach((i) => {
        i.supplyOrderMaterial.forEach((j) => {
          if (j.toggleChecked) {
            materialId.push(j.supplyOrderMaterialId)
          }
        })
      })
      materialId = unique(materialId)
      this.$router.push({
        name: 'warehouseOutAdd',
        params: {
          type: 'add'
        },
        query: {
          orderIds: orderId.join(),
          orderMaterialIds: materialId.join(),
          type: 'SUPPLY'
        }
      })
    },
    handleClose () {
      this.tipVisible = false
      this.tipVisible1 = false
      this.tipVisible2 = false
      this.tipVisible3 = false
      this.tipVisible4 = false
    },
    addBtn (type) {
      this.type = 'add'
      this.$router.push({
        name: 'outsourceProductAdd',
        query: {
          type
        }
      })
    },
    // 获取列表
    async getData () {
      this.expandText = '全部展开'
      let arg = this.setParams()
      if (arg.baseSupplierIds) {
        arg = {
          ...arg,
          baseSupplierIds: [arg.baseSupplierIds]
        }
      }
      try {
        this.TABLE_LOADING(true)
        const { status, data } = await this.A_GET_OUT_PRODUCT_LIST(arg)
        this.TABLE_LOADING()
        if (status === 0) {
          data.records = data.records.map((item, index) => {
            const supplyOrderMaterial = item.supplyOrderMaterial.map(
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
              supplyOrderMaterial
            }
          })
          this.tableData = data.records
          this.total = data.total
        }
      } catch (e) {
        this.TABLE_LOADING()
        console.log(e)
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
      this.getData()
    },
    // table全部展开
    allExpand () {
      this.tableData.forEach((row) => {
        this.$refs.wareInTable.toggleRowExpansion(
          row,
          this.expandText === '全部展开'
        )
      })
      this.expandText =
        this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.A_DEL_OUT_PRODUCT_ORDER({
        id: val
      })
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
      const arg = {
        targetType: 'SUPPLY',
        targetCode: item.supplyCode,
        targetId: item.supplyOrderId
      }
      const { status } = await this.POST_GLOBAL_AUDITOR([arg])
      if (status === 0) {
        this.getData()
        this.tipVisible4 = false
      }
    },
    // 送审
    async approveBtn (item) {
      this.approveList = item
      if (item.supplyType === 'SALE') {
        const { status, data } = await this.A_CHECK_OUT_PRODUCT_ORDER_LIST([
          item.supplyOrderId
        ])
        if (status === 0 && data.length === 0) {
          this.approveFn(item)
        } else {
          this.tipVisible4 = true
          this.orderList4 = data
        }
      } else {
        this.approveFn(item)
      }
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.searchObj = {
        ...this.copyParamsObj
      }
      this.$refs.mainContainer.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.searchObj = {
        ...this.copyParamsObj
      }
      this.$refs.mainContainer.scrollTop = 0
      this.getData()
    },
    expandChange (row, selection) {
      const name = `next${row.index}`
      this.$nextTick(() => {
        if (!this.$refs[name]) {
          this.tableData[row.index].toggleChecked = false
          this.tableData[row.index].supplyOrderMaterial.forEach(
            (item, index) => {
              this.tableData[row.index].supplyOrderMaterial[
                index
              ].toggleChecked = false
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="scss">
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
</style>
