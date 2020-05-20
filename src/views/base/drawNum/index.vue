<template>
  <div ref="drawNum">
    <tzHeadline title="图号主档" :isShowBack="isShowBack">
      <template slot="btn">
        <!-- <tzBtn icon="tz-icon-export" @click="downloadBtn">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="downloadBtn">导入</tzBtn>-->
        <!-- <tzBtn icon="tz-icon-download" @click="downloadBtn">下载模版</tzBtn> -->
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium" label-width="70px" label-position="left">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="物料类型">
            <el-select v-model.trim="searchObj.typeName" placeholder="全部" clearable>
              <el-option
                :key="index"
                :value="item.typeName"
                v-for="(item,index) in materialTypeList"
                :label="item.typeName"
              ></el-option>
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
        </template>
        <template slot="main">
          <el-form-item label="图号" class="draw-word">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.picNum"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      :data="list"
      border
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编号" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="图号" align="center" show-overflow-tooltip />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <div>
            <span @click="editBtn('detail',scope.row.baseMaterialId)" class="pointer mr10">详情</span>
            <span class="yellow" @click="editBtn('edit',scope.row.baseMaterialId)">维护图片</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :currentPage="searchObj.pageIndex"
      :page-size="searchObj.pageSize"
      :total="total"
      @_currentPageChange="pageChange"
      @_pageSizeChange="pageSizeChange"
    />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'drawNum',
  mixins: [keepAlive, dic, copyParams],
  data () {
    return {
      isShowBack: false,
      type: null,
      searchObj: {
        typeName: '',
        materialCode: '',
        materialName: '',
        picNum: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapState({
      list: state => state.base.drawNum.list,
      total: state => state.base.drawNum.total,
      tableLoading: state => state.global.tableLoading
    })
  },
  created () {
    this.copyParamsFun(this.searchObj)
    this.getData()
  },
  activated () {
    const { type } = this
    if (type && type === 'edit') {
      this.searchObj = { ...this.copyParamsObj }
      this.getData()
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions(['A_GET_DRAW_NUM_LIST']),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      return {
        ...this.searchObj
      }
    },
    // 获取列表数据
    getData () {
      const arg = this.setParams()
      this.A_GET_DRAW_NUM_LIST(arg)
    },
    // 详情
    editBtn (type, id) {
      this.$router.push({
        name: 'drawNumDetail',
        params: { type, id }
      })
    },
    // 下载模版
    downloadBtn () {
      this.$message.error('功能暂无开发')
    },
    // 查询
    search () {
      this.searchObj.pageIndex = 1
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 清空
    clear () {
      this.searchObj = {
        pageIndex: 1,
        pageSize: 10
      }
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 页码改变
    pageChange (val) {
      this.searchObj = { ...this.copyParamsObj }
      this.searchObj.pageIndex = val
      this.copyParamsFun(this.searchObj)
      this.$refs.drawNum.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.searchObj = { ...this.copyParamsObj }
      this.searchObj.pageSize = size
      this.copyParamsFun(this.searchObj)
      this.$refs.drawNum.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
