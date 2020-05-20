<template>
  <div class="ware">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-input placeholder="您可以搜索仓库名称" v-model.trim="searchValue" clearable @keyup.enter.native="search">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
      </el-input>
      <el-table ref="multipleTable" :data="warehouseList" :row-class-name="tableRowClassName" @row-click="rowClick"  @row-dblclick="dbRowClick"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="chooseType==='multiple'" align="center">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称"  align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose" round size="medium" class="tz-staff-cancel">取 消</el-button>
          <el-button type="primary" round size="medium" class="tz-staff-submit" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {
  mapActions,
  mapState
} from 'vuex'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '选择仓库'
    },
    chooseType: {
      type: String,
      default: 'single' // 单选:single  多选:multiple
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  computed: {
    ...mapState({
      warehouseList: state => state.base.warehouseList
    })
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 5,
      searchValue: '',
      multipleSelection: [],
      row: {}
    }
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.handleClose()
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    ...mapActions(['GET_WAREHOUSE_LIST']),
    handleClose (done) {
      this.$refs.multipleTable.clearSelection()
      this.row = {}
      this.$emit('cancle')
      this.pageIndex = 1
      this.searchValue = ''
      this.getList()
    },
    dialogSubmit () {
      if (this.chooseType === 'single') {
        this.$emit('submit', this.row)
      }
      if (this.chooseType === 'multiple') {
        this.$emit('submit', this.multipleSelection)
      }
    },
    tableRowClassName ({ row }) {
      if (row.baseWarehouseId === this.row.baseWarehouseId) {
        return 'warning-row'
      }
      return ''
    },
    rowClick (row) {
      if (this.chooseType === 'single') {
        this.row = row
      }
    },
    dbRowClick (row) {
      if (this.chooseType === 'single') {
        this.row = row
        this.dialogSubmit()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getList () {
      const arg = {
        name: this.searchValue
      }
      this.GET_WAREHOUSE_LIST(arg)
    },
    search () {
      this.getList()
    }
  }
}

</script>

<style>
  .ware .el-table .warning-row td:last-child::after {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    content: '√';
    color: #7CA870;
  }

  .ware .el-table .warning-row {
    color: #7CA870;
  }

</style>
