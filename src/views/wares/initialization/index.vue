<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="仓库管理">
      <template slot="btn">
        <!-- responseType: 'blob' -->
        <!-- <el-upload
          :accept="fileAccept"
          class="upload-demo"
          :headers="uploadHeaders"
          :action="uploadFileUrl"
          :before-upload="importBeforeUpload"
          :on-error="importFileError"
          :on-success="handleSucess">
          <el-button class="tz-btn-add" round size="medium">初始化</el-button>
        </el-upload>-->
        <!-- <tzFileUpload
          class="mr10"
          :isShow="false"
          content="初始化"
          @success="handleSuccess"
          :api="api.initialization.init"
        >
          <el-button class="tz-btn-add" round size="medium">初始化</el-button>
        </tzFileUpload> -->
        <el-button class="tz-btn-add" round size="medium" @click="importFile">仓库初始化</el-button>
        <el-button class="tz-btn-add" round size="medium" @click="goTo('add')">盘点</el-button>
        <el-button class="tz-btn-add" round size="medium" @click="goTo('allAdd')">全部盘点</el-button>
        <tzBtn icon="tz-icon-export" @click="downloadFile">导出</tzBtn>
      </template>
    </tzHeadline>
    <div class="relation">
      <div
        :class="{item: true, current : currentIndex === index }"
        class="pointer"
        @click="changeTabs(item.baseWarehouseId, index)"
        v-for="(item, index) in houseList"
        :key="item.baseWarehouseId"
      >{{item.warehouseName}}</div>
    </div>
    <div style="height: 20px;"></div>
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="物料类型" prop="typeName">
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
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.materialCode"
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.materialName"
            />
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      :data="tableData"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="safetyStock" label="安全库存"></el-table-column>
      <el-table-column align="center" prop="quantity" label="当前在库数量">
        <template slot-scope="scope">{{scope.row.quantity}}</template>
      </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <span
            class="yellow"
            @click="goTo('detail', scope.row.stockMaterialId, scope.row.baseMaterialId)"
          >详情</span>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :total="total"
      :pageSize="formData.pageSize"
      :current-page="formData.pageIndex"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange"
    />
    <tzImport
      type="warehouse"
      title="导出仓库物料"
      :isWarehouse="true"
      :exportData="exportData"
      :visible="importVisible"
      @close="importVisible = false"
      @success="clear"
    ></tzImport>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import api from '../../../global/api'
import * as urls from '../../../router/routePath'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import { becomeString } from '../../../utils/utils'
import download from '../../../mixins/download'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'initialization',
  mixins: [keepAlive, dic, download, copyParams],
  data () {
    return {
      api,
      id: '',
      materialTypes: [],
      currentIndex: 0,
      materials: [],
      formData: {
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        warehouseId: '',
        materialCode: '',
        materialName: ''
      },
      exportData: {
        moduleType: 'exportStock',
        exportName: '当前库存初始化模板'
      },
      checkSuffixs: ['xls', 'xlsx'],
      importVisible: false
    }
  },
  computed: {
    ...mapState({
      total: state => state.ware.initialization.total,
      tableLoading: state => state.global.tableLoading,
      showBtn: state => state.ware.initialization.showBtn,
      tableData: state => state.ware.initialization.getInitializationList
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.initWarehouse()
  },
  activated () {
    const { type } = this.formData
    if (type === 'add') {
      this.clear()
      this.getInitializationList()
    } else {
      this.formData = {
        ...this.copyParamsObj,
        warehouseId: this.formData.warehouseId
      }
      this.getInitializationList()
    }
  },
  methods: {
    ...mapActions([
      'GET_STOCK_WAREHOUSE_LIST', // 获取仓库列表
      'GET_INITIALIZATION_LIST', // 获取初始化库存
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 导出
    downloadFile () {
      const { warehouseId } = this.formData
      this.formData = {
        ...this.copyParamsObj,
        warehouseId,
        baseWarehouseId: warehouseId
      }
      this.A_GET_GLOBAL_EXPORT({
        ...this.formData,
        moduleType: 'exportWarehouse',
        exportName: '当前仓库库存数据'
      })
    },
    importFile (type) {
      this.importVisible = true
    },
    async initWarehouse () {
      try {
        const { status, data } = await this.GET_STOCK_WAREHOUSE_LIST()
        if (status === 0) {
          this.materialTypes = data
          if (data.length) {
            const { baseWarehouseId } = data[0]
            this.formData.warehouseId = baseWarehouseId
            this.exportData.baseWarehouseId = baseWarehouseId
            this.getInitializationList()
          } else {
            this.$message.error('请维护仓库主档')
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    changeTabs (id, index) {
      this.currentIndex = index
      this.formData.warehouseId = id
      this.exportData.baseWarehouseId = id
      this.clear()
    },
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getInitializationList()
    },
    // 全选
    handleSelectionChange (e) {
      this.materials = e.map(item => ({
        ...item,
        result: '',
        remark: '',
        takingQuantity: '',
        differenceValue: ''
      }))
    },
    // 清空列表
    clear () {
      this.formData = {
        pageIndex: 1,
        pageSize: 10,
        typeName: '',
        warehouseId: this.formData.warehouseId,
        materialCode: '',
        materialName: ''
      }
      this.copyParamsFun(this.formData)
      this.getInitializationList(this.formData)
    },
    // 获取初始化库存列表
    getInitializationList () {
      this.GET_INITIALIZATION_LIST(this.formData)
    },
    // 进入盘点
    goTo (type, id = '', baseMaterialId) {
      const materials = this.materials.map(item => ({
        spec: item.spec,
        quantity: item.quantity,
        unitName: item.unitName,
        typeName: item.typeName,
        baseMaterialId: item.baseMaterialId,
        baseWarehouseId: item.baseWarehouseId,
        materialName: item.materialName,
        materialCode: item.materialCode
      }))
      this.formData.type = type
      let query = {}
      if (type === 'add' && this.formData.warehouseId) {
        query = {
          query: {
            id: this.formData.warehouseId,
            materials: becomeString(materials)
          }
        }
      }
      if (type === 'allAdd' && this.formData.warehouseId) {
        query = {
          query: {
            id: this.formData.warehouseId
          }
        }
      }
      if (type === 'detail') {
        query = {
          query: {
            id,
            baseMaterialId
          }
        }
      }
      let arg = {
        path:
          type === 'detail'
            ? `${urls.INITIALIZATION_DETAIL}/${type}`
            : `${urls.INVENTORY_ADD}/${type}`
      }
      arg = Object.assign({}, arg, query)
      this.$router.push(arg)
    },
    // 页码
    pageSizeChange (e) {
      this.formData = {
        ...this.copyParamsObj,
        warehouseId: this.formData.warehouseId
      }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getInitializationList()
    },
    currentPageChange (e) {
      this.formData = {
        ...this.copyParamsObj,
        warehouseId: this.formData.warehouseId
      }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getInitializationList()
    },
    // 下载模板
    async downloadTemplate () {
      this.exportFile(api.initialization.download, {
        fileName: '初始化库存模板.xls'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.relation {
  padding: 2px;
  background: #f0f2f5;
  display: inline-block;
}
.relation .item {
  height: 32px;
  color: #303133;
  font-size: 14px;
  padding: 0 15px;
  line-height: 32px;
  margin-right: 2px;
  text-align: center;
  display: inline-block;
}
.relation .item:last-child {
  margin-right: 0;
}
.relation .current {
  color: #7ca870;
  background: #ffffff;
}
.relation .item:hover {
  color: #7ca870;
  background: #ffffff;
}

// .upload-demo {
//   margin-right: 15px;
//   display: inline-block;
// }
// /deep/ .el-upload-list {
//   display: none;
// }
</style>
