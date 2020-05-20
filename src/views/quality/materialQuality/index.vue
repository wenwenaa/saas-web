<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="物料质检方案" />
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="物料类型">
            <el-select v-model.trim="formData.typeName" clearable filterable placeholder="请选择">
              <el-option
                :key="item.baseMaterialTypeId"
                :label="item.typeName"
                v-for="item in materialTypeList"
                :value="item.typeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.materialCode"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.materialName"
              @keyup.enter.native="search"
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="materialList"
      style="width: 100%"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" show-overflow-tooltip />
      <el-table-column align="center" prop="typeName" label="物料类型" width="180" show-overflow-tooltip />
      <el-table-column align="center" prop="materialCode" label="物料编码" width="180" show-overflow-tooltip />
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip />
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip />
      <el-table-column align="center" prop="inCheckFlag" label="来料检验">
        <template slot-scope="scope">
          <tzEnable :isEnable="scope.row.inCheckFlag === 'Y'" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="outCheckFlag" label="出货检验">
        <template slot-scope="scope">
          <tzEnable :isEnable="scope.row.outCheckFlag === 'Y'" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <div class="buttons operation">
            <div class="btns yellow" v-if="!scope.row.checkPlanId" @click="enterPage('add', scope.row)">维护质检方案</div>
            <div class="btns yellow" v-else @click="enterPage('edit', scope.row)">编辑</div>
            <div class="btns" v-if="scope.row.checkPlanId" @click="enterPage('detail',scope.row)">详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :currentPage="formData.pageIndex"
      :pageSize="formData.pageSize"
      :total="total"
      :current-page="formData.pageIndex"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange"
    />
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import dic from '../../../mixins/dic'
import keepAlive from '../../../mixins/keepAlive'
import { becomString } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'materialQuality',
  mixins: [keepAlive, dic, copyParams],
  data () {
    return {
      total: 0,
      type: '',
      formData: {
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        materialCode: '',
        materialName: ''
      },
      selectedId: [],
      materialList: []
    }
  },
  computed: {
    ...mapState({
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getMaterialQualityList()
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      this.formData = { ...this.copyParamsObj }
      this.getMaterialQualityList()
    }
  },
  methods: {
    ...mapMutations(['TABLE_LOADING']),
    ...mapActions([
      'A_GET_MATERIAL_QUALITY_LIST'
    ]),
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getMaterialQualityList()
    },
    // 清空列表
    clear () {
      this.formData = {
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        materialCode: '',
        materialName: ''
      }
      this.copyParamsFun(this.formData)
      this.getMaterialQualityList()
    },
    // 获取列表
    async getMaterialQualityList () {
      try {
        this.TABLE_LOADING(true)
        const { status, data } = await this.A_GET_MATERIAL_QUALITY_LIST(this.formData)
        if (status === 0) {
          this.total = data.total
          this.materialList = data.records
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
    // 新增/编辑质检方案
    enterPage (type, data) {
      this.type = type
      const name = type === 'detail' ? 'materialQualityDetail' : 'materialQualityAdd'
      const list = becomString(data)
      this.$router.push({
        name,
        query: {
          type,
          list
        }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getMaterialQualityList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getMaterialQualityList()
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
  cursor: pointer;
}
</style>
