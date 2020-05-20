<template>
  <el-dialog :width="width" :modal-append-to-body="true" :title="title" :visible="visible" custom-class="material"
    @close="close">
    <el-input style="margin-bottom: 16px" placeholder="您可以搜索物料名称/编码/规格/图号" clearable @keyup.enter.native="getData"
      v-model.trim="materialNameOrCode">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="getData"></i>
    </el-input>
    <div class="material-t">
      <el-table border :data="list" ref="multipleTable" height="300px" v-loading="tableLoading"
      element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)" @current-change="handleCurrent" :row-key="getRowKeys"
      @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      :header-cell-style="{'background-color': '#F9F9F9'}" @row-dblclick="dbHandleCurrent">
      <el-table-column v-if="isMultiple" type="selection" align="center" :reserve-selection="true"
        :selectable="checkSelectable" width="55"></el-table-column>
      <el-table-column property="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column property="materialCode" label="物料编码" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column property="materialName"  label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column property="spec" label="物料规格" align="center"   show-overflow-tooltip></el-table-column>
      <el-table-column property="picNum" label="物料图号" align="center"   show-overflow-tooltip></el-table-column>
      <el-table-column property="display" label="工艺路线" align="center" v-if="isShowProcess" show-overflow-tooltip></el-table-column>
    </el-table>
    <section v-if="isMultiple" style="text-align: right;padding: 10px 0">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize"
        :layout="layout" :total="total"></el-pagination>
    </section>
    </div>
    <section>
      <el-divider v-if="isMultiple"></el-divider>
      <h2 v-if="isMultiple" class="title">已选择物料：</h2>
      <el-table border max-height="250" v-if="isMultiple" :data="selectedData"
        :header-cell-style="{'background-color': '#F9F9F9'}">
        <el-table-column property="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="materialCode" label="物料编码" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column property="materialName"  label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column property="spec" label="物料规格" align="center"   show-overflow-tooltip></el-table-column>
        <el-table-column property="picNum" label="物料图号" align="center"   show-overflow-tooltip></el-table-column>
        <el-table-column property="display" label="工艺路线" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isShowUseCount" property="useCount" label="用量" align="center">
          <template slot-scope="scope">
            <el-input-number clearable :precision="6" style="width: 100%" v-model.trim="scope.row.useCount"
              :min="0" :max="99999999" size="mini" :controls="false" placeholder="用量"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column property="action" label="操作" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" type="warning" @click.stop.prevent="del(scope.$index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <h2></h2>
    <div slot="footer">
      <el-divider style="margin: 0"></el-divider>
      <main class="footer">
        <section>
          <el-pagination v-if="!isMultiple" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
            :page-size="pageSize" :layout="layout" :total="total"></el-pagination>
        </section>
        <section>
          <el-button round size="medium" class="tz-staff-cancel" @click="close">取 消</el-button>
          <el-button round size="medium" type="primary" class="tz-staff-submit" @click="submit">确 定</el-button>
        </section>
      </main>
    </div>
  </el-dialog>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'material',
  props: {
    // width
    width: {
      type: String,
      default: '900px'
    },
    // 显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: '选择物料'
    },
    // 分页
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: true
    },
    // 默认选中数据是否置灰
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 单选的默认值
    defaultVal: {
      type: Object,
      default () {
        return {}
      }
    },
    // 多选的默认值
    defaultData: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否展示修改用量输入框
    isShowUseCount: {
      type: Boolean,
      default: false
    },
    // 是否展示工艺路线
    isShowProcess: {
      type: Boolean,
      default: true
    },
    // 仓库Id
    baseWarehouseId: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      currentData: this.defaultVal,
      materialNameOrCode: '',
      multipleSelection: [], // 表格中已选择数据包含disabled
      selectedData: [], // 当前最新选择的数据
      pageIndex: 1,
      pageSize: 5
    }
  },
  computed: {
    ...mapState({
      list: state => state.global.material.list || [],
      total: state => state.global.material.total || 0,
      tableLoading: state => state.global.tableLoading
    })
  },
  watch: {
    visible (val) {
      if (val) {
        this.reset()
        this.getData()
      }
    }
  },
  methods: {
    ...mapActions(['A_GET_GLOBAL_MATERIAL_LIST']),
    // 设置row-key
    getRowKeys (row) {
      return row.baseMaterialId
    },
    // 设置请求参数
    setParams () {
      const {
        pageIndex = 1, pageSize = 5, materialNameOrCode = '', baseWarehouseId
      } = this
      return {
        pageIndex,
        pageSize,
        materialNameOrCode,
        baseWarehouseId
      }
    },
    // 获取物料数据
    async getData () {
      try {
        const arg = this.setParams()
        const {
          status
        } = await this.A_GET_GLOBAL_MATERIAL_LIST(arg)
        if (status === 0) {
          this.$nextTick(() => {
            if (this.isDisabled) {
              this.checkSelectable()
            }
            if (this.isMultiple) {
              this.toggleSelection()
            } else {
              this.setCurrent()
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 设置选择行
    tableRowClassName ({ row, rowIndex }) {
      if (row.baseMaterialId === this.currentData.baseMaterialId) {
        return 'sel-row'
      }
      return ''
    },
    // 是否置灰多选按钮
    checkSelectable (row = {}) {
      if (this.isDisabled) {
        const defaultCheck = this.defaultData
          .filter(item => item.baseMaterialId)
          .map(item => item.baseMaterialId)
        return !defaultCheck.includes(row.baseMaterialId)
      }
      return true
    },
    // 添加选中效果
    toggleSelection () {
      const selected = [...this.defaultData, ...this.selectedData]
      const result = selected
        .filter(item => item.baseMaterialId)
        .map(it => it.baseMaterialId)
      if (this.list.length) {
        this.list.forEach((row) => {
          if (result.includes(row.baseMaterialId)) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(row, false)
          }
        })
        return
      }
      this.$refs.multipleTable.clearSelection()
    },
    // 单选
    handleCurrent (val) {
      if (!this.isMultiple) {
        this.currentData = val
      }
    },
    // 双击单选
    dbHandleCurrent (val) {
      if (this.isMultiple) return
      this.handleCurrent(val)
      this.submit()
    },
    setCurrent () {
      if (!this.isMultiple) {
        this.$refs.multipleTable.setCurrentRow(this.defaultVal)
      }
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      const defaultData = this.defaultData.map(it => it.baseMaterialId)
      this.selectedData = val.filter(
        it => !defaultData.includes(it.baseMaterialId)
      ).map(it => ({
        ...it,
        useCount: this.setUseCount(it.baseMaterialId)
      }))
    },
    // 设置用量
    setUseCount (baseMaterialId) {
      const result = this.selectedData.filter(it => it.baseMaterialId === baseMaterialId)
      return result && result.length > 0 ? result[0].useCount : undefined
    },
    // 分页改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getData()
    },
    // 点击确定
    submit () {
      if (this.isMultiple) {
        if (!this.multipleSelection.length || !this.selectedData.length) {
          this.$message.error('请选择物料')
          return
        }
        if (this.isShowUseCount && this.selectedData.filter(it => !it.useCount || it.useCount === 0).length > 0) {
          this.$message.error('请输入用量')
          return
        }
        this.$emit('submit', this.selectedData)
      } else {
        if (!this.currentData.baseMaterialId) {
          this.$message.error('请选择物料')
          return
        }
        const defaultData = this.defaultData.map(it => it.baseMaterialId)
        if (defaultData.includes(this.currentData.baseMaterialId)) {
          this.$message.error('该物料已添加请勿重复添加')
          return
        }
        this.$emit('submit', this.currentData)
      }
    },
    // 多选时删除已选择数据
    del (index) {
      this.multipleSelection.splice(index, 1)
      this.selectedData = this.selectedData.filter((it, i) => i !== index)
      this.toggleSelection(this.multipleSelection)
    },
    // 重置val
    reset () {
      this.pageIndex = 1
      this.selectedData = []
      this.materialNameOrCode = ''
    },
    // 关闭
    close () {
      this.reset()
      this.$refs.multipleTable.clearSelection()
      this.$emit('close')
    }
  }
}

</script>

<style lang="less" scoped>
  .title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(68, 68, 68, 1);
    line-height: 20px;
  }

  .el-table .sel-row {
    background-color: #f5f7fa;
    color: #a6c4a0;
  }

  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

</style>
<style>
  .el-table .sel-row {
    background: #f5f7fa;
    color: #85ae7a;
  }

  .el-table .current-row {
    background: #f5f7fa;
    color: #85ae7a;
  }

  .material .el-dialog__footer {
    padding: 16px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .material .el-dialog__body {
    padding: 16px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }

</style>
<style>
  .material-t .el-table .sel-row td:last-child::after {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    content: "√";
    color: #7ca870;
  }

</style>
