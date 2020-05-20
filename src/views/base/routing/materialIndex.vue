<template>
  <div ref='materialRouting'>
    <tzHeadline title="物料工艺路线">
      <template slot="btn">
        <el-button
          round
          size="medium"
          class="tz-btn-add"
          @click="addBtn('add', 'MATERIAL')"
        >新增物料工艺路线</el-button>
        <tzBtn icon="tz-icon-del" @click="BatchDelBtn">批量删除</tzBtn>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
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
          <el-form-item label="物料规格">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialSpec"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料图号">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialPicNum"
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
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialSpec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialPicNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="display" label="工艺路线构成" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="enableFlag" label="是否启用" align="center">
          <template slot-scope="scope">
            <tzEnable :isEnable="scope.row.enableFlag==='Y'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="btn">
              <span
                @click="editBtn('edit',scope.row.baseProcessId, scope.row.processType)"
                class="pointer mr10"
              >编辑</span>
              <span class="yellow" @click="deleteBtn(scope.row.baseProcessId)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <tzImport
    title="导入物料工艺路线"
      :visible="importVisible"
      type="process-material"
      @close="importVisible = false"
      @success="clear"
    ></tzImport>
    <tzPagination
      :currentPage="pageIndex"
      :page-size="pageSize"
      :total="total"
      @_currentPageChange="pageChange"
      @_pageSizeChange="pageSizeChange"
    />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dic from '../../../global/dictionary'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'materialRouting',
  mixins: [keepAlive, copyParams],
  data () {
    return {
      importVisible: false,
      type: null,
      searchObj: {
        processType: 'MATERIAL',
        materialCode: '',
        materialName: '',
        materialSpec: '',
        materialPicNum: ''
      },
      searchType: '',
      arrDic: dic.routingName,
      ids: [],
      pageIndex: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapState({
      list: state => state.base.routing.list,
      total: state => state.base.routing.total,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    const { type } = this
    if (type && type === 'add') {
      this.pageIndex = 1
      this.clear()
    } else if (type === 'edit') {
      this.getData()
    }
  },
  created () {
    this.copyParamsFun(this.searchObj)
    this.getData()
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_GET_ROUTING_LIST',
      'A_ROUTING_DELETE',
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      return {
        ...this.searchObj,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
    },
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
        moduleType: 'process',
        exportName: '物料工艺路线'
      })
    },
    // 获取列表数据
    getData () {
      this.searchObj = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_ROUTING_LIST(arg)
    },
    // 新增
    addBtn (type, direction) {
      this.type = type
      this.$router.push({
        name: 'routingDetail',
        params: { type, direction, id: '0' }
      })
    },
    // 编辑、详情
    editBtn (type, id, direction) {
      this.type = 'edit'
      this.$router.push({
        name: 'routingDetail',
        params: { type, direction, id }
      })
    },
    // 获取checkbox ID
    handleSelection (val) {
      this.ids = val.map(it => it.baseProcessId)
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
        const { status } = await this.A_ROUTING_DELETE(id ? [id] : this.ids)
        if (status === 0) {
          this.getData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除
    deleteBtn (id) {
      this.BatchDelBtn(id)
    },
    // 查询
    search () {
      this.pageIndex = 1
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 清空
    clear () {
      this.searchObj = {
        processType: 'MATERIAL',
        materialCode: '',
        materialName: '',
        materialSpec: '',
        materialPicNum: ''
      }
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 路线类型改变
    processChg (val) {
      this.searchType = val
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
       this.$refs.materialRouting.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
       this.$refs.materialRouting.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
