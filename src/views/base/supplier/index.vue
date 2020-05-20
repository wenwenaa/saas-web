<template>
  <div ref='supplier'>
    <!-- 头部 -->
    <tzHeadline title="供应商主档">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="supplierAdd('add')">新增供应商</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <tzBtn icon="tz-icon-del" @click="batchDeletion">批量删除</tzBtn>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="供应商名称">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.supplierName"
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
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
      <el-table-column align="center" prop="supplierCode" label="供应商编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="supplierName" label="供应商名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="contactName" label="联系人" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <span
              class="btns pointer mr10"
              @click="supplierAdd('detail', scope.row.baseSupplierId)"
            >详情</span>
            <span
              class="btns pointer mr10"
              @click="supplierAdd('edit', scope.row.baseSupplierId)"
            >编辑</span>
            <span class="btns yellow" @click="confirmSupplierDel('single', scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :page-size="formData.pageSize"
      :total="total"
      @_pageSizeChange="pageSizeChange"
      :currentPage="formData.pageIndex"
      @_currentPageChange="currentPageChange"
    />
    <tzImport
      title="导入供应商"
      :visible="visible"
      type="supplier"
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
  name: 'supplierList',
  mixins: [keepAlive, copyParams],
  data () {
    return {
      visible: false,
      formData: {
        pageSize: 10,
        pageIndex: 1,
        contactName: '',
        contactPhone: '',
        supplierName: '',
        type: ''
      },
      selectedId: [] // 批量删除的id
    }
  },
  computed: {
    ...mapState({
      total: state => state.base.total,
      tableData: state => state.base.supplierList,
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getSupplierList()
  },
  activated () {
    const { type } = this.formData
    if (type === 'add') {
      this.clear()
    } else if (type === 'edit') {
      this.formData = { ...this.copyParamsObj }
      this.getSupplierList()
    }
  },
  methods: {
    ...mapActions([
      'GET_SUPPLIER_LIST',
      'DEL_SUPPLIER',
      'A_GET_GLOBAL_SUPPLIER_LIST',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getSupplierList()
    },
    // 导入
    importFile () {
      this.visible = true
    },
    // 导出
    downloadFile () {
      this.formData = { ...this.copyParamsObj }
      this.A_GET_GLOBAL_EXPORT({
        ...this.formData,
        moduleType: 'supplier',
        exportName: '供应商'
      })
    },
    // 清空列表
    clear () {
      this.formData = {
        pageSize: 10,
        pageIndex: 1,
        contactName: '',
        contactPhone: '',
        supplierName: ''
      }
      this.copyParamsFun(this.formData)
      this.getSupplierList()
    },
    // 获取设备列表
    getSupplierList () {
      this.GET_SUPPLIER_LIST(this.formData)
    },
    // 全选
    handleSelectionChange (data) {
      this.selectedId = data.map(item => item.baseSupplierId)
    },
    // 批量删除
    batchDeletion () {
      this.confirmSupplierDel('all', this.selectedId)
    },
    // 确认删除设备
    async confirmSupplierDel (type, item) {
      if (type === 'single') {
        this.selectedId = [item.baseSupplierId]
      }
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.supplierDel(this.selectedId)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除设备 批量删除
    async supplierDel (data) {
      try {
        const { status } = await this.DEL_SUPPLIER(data)
        if (status === 0) {
          this.formData.pageIndex = 1
          this.$message.success('删除成功')
          this.getSupplierList()
          this.A_GET_GLOBAL_SUPPLIER_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    supplierAdd (type, id = '') {
      this.formData.type = type
      const path =
        type === 'detail' ? urls.BASE_SUPPLIER_DETAIL : urls.BASE_SUPPLIER_ADD
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
      this.$refs.supplier.scrollTop = 0
      this.getSupplierList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.supplier.scrollTop = 0
      this.getSupplierList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
