<template>
  <div class="staff">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-input placeholder="您可以搜索员工编码/员工姓名" v-model.trim="searchValue" clearable @keyup.enter.native="search">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
      </el-input>
      <el-table ref="multipleTable" :data="staffList" :row-class-name="tableRowClassName" @row-click="rowClick"
        @row-dblclick="dbRowClick" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="chooseType==='multiple'" align="center"></el-table-column>
        <el-table-column prop="stuffNo" label="员工编号" width="150" align="center"></el-table-column>
        <el-table-column prop="realname" label="员工姓名" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-pagination layout="prev, pager, next" :total="total" :current-page="pageIndex" :page-size="pageSize"
          @current-change="currentChange"></el-pagination>
        <div>
          <el-button @click="handleClose" round size="medium" class="tz-staff-cancel">取 消</el-button>
          <el-button type="primary" round size="medium" class="tz-staff-submit" @click="dialogSubmit">确 定</el-button>
        </div>
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
      default: '选择审核人员'
    },
    chooseType: {
      type: String,
      default: 'single' // 单选:single  多选:multiple
    },
    // true 是绑定的帐号的  false 查询所有的
    accountFlag: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  computed: {
    ...mapState({
      staffList: state => state.webSetting.staffList,
      total: state => state.webSetting.total
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
    ...mapActions(['A_GET_STAFF_LIST']),
    handleClose (done) {
      this.row = {}
      this.$emit('cancle')
      this.pageIndex = 1
      this.searchValue = ''
      this.getList()
      this.$refs.multipleTable.clearSelection()
    },
    dialogSubmit () {
      if (this.chooseType === 'single') {
        if (this.row.id) {
          this.$emit('submit', this.row)
        } else {
          this.$message.error('您还未选择人员！')
          return
        }
      }
      if (this.chooseType === 'multiple') {
        if (this.multipleSelection.length) {
          this.$emit('submit', this.multipleSelection)
        } else {
          this.$message.error('您还未选择人员！')
        }
      }
    },
    tableRowClassName ({
      row
    }) {
      if (row.id === this.row.id) {
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
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        key: this.searchValue,
        accountFlag: this.accountFlag
      }
      this.A_GET_STAFF_LIST(arg)
    },
    currentChange (index) {
      this.pageIndex = index
      this.getList()
    },
    search () {
      this.pageIndex = 1
      this.getList()
    }
  }
}

</script>

<style>
  .staff .el-table .warning-row td:last-child::after {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    content: "√";
    color: #7ca870;
  }

  .staff .el-table .warning-row {
    color: #7ca870;
  }

  .staff .dialog-footer {
    display: flex;
    justify-content: space-between;
  }

</style>
