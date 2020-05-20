<template>
  <div>
    <el-dialog title="质检信息" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" :show-close="showClose">
      <div class="success-head">无需质检，{{successTitle}}</div>
      <el-table :data="successData" style="width: 100%" :header-cell-style="{'background-color': '#F9F9F9'}" border>
        <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center"   show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="quantity" :label="successTitle==='收货已入库'?'入库数':'出库数'" align="center">
        </el-table-column>
      </el-table>
      <div class="fail-head">必须质检，{{failTitle}}</div>
       <el-table :data="failData" style="width: 100%" :header-cell-style="{'background-color': '#F9F9F9'}" border>
        <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center"   show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="quantity" :label="successTitle==='收货已入库'?'入库数':'出库数'" align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" round size="medium" class="tz-staff-submit" @click="dialogSubmit" >知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    successTitle: {
      type: String,
      default: '收货已入库'
    },
    failTitle: {
      type: String,
      default: '收货未入库'
    },
    successData: {
      type: Array,
      default: () => []
    },
    failData: {
      type: Array,
      default: () => []
    },
    showClose: {
       type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleClose () {
      this.$emit('cancle')
    },
    dialogSubmit () {
      this.$emit('dialogSubmit')
    }
  }
}

</script>

<style lang="scss" scoped>
  .success-head{
    color:#7CA870;
    font-size:18px;
    font-weight:bold;
    margin-bottom:20px;
  }
  .fail-head{
    margin-top: 20px;
    color:#E9A763;
    font-size:18px;
    font-weight:bold;
    margin-bottom:20px;
  }
</style>>

