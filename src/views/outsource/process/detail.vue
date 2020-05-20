<!-- 详情 -->
<template>
  <div>
    <tzHeadline title="工序委外订单详情" isShowBack :customBack="false" @back="back">
      <template slot="btn">
        <!-- <el-button class="tz-search-submit" round size="medium" @click="openPrint">打印</el-button> -->
        <el-button
          v-if="detail.status === 'DRAFT'"
          round
          size="medium"
          class="tz-btn-add"
          @click="goEdit"
        >编辑</el-button>
      </template>
    </tzHeadline>
    <h1 class="head-title">基本信息</h1>
    <el-row :gutter="16" class="lh30">
      <el-col :span="6">
        <div class="d-flex">
          <span class="labelColor label80 flex-shrink-0">委外单号：</span>
          <tzToolTip :content="detail.supplyCode"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <span class="labelColor label80 flex-shrink-0">委外来源：</span>
        <span class="contentColor">生产</span>
      </el-col>
      <el-col :span="6">
        <span class="labelColor label80 flex-shrink-0">委外类型：</span>
        <span class="contentColor">工序委外</span>
      </el-col>
      <el-col :span="6">
        <div class="d-flex">
          <span class="labelColor label80 flex-shrink-0">委外工序：</span>
          <tzToolTip :content="detail.baseSeqName"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex">
          <span class="labelColor flex-shrink-0">负责人：</span>
          <tzToolTip :content="detail.managerStuff" :index="2"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex">
          <span class="labelColor flex-shrink-0">供应商：</span>
          <tzToolTip :content="detail.supplierName"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="16">
        <span class="labelColor label80 flex-shrink-0">备注：</span>
        <span class="contentColor wordWrap">{{detail.remark}}</span>
      </el-col>
    </el-row>
    <tzCommonFileUpload class="mt10" applicationType="detail" :fileList="fileList" />
    <div class="addPage">
      <div class="section-label">关联单据</div>
      <div class="order-list">
        <div class="order-item" v-for="(item, index) in relevanceDoc" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">生产单号：</span>
            <span class="order-item-detail">{{item.prodOrderCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.managerStuff}}</span>
          </div>
        </div>
      </div>
    </div>
    <h1 class="head-title">产品信息·工序委外</h1>
    <!-- :span-method="objectSpanMethod" -->
    <el-table
      size="medium"
      :data="materialList"
      border
      :span-method="objectSpanMethod"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column label="生产订单号" align="center">
        <template slot-scope="scope">
          <span class="yellow" @click="goProd(scope.row.prodOrderId)">{{scope.row.prodOrderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委外数量" align="center">
        <template slot-scope="scope">{{scope.row.supplyOrderQuantity || 0}}</template>
      </el-table-column>
      <el-table-column label="收回数量" align="center">
        <template slot-scope="scope">{{scope.row.recallQuantity || 0}}</template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">{{scope.row.unitPrice || 0}}</template>
      </el-table-column>
    </el-table>
    <h1 class="head-title">
      订单状态
      <el-button
        class="green pointer ml10"
        icon="el-icon-document"
        type="text"
        @click="recordVisible = true"
      >查看记录</el-button>
    </h1>
    <tzSteps2 :stepsList="dic.auditStatus" titleName="name" :activeVal="detail.status">
      <template v-slot:desc="slotProp">
        <div v-if="slotProp.step.type==='DRAFT'">
          <el-button
            v-if="detail.status === 'DRAFT'"
            round
            size="mini"
            @click="checkReview"
            class="tz-search-transparent mt10"
          >送审</el-button>
          <br />
          <el-button
            v-if="detail.status === 'DRAFT'"
            round
            size="mini"
            class="tz-search-transparent mt10"
            @click="delOrder"
          >删除订单</el-button>
        </div>
        <div v-else-if="slotProp.step.type==='SUBMIT'">
          <el-button
            v-if="detail.status === 'SUBMIT'"
            round
            size="mini"
            class="tz-search-transparent"
            @click="recallAudit"
          >撤销</el-button>
        </div>
        <div v-else-if="slotProp.step.type==='CLOSED'">
          <el-button
            v-if="detail.status === 'APPROVED'"
            round
            size="mini"
            class="tz-search-transparent"
            @click="closeOrder"
          >关闭订单</el-button>
          <el-button
            v-if="detail.status === 'CLOSED'"
            round
            size="mini"
            class="tz-search-transparent"
            @click="openOrder"
          >打开订单</el-button>
        </div>
      </template>
    </tzSteps2>
    <h1 class="head-title" v-if="detail.status === 'APPROVED' || detail.status === 'CLOSED'">收回状态</h1>
    <tzSteps2
      v-if="detail.status === 'CLOSED' || detail.status === 'APPROVED'"
      :stepsList="dic.completionStatus8"
      titleName="name"
      :activeVal="detail.pushStatus"
    />
    <h1 class="head-title" v-if="detail.status === 'CLOSED' || detail.status === 'APPROVED'">
      收回记录
      <el-button
        round
        size="mini"
        class="tz-search-submit-plain"
        @click="jumpPage"
        v-if="detail.status === 'APPROVED'"
      >添加收回</el-button>
    </h1>
    <section v-if="detail.status === 'CLOSED' || detail.status === 'APPROVED'">
      <section v-for="(item, i) in outsourceList" :key="i">
        <!-- 收回记录 -->
        <el-row class="header-line">
          <el-col :span="5">
            <div class="d-flex">
              <span style="color: #333" class="label80 font-bold flex-shrink-0">物料编码:</span>
              <tzToolTip :content="item.materialCode" :len="10"></tzToolTip>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="d-flex">
              <span style="color: #333" class="label80 font-bold flex-shrink-0">物料名称:</span>
              <tzToolTip :content="item.materialName" :len="10"></tzToolTip>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="d-flex">
              <span style="color: #333" class="label80 font-bold flex-shrink-0">物料规格:</span>
              <tzToolTip :content="item.spec" :len="10"></tzToolTip>
            </div>
          </el-col>
        </el-row>
        <el-table
          size="medium"
          :data="item.detailVoList || []"
          border
          height="300px"
          :header-cell-style="{'background-color': '#F9F9F9'}"
        >
          <el-table-column prop="prodOrderCode" label="生产订单号" align="center">
            <template slot-scope="scope">
              <span
                class="yellow"
                @click="goProd(scope.row.prodOrderId)"
              >{{scope.row.prodOrderCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplyOrderQuantity" label="委外数量" align="center" />
          <el-table-column prop="goodQuantity" label="良品数" align="center" />
          <el-table-column prop="discardQuantity" label="报废数" align="center" />
          <el-table-column prop="ngQuantity" label="不良品数" align="center" />
          <el-table-column prop="recallQuantity" label="本次收回数量" align="center" />
          <el-table-column label="不良原因" align="center" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <p v-for="(sub, i) in scope.row.ngVoList || []" :key="i">
                <span>{{sub.ngType}}:{{sub.ngQuantity}}({{sub.ngReason}})</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template>
              <span>{{item.unitName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="managerStuff" label="收回人" align="center" />
          <el-table-column label="收回时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.recallTime | momentTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="yellow" @click="delTakeBack(scope.row.prodOrderReportId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <section v-if="!outsourceList.length" class="noData">暂无数据</section>
    </section>
    <tzView
      :visible="recordVisible"
      @close="recordVisible = false"
      paramsType="SUPPLY_SEQ"
      :paramsCode="detail.supplyCode"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下单据已超出工序委外参考量"
      @submit="review"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column
            property="processDisplay"
            label="工艺路线"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            property="prodOrderCode"
            label="生产单号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
     <!-- 打印组件 -->
    <!-- <tzPrint
      :orders="[{ code: detail.supplyCode, id: detail.supplySeqId }]"
      :visible="printVisible"
      type="outsourceProcess"
      @cancle="closePrint"
    /> -->
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapState, mapActions } from 'vuex'
import dic from '../../../global/dictionary'
// import print from '../../../mixins/print'
import { spanMethod, rowspan } from '../../../utils/utils'

export default {
  name: 'outsourceProcessDetail',
  // mixins: [print],
  data () {
    // 这里存放数据
    return {
      dic,
      orderList: [],
      tipVisible: false,
      recordVisible: false,
      detail: {},
      fileList: [],
      materialList: [], // 物料数据
      relevanceDoc: [], // 关联订单
      spanArr: [],
      outsourceList: [] // 收入记录
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getDetail()
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({})
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    ...mapActions([
      'A_GET_OUTSOURCE_PROCESS_DETAIL',
      'POST_GLOBAL_AUDITOR',
      'POST_GLOBAL_RECALL_AUDIT',
      'A_GET_OUTSOURCE_PROCESS_DEL',
      'OUTSOURCE_PROCESS_LIST_CHECK_APPROVE',
      'A_GET_OUTSOURCE_PROCESS_CLOSE',
      'A_GET_OUTSOURCE_PROCESS_OPEN',
      'A_GET_OUTSOURCE_PROCESS_TAKE_BACK_DEL'
    ]),
    // 返回
    back () {
      const { type } = this.$route.query
      if (type && type === 'takeBack') {
        this.$router.push({ name: 'outsourceProcess' })
        return
      }
      this.$router.back()
    },
    // 删除收据哦
    delTakeBack (prodOrderReportId) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delTakeBackAction(prodOrderReportId)
        })
        .catch(() => {})
    },
    // 删除请求接口
    async delTakeBackAction (prodOrderReportId) {
      try {
        const { status } = await this.A_GET_OUTSOURCE_PROCESS_TAKE_BACK_DEL({
          prodOrderReportId
        })
        if (status === 0) {
          this.$message.success('删除成功')
          this.getDetail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 跳转销售订单
    goProd (id) {
      const arg = {
        name: 'prodDetail',
        params: { id }
      }
      this.$router.push(arg)
    },
    // 跳转对应的新增页面
    jumpPage () {
      const { id } = this.$route.params
      this.$router.push({
        name: 'takeBack',
        params: { id }
      })
    },
    // 送审前校验
    async checkReview () {
      try {
        const { supplySeqId } = this.detail
        const {
          status,
          data
        } = await this.OUTSOURCE_PROCESS_LIST_CHECK_APPROVE([supplySeqId])
        if (status === 0) {
          if (data && data.length > 0) {
            this.orderList = data
            this.tipVisible = true
          } else {
            this.review()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    async review () {
      try {
        this.tipVisible = false
        const { supplySeqId, supplyCode } = this.detail
        const arg = {
          targetId: supplySeqId,
          targetCode: supplyCode,
          targetType: 'SUPPLY_SEQ'
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.$message.success('送审成功')
          this.getDetail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 撤销审核
    async recallAudit () {
      try {
        const { id } = this.$route.params
        const arg = { targetType: 'SUPPLY_SEQ', targetId: id }
        const { status } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
        if (status === 0) {
          this.detail = { ...this.detail, status: 'DRAFT' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除订单
    delOrder () {
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delAction()
        })
        .catch(() => {})
    },
    // 删除请求接口
    async delAction () {
      try {
        const { id } = this.$route.params
        const { status } = await this.A_GET_OUTSOURCE_PROCESS_DEL({
          supplySeqId: id
        })
        if (status === 0) {
          this.$message.success('删除成功')
          this.$router.back()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 合并单元格
    objectSpanMethod ({ rowIndex, columnIndex }) {
      return spanMethod({ rowIndex, columnIndex }, this.spanArr, [
        0,
        1,
        2,
        3,
        4,
        8,
        9
      ])
    },
    delRecord (row) {
      const { prodOrderReportId, baseProcessId } = row
      this.$confirm('此操作将永久删除该次报工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.reportTaskDel(prodOrderReportId, baseProcessId)
        })
        .catch(() => {})
    },
    // 删除报工
    async reportTaskDel (prodOrderReportId, baseProcessId) {
      try {
        const { status } = await this.REPORT_TASK_DEL({
          prodOrderReportId,
          baseProcessId
        })
        if (status === 0) {
          this.M_SET_RELEVANCE_REPORT_TASK_LIST()
          this.M_SET_RELEVANCE_REPORT_TASK_LIST_TOTAL()
          this.getDetail()
          // this.getTableData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取详情数据
    async getDetail () {
      try {
        const { id } = this.$route.params
        const { status, data } = await this.A_GET_OUTSOURCE_PROCESS_DETAIL({
          supplySeqId: id
        })
        if (status === 0) {
          const {
            supplySeqMaterialList = [],
            prodSeqRelateProdVoList = [],
            baseFileDtoList = [],
            recallList = []
          } = data
          this.detail = data
          this.fileList = baseFileDtoList
          this.relevanceDoc = prodSeqRelateProdVoList
          this.materialList = supplySeqMaterialList
          this.outsourceList = recallList
          this.spanArr = rowspan(supplySeqMaterialList, 'baseMaterialId')
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭订单
    async closeOrder () {
      try {
        const { supplySeqId } = this.detail
        const { status } = await this.A_GET_OUTSOURCE_PROCESS_CLOSE({
          supplySeqId
        })
        if (status === 0) {
          this.detail = { ...this.detail, status: 'CLOSED' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 打开订单
    async openOrder () {
      try {
        const { supplySeqId } = this.detail
        const { status } = await this.A_GET_OUTSOURCE_PROCESS_OPEN({
          supplySeqId
        })
        if (status === 0) {
          this.detail = { ...this.detail, status: 'APPROVED' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 跳转修改
    goEdit () {
      const { id } = this.$route.params
      this.$router.push({
        name: 'outsourceProcessAdd',
        params: { type: 'edit' },
        query: { supplySeqId: id }
      })
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.sec-item {
  line-height: 14px;
  color: #444444;
  font-size: 14px;
  margin-bottom: 20px;
}
.header-line {
  background: #f0f2f5;
  padding: 8px;
}
.lh30 {
  line-height: 30px;
}
</style>
