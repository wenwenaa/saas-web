<template>
  <div ref="bom">
    <tzHeadline title="多阶BOM">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="add">新增BOM</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <!-- <tzBtn icon="tz-icon-download" @click="download">下载模版</tzBtn> -->
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="物料编号">
            <el-input
              placeholder="请输入"
              clearable
              @keyup.enter.native="search"
              v-model.trim="filterData.materialCode"
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              clearable
              @keyup.enter.native="search"
              v-model.trim="filterData.materialName"
            />
          </el-form-item>
          <el-form-item label="物料规格">
            <el-input
              placeholder="请输入"
              clearable
              @keyup.enter.native="search"
              v-model.trim="filterData.spec"
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="list"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
      <el-table-column prop="materialCode" label="物料编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="processRoute" label="工艺路线" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="versionCount" label="版本数量" align="center"></el-table-column>
      <el-table-column prop="lastEditTime" label="更新时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.lastEditTime | momentTime('YYYY-MM-DD HH:mm')}}</template>
      </el-table-column>
      <el-table-column prop="enableFlag" label="是否启用" align="center">
        <template slot-scope="scope">
          <tzEnable :isEnable="scope.row.enableFlag === 'Y'" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="pointer mr10" @click.stop.prevent="edit(scope.row.baseBomId)">编辑</span>
          <!-- <el-divider direction="vertical"></el-divider> -->
          <span class="yellow" @click.stop.prevent="del(scope.row.baseBomId)">删除</span>
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
    <tzImport
      title="导入bom"
      :visible="visible"
      type="bom"
      @close="visible = false"
      @success="clear"
    />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'
// import api from '../../../global/api'

export default {
  name: 'bom',
  mixins: [keepAlive, copyParams],
  data () {
    return {
      visible: false,
      type: null,
      filterData: {},
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapState({
      list: state => state.base.bom.list,
      total: state => state.base.bom.total,
      tableLoading: state => state.global.tableLoading
    })
  },
  created () {
    this.copyParamsFun(this.filterData)
    this.getData()
  },
  activated () {
    const { type = 'add' } = this
    if (type === 'add') {
      this.clear()
    } else if (type === 'edit') {
      this.SET_IS_UPDATE_COM()
      this.getData()
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions(['A_GET_BOM_LIST', 'A_BOM_DEL', 'A_GET_GLOBAL_EXPORT']),
    // 同步vuex数据
    ...mapMutations(['SET_IS_UPDATE_COM']),
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
        moduleType: 'bom',
        exportName: 'bom'
      })
    },
    // 设置请求参数
    setParams () {
      return {
        ...this.filterData,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
    },
    // 获取列表数据
    getData () {
      this.filterData = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_BOM_LIST(arg)
    },
    // 查询
    search () {
      this.pageIndex = 1
      this.copyParamsFun(this.filterData)
      this.getData()
    },
    // 清空
    clear () {
      this.filterData = {}
      this.copyParamsFun(this.filterData)
      this.pageIndex = 1
      this.getData()
    },
    // 新增
    add () {
      this.type = 'add'
      this.$router.push({ path: urls.BASE_BOM_ADD })
    },
    // 删除
    del (baseBomId) {
      this.$confirm('此操作将永久删除该BOM, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delAction(baseBomId)
        })
        .catch(() => {})
    },
    // 删除请求接口
    async delAction (baseBomId) {
      try {
        const { status } = await this.A_BOM_DEL({ baseBomId })
        if (status === 0) {
          this.$message.success('删除成功')
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 修改
    edit (baseBomId) {
      this.type = 'edit'
      this.$router.push({
        name: 'bomDetail',
        params: { id: baseBomId }
      })
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.$refs.bom.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.$refs.bom.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
