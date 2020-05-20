<template>
  <div ref="process">
    <tzHeadline title="工序主档" :isShowBack="isShowBack">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('add')">新增工序</el-button>
        <tzBtn icon="tz-icon-del" @click="BatchDelBtn">批量删除</tzBtn>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
        <tzBtn icon="tz-icon-import" @click="importFile">导入</tzBtn>
        <!-- <tzBtn icon="tz-icon-download" @click="downloadBtn">下载模版</tzBtn> -->
      </template>
    </tzHeadline>
    <el-form :inline="true" size="medium">
      <tzSearch :isShowExtend="false" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="工序类型">
            <el-select v-model.trim="searchObj.seqType" placeholder="全部" clearable>
              <el-option
                :key="item.type"
                :value="item.type"
                v-for="item in arrDic"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工序编码">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.seqCode"
              @keyup.enter.native="search"
              clearable
            />
          </el-form-item>
          <el-form-item label="工序名称">
            <el-input
              placeholder="请输入"
              v-model.trim="searchObj.seqName"
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
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="seqType" label="工序类型" align="center">
        <template slot-scope="scope">{{scope.row.seqType | filterDic(arrDic)}}</template>
      </el-table-column>
      <el-table-column prop="seqCode" label="工序编码" align="center"></el-table-column>
      <el-table-column prop="seqName" label="工序名称" align="center"></el-table-column>
      <el-table-column prop="enableFlag" label="是否启用" align="center">
        <template slot-scope="scope">
          <tzEnable :isEnable="scope.row.enableFlag==='Y'" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <div class="btn">
            <!-- <span
               @click="editBtn('detail',scope.row)"
               class="pointer mr10"
            >详情</span>-->
            <span @click="editBtn('edit',scope.row)" class="pointer mr10">编辑</span>
            <span class="yellow" @click="deleteBtn(scope.row.baseSeqId)">删除</span>
          </div>
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
    <tzImport title="导入工序" :visible="visible" type="seq" @close="visible = false" @success="clear" />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dic from '../../../global/dictionary'
import keepAlive from '../../../mixins/keepAlive'
import { becomeString } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'process',
  mixins: [keepAlive, copyParams],
  data () {
    return {
      visible: false,
      isShowBack: false,
      type: null,
      materSearch: '',
      searchObj: {
        seqCode: '',
        seqName: '',
        seqType: ''
      },
      pageIndex: 1,
      pageSize: 10,
      arrDic: dic.processName,
      processData: [],
      ids: []
    }
  },
  computed: {
    ...mapState({
      list: state => state.base.process.list,
      total: state => state.base.process.total,
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
      // this.pageIndex = 1
      this.clear()
    } else if (type === 'edit') {
      this.getData()
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_GET_PROCESS_LIST',
      'A_PROCESS_DELETE',
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
    // 获取列表数据
    getData () {
      this.searchObj = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_PROCESS_LIST(arg)
    },
    // 新增
    addBtn (type) {
      this.type = type
      this.$router.push({
        name: 'processDetail',
        params: { type }
      })
    },
    // 编辑、详情
    editBtn (type, item) {
      const arg = becomeString(item)
      this.type = 'edit'
      this.$router.push({
        name: 'processDetail',
        params: { type },
        query: {
          item: arg
        }
      })
    },
    // 导入
    importFile () {
      this.visible = true
    },
    // 导出
    downloadFile () {
      this.searchObj = { ...this.copyParamsObj }
      const arg = this.setParams()
      this.A_GET_GLOBAL_EXPORT({
        ...arg,
        moduleType: 'seq',
        exportName: '工序'
      })
    },
    // 获取checkbox ID
    handleSelection (val) {
      this.ids = val.map(it => it.baseSeqId)
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
        const { status } = await this.A_PROCESS_DELETE(id ? [id] : this.ids)
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
      this.pageIndex = 1
      this.searchObj = {}
      this.copyParamsFun(this.searchObj)
      this.getData()
    },
    // 页码改变
    pageChange (val) {
      this.pageIndex = val
      this.$refs.process.scrollTop = 0
      this.getData()
    },
    // size改变
    pageSizeChange (size) {
      this.pageSize = size
      this.$refs.process.scrollTop = 0
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
