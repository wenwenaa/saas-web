<template>
  <div class="wareHouseIn" ref="mainContainer">
    <tzHeadline title="出库单列表">
      <template slot="btn">
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button round size="medium" class="tz-btn-add">
            新增出库单
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item,index) in dic.wareOutRoutes"
              :key="index"
              :command="item"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="!batchPrint" @click="batchPrintFun">批量打印</tzBtn>
        <tzBtn
          icon="tz-icon-print"
          v-show="batchPrint"
          @click="closePrint(wareOutList, 'wareInTable')"
        >取消打印</tzBtn>
        <tzBtn icon="tz-icon-print" v-show="batchPrint" @click="printFun">打印</tzBtn>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium" label-position="right" label-width="70px">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="出库单号">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.code"
              @keyup.enter.native="search"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item label="出库类型">
            <el-select
              v-model.trim="searchObj.type"
              placeholder="全部"
              clearable
              @change="typeChange"
            >
              <el-option
                :key="index"
                :value="item.type"
                v-for="(item,index) in dic.wareOutStatus"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人员">
            <el-select v-model.trim="searchObj.createBy" filterable placeholder="请选择" clearable>
              <el-option
                v-for="item in employeeList"
                :key="item.id"
                :label="item.val"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="客户">
            <el-select
              v-model.trim="searchObj.customerId"
              filterable
              placeholder="请选择"
              clearable
              :disabled="searchObj.type==='PURCHASE_RETURN'||searchObj.type==='PROD_MATERIAL'||searchObj.type==='SUPPLY_RETURN'||searchObj.type==='SUPPLY_MATERIAL'||
            searchObj.type==='EXCHANGE_OUT'
            "
            >
              <el-option
                v-for="item in customerList"
                :key="item.baseCustomerId"
                :label="item.customerName"
                :value="item.baseCustomerId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-select
              v-model.trim="searchObj.supplierId"
              filterable
              placeholder="请选择"
              clearable
              :disabled="searchObj.type==='SALE'||searchObj.type==='PROD_MATERIAL'||
            searchObj.type==='EXCHANGE_OUT'||
            searchObj.type==='OTHER_OUT'
            "
            >
              <el-option
                v-for="item in supplierList"
                :key="item.baseSupplierId"
                :label="item.supplierName"
                :value="item.baseSupplierId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="createDate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <div>
            <el-form-item label="质检状态">
              <el-checkbox-group v-model="searchObj.checkStatus">
                <el-checkbox
                  class="checkbox"
                  :label="item.type"
                  v-for="(item,index) in dic.qualityStatus"
                  :key="index"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="出库状态">
              <el-checkbox-group v-model="searchObj.pushStatus">
                <el-checkbox
                  class="checkbox"
                  :label="item.type"
                  v-for="(item,index) in dic.completionStatus6"
                  :key="index"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      :data="wareOutList"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      border
      ref="wareInTable"
      v-loading="tableLoading"
      @selection-change="partSelectC"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column :type="columnType" v-if="!batchPrint">
        <template slot-scope="props">
          <el-table
            :data="props.row.materialList"
            style="width: 100%"
            class="el-table-expand"
            row-class-name="warning-row"
            :header-cell-style="{'background-color': '#F3F5F7'}"
          >
            <el-table-column type="selection" v-if="!batchPrint" />
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
            <el-table-column prop="picNum" label="图号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="quantity" label="本次出库数量" align="center"></el-table-column>
            <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
            <el-table-column prop="baseWarehouseName" label="出库仓库" align="center"></el-table-column>
            <el-table-column label="质检状态" align="center">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.outCheckFlag==='Y'&&scope.row.checkFlag==='N'"
                  class="green"
                >未质检</div>
                <div
                  v-else
                >{{scope.row.outCheckFlag==='Y'?(scope.row.checkFlag==='Y'?'已质检':'未质检'):'无需质检'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.outCheckFlag==='Y'&&scope.row.checkFlag==='Y'&&scope.row.outFlag==='N')||((scope.row.outCheckFlag==='N'||scope.row.outCheckFlag===null)&&scope.row.outFlag==='N')"
                  class="yellow"
                  @click="toWare(scope.row)"
                >出库</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" v-if="batchPrint"></el-table-column>
      <el-table-column label="出库单号" prop="outCode" align="center">
        <template slot-scope="scope">
          <span class="yellow" @click="toDetail(scope.row)">{{scope.row.outCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库类型" prop="outType" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.outType?scope.row.outType:'' | filterDic(dic.wareOutStatus,'type','name')}}</template>
      </el-table-column>
      <el-table-column label="供应商/客户" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.baseCustomerName||scope.row.baseSupplierName||'__'}}</template>
      </el-table-column>
      <el-table-column label="操作人员" prop="createBy" align="center"></el-table-column>
      <el-table-column label="创建日期" prop="createTime" align="center">
        <template slot-scope="scope">{{scope.row.createTime | momentTime}}</template>
      </el-table-column>
      <el-table-column label="质检状态" align="center">
        <template slot-scope="scope">
          <div
            :class="scope.row.checkStatus==='NONE'?'green':''"
          >{{scope.row.checkStatus?scope.row.checkStatus:'' | filterDic(dic.qualityStatus,'type','name')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="出库状态" align="center">
        <template slot-scope="scope">
          <tzStatus
            :status="scope.row.pushStatus"
            :content="scope.row.pushStatus | filterDic(dic.completionStatus6)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <span class="yellow" @click="toDetail(scope.row)">详情</span>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :currentPage="pageIndex"
      :page-size="pageSize"
      :total="outTotal"
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
    <wareDialog
      :material="material"
      :dialogVisible="wareVisible"
      dialogTitle="出库"
      placeholder="请输入出库数量"
      @submit="wareSubmit"
      @cancle="cancle"
    ></wareDialog>
    <tzPrint
      :orders="printList.map(it => ({ code: it.outCode, id: it.storageOutId }))"
      :visible="printVisible"
      :type="OrderType"
      @cancle="closePrint(wareOutList, 'wareInTable')"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../global/dictionary'
import mix from '../../../mixins/dic'
import wareDialog from '../components/wareDialog.vue'
import copyParams from '../../../mixins/copyParams'
import print from '../../../mixins/print'
import { unique } from '../../../utils/utils'

export default {
  name: 'warehouseOut',
  data () {
    return {
      dic,
      columnType: 'expand',
      expandText: '全部展开',
      pageIndex: 1,
      pageSize: 10,
      searchObj: {
        checkStatus: [],
        pushStatus: []
      },
      createDate: '',
      tableData: [],
      type: '',
      wareVisible: false,
      material: {},
      OrderType: ''
    }
  },
  mixins: [mix, keepAlive, copyParams, print],
  components: {
    wareDialog
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      wareOutList: state => state.ware.wareOutList,
      outTotal: state => state.ware.outTotal,
      tableLoading: state => state.global.tableLoading
    })
  },
  created () {
    this.copyParamsFun(this.searchObj)
  },
  activated () {
    const { type = 'add' } = this
    if (type === 'add') {
      this.clear()
    } else {
      this.searchObj = { ...this.copyParamsObj }
      this.getList()
    }
  },
  methods: {
    ...mapActions([
      'A_GET_GLOBAL_SUPPLIER_LIST',
      'A_GET_WARE_OUT_LIST',
      'A_ADD_MATERIAL_WARE_IN',
      'A_GET_GLOBAL_EXPORT'
    ]),
    printFun () {
      if (!this.printList.length) {
        this.$message.error('请选择出库单')
        return
      }
      const typeArr = unique(this.printList.map(it => it.outType))
      if (typeArr && typeArr.length > 1) {
        this.$message.error('请选择一种类型的单据进行打印')
        return
      }
      if (typeArr && typeArr.length === 1 && typeArr.includes('EXCHANGE_OUT')) {
        this.$message.error('调仓出库暂不支持打印，请重新选择')
        return
      }
      this.OrderType = (typeArr && typeArr[0].length > 0 && typeArr[0] === 'SALE') ? 'SALE_OUT' : typeArr[0]
      this.openPrint()
    },
    tableRowClassName ({ row, rowIndex }) {
      return 'warning-row'
    },
    // 导出
    downloadFile () {
      const arg = {
        ...this.copyParamsObj,
        startTime: this.createDate ? this.createDate[0] : '',
        endTime: this.createDate ? this.createDate[1] : '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.searchObj = { ...this.copyParamsObj }
      this.A_GET_GLOBAL_EXPORT({
        ...arg,
        moduleType: 'outStock',
        exportName: '出库'
      })
    },
    cancle () {
      this.wareVisible = false
    },
    wareSubmit (data) {
      this.$message.success('出库成功')
      this.wareVisible = false
      this.getList()
    },
    toDetail (row) {
      this.type = 'detail'
      this.$router.push({
        name: 'warehouseOutDetail',
        params: {
          id: row.storageOutId
        },
        query: {
          type: row.outType
        }
      })
    },
    toWare (row) {
      this.material = row
      this.wareVisible = true
    },
    handleCommand (item) {
      this.type = 'add'
      this.$router.push({
        name: item.route,
        params: {
          type: 'add'
        },
        query: {
          type: item.type
        }
      })
    },
    search () {
      this.pageIndex = 1
      this.copyParamsFun(this.searchObj)
      this.getList()
    },
    clear () {
      this.searchObj = {
        checkStatus: [],
        pushStatus: []
      }
      this.copyParamsFun(this.searchObj)
      this.createDate = ''
      this.pageIndex = 1
      this.getList()
    },
    allExpand () {
      this.wareOutList.forEach((row) => {
        this.$refs.wareInTable.toggleRowExpansion(
          row,
          this.expandText === '全部展开'
        )
      })
      this.expandText =
        this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    typeChange (v) {
      if (
        v === 'PURCHASE_RETURN' ||
        v === 'PROD_MATERIAL' ||
        v === 'SUPPLY_RETURN' ||
        v === 'SUPPLY_MATERIAL' ||
        v === 'EXCHANGE_OUT'
      ) {
        this.searchObj.customerId = ''
      }
      if (
        v === 'SALE' ||
        v === 'PROD_MATERIAL' ||
        v === 'EXCHANGE_OUT' ||
        v === 'OTHER_OUT'
      ) {
        this.searchObj.supplierId = ''
      }
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.searchObj = { ...this.copyParamsObj }
      this.getList()
      this.$refs.mainContainer.scrollTop = 0
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.getList()
      this.$refs.mainContainer.scrollTop = 0
    },
    getList () {
      this.expandText = '全部展开'
      const params = {
        ...this.copyParamsObj,
        startTime: this.createDate ? this.createDate[0] : '',
        endTime: this.createDate ? this.createDate[1] : '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.A_GET_WARE_OUT_LIST(params)
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

.el-table .warning-row {
  background: #f3f5f7;
}
.el-table__expanded-cell {
  padding: 0 50px !important;
}
</style>>
