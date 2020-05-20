<template>
  <div>
    <tzHeadline title="工艺路线" :isShowBack="isShowBack">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add', 'MATERIAL')">新增物料工艺路线</el-button>
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add', 'GLOBAL')">新增全局工艺路线</el-button>
        <tzBtn icon="tz-icon-del" @click="BatchDelBtn">批量删除</tzBtn>
        <tzBtn icon="tz-icon-export" @click="downloadBtn">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="downloadBtn">导入</tzBtn>
        <!-- <tzBtn icon="tz-icon-download" @click="downloadBtn">下载模版</tzBtn> -->
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium">
      <tzSearch :isShowExtend="true" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="路线类型">
            <el-select
              v-model.trim="searchObj.processType"
              placeholder="全部"
              @change="processChg"
              clearable
            >
              <el-option
                :key="item.type"
                :value="item.type"
                v-for="item in arrDic"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialCode"
              @keyup.enter.native="search"
              :disabled="searchType !== 'MATERIAL' || searchType === ''"
              clearable
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialName"
              @keyup.enter.native="search"
              :disabled="searchType !== 'MATERIAL' || searchType === ''"
              clearable
            />
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料规格">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialSpec"
              @keyup.enter.native="search"
              :disabled="searchType !== 'MATERIAL' || searchType === ''"
              clearable
            />
          </el-form-item>
          <el-form-item label="物料图号">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.materialPicNum"
              @keyup.enter.native="search"
              :disabled="searchType !== 'MATERIAL' || searchType === ''"
              clearable
            />
          </el-form-item>
          <el-form-item label="路线名称">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.processName"
              @keyup.enter.native="search"
              :disabled="searchType !== 'GLOBAL' || searchType === ''"
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
        <el-table-column prop="processType" label="所属性质" align="center">
          <template slot-scope="scope">{{scope.row.processType | filterDic(arrDic)}}</template>
        </el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialSpec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialPicNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="processName" label="工艺路线名称-物料名称" align="center">
          <template slot-scope="scope">
            {{scope.row.materialCode}}
            {{scope.row.processName}}
          </template>
        </el-table-column>
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
              <span
                class="yellow"
                @click="deleteBtn(scope.row.baseProcessId)"
              >删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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

export default {
  name: 'prorouting',
  mixins: [keepAlive],
  data () {
    return {
      isShowBack: false,
      dialogVisible: false,
      type: null,
      materSearch: '',
      searchObj: {
        processType: '',
        materialCode: '',
        materialName: '',
        materialSpec: '',
        materialPicNum: '',
        processName: ''
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
    this.getData()
  },
  methods: {
    // 所有异步请求
    ...mapActions(['A_GET_ROUTING_LIST', 'A_ROUTING_DELETE']),
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
    // 获取列表数据
    getData () {
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
    // 下载模版
    downloadBtn () {
      this.$message.error('功能暂无开发')
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
        const { status } = await this.A_ROUTING_DELETE(
          id ? [id] : this.ids
        )
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
      this.getData()
    },
    // 清空
    clear () {
      this.searchObj = {}
      this.getData()
    },
    // 路线类型改变
    processChg (val) {
      this.searchType = val
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
