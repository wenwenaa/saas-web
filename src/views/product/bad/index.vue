<template>
  <div ref="bad">
    <!-- 头部 -->
    <tzHeadline title="不良类型主档">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="badAdd('add')">新增不良类型</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <tzBtn icon="tz-icon-del" @click="batchDeletion">批量删除</tzBtn>
      </template>
    </tzHeadline>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="ngType" label="不良类型"></el-table-column>
      <el-table-column align="center" prop="ngNum" label="不良原因数"></el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <tzEnable :isEnable="scope.row.enableFlag === 'Y'" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <span class="pointer mr10" @click="badAdd('edit', scope.row.baseNgTypeId)">编辑</span>
          <span class="yellow" @click="confirmBadDel('single', scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :total="total"
      :currentPage="formData.pageIndex"
      :page-size="formData.pageSize"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange"
    />
    <tzImport
      title="不良类型"
      :visible="visible"
      type="ng-type"
      @close="visible = false"
      @success="search"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import * as urls from '../../../router/routePath'

export default {
  name: 'badList',
  data () {
    return {
      visible: false,
      type: '',
      formData: {
        pageSize: 10,
        pageIndex: 1
      },
      selectedId: [] // 批量删除的id
    }
  },
  computed: {
    ...mapState({
      total: state => state.product.total,
      tableData: state => state.product.badList,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    const { type } = this
    if (type === 'add') {
      this.formData = {
        pageSize: 10,
        pageIndex: 1
      }
      this.getBadList()
    } else {
      this.getBadList()
    }
  },
  methods: {
    ...mapActions([
      'GET_BAD_LIST',
      'DEL_BAD',
      'A_GET_GLOBAL_BAD_TYPE_LIST',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 导入
    importFile () {
      this.visible = true
    },
    // 导出
    downloadFile () {
      this.A_GET_GLOBAL_EXPORT({
        ...this.formData,
        moduleType: 'ngType',
        exportName: '不良类型'
      })
    },

    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.getBadList()
    },
    // 获取设备列表
    getBadList () {
      this.GET_BAD_LIST(this.formData)
    },
    // 全选
    handleSelectionChange (data) {
      this.selectedId = data.map(item => item.baseNgTypeId)
    },
    // 批量删除
    batchDeletion () {
      this.confirmBadDel('all', this.selectedId)
    },
    // 确认删除设备
    async confirmBadDel (type, item) {
      if (type === 'single') {
        this.selectedId = [item.baseNgTypeId]
      }
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.badDel(this.selectedId)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除设备 批量删除
    async badDel (data) {
      try {
        const { status } = await this.DEL_BAD(data)
        if (status === 0) {
          this.formData.pageIndex = 1
          this.$message.success('删除成功')
          this.getBadList()
          this.A_GET_GLOBAL_BAD_TYPE_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    badAdd (type, id = '') {
      this.type = type
      this.$router.push({
        path: urls.BASE_PRO_BAD_ADD,
        query: { type, id }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData.pageSize = e
      this.$refs.bad.scrollTop = 0
      this.getBadList()
    },
    currentPageChange (e) {
      this.formData.pageIndex = e
      this.$refs.bad.scrollTop = 0
      this.getBadList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
