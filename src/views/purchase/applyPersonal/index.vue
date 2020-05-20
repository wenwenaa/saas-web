<template>
  <div class="wareHouseIn"  ref="mainContainer">
    <tzHeadline title="采购申请单">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add',0)">无来源申请</el-button>
        <!-- <tzBtn icon="tz-icon-del" @click="downloadBtn">批量送审</tzBtn> -->
        <!-- <tzBtn icon="tz-icon-export" @click="downloadBtn">导出</tzBtn> -->
        <tzBtn icon="tz-icon-genera"
               @click="generateOrder">生成采购订单</tzBtn>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium" label-position="right" label-width="85px">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="采购申请单">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.applyCode"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
          <el-form-item label="采购类型">
            <el-select v-model.trim="searchObj.applyType" placeholder="全部" filterable clearable>
              <el-option
                v-for="(item, i) in dictionary.completionStatus5"
                :label="item.name"
                :key="i"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
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
        </template>
        <template slot="main">
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
            <el-form-item label="申请时间">
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
              <el-checkbox-group v-model="searchObj.statusStr">
                <el-checkbox
                  class="checkbox"
                  v-for="(item, i) in dictionary.auditStatus"
                  :label="item.type"
                  :key="i"
                  :value="item.name"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="转单状态" class="ml50" v-if="searchObj.statusStr.includes('APPROVED') || searchObj.statusStr.includes('CLOSED')">
              <el-checkbox-group v-model="searchObj.pushStatusStr">
                <el-checkbox
                  class="checkbox"
                  v-for="(item, i) in dictionary.completionStatus2"
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
      style="width: 100%"
      @expand-change="expandChange"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      ref="wareInTable"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column :type="columnType">
        <template slot-scope="scope">
          <el-table
            @select="select"
            style="width: 100%"
            class="el-table-expand"
            :ref="`next${scope.row.index}`"
            @select-all="selectAll(scope.row)"
            :data="scope.row.purchaseApplyMaterialVoList"
            row-class-name="warning-row" :header-cell-style="{'background-color': '#F3F5F7'}"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="materialType" label="物料类型" width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="materialName"  label="物料名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spec" label="物料规格" align="center"   show-overflow-tooltip></el-table-column>
            <el-table-column prop="picNum" label="物料图号" align="center"   show-overflow-tooltip></el-table-column>
            <el-table-column prop="quantityDisplay" label="申请数量" align="center"></el-table-column>
            <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
            <el-table-column prop="sendDate" label="交期" align="center"></el-table-column>
            <el-table-column label="转单情况" align="center" :formatter="transferFn"></el-table-column>
            <el-table-column prop="processQuantity" label="转单数量" align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="采购申请单号" prop="applyCode" align="center">
        <template slot-scope="scope">
         <span class="yellow" @click="addBtn('detail',scope.row)">{{scope.row.applyCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购类型" prop="applyType" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.applyType | filterDic(dictionary.completionStatus5)}}</template>
      </el-table-column>
      <el-table-column label="申请日期" prop="createTime" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime | momentTime('YYYY-MM-DD HH:mm')}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status" align="center">
        <template slot-scope="scope">
          <tzStatus :status="scope.row.status" :content="scope.row.status | filterDic(dictionary.auditStatus)" />
        </template>
      </el-table-column>
      <el-table-column label="转单状态" prop="pushStatus" align="center">
        <template slot-scope="scope">
          <tzStatus :status="scope.row.pushStatus" :content="scope.row.pushStatus | filterDic(dictionary.completionStatus2)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <span class="pointer mr10" @click="approveBtn(scope.row)" v-if="scope.row.status === 'DRAFT'">送审</span>
          <span class="pointer mr10" @click="addBtn('detail',scope.row)">详情</span>
          <span class="yellow" @click="delBtn(scope.row.purchaseApplyId)">删除</span>
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
      @submit="approveFn(approveList)"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" border :header-cell-style="{'background-color': '#F9F9F9'}" :data="orderList">
          <el-table-column property="materialName"  label="物料名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dictionary from '../../../global/dictionary'
import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import { removeEmpty, unique } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'applyPersonal',
  mixins: [dic, keepAlive, copyParams],
  data () {
    return {
      dictionary,
      columnType: 'expand',
      expandText: '全部展开',
      searchObj: {
        statusStr: ['DRAFT', 'SUBMIT', 'APPROVED'],
        pushStatusStr: ['NONE', 'PARTIAL', 'FULL']
      },
      pageSize: 10,
      pageIndex: 1,
      tableData: [],
      type: '',
      selectIds: [],
      tipVisible: false,
      orderList: [],
      selectParentItem: [],
      approveList: ''
    }
  },
  created () {
    this.copyParamsFun(this.searchObj)
  },
  computed: {
    ...mapState({
      total: state => state.purchase.purchaseObj.personalTotal,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      this.searchObj = { ...this.copyParamsObj }
      this.getData()
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions(['GET_PURCHASE_PERSONAL_LIST', 'DELETE_PURCHASE_TYPE', 'APPROVELIST_PURCHASE_TYPE', 'POST_GLOBAL_AUDITOR']),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      const { copyParamsObj, pageIndex, pageSize } = this
      const { time, ...newVal } = copyParamsObj
      const [startTime, endTime] = time || []
      const arg = {
        ...newVal,
        statusStr: copyParamsObj.statusStr.toString(),
        pushStatusStr: copyParamsObj.pushStatusStr.toString(),
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
    addBtn (type, item) {
      let page = ''
      const id = item.purchaseApplyId ? item.purchaseApplyId : 0

      if (item.applyType === 'SALE_PROD') {
        page = 'finished'
      } else if (item.applyType === 'SALE_MATERIAL') {
        page = 'subpart'
      } else if (item.applyType === 'APPLY') {
        page = 'apply'
      } else if (item === 0 || item.applyType === 'NONE') {
        page = 'none'
      }

      this.type = type
      this.$router.push({
        name: 'applyPersonalAdd',
        params: {
          type, page, id
        }
      })
    },
    // 获取采购列表个人数据
    async getData () {
      this.expandText = '全部展开'
      const arg = this.setParams()
      const { status, data } = await this.GET_PURCHASE_PERSONAL_LIST(arg)
      if (status === 0) {
        data.records = data.records.map((item, index) => {
          const purchaseApplyMaterialVoList = item.purchaseApplyMaterialVoList.map((inItem, inIndex) => ({
            ...inItem,
            parIndex: index, // 父元素的index
            index: inIndex, // 子元素的index
            toggleChecked: false
          }))
          return {
            index,
            ...item,
            toggleChecked: false,
            purchaseApplyMaterialVoList
          }
        })
        this.tableData = data.records
      }
    },
    // 获取转单情况
    transferFn (item) {
      // quantityDisplay  申请数量
      // processQuantity  转单数量
      // 0  未转单    >0 && <申请数量      部分转单     >申请数量   全部转单
      if (item.processQuantity === 0) {
        return '未转单'
      } if (item.processQuantity > 0 && item.processQuantity < item.quantityDisplay) {
        return '部分转单'
      } if (item.processQuantity >= item.quantityDisplay) {
        return '全部转单'
      }
      return ''
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
        statusStr: ['DRAFT', 'SUBMIT', 'APPROVED'],
        pushStatusStr: ['NONE', 'PARTIAL', 'FULL']
      }
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // table全部展开
    allExpand () {
      this.tableData.forEach((row) => {
        this.$refs.wareInTable.toggleRowExpansion(row, this.expandText === '全部展开')
      })
      this.expandText = this.expandText === '全部展开' ? '全部收起' : '全部展开'
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.DELETE_PURCHASE_TYPE(val)
      if (status === 0) {
        this.$message.success('删除成功')
        this.getData()
      }
    },
    // 删除
    delBtn (val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示').then((res) => {
        if (res === 'confirm') {
          this.delFn(val)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    // 送审方法
    async approveFn (item) {
      const arg = {
        targetType: 'APPLY',
        targetCode: item.applyCode,
        targetId: item.purchaseApplyId
      }
      const { status } = await this.POST_GLOBAL_AUDITOR([arg])
      if (status === 0) {
        this.getData()
        this.tipVisible = false
      }
    },
    // 送审
    async approveBtn (item) {
      this.approveList = item
      if (item.applyType === 'SALE_PROD') {
        const { status, data } = await this.APPROVELIST_PURCHASE_TYPE([item.purchaseApplyId])
        if (status === 0 && data.length === 0) {
          this.approveFn(item)
        } else {
          this.tipVisible = true
          this.orderList = data
        }
      } else {
        this.approveFn(item)
      }
      setTimeout(() => {
        this.getData()
      }, 500)
    },
    // 全选
    selectAll (selection) {
      const { index } = selection
      const childLength = this.tableData[index].purchaseApplyMaterialVoList.length
      const trueLength = this.tableData[index].purchaseApplyMaterialVoList.filter(item => item.toggleChecked).length
      if (childLength === trueLength) {
        this.tableData[index].toggleChecked = false
        for (let i = 0; i < this.tableData[index].purchaseApplyMaterialVoList.length; i += 1) {
          this.tableData[index].purchaseApplyMaterialVoList[i].toggleChecked = false
        }
      } else {
        this.tableData[index].toggleChecked = true
        for (let i = 0; i < this.tableData[index].purchaseApplyMaterialVoList.length; i += 1) {
          this.tableData[index].purchaseApplyMaterialVoList[i].toggleChecked = true
        }
      }
    },
    // 单选
    select (selection, row) {
      const { parIndex, index, toggleChecked } = row
      const childLength = this.tableData[parIndex].purchaseApplyMaterialVoList.length
      this.tableData[parIndex].purchaseApplyMaterialVoList[index].toggleChecked = !toggleChecked
      const falseLength = this.tableData[parIndex].purchaseApplyMaterialVoList.filter(item => !item.toggleChecked).length
      if (childLength === falseLength) {
        this.tableData[parIndex].toggleChecked = false
      } else {
        this.tableData[parIndex].toggleChecked = true
      }
    },
    // 生成采购订单
    generateOrder () {
      const selectIds = []
      const tableData = this.tableData.filter(item => item.toggleChecked)
      if (!tableData.length) {
        this.$message.error('请选择物料信息')
        return
      }
      for (let i = 0; i < tableData.length; i += 1) {
        if (tableData[i].status !== 'APPROVED') {
          this.$message.error('已审核状态订单才能生成采购订单')
          return
        }
        for (let j = 0; j < tableData[i].purchaseApplyMaterialVoList.length; j += 1) {
          if (tableData[i].purchaseApplyMaterialVoList[j].toggleChecked) {
            selectIds.push(tableData[i].purchaseApplyMaterialVoList[j].purchaseApplyMaterialId)
          }
        }
      }
      const newSelectIds = unique(selectIds)
      const ids = newSelectIds.join(',')
      this.$router.push({
        name: 'orderFinishedAdd',
        params: {
          type: 'add',
          page: 'down',
          id: ids
        }
      })
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
       this.searchObj = { ...this.copyParamsObj }
      this.getData()
      this.$refs.mainContainer.scrollTop = 0
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.getData()
      this.$refs.mainContainer.scrollTop = 0
    },
    expandChange (row, selection) {
      const name = `next${row.index}`
      this.$nextTick(() => {
        if (!this.$refs[name]) {
          this.tableData[row.index].toggleChecked = false
          this.tableData[row.index].purchaseApplyMaterialVoList.forEach((item, index) => {
            this.tableData[row.index].purchaseApplyMaterialVoList[index].toggleChecked = false
          })
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
  padding:0 50px!important;
}
</style>>
