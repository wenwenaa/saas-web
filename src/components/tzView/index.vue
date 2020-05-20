<!-- 查看操作记录 -->
<template>
  <el-dialog
    :width="width"
    :modal-append-to-body="true"
    :title="title"
    :visible="visible"
    @close="close"
  >
    <tzSteps v-show="approvalFlowList.length > 0" :stepsList="approvalFlowList" titleName="realname">
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
    <el-table
      border
      :data="list"
      height="300px"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column property="realname" label="操作人" align="center"></el-table-column>
      <el-table-column property="actionTime" label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.actionTime | momentTime}}</span>
        </template>
      </el-table-column>
      <el-table-column property="actionType" label="操作内容" align="center">
        <template  slot-scope="scope">
          {{scope.row.actionType | filterDic(dictionary.suggestionHistory)}}
        </template>
      </el-table-column>
      <el-table-column property="remark" label="描述" align="center"></el-table-column>
    </el-table>
    <section style="text-align: right">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
      ></el-pagination>
    </section>
    <div v-if="!rootNode">
      <el-table
        border
        :data="subHisList"
        height="300px"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column property="realname" label="操作人" align="center"></el-table-column>
        <el-table-column property="actionTime" label="操作时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.actionTime | momentTime}}</span>
          </template>
        </el-table-column>
        <el-table-column property="actionType" label="操作内容" align="center">
          <template  slot-scope="scope">
            {{scope.row.actionType | filterDic(dictionary.suggestionHistory)}}
          </template>
        </el-table-column>
        <el-table-column property="remark" label="描述" align="center"></el-table-column>
      </el-table>
      <section style="text-align: right">
        <el-pagination
          @current-change="subHandleCurrentChange"
          :current-page.sync="subHisPageIndex"
          :page-size="subHisPageSize"
          :layout="layout"
          :total="subHisTotal"
        ></el-pagination>
      </section>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import dictionary from '../../global/dictionary'

export default {
  name: 'tzView',
  props: {
    // 宽度
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
      default: '查看操作记录'
    },
    // 分页
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    // 子件操作記錄
    rootNode: {
      type: Boolean,
      default: true
    },
    // 获取参数
    paramsCode: {
      type: String,
      default: ''
    },
    paramsType: {
      type: String,
      default: ''
    },
    partParamsCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dictionary,
      pageIndex: 1,
      pageSize: 5,
      subHisPageIndex: 1,
      subHisPageSize: 5
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.getData()
        this.getApprovalFlowList()
        if (!this.rootNode) {
          this.getSubHisData()
        }
      }
    }
  },
  computed: {
    ...mapState({
      approvalFlowList: state => state.global.approvalFlowList,
      list: state => state.global.history.historyList,
      total: state => state.global.history.total,
      tableLoading: state => state.global.tableLoading,
      subHisTotal: state => state.product.prod.subHisData.total,
      subHisList: state => state.product.prod.subHisData.list
    })
  },
  methods: {
    ...mapActions(['POST_GLOBAL_HISTORY', 'POST_GLOBAL_APPROVAL_FLOW', 'A_GET_PROD_SUB_HIS']),
    // 设置请求参数
    setParams () {
      const {
        pageIndex, pageSize, paramsType, paramsCode, partParamsCode, rootNode
      } = this
      return {
        targetType: paramsType,
        targetCode: rootNode ? paramsCode : partParamsCode,
        pageIndex,
        pageSize
      }
    },
    // 获取操作记录
    getData () {
      const arg = this.setParams()
      this.POST_GLOBAL_HISTORY(arg)
    },
    // 设置请求参数
    setParams1 () {
      const {
        subHisPageIndex, subHisPageSize, paramsType, paramsCode
      } = this
      return {
        targetType: paramsType,
        targetCode: paramsCode,
        pageIndex: subHisPageIndex,
        pageSize: subHisPageSize
      }
    },
    // 获取子件操作历史数据（子件详情获取）
    async getSubHisData () {
      const arg = this.setParams1()
      this.A_GET_PROD_SUB_HIS(arg)
    },
    // 获取操作记录
    getApprovalFlowList () {
      const { paramsType, paramsCode } = this
      const arg = {
        targetType: paramsType,
        targetCode: paramsCode
      }
      this.POST_GLOBAL_APPROVAL_FLOW(arg)
    },
    // 分页改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getData()
    },
    // 分页改变
    subHandleCurrentChange (val) {
      this.subHisPageIndex = val
      this.getSubHisData()
    },
    // 关闭
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
