<template>
  <div class="wareHouseIn" ref='outSourceProcess'>
    <tzHeadline title="工序委外订单">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add')">新建委外单</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadBtn">导出</tzBtn>
        <!-- <tzBtn icon="tz-icon-print" v-show="!batchPrint" @click="batchPrintFun">批量打印</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="batchPrint" @click="closePrint">取消打印</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="batchPrint" @click="printFun">打印</tzBtn> -->
      </template>
    </tzHeadline>
    <el-form
      :inline="true"
      size="medium"
      label-position="right"
      label-width="80px"
      ref="tzHeadline"
      id="tzHeadline"
    >
      <!-- @_handleExtend="handleExtend" -->
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
          <el-form-item label="委外工序">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.baseSeqName"
              @keyup.enter.native="search"
              clearable
            />
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
            <el-select v-model.trim="searchObj.materialType" placeholder="全部" filterable clearable>
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
              maxlength="15"
              clearable
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialName"
              @keyup.enter.native="search"
              maxlength="15"
              clearable
            />
          </el-form-item>
          <div>
            <el-form-item label="负责人">
              <el-select clearable filterable v-model="searchObj.managerStuffId" placeholder="创建人">
                <el-option
                  v-for="(staff, index) in staffList"
                  :key="index"
                  :label="staff.realname"
                  :value="staff.id"
                />
              </el-select>
            </el-form-item>
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
              label="收回状态"
              class="ml50"
              v-if="searchObj.statusList.includes('APPROVED') || searchObj.statusList.includes('CLOSED')"
            >
              <el-checkbox-group v-model="searchObj.pushStatusList">
                <el-checkbox
                  class="checkbox"
                  v-for="(item, i) in dictionary.completionStatus8"
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
    <!-- :max-height="tHeight" @selection-change="partSelectC" v-if="!batchPrint" -->
    <el-table
      border
      :data="tableData"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      ref="table"
      @expand-change="expandChange"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <!-- <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column> -->
      <el-table-column :type="columnType">
        <template slot-scope="props">
          <el-table
            :data="props.row.supplySeqMaterialList || []"
            class="el-table-expand"
            @select="handleSelectionChange"
            row-class-name="warning-row"
            @select-all="selectAll(props.row.supplySeqMaterialList)"
            @selection-change="selectionChange"
            :row-style="{'background-color': '#F3F5F7'}"
            :header-cell-style="{'background-color': '#F3F5F7'}"
          >
            <!--<el-table-column type="selection" width="55" />-->
            <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip />
            <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
            <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
            <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
            <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
            <el-table-column prop="supplyOrderQuantity" label="委外数量" align="center" />
            <el-table-column prop="unitPrice" label="委外单价" align="center" />
            <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
            <el-table-column prop="recallQuantity" label="收回数量" align="center" />
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column> -->
      <el-table-column label="委外单号" align="center">
        <template slot-scope="scope">
          <span
            class="yellow"
            @click="addBtn('detail',scope.row.supplySeqId)"
          >{{scope.row.supplyCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委外工序" prop="baseSeqName" align="center" show-overflow-tooltip />
      <el-table-column label="供应商" prop="supplierName" align="center" show-overflow-tooltip />
      <el-table-column label="创建人" prop="managerStuff" align="center" />
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
      <el-table-column label="收回状态" prop="pushStatus" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.pushStatus"
            :content="scope.row.pushStatus | filterDic(dictionary.completionStatus8)"
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
            <span class="pointer mr10" @click="addBtn('detail',scope.row.supplySeqId)">详情</span>
            <span
              class="yellow mr10"
              v-if="scope.row.status === 'APPROVED'"
              @click="takeBack(scope.row.supplySeqId)"
            >收回</span>
            <span
              class="yellow"
              v-if="scope.row.status === 'DRAFT'"
              @click="delBtn(scope.row.supplySeqId)"
            >删除</span>
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
      content="您提交的订单中，以下单据已超出工序委外参考量"
      @submit="approveFn(curRow)"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column
            property="processDisplay"
            label="工艺路线"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            property="prodOrderCode"
            label="生产单号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <!-- <tzPrint
      :orders="printList.map(it => ({ code: it.supplyCode, id: it.supplySeqId }))"
      :visible="printVisible"
      type="outsourceProcess"
      @cancle="closePrint(tableData, 'table')"
    /> -->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import dictionary from '../../../global/dictionary'
import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
// import print from '../../../mixins/print'
import { removeEmpty, unique } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'outsourceProcess',
  mixins: [dic, keepAlive, copyParams],
  data () {
    return {
      // tHeight: 400,
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
    // this.tHeight = document.documentElement.clientHeight - 336
    this.copyParamsFun(this.searchObj)
  },
  computed: {
    ...mapState({
      total: state => state.outsource.process.total,
      tableData: state => state.outsource.process.list,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
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
      'A_GET_OUTSOURCE_PROCESS_LIST',
      'A_GET_OUTSOURCE_PROCESS_DEL',
      'OUTSOURCE_PROCESS_LIST_CHECK_APPROVE',
      'POST_GLOBAL_AUDITOR'
    ]),
    // printFun () {
    //   if (!this.printList.length) {
    //     this.$message.error('请选择工序委外单号')
    //     return
    //   }
    //   this.openPrint()
    // },
    // 同步vuex数据
    // handleExtend (val) {
    //   if (val) {
    //     this.tHeight = document.documentElement.clientHeight - 520
    //   } else {
    //     this.tHeight = document.documentElement.clientHeight - 336
    //   }
    // },
    takeBack (id) {
      this.$router.push({
        name: 'takeBack',
        params: {
          id
        }
      })
    },
    // 设置请求参数
    setParams () {
      const { copyParamsObj, pageIndex, pageSize } = this
      const {
 time, statusList, pushStatusList, ...newVal
} = copyParamsObj

      const [startTime, endTime] = time || []
      const statusStr = statusList.join()
      const pushStatusStr = pushStatusList.join()
      const arg = {
        ...newVal,
        statusStr,
        pushStatusStr:
          this.searchObj.statusList.includes('APPROVED') ||
          this.searchObj.statusList.includes('CLOSED')
            ? pushStatusStr
            : '',
        startTime,
        endTime,
        pageIndex,
        pageSize
      }
      return removeEmpty(arg)
    },
    // 暂未开发
    downloadBtn () {
      this.$message.error('功能暂无开发')
    },
    // 新增
    addBtn (type, orderId) {
      this.type = type
      if (type === 'add') {
        this.$router.push({
          name: 'prod'
        })
        return
      }
      this.$router.push({
        name: 'outsourceProcessDetail',
        params: {
          id: orderId
        }
      })
    },
    // 获取工序委外列表个人数据
    async getData () {
      this.expandText = '全部展开'
      const arg = this.setParams()
      this.A_GET_OUTSOURCE_PROCESS_LIST(arg)
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
        this.$refs.table.toggleRowExpansion(
          row,
          this.expandText === '全部展开'
        )
      })
      this.expandText =
        this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.A_GET_OUTSOURCE_PROCESS_DEL({
        supplySeqId: val
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
      try {
        const arg = {
          targetId: item.supplySeqId,
          targetCode: item.supplyCode,
          targetType: 'SUPPLY_SEQ'
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
      const { status, data } = await this.OUTSOURCE_PROCESS_LIST_CHECK_APPROVE([
        item.supplySeqId
      ])
      if (status === 0) {
        if (data.length > 0) {
          this.tipVisible = true
          this.orderList = data
        } else {
          this.approveFn(item)
        }
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
      if (this.selectParent.length > 0) {
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
            '您选择的工序委外订单存在未入库的情况，请选择已入库的工序委外订单进行退货！'
          )
          return
        }
        this.$router.push({
          name: status === 'in' ? 'warehouseInAdd' : 'warehouseOutAdd',
          params: {
            type: 'add'
          },
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
      // document.getElementsByClassName(
      //   'el-table__body-wrapper'
      // )[0].scrollTop = 0 // 分页时滚动到表达顶部
      this.searchObj = { ...this.copyParamsObj }
      this.$refs.outSourceProcess.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.$refs.outSourceProcess.scrollTop = 0
      this.getData()
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
