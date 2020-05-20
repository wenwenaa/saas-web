<template>
  <div ref="material">
    <tzHeadline title="物料主档" :isShowBack="isShowBack">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add')">新增物料</el-button>
        <tzBtn icon="tz-icon-del" @click="BatchDelBtn">批量删除</tzBtn>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium">
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
              @keyup.enter.native="search"
              v-model.trim="searchObj.materialName"
              clearable
            />
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料规格">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.spec"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
          <el-form-item label="物料图号">
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
    <div class="table">
      <el-table
        :data="list"
        border
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :header-cell-style="{'background-color': '#F9F9F9'}"
        @selection-change="handleSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unitName" label="主计量单位" align="center"></el-table-column>
        <el-table-column prop="enableFlag" label="是否启用" align="center">
          <template slot-scope="scope">
            <tzEnable :isEnable="scope.row.enableFlag==='Y'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <div class="btn">
              <span @click="editBtn('detail',scope.row.baseMaterialId)" class="pointer mr10">详情</span>
              <span @click="editBtn('edit',scope.row.baseMaterialId)" class="pointer mr10">编辑</span>
              <span class="yellow" @click="deleteBtn(scope.row.baseMaterialId)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <tzPagination
      :total="total"
      :currentPage="searchObj.pageIndex"
      :pageSize="searchObj.pageSize"
      @_currentPageChange="pageChange"
      @_pageSizeChange="pageSizeChange"
    >
      <div class="custom-box">
        <tzBtn icon="tz-icon-custom" @click="customBtn">自定义字段</tzBtn>
      </div>
    </tzPagination>
    <tzDialog :dialogTitle="dialogTitle" :dialogVisible="dialogVisible" @dialogClose="dialogClose">
      <template slot="single">
        <div>新增字段</div>
        <div class="single-box">
          <el-input placeholder="请输入不超过15个字" v-model.trim="materSearch"/>
        </div>
        <el-table :data="tableData" border :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="materialsTypeName" label="序号">
            <template slot-scope="scope">0{{scope.row}}</template>
          </el-table-column>
          <el-table-column prop="code" label="字段名称"></el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <div class="btn">
                <span class="yellow" @click="deleteBtn(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </tzDialog>
    <tzImport
      :visible="importVisible"
      type="material"
      @close="importVisible = false"
      @success="clear"
    ></tzImport>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
// import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'material',
  mixins: [dic, keepAlive, copyParams],
  data () {
    return {
      importVisible: false,
      isShowBack: false,
      dialogTitle: '自定义字段',
      dialogVisible: false,
      type: null,
      materSearch: '',
      searchObj: {
        materialCode: '',
        materialName: '',
        picNum: '',
        spec: '',
        typeName: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      ids: []
    }
  },
  computed: {
    ...mapState({
      list: state => state.base.material.list,
      total: state => state.base.material.total,
      tableLoading: state => state.global.tableLoading
    })
  },
  created () {
    this.copyParamsFun(this.searchObj)
    this.getData()
  },
  activated () {
    const { type } = this
    if (type && type === 'add') {
      this.searchObj.pageIndex = 1
      this.clear()
    } else if (type === 'edit') {
      this.searchObj = { ...this.copyParamsObj }
      this.getData()
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_GET_MATERIAL_LIST',
      'A_MATERIAL_DELETE',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    // 导入
    importFile () {
      this.importVisible = true
    },
    // 导出
    downloadFile () {
      this.searchObj = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_GLOBAL_EXPORT({
        ...arg,
        moduleType: 'material',
        exportName: '物料'
      })
    },
    // 设置请求参数
    setParams () {
      return this.searchObj
    },
    // 获取列表数据
    getData () {
      const arg = this.setParams()
      this.A_GET_MATERIAL_LIST(arg)
    },
    // 新增
    addBtn (type) {
      this.type = type
      this.$router.push({
        name: 'materialDetail',
        params: { type, id: '0' }
      })
    },
    // 编辑、详情
    editBtn (type, id) {
      this.type = 'edit'
      this.$router.push({
        name: 'materialDetail',
        params: { type, id }
      })
    },
    // 获取checkbox ID
    handleSelection (val) {
      this.ids = val.map(it => it.baseMaterialId)
    },
    // 批量删除
    async BatchDelBtn (id) {
      if (this.ids.length > 0 || id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示')
          .then((res) => {
            if (res === 'confirm') {
              this.batchFn(id)
            }
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        this.$message.error('请选择需要删除列表数据')
      }
    },
    // 批量删除方法
    async batchFn (id) {
      try {
        const { status } = await this.A_MATERIAL_DELETE(id ? [id] : this.ids)
        if (status === 0) {
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 自定义字段
    customBtn () {
      this.dialogVisible = true
    },
    // 关闭自定义字段
    dialogClose () {
      this.dialogVisible = false
    },
    // 删除
    deleteBtn (id) {
      this.BatchDelBtn(id)
    },
    // 查询
    search () {
      this.searchObj.pageIndex = 1
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 清空
    clear () {
      this.searchObj = {}
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 页码改变
    pageChange (val) {
      this.searchObj = { ...this.copyParamsObj }
      this.searchObj.pageIndex = val
      this.copyParamsFun(this.searchObj)
      this.$refs.material.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.searchObj = { ...this.copyParamsObj }
      this.searchObj.pageSize = size
      this.copyParamsFun(this.searchObj)
      this.$refs.material.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
.custom-box {
  display: none;
}
</style>
