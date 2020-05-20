<template>
  <div>
    <el-table
      border
      :data="tableData"
      style="width: 100%"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
      <el-table-column prop="targetType" label="单据类型" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.targetType | filterDic(dic.moduleName,'type','orderName')}}</template>
      </el-table-column>
      <el-table-column prop="targetCode" label="单号" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goDetail(scope.row)">{{scope.row.targetCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核状态" v-if="type==='second'" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.status?scope.row.status:'' | filterDic(dic.checkStatus,'type','name')}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="我的处理结果" v-if="type==='second'" align="center">
        <template slot-scope="scope">{{scope.row.actionType | filterDic(dic.suggestion)}}</template>
      </el-table-column>
      <el-table-column prop="actionTime" label="处理时间" v-if="type==='second'" align="center">
        <template slot-scope="scope">{{scope.row.actionTime | momentTime}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <span class="pointer mr10" @click="goDetail(scope.row)">详情</span>
          <span v-if="type !== 'second'" class="green pointer" @click="check(scope.row)">审批</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="审批" :visible.sync="dialogVisible" width="840px" :before-close="handleClose">
      <tzSteps :stepsList="members" titleName="realname">
        <template v-slot:desc="slotProp">
          <div class="desc-item">{{slotProp.step.nowApproveFlag==='Y'?'':'未审核'}}</div>
          <div
            v-if="slotProp.step.nowApproveFlag==='Y'"
            class="desc-item"
          >{{slotProp.step.actionType==='ACCEPT'?'同意':'拒绝'}}</div>
          <div
            v-if="slotProp.step.nowApproveFlag==='Y'"
            class="desc-item"
          >{{slotProp.step.actionTime}}</div>
          <div v-if="slotProp.step.nowApproveFlag==='Y'" class="desc-item">{{slotProp.step.remark}}</div>
        </template>
      </tzSteps>
      <el-form label-width="80px" :model="checkForm" :rules="rules" ref="checkForm">
        <el-form-item label="处理结果" prop="actionType">
          <el-radio-group v-model="checkForm.actionType">
            <el-radio v-for="it in dic.suggestion" :label="it.type" :key="it.type">{{it.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input type="textarea" v-model="checkForm.remark" maxlength="20" show-word-limit/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="type==='first'">
        <el-button
          type="primary"
          round
          size="medium"
          class="tz-staff-submit"
          @click="dialogSubmit('checkForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import dic from '../../../../global/dictionary'
import * as urls from '../../../../router/routePath'

const pages = {
  SALE_PROD: 'finished',
  SALE_MATERIAL: 'subpart',
  NONE: 'none',
  APPLY: 'down'
}
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'first'
    }
  },
  data () {
    return {
      rules: {
        actionType: [
          {
            required: true,
            message: '请选择审批意见',
            trigger: 'change'
          }
        ]
      },
      dialogVisible: false,
      dic,
      checkForm: {
        actionType: 'ACCEPT'
      },
      curRow: {}
    }
  },
  computed: {
    ...mapState({
      tableLoading: state => state.global.tableLoading,
      members: state => state.orderCheck.members
    })
  },
  methods: {
    ...mapActions(['A_GET_CHECKERS', 'A_ADD_CHECK']),
    check (row) {
      this.curRow = row
      const { approveInstanceId } = row
      this.A_GET_CHECKERS({
        approveInstanceId
      })
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      this.checkForm = {
        actionType: 'ACCEPT'
      }
    },
    // 跳转详情
    goDetail (row) {
      if (row.targetType === 'SALE') {
        this.$router.push({
          path: `${urls.SALE_DETAIL}/detail`,
          query: {
            id: row.targetId
          }
        })
      }
      if (row.targetType === 'PROD') {
        this.$router.push({
          name: 'prodDetail',
          params: {
            id: row.targetId
          }
        })
      }
      if (row.targetType === 'APPLY') {
        this.$router.push({
          name: 'applyFinishedAdd',
          params: {
            type: 'detail',
            page: pages[row.targetDetailType],
            id: row.targetId
          }
        })
      }
      if (row.targetType === 'PURCHASE' && row.targetDetailType !== 'NONE') {
        this.$router.push({
          name: 'orderFinishedAdd',
          params: {
            type: 'detail',
            page: pages[row.targetDetailType],
            id: row.targetId
          }
        })
      }
      if (row.targetType === 'PURCHASE' && row.targetDetailType === 'NONE') {
        this.$router.push({
          name: 'orderPersonalAdd',
          params: {
            type: row.targetDetailType,
            page: 'order',
            id: row.targetId
          }
        })
      }
      if (row.targetType === 'SUPPLY') {
        this.$router.push({
          name: 'outsourceProductDetail',
          query: {
            id: row.targetId,
            type: row.targetDetailType
          }
        })
      }
      if (row.targetType === 'SUPPLY_SEQ') {
        this.$router.push({
          name: 'outsourceProcessDetail',
          params: { id: row.targetId }
        })
      }
    },
    dialogSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        try {
          if (valid) {
            const { approveInstanceId, approveInstanceSeqId } = this.curRow
            const arg = {
              ...this.checkForm,
              approveInstanceId,
              approveInstanceSeqId
            }
            const { status } = await this.A_ADD_CHECK(arg)
            if (status === 0) {
              this.handleClose()
              this.$emit('submit')
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.desc-item {
  margin-top: 4px;
}
</style>>
