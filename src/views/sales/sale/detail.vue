<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="销售订单详情" :isShowBack="true" backText="返回">
      <template slot="btn">
        <el-button class="tz-search-submit" round size="medium" @click="openPrint">打印</el-button>
        <el-button class="tz-btn-add" v-if="getDetail.status==='DRAFT'" round size="medium" @click="goTo">编辑</el-button>
      </template>
    </tzHeadline>
    <!-- 基础信息 -->
    <div class="detail">
      <div class="title">基本信息</div>
      <div class="lists">
        <div class="item">
          <div class="name">销售订单号：</div>
          <div class="tip">{{getDetail.saleCode}}</div>
        </div>
        <div class="item">
          <div class="name">客户订单号：</div>
          <div class="tip">{{getDetail.customerCode}}</div>
        </div>
        <el-tooltip effect="dark" :content="getDetail.baseCustomerName" placement="top">
          <div class="nowrap item">
            <div class="name">客户：</div>
            {{getDetail.baseCustomerName}}
          </div>
        </el-tooltip>
        <br />
        <div class="item">
          <div class="name">接单日期：</div>
          <div class="tip">{{getDetail.acceptDate}}</div>
        </div>
        <div class="item">
          <div class="name">销售人员：</div>
          <div class="tip">{{getDetail.salerStuff}}</div>
        </div>
        <br />
        <div class="item">
          <div class="name">备注：</div>
          <div class="tip wordWrap">{{getDetail.remark}}</div>
        </div>
      </div>
    </div>
    <!-- 图片和附件 -->
    <tzCommonFileUpload applicationType='detail' class="tzupload" v-if="getDetail.baseFileDtoList && getDetail.baseFileDtoList.length" :fileList="getDetail.baseFileDtoList" />
    <!-- 订单状态 -->
    <div class="head orderState" style="margin-bottom: 20px;">
      <div class="headTitle">订单状态</div>
      <tzBtn icon="tz-icon-view" cls="blue" @click="viewRecord">查看记录</tzBtn>
    </div>
    <tzView :visible="visible"  @close="close" :paramsCode="paramsCode" paramsType="SALE" />
    <tzSteps2 :stepsList="dic.auditStatus" titleName="name" :activeVal="getDetail.status">
      <template v-slot:desc="slotProp">
        <div v-if="slotProp.step.type==='DRAFT'">
          <el-button
            v-if="getDetail.status === 'DRAFT'"
            round
            size="mini"
            @click="checkReview"
            class="tz-search-transparent mt8"
          >送审</el-button>
          <br />
          <el-button
            v-if="getDetail.status === 'DRAFT'"
            round
            size="mini"
            class="tz-search-transparent mt8"
            @click="comfirmSalesDel"
          >删除订单</el-button>
        </div>
        <div v-else-if="slotProp.step.type==='SUBMIT'">
          <el-button
            v-if="getDetail.status === 'SUBMIT'"
            round
            size="mini"
            class="tz-search-transparent mt8"
            @click="recallAudit"
          >撤销</el-button>
        </div>
        <div v-else-if="slotProp.step.type==='CLOSED'">
          <el-button
            v-if="getDetail.status === 'APPROVED'"
            round
            size="mini"
            class="tz-search-transparent mt8"
            @click="closeOrder"
          >关闭订单</el-button>
          <el-button
            v-if="getDetail.status === 'CLOSED'"
            round
            size="mini"
            class="tz-search-transparent mt8"
            @click="openOrder"
          >打开订单</el-button>
        </div>
      </template>
    </tzSteps2>
    <!-- 发货状态 -->
    <div class="head" style="margin-bottom: 20px;">
      <div class="headTitle">发货状态</div>
    </div>
    <tzSteps2 titleName="name" :stepsList="dic.completionStatus4" :activeVal="getDetail.pushStatus" />

    <!-- 产品信息 -->
    <div class="headTitle" style="margin-bottom: 21px;">产品信息</div>
    <el-table
      border
      :data="getDetail.saleOrderMaterialDtoList"
      :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" type="index" width="46"></el-table-column>
      <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="picNum" label="物料图号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="customerMaterialCode" label="客户料号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="unitPrice" label="含税单价"></el-table-column>
      <el-table-column align="center" prop="materialStock" label="库存数量">
        <template slot-scope="scope">
          {{scope.row.materialStock}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="quantity" label="订单数量">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sendDate" label="交期">
        <template slot-scope="scope">
          {{scope.row.sendDate | momentTime('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deliveryQuantity" label="已出库">
        <template slot-scope="scope">
          {{scope.row.deliveryQuantity}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="returnQuantity" label="退货数量">
        <template slot-scope="scope">
          {{scope.row.returnQuantity}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="tableBottom allPrice">
      <div class="green">合计：{{allPrice}}元</div>
    </div>

    <!-- 关联单据 -->
    <div class="headTitle" style="margin-bottom: 21px;margin-top: 41px;">关联单据</div>
    <div class="relation">
      <div :class="{item: true, current : currentIndex === index }" @click="changeTabs(item.type, index)" v-for="(item, index) in relationTitles" :key="item.id">{{item.name}}</div>
    </div>
    <el-table
      border
      :data="tableData"
      :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" prop="orderNumber" label="单号" width="180">
        <template slot-scope="scope">
          <div class="yellow" @click="go(scope.row)">{{scope.row.orderNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialSpec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialPicNum" label="物料图号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="计划数量"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="originator" label="发起人"></el-table-column>
      <el-table-column align="center" prop="operateTime" label="操作时间">
        <template slot-scope="scope">
          {{scope.row.operateTime | momentTime}}
        </template>
      </el-table-column>
      <!-- 出库单和退货单不显示 -->
      <el-table-column align="center" prop="status" label="审核状态" v-if="contain.includes(currentIndex)">
        <template slot-scope="scope">
          {{scope.row.status | filterDic(dic.auditStatus)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="pushStatus" label="状态">
        <template slot-scope="scope">
          <div v-if="currentIndex === 1">
            <!-- 出库 -->
            <div v-if="scope.row.inOutCheckFlag === 'Y' && scope.row.checkFlag === 'N'">未质检</div>
            <div v-else>{{scope.row.inOutFlag | filterDic(dic.outRelation)}}</div>
          </div>
          <div v-if="currentIndex === 2">
            <!-- 退货 -->
            <div v-if="scope.row.inOutCheckFlag === 'Y' && scope.row.checkFlag === 'N'">未质检</div>
            <div v-else>{{scope.row.inOutFlag | filterDic(dic.inRelation)}}</div>
          </div>
          <div v-else-if="currentIndex === 4">
            <!-- 采购申请 -->
            {{scope.row.pushStatus | filterDic(dic.completionStatus3)}}
          </div>
          <div v-else-if="currentIndex === 5">
            <!-- 采购订单 -->
            {{scope.row.pushStatus | filterDic(dic.completionStatus1)}}
          </div>
          <div v-else>
            <!-- 生产订单 -->
            {{scope.row.pushStatus | filterDic(dic.completionStatus1)}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="tableBottom pages">
      <el-pagination
        :page-size="5"
        :current-page="formData.pageIndex"
        @current-change="changePage"
        layout="prev, pager, next"
        :total="tableTotal">
      </el-pagination>
    </div>
    <!-- 打印组件 -->
    <tzPrint
      :orders="[{ code: getDetail.saleCode, id: id }]"
      :visible="printVisible"
      type="sale"
      @cancle="closePrint"
    />
  </div>
</template>
<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import dic from '../../../global/dictionary'
import print from '../../../mixins/print'
import * as urls from '../../../router/routePath'

export default {
  name: 'saleDetail',
  mixins: [print],
  data () {
    return {
      dic,
      id: '',
      allPrice: 0,
      paramsCode: '',
      pageSize: 5,
      pageIndex: 1,
      tableData: [],
      visible: false,
      stepsList: dic.auditStatus,
      getDetail: {},
      tableTotal: 0,
      currentIndex: 0,
      relationTitles: [
        {
          id: 1,
          type: 'product',
          name: '生产订单'
        }, {
          id: 2,
          type: 'outStock',
          name: '出库单'
        }, {
          id: 3,
          type: 'returnGoods',
          name: '退货单'
        }, {
          id: 4,
          type: 'outsourcing',
          name: '委外订单'
        }, {
          id: 5,
          type: 'apply',
          name: '采购申请'
        }, {
          id: 6,
          type: 'purchase',
          name: '采购订单'
        }
      ],
      contain: [0, 3, 4, 5],
      formData: {
        type: '',
        id: '',
        pageSize: 5,
        pageIndex: 1
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.id = id
    this.formData.id = id
    this.getCustomerDetail()
    this.changeTabs('product', 0)
  },
  methods: {
    ...mapActions([
      'OPEN_SALES_LIST',
      'CLOSE_SALES_LIST',
      'DEL_SALES_lIST',
      'DETAIL_SALES_ORDER',
      'GET_RELATION_lIST',
      'POST_GLOBAL_AUDITOR',
      'POST_GLOBAL_RECALL_AUDIT'
    ]),
    // 获取客户详情
    async getCustomerDetail () {
      try {
        const { status, data } = await this.DETAIL_SALES_ORDER({ id: this.id })
        if (status === 0) {
          this.getDetail = {
            ...data,
            acceptDate: data.acceptDate && moment(data.acceptDate).format('YYYY-MM-DD')
          }
          this.paramsCode = this.getDetail.saleCode
          this.getDetail.saleOrderMaterialDtoList.forEach((item) => {
            this.allPrice += Number(item.quantity) * Number(item.unitPrice)
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入页面
    customerAdd () {
      this.$router.push({
        path: urls.BASE_CUSTOMER_ADD,
        query: {
          type: 'detail',
          id: this.id
        }
      })
    },
    changeTabs (type, index) {
      this.formData.pageIndex = 1
      this.formData.type = type
      this.currentIndex = index
      this.getBillList()
    },
    changePage (e) {
      this.formData.pageIndex = e
      this.getBillList()
    },
    // 关联单据
    async getBillList () {
      try {
        const { data, status } = await this.GET_RELATION_lIST(this.formData)
        if (status === 0) {
          this.tableData = data.records
          this.tableTotal = data.total
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    async checkReview () {
      try {
        const { saleOrderId, saleCode } = this.getDetail
        const arg = {
          targetId: saleOrderId,
          targetCode: saleCode,
          targetType: 'SALE'
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.$message.success('送审成功')
          this.getCustomerDetail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 撤销审核
    async recallAudit () {
      try {
        const { id } = this.$route.query
        const arg = { targetType: 'SALE', targetId: id }
        const { status } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
        if (status === 0) {
          this.$message.success('撤销成功')
          this.getDetail = { ...this.getDetail, status: 'DRAFT' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 确认删除销售订单
    async comfirmSalesDel () {
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.salesDel()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除销售订单
    async salesDel (saleOrderId) {
      try {
        const { status } = await this.DEL_SALES_lIST({ saleOrderId: this.getDetail.saleOrderId })
        if (status === 0) {
          this.$message.success('删除成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭订单
    async closeOrder () {
      try {
        const { status } = await this.CLOSE_SALES_LIST({ saleOrderId: this.getDetail.saleOrderId })
        if (status === 0) {
          this.$message.success('关闭订单成功')
          this.getCustomerDetail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 打开订单
    async openOrder () {
      try {
        const { status } = await this.OPEN_SALES_LIST({ saleOrderId: this.getDetail.saleOrderId })
        if (status === 0) {
          this.$message.success('打开订单成功')
          this.getCustomerDetail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    goTo (type, id = '') {
      this.$router.push({
        path: `${urls.SALE_ADD}/edit`,
        query: {
          id: this.id
        }
      })
    },
    viewRecord () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    // 跳转页面
    go (data) {
      const index = this.currentIndex
      switch (index) {
        case 0:
          this.$router.push({
            name: 'prodDetail',
            params: { id: data.orderId }
          })
          break
        case 1:
          this.$router.push({
            name: 'warehouseOutDetail',
            params: {
              id: data.orderId
            },
            query: {
              type: data.inOutType
            }
          })
          break
        case 2:
          this.$router.push({
            name: 'warehouseInDetail',
            params: {
              id: data.orderId
            },
            query: {
              type: data.inOutType
            }
          })
          break
        case 3:
          this.$router.push({
            name: 'outsourceProductDetail',
            query: {
              id: data.orderId,
              type: 'SALE'
            }
          })
          break
        case 4:
          this.$router.push({
            name: 'applyFinishedAdd',
            params: {
              type: 'detail', page: 'finished', id: data.orderId
            }
          })
          break
        case 5:
          this.$router.push({
            name: 'orderPersonalAdd',
            params: {
              type: data.applyType,
              page: 'order',
              id: data.orderId
            }
          })
          break
        default:
      }
    }
  }
}
</script>
<style lang="less" scoped>
.detail .title {
  width: 72px;
  height: 18px;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  margin-bottom: 20px;
  color: rgba(40, 40, 40, 1);
  font-family: PingFangSC-Medium, PingFang SC;
}
.detail .lists {
  display: inline-block;
}
.detail .lists .item {
  width: 260px;
  align-items: center;
  margin-bottom: 20px;
  display: inline-block;
}
.detail .lists .item .name,.detail .lists .item .tip {
  height:20px;
  font-size:14px;
  font-weight:400;
  color: #999999;
  line-height:20px;
  display: inline-block;
  color:rgba(153,153,153,1);
  font-family:PingFangSC-Regular,PingFang SC;
}
.detail .lists .item .tip {
  color: #444444;
  word-break: break-all;
}
.detail .lists .item:last-child {
  width: 780px;
}
.relation {
  padding: 2px;
  background: #F0F2F5;
  display: inline-block;
}
.relation .item {
  width: 86px;
  height: 32px;
  color: #303133;
  font-size: 14px;
  line-height: 32px;
  margin-right: 2px;
  text-align: center;
  display: inline-block;
}
.relation .item:last-child {
  margin-right: 0;
}
.relation .current {
  color: #7CA870;
  background: #FFFFFF;
}
.mt8 {
  margin-bottom: 8px;
}
.tableBottom {
  width: 100%;
  height: 40px;
  border-top: none;
  line-height: 40px;
  box-sizing: border-box;
  border: 1px solid#ebeef5;
}
.pages {
  display: flex;
  padding-top: 4px;
  justify-content: flex-end;
}
.orderState {
  display: flex;
  align-items: center;
}
.allPrice {
  padding-left: 15px;
  color: #7CA870;
}
.nowrap {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-bottom: 0!important;
}
</style>
