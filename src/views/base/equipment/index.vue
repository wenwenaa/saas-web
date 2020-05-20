<template>
  <div ref="equipment">
    <!-- 头部 -->
    <tzHeadline title="设备主档">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="equipmentAdd('add')">新增设备</el-button>
        <tzBtn icon="tz-icon-del" @click="batchDeletion">批量删除</tzBtn>
        <!-- <tzBtn icon="tz-icon-export">导出</tzBtn>
        <tzBtn icon="tz-icon-import">导入</tzBtn> -->
        <!-- <tzBtn icon="tz-icon-download">下载模版</tzBtn> -->
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="设备编号">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.equipmentCode"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input
              placeholder="请输入"
              v-model.trim="formData.equipmentName"
              @keyup.enter.native="search"
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      border
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="equipmentCode" label="设备编码" width="180"></el-table-column>
      <el-table-column align="center" prop="equipmentName" label="设备名称" width="180"></el-table-column>
      <el-table-column align="center" prop="workshop" label="所在车间"></el-table-column>
      <el-table-column align="center" prop="location" label="坐标位置"></el-table-column>
      <el-table-column align="center" prop="address" label="是否启用">
        <template slot-scope="scope">
          <tzEnable :isEnable="scope.row.enableFlag === 'Y'" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <p>
            <span class="pointer mr10" @click="equipmentAdd('edit', scope.row.baseEquipmentId)">编辑</span>
            <span class="yellow" @click="confirmEquipmentDel('single',scope.row)">删除</span>
          </p>
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
import { mapActions, mapState } from 'vuex'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'equipmentList',
  mixins: [keepAlive, copyParams],
  data () {
    return {
      formData: {
        pageSize: 10,
        pageIndex: 1,
        equipmentName: '',
        equipmentCode: '',
        type: ''
      },
      type: 'img',
      selectedId: [] // 批量删除的id
    }
  },
  computed: {
    ...mapState({
      total: state => state.base.total,
      tableData: state => state.base.equipmentList,
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getEquipmentList()
  },
  activated () {
    const { type } = this.formData
    if (type === 'add') {
      this.formData = {
        pageIndex: 1,
        pageSize: 10,
        equipmentName: '',
        equipmentCode: ''
      }
      this.copyParamsFun(this.formData)
      this.getEquipmentList()
    } else if (type === 'edit') {
      this.formData = { ...this.copyParamsObj }
      this.getEquipmentList()
    }
  },
  methods: {
    ...mapActions([
      'GET_EQUIPMENT_LIST',
      'DEL_EQUIPMENT',
      'A_GET_GLOBAL_EQUIPMENT_LIST'
    ]),
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getEquipmentList()
    },
    // 清空列表
    clear () {
      this.formData = {
        pageIndex: 1,
        pageSize: 10,
        equipmentName: '',
        equipmentCode: ''
      }
      this.copyParamsFun(this.formData)
      this.getEquipmentList()
    },
    // 获取设备列表
    getEquipmentList () {
      this.GET_EQUIPMENT_LIST(this.formData)
    },
    // 全选
    handleSelectionChange (data) {
      this.selectedId = data.map(item => item.baseEquipmentId)
    },
    // 批量删除
    batchDeletion () {
      this.confirmEquipmentDel('all', this.selectedId)
    },
    // 确认删除设备
    async confirmEquipmentDel (type, item) {
      if (type === 'single') {
        this.selectedId = [item.baseEquipmentId]
      }
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.equipmentDel(this.selectedId)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除设备 批量删除
    async equipmentDel (data) {
      try {
        const { status } = await this.DEL_EQUIPMENT(data)
        if (status === 0) {
          this.$message.success('删除成功')
          this.getEquipmentList()
          this.A_GET_GLOBAL_EQUIPMENT_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    equipmentAdd (type, id = '') {
      this.formData.type = type
      this.$router.push({
        path: urls.BASE_EQUIPMENT_ADD,
        query: { type, id }
      })
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.equipment.scrollTop = 0
      this.getEquipmentList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.equipment.scrollTop = 0
      this.getEquipmentList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
