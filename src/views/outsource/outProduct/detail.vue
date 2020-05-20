<template>
  <div class="addPage">
    <tzHeadline :title="type | filterDic(dic.outSourceTypes,'type','detail')" :isShowBack="isShowBack">
      <template slot="btn">
        <div>
          <el-button class="tz-search-submit" round size="medium" @click="openPrint">打印</el-button>
          <el-button round size="medium" class="tz-btn-add" @click="editBtn()" v-if="detailObj.status==='DRAFT'">编辑
          </el-button>
          <el-button round size="medium" class="tz-search-submit tz-btn-add" @click="approveBtn"
            v-if="detailObj.status==='DRAFT'">送审</el-button>
        </div>
      </template>
    </tzHeadline>
    <div class="section-title">基本信息</div>
    <el-row>
      <el-col :span="4">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">委外单号：</div>
          <tzToolTip :content="detailObj.supplyCode"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">委外来源：</div>
          <tzToolTip :content="detailObj.supplyType| filterDic(dic.outSourceTypes,'type','origin')"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">委外类型：</div>
          <tzToolTip :content="detailObj.supplyType| filterDic(dic.outSourceTypes,'type','typeName')"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">负责人：</div>
          <tzToolTip :content="detailObj.managerStuff"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">供应商：</div>
          <tzToolTip :content="detailObj.supplierName"></tzToolTip>
        </div>
      </el-col>
    </el-row>
    <div class="d-flex">
      <div class="labelColor" style="width:57px;">备注：</div>
      <div class="content wordWrap">{{detailObj.remark}}</div>
    </div>
    <tzCommonFileUpload :fileList="detailObj.baseFileDtoList" style="margin-top:20px;"
      v-if="detailObj.baseFileDtoList&&detailObj.baseFileDtoList.length" applicationType="detail" />
    <div class="section2 mt20" v-if="type==='SALE'">
      <div class="section-label">关联单据</div>
      <div class="order-list">
        <div class="order-item" v-for="(item,index) in detailObj.supplyOrderTop" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">销售订单号：</span>
            <span class="order-item-detailObj">{{item.saleCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detailObj">{{item.createBy}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section-title" style="margin-top:20px;" v-if="type==='NONE'">产品信息</div>
    <el-table :data="materialList" border style="width: 100%; margin-top: 20px;margin-bottom:20px;"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="type==='NONE'">
      <el-table-column prop="typeName" label="物料类型" align="center"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplyOrderQuantity" label="委外数量" align="center"></el-table-column>
      <el-table-column prop="unitPrice" label="委外单价" align="center"></el-table-column>
      <el-table-column prop="stockInQuantity" label="入库数量" width="220" align="center"></el-table-column>
      <el-table-column prop="returnQuantity" label="退货数量" width="180" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
    </el-table>
    <!-- 销售委外成品--产品信息 -->
    <div class="section-label" v-if="type==='SALE'">
      <span class="lf-title">产品信息·汇总</span>
    </div>
    <el-table :data="materialList" border style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="type==='SALE'">
      <el-table-column prop="typeName" label="物料类型" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplyOrderQuantity" label="委外数量" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="委外单价" align="center"></el-table-column>
      <el-table-column prop="stockInQuantity" label="入库数量" align="center">
        <template slot-scope="scope">{{scope.row.stockInQuantity||0}}</template>
      </el-table-column>
      <el-table-column prop="returnQuantity" label="退货数量" align="center">
        <template slot-scope="scope">{{scope.row.returnQuantity||0}}</template>
      </el-table-column>
    </el-table>
    <div class="section-label mt20" v-if="type==='SALE'">
      <span class="lf-title">产品信息·明细</span>
    </div>
    <el-table :data="recordDetail" border style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="type==='SALE'" :span-method="objectSpanMethod">
      <el-table-column prop="typeName" label="物料类型" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unitPrice" label="委外单价" align="center"></el-table-column>
      <el-table-column prop="quantity" label="委外数量" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column prop="saleOrderQuantity" label="订单数量" align="center"></el-table-column>
      <el-table-column prop="saleCode" label="销售订单号" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="step-box mt20">
      <p class="mb10">
        <span class="f18 mr50" style="font-weight:bold;color: #282828;">订单状态</span>
        <tzBtn icon="tz-icon-view" cls="blue" @click="dialogVisible = true">查看记录</tzBtn>
      </p>
      <tzSteps2 :stepsList="dic.auditStatus" titleName="name" :activeVal="detailObj.status">
        <template v-slot:desc="slotProp">
          <div v-if="slotProp.step.type==='DRAFT'" class="desc-item">
            <el-button round size="mini" class="tz-search-transparent mt10 d-block" v-if="detailObj.status === 'DRAFT'"
              @click="approveBtn">送审</el-button>
            <el-button round size="mini" class="tz-search-transparent mt10 d-block" style="margin-left:0;"
              v-if="detailObj.status === 'DRAFT'" @click="delAuditBtn">删除订单</el-button>
          </div>
          <div v-else-if="slotProp.step.type==='SUBMIT'" class="desc-item">
            <el-button v-if="detailObj.status === 'SUBMIT'" round size="mini" @click="recallAudit"
              class="tz-search-transparent mt10">撤销</el-button>
          </div>
          <div v-else-if="slotProp.step.type==='CLOSED'" class="desc-item">
            <el-button v-if="detailObj.status === 'APPROVED'" round size="mini" class="tz-search-transparent mt10"
              @click="setClose(detailObj.supplyOrderId)">关闭订单</el-button>
            <el-button v-if="detailObj.status === 'CLOSED'" round size="mini" class="tz-search-transparent mt10"
              @click="setOpen(detailObj.supplyOrderId)">打开订单</el-button>
          </div>
        </template>
      </tzSteps2>
    </div>
    <div class="section-title mt20" v-if="detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED'">入库状态</div>
    <tzSteps2 :stepsList="dic.completionStatus1" titleName="name" :activeVal="detailObj.pushStatus"
      v-if="detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED'"></tzSteps2>
    <div class="section-title" v-if="detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED'">订单进度</div>
    <div class="relation" v-if="detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED'">
      <div class="pointer" :class="{item: true, current : currentIndex === index }"
        @click="changeTabs(item.type, index)" v-for="(item, index) in relationTitles" :key="item.id">{{item.name}}</div>
    </div>
    <el-table border :data="tableData" :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="currentIndex===0&&(detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED')">
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="发料数量"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="createBy" label="操作人">
        <template slot-scope="scope">
           {{scope.row.createBy}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="操作时间">
        <template slot-scope="scope">{{scope.row.createTime | momentTime}}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="完成状态">
        <template slot-scope="scope">
          <tzStatus :status="scope.row.status" :content="scope.row.status | filterDic(dic.completionStatus6)">
          </tzStatus>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="出库单号">
        <template slot-scope="scope">
          <span class="yellow" @click="toDetail(scope.row,currentIndex)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table border :data="tableData" :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="currentIndex===1&&(detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED')">
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="入库数量"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="createBy" label="操作人">
        <template slot-scope="scope">
           {{scope.row.createBy}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="操作时间">
        <template slot-scope="scope">{{scope.row.createTime | momentTime}}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="完成状态">
        <template slot-scope="scope">
          <tzStatus :status="scope.row.status" :content="scope.row.status | filterDic(dic.completionStatus1)">
          </tzStatus>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="入库单号">
        <template slot-scope="scope">
          <span class="yellow" @click="toDetail(scope.row,currentIndex)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table border :data="tableData" :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="currentIndex===2 && (detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED')">
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="退货数量"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="warehouseName" label="出库仓库"></el-table-column>
      <el-table-column align="center" prop="createBy" label="出库人">
        <template slot-scope="scope">
           {{scope.row.createBy}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="出库时间">
        <template slot-scope="scope">{{scope.row.createTime | momentTime}}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="完成状态">
        <template slot-scope="scope">
          <tzStatus :status="scope.row.status" :content="scope.row.status | filterDic(dic.completionStatus6)">
          </tzStatus>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="出库单号">
        <template slot-scope="scope">
          <span class="yellow" @click="toDetail(scope.row,currentIndex)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="fr mt10" v-if="detailObj.status === 'APPROVED' || detailObj.status === 'CLOSED'">
      <el-pagination layout="prev, pager, next" :total="total" :size="pageSize" @current-change="currentChange">
      </el-pagination>
    </div>
    <!-- 查看操作记录 -->
    <tzView :visible="dialogVisible" @close="dialogVisible = false" paramsType="SUPPLY"
      :paramsCode="detailObj.supplyCode" />
    <tzTipDialog :visible="tipVisible" :singleBtn="singleBtn" @close="tipVisible = false" @submit="dialogSubmit">
      <template v-slot:tipTitle>您提交的订单中，以下单据已超出委外参考量</template>
      <template v-slot:tipTable>
        <el-table size="mini" border :header-cell-style="{'background-color': '#F9F9F9'}" :data="orderList">
          <el-table-column property="materialName" label="物料名称" align="center"></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
     <!-- 打印组件 -->
    <tzPrint
      :orders="[{ code: detailObj.supplyCode, id: detailObj.supplyOrderId }]"
      :visible="printVisible"
      type="SupplyOrder"
      @cancle="closePrint"
    />
  </div>
</template>

<script>
  import {
    mapActions
  } from 'vuex'
  import dic from '../../../global/dictionary'
  import {
    spanMethod,
    rowspan
  } from '../../../utils/utils'
    import print from '../../../mixins/print'

  export default {
    name: 'outsourceProductDetail',
    mixins: [print],
    data () {
      return {
        dic,
        isShowBack: true,
        dialogVisible: false,
        currentIndex: 0,
        spanArr: [],
        supplyId: '',
        tableData: [],
        type: '',
        materialList: [],
        detailObj: {
          status: 'DRAFT'
        },
        relationTitles: [{
            id: 1,
            type: 'supplyMaterial',
            name: '发料'
          },
          {
            id: 2,
            type: 'supply',
            name: '入库'
          },
          {
            id: 3,
            type: 'supplyReturn',
            name: '退货'
          }
        ],
        recordDetail: [],
        tipVisible: false,
        singleBtn: false,
        orderList: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    },
    created () {
      this.supplyId = this.$route.query.id
      this.type = this.$route.query.type
      document.title = this.dic.outSourceTypes.filter(
        item => item.type === this.type
      )[0].detail
      this.getDetail()
    },
    methods: {
      ...mapActions([
        'A_GET_OUT_PRODUCT_ORDER_DETAIL',
        'A_GET_CHANGE_OPEN',
        'A_GET_CHANGE_CLOSE',
        'POST_GLOBAL_RECALL_AUDIT',
        'POST_GLOBAL_AUDITOR',
        'A_DEL_OUT_PRODUCT_ORDER',
        'A_CHECK_OUT_PRODUCT_ORDER_LIST',
        'A_GET_ORDER_PLAN'
      ]),
      toDetail (row, currentIndex) {
        if (currentIndex === 0) {
          this.$router.push({
            name: 'warehouseOutDetail',
            params: {
              id: row.id
            },
            query: {
              type: 'SUPPLY_MATERIAL'
            }
          })
        }
        if (currentIndex === 1) {
          this.$router.push({
            name: 'warehouseInDetail',
            params: {
              id: row.id
            },
            query: {
              type: 'SUPPLY'
            }
          })
        }
        if (currentIndex === 2) {
          this.$router.push({
            name: 'warehouseOutDetail',
            params: {
              id: row.id
            },
            query: {
              type: 'SUPPLY_RETURN'
            }
          })
        }
      },
      dialogSubmit () {
        this.tipVisible = false
        this.sendCheck()
      },
      currentChange (val) {
        this.pageIndex = val
      },
      async getOrderPlan (type) {
        const params = {
          supplyCode: this.detailObj.supplyCode,
          type,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        const {
          status,
          data
        } = await this.A_GET_ORDER_PLAN(params)
        if (status === 0) {
          this.tableData = data.records
        }
      },
      // 删除订单
      delAuditBtn () {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示')
          .then(async (res) => {
            if (res === 'confirm') {
              const {
                status
              } = await this.A_DEL_OUT_PRODUCT_ORDER({
                id: this.detailObj.supplyOrderId
              })
              if (status === 0) {
                this.$router.push({
                  name: 'outsourceProduct'
                })
              }
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 撤销审核
      async recallAudit () {
        const arg = {
          targetType: 'SUPPLY',
          targetId: this.detailObj.supplyOrderId
        }
        const {
          status
        } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
        if (status === 0) {
          this.detailObj = {
            ...this.detailObj,
            status: 'DRAFT'
          }
        }
      },
      // 送审
      async approveBtn () {
        if (this.detailObj.supplyType === 'SALE') {
          this.approveCheck()
        } else {
          this.sendCheck()
        }
      },
      async sendCheck () {
        const {
          status
        } = await this.POST_GLOBAL_AUDITOR([{
          targetId: this.detailObj.supplyOrderId,
          targetCode: this.detailObj.supplyCode,
          targetType: 'SUPPLY'
        }])
        if (status === 0) {
          this.getDetail()
        }
      },
      async approveCheck () {
        const {
          status,
          data
        } = await this.A_CHECK_OUT_PRODUCT_ORDER_LIST([
          this.detailObj.supplyOrderId
        ])
        if (status === 0) {
          if (data.length) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.sendCheck()
          }
        }
      },
      async setClose (id) {
        const {
          status
        } = await this.A_GET_CHANGE_CLOSE({
          id
        })
        if (status === 0) {
          this.$message.success('订单已关闭')
          this.detailObj.status = 'CLOSED'
        }
      },
      async setOpen (id) {
        const {
          status
        } = await this.A_GET_CHANGE_OPEN({
          id
        })
        if (status === 0) {
          this.$message.success('订单已打开')
          this.detailObj.status = 'APPROVED'
        }
      },
      editBtn () {
        this.$router.push({
          name: 'outsourceProductAdd',
          query: {
            supplyId: this.detailObj.supplyOrderId,
            pageType: 'edit',
            type: this.detailObj.supplyType
          }
        })
      },
      // 跳转销售列表
      goSale (id) {
        this.$router.push({
          path: '/sale/detail/detail',
          query: {
            id
          }
        })
      },
      changeTabs (type, index) {
        this.currentIndex = index
        this.getOrderPlan(type)
      },
      objectSpanMethod ({
        rowIndex,
        columnIndex
      }) {
        return spanMethod({
            rowIndex,
            columnIndex
          },
          this.spanArr,
          [0, 1, 2, 3, 4, 5])
      },
      getDetail () {
        this.A_GET_OUT_PRODUCT_ORDER_DETAIL({
          id: this.supplyId
        }).then((res) => {
          if (res.data) {
            this.detailObj = res.data
            this.materialList = res.data.supplyOrderMaterial
            this.recordDetail = res.data.supplyOrderSalesMaterial
            this.spanArr = rowspan(this.recordDetail, 'baseMaterialId')
            this.getOrderPlan('supplyMaterial')
          }
        })
      }
    }
  }

</script>

<style scoped>
  .section-title {
    color: #282828;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .content {
    color: #444444;
    font-size: 14px;
  }

  .second-title {
    font-size: 16px;
    color: #444444;
    margin-top: 20px;
  }

  .records img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .records-lis {
    font-size: 12px;
    color: #7ca870;
    line-height: 26px;
    margin-left: 30px;
  }

  .check-sec {
    line-height: 26px;
    font-size: 14px;
    color: #444444;
  }

  .sum {
    color: #e9a763;
  }

  .relation {
    padding: 2px;
    background: #f0f2f5;
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

  .relation .item:hover {
    color: #7ca870;
    background: #ffffff;
  }

  .relation .item:last-child {
    margin-right: 0;
  }

  .relation .current {
    color: #7ca870;
    background: #ffffff;
  }

  .section-label {
    font-size: 18px;
    color: #282828;
    font-weight: bold;
  }

</style>
