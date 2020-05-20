<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="全局质检方案">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="enterPage('add')">新增方案</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="方案名称">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.planName"
              @keyup.enter.native="search"
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="qualityList"
      style="width: 100%"
        v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="planName" label="检验方案名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="buttons operation">
            <div class="btns yellow" @click="enterPage('edit', scope.row.checkPlanId)">编辑</div>
            <div class="btns pointer" @click="enterPage('detail', scope.row.checkPlanId)">详情</div>
            <div class="btns pointer" @click="confirmDel(scope.row)">删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination :page-size="formData.pageSize" :currentPage="formData.pageIndex" :total="total" @_pageSizeChange="pageSizeChange" @_currentPageChange="currentPageChange" />
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'globalQuality',
  mixins: [keepAlive, dic, copyParams],
  data () {
    return {
      total: 0,
      type: '',
      formData: {
        pageIndex: 1,
        pageSize: 10,
        planName: ''
      },
      qualityList: [],
      selectedId: []
    }
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getGlobalQualityList()
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      this.formData = { ...this.copyParamsObj }
      this.getGlobalQualityList()
    }
  },
  computed: {
    ...mapState({
      tableLoading: state => state.global.tableLoading
    })
  },
  methods: {
    ...mapMutations(['TABLE_LOADING']),
    ...mapActions([
      'A_GET_GLOBAL_QUALITY_LIST',
      'A_GET_GLOBAL_QUALITY_DEL'
    ]),
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getGlobalQualityList()
    },
    // 清空列表
    clear () {
      this.formData = {
        pageSize: 10,
        pageIndex: 1,
        planName: ''
      }
      this.copyParamsFun(this.formData)
      this.getGlobalQualityList()
    },
    // 获取列表
    async getGlobalQualityList () {
      try {
        this.TABLE_LOADING(true)
        const { status, data } = await this.A_GET_GLOBAL_QUALITY_LIST(this.formData)
        if (status === 0) {
          this.total = data.total
          this.qualityList = data.records
        }
        this.TABLE_LOADING(false)
      } catch (e) {
        this.TABLE_LOADING(false)
        console.log(e)
      }
    },
    // 全选
    handleSelectionChange (data) {
      this.selectedId = data.map(item => item.baseCustomerId)
    },
    // 确认删除
    async confirmDel (data) {
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.globalQualityDel(data)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除
    async globalQualityDel (data) {
      try {
        const { status } = await this.A_GET_GLOBAL_QUALITY_DEL({ checkPlanId: data.checkPlanId })
        if (status === 0) {
          this.$message.success('删除成功')
          this.getGlobalQualityList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 新增/编辑质检方案
    enterPage (type, id = '') {
      this.type = type
      const name = type === 'detail' ? 'globalQualityDetail' : 'globalQualityAdd'
      this.$router.push({
        name,
        query: {
          type,
          id
        }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getGlobalQualityList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getGlobalQualityList()
    }
  }
}
</script>
<style lang="less" scoped>
  .operation {
    justify-content: center;
  }
  .operation .btns {
    margin-right: 10px;
  }
</style>
