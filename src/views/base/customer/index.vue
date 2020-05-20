<template>
  <div ref="customer">
    <!-- 头部 -->
    <tzHeadline title="客户主档">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="customerAdd('add')">新增客户主档</el-button>
        <tzBtn icon="tz-icon-del" @click="batchDeletion">批量删除</tzBtn>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <!-- <tzBtn icon="tz-icon-download">下载模版</tzBtn> -->
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="客户名称">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.customerName"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.contactName"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.contactPhone"
              @keyup.enter.native="search"
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="tableData"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
      <el-table-column align="center" prop="customerCode" label="客户编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="customerName" label="客户名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="contactName" label="联系人" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <span>
            <span
              class="btns pointer mr10"
              @click="customerAdd('detail', scope.row.baseCustomerId)"
            >详情</span>
            <span
              class="btns pointer mr10"
              @click="customerAdd('edit', scope.row.baseCustomerId)"
            >编辑</span>
            <span class="btns yellow" @click="confirmCustomerDel('single', scope.row)">删除</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :currentPage="formData.pageIndex"
      :page-size="formData.pageSize"
      :total="total"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange"
    />
    <tzImport
      title="导入客户"
      :visible="visible"
      type="customer"
      @close="visible = false"
      @success="clear"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'customerList',
  mixins: [keepAlive, copyParams],
  data () {
    return {
      visible: false,
      formData: {
        pageSize: 10,
        pageIndex: 1,
        contactName: '',
        contactPhone: '',
        customerName: '',
        type: ''
      },
      selectedId: [] // 批量删除的id
    }
  },
  computed: {
    ...mapState({
      total: state => state.base.total,
      tableData: state => state.base.customerList,
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getCustomerList()
  },
  activated () {
    const { type } = this.formData
    if (type === 'add') {
      this.clear()
    } else if (type === 'edit') {
      this.formData = { ...this.copyParamsObj }
      this.getCustomerList()
    }
  },
  methods: {
    ...mapActions([
      'GET_CUSTOMER_LIST',
      'DEL_CUSTOMER',
      'GET_GLOBAL_CUSTOMER_LIST',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 导入
    importFile () {
      this.visible = true
    },
    // 导出
    downloadFile () {
      this.formData = { ...this.copyParamsObj }
      this.A_GET_GLOBAL_EXPORT({
        ...this.formData,
        moduleType: 'customer',
        exportName: '客户'
      })
    },
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getCustomerList()
    },
    // 清空列表
    clear () {
      this.formData = {
        pageSize: 10,
        pageIndex: 1,
        contactName: '',
        contactPhone: '',
        customerName: ''
      }
      this.copyParamsFun(this.formData)
      this.getCustomerList()
    },
    // 获取设备列表
    getCustomerList () {
      this.GET_CUSTOMER_LIST(this.formData)
    },
    // 全选
    handleSelectionChange (data) {
      this.selectedId = data.map(item => item.baseCustomerId)
    },
    // 批量删除
    batchDeletion () {
      this.confirmCustomerDel('all', this.selectedId)
    },
    // 确认删除设备
    async confirmCustomerDel (type, item) {
      if (type === 'single') {
        this.selectedId = [item.baseCustomerId]
      }
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.customerDel(this.selectedId)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除设备 批量删除
    async customerDel (data) {
      try {
        const { status } = await this.DEL_CUSTOMER(data)
        if (status === 0) {
          this.$message.success('删除成功')
          this.getCustomerList()
          this.GET_GLOBAL_CUSTOMER_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    customerAdd (type, id = '') {
      this.formData.type = type
      const path =
        type === 'detail' ? urls.BASE_CUSTOMER_DETAIL : urls.BASE_CUSTOMER_ADD
      this.$router.push({
        path,
        query: { type, id }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.customer.scrollTop = 0
      this.getCustomerList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.customer.scrollTop = 0
      this.getCustomerList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
