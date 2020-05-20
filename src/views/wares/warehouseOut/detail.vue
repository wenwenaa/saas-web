<template>
  <div>
    <tzHeadline :title="type | filterDic(dic.wareOutStatus,'type','order')" isShowBack>
      <template slot="btn">
        <el-button class="tz-search-submit" round size="medium" v-if="isShowPrint" @click="openPrint">打印</el-button>
      </template>
    </tzHeadline>
    <div class="section-title">基本信息</div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">出库单号：</div>
          <tzToolTip :content="detail.outCode"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">出库类型：</div>
          <tzToolTip :content="detail.outType| filterDic(dic.wareOutStatus,'type','name')"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">负责人：</div>
          <tzToolTip :content="detail.managerStuff"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20"
          v-if="type==='PURCHASE_RETURN'||type==='SUPPLY_MATERIAL'||type==='SUPPLY_RETURN'">
          <div class="labelColor label80 flex-shrink-0">供应商：</div>
          <tzToolTip :content="detail.baseSupplierName"></tzToolTip>
        </div>
        <div class="d-flex contentColor mb20" v-if="type==='SALE'||type==='OTHER_OUT'">
          <div class="labelColor label80 flex-shrink-0">客户：</div>
          <tzToolTip :content="detail.baseCustomerName"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label100 flex-shrink-0">出库仓库：</div>
          <tzToolTip :content="detail.baseWarehouseName"></tzToolTip>
        </div>
      </el-col>
    </el-row>
    <!-- <div class="d-flex ">
      <div class="d-flex sec-item">
        <div class="s-label">{{type|filterDic(dic.wareOutStatus,'type','name')}}单号：</div>
        <div>{{detail.outCode}}</div>
      </div>
      <div class="d-flex sec-item">
        <div class="s-label">出库类型：</div>
        <div>{{detail.outType| filterDic(dic.wareOutStatus,'type','name')}}</div>
      </div>
      <div class="d-flex sec-item">
        <div class="s-label">负责人：</div>
        <div>{{detail.managerStuff}}</div>
      </div>
      <div class="d-flex sec-item" v-if="type==='PURCHASE_RETURN'">
        <div class="s-label">供应商：</div>
        <div>{{detail.baseSupplierName}}</div>
      </div>
      <div class="d-flex sec-item" v-if="type==='SALE'||type==='OTHER_OUT'">
        <div class="s-label">客户：</div>
        <div>{{detail.baseCustomerName}}</div>
      </div>
      <div class="d-flex sec-item">
        <div class="s-label">出库仓库：</div>
        <div>{{detail.baseWarehouseName}}</div>
      </div>
    </div> -->
    <div class="d-flex">
      <div class="s-label" style="width:57px;">备注：</div>
      <div class="content wordWrap">{{detail.remark}}</div>
    </div>
    <tzCommonFileUpload :fileList="detail.fileList" style="margin-top:20px;" applicationType="detail">
    </tzCommonFileUpload>
    <div class="section-title">产品信息</div>
    <el-table :data="materialList" :span-method="objectSpanMethod" border
      style="width: 100%; margin-top: 20px;margin-bottom:20px;" :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left">
      </el-table-column>
      <!-- <el-table-column prop="typeName" label="物料类型" width="180" align="center" >
      </el-table-column> -->
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="质检情况" align="center" v-if="type!=='EXCHANGE_OUT'">
        <template slot-scope="scope">
          <div v-if="scope.row.outCheckFlag==='Y'&&scope.row.checkFlag==='N'" class="green">未质检</div>
          <div v-else>{{scope.row.outCheckFlag==='Y'?(scope.row.checkFlag==='Y'?'已质检':'未质检'):'无需质检'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="出库数量" width="220" align="center">
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column prop="refCode" :label="type|filterDic(dic.tipStatus,'type','name')" width="220" align="center"
        v-if="type!=='OTHER_OUT'&&type!=='EXCHANGE_OUT'">
        <template slot-scope="scope">
          <div class="yellow" @click="toOrderDetail(scope.row)">
            {{scope.row.refCode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="managerStuff" label="出库人" width="220" align="center">
         <template slot-scope="scope">
          {{scope.row.managerStuff || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="出库时间" align="center" :width="type==='EXCHANGE_OUT'?'':'180'">
        <template slot-scope="scope">
          {{scope.row.outTime  || '-'}}
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-between" style="width:500px;" v-if="detail.checkStatus!=='NOT'">
      <div class="d-flex">
        <div class="section-title">质检情况</div>
      </div>
      <div class="check-sec"><span class="sum">{{detail.checkMaterialList&&detail.checkMaterialList.length}}条</span>需要质检
      </div>
    </div>
    <tzSteps2 :stepsList="dic.qualityStatus2" titleName="name" :activeVal="detail.checkStatus"
      v-if="detail.checkStatus!=='NOT'"></tzSteps2>
    <div class="section-title">出库情况</div>
    <tzSteps2 :stepsList="dic.completionStatus6" titleName="name" :activeVal="detail.pushStatus"></tzSteps2>
    <div class="section-title" v-if="detail.checkStatus!=='NOT'">质检</div>
    <el-table :data="detail.checkMaterialList" border style="width: 100%; margin-top: 20px;margin-bottom:20px;"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="detail.checkStatus!=='NOT'">
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="检验数量" align="center">
        <template slot-scope="scope">
          {{scope.row.result==='U'?'-':scope.row.goodQuantity+scope.row.ngQuantity||0}}
        </template>
      </el-table-column>
      <el-table-column prop="goodQuantity" label="良品数" align="center">
        <template slot-scope="scope">
          {{scope.row.result==='U'?'-':scope.row.goodQuantity||0}}
        </template>
      </el-table-column>
      <el-table-column prop="ngQuantity" label="不良品数" align="center">
        <template slot-scope="scope">
          {{scope.row.result==='U'?'-':scope.row.ngQuantity||0}}
        </template>
      </el-table-column>
      <el-table-column label="不良原因" align="center" width="200">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top" v-if="scope.row.checkFormNgList">
            <div slot="content">
              <div class="d-flex" v-for="(item ,index) in scope.row.checkFormNgList" :key="index">
                <div>{{item.ngType}}:</div>
                <div>{{item.ngQuantity}}</div>
                <div>({{item.ngReason}})</div>
              </div>
            </div>
            <div class="ellipsis" style="width:200px;">
              {{scope.row.checkFormNgList[0].ngType}}：{{scope.row.checkFormNgList[0].ngQuantity}}({{scope.row.checkFormNgList[0].ngReason}})</div>
          </el-tooltip>
          <div v-else>{{'-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="质检结果" align="center">
        <template slot-scope="scope">
          <tzStatus :status="scope.row.result" :content="scope.row.result | filterDic(dic.qualityResult)" />
        </template>
      </el-table-column>
      <el-table-column prop="managerStuff" label="质检人" width="220" align="center">
        <template slot-scope="scope">
          {{scope.row.managerStuff||'-'}}
        </template>
      </el-table-column>
      <el-table-column label="质检时间" align="center">
        <template slot-scope="scope">
          {{scope.row.checkTime||'-' }}
        </template>
      </el-table-column>
      <el-table-column prop="formCode" label="质检单号" width="220" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="toCheckDetail(scope.row)">
            {{scope.row.formCode}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 打印组件 -->
    <tzPrint
      :orders="[{ code: detail.outCode, id: detail.storageOutId }]"
      :visible="printVisible"
      :type="orderType"
      @cancle="closePrint"
    />
  </div>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  import dic from '../../../global/dictionary'
  import * as urls from '../../../router/routePath'
  import {
    spanMethod,
    rowspan
  } from '../../../utils/utils'
  import print from '../../../mixins/print'

  export default {
    mixins: [print],
    data () {
      return {
        dic,
        fileList: [],
        spanArr: [],
        stockInId: '',
        tableData: [],
        type: '',
        materialList: []
      }
    },
    computed: {
      ...mapState({
        detail: state => state.ware.wareDetail
      }),
      isShowPrint () {
        const arr = ['EXCHANGE_OUT']
        return !arr.includes(this.detail.outType)
      },
      orderType () {
        return this.detail.outType === 'SALE' ? 'SALE_OUT' : this.detail.outType
      }
    },
    created () {
      this.storageOutId = this.$route.params.id
      this.type = this.$route.query.type
      document.title = this.dic.wareOutStatus.filter(item => item.type === this.type)[0].order
      this.getDetail()
    },
    methods: {
      ...mapActions(['A_GET_WARE_OUT_DETAIL']),
      toOrderDetail (row) {
        if (this.type === 'SALE') {
          this.$router.push({
            path: `${urls.SALE_DETAIL}/detail`,
            query: {
              id: row.refOrderId
            }
          })
        }
        if (this.type === 'PROD_MATERIAL') {
          this.$router.push({
            name: 'prodDetail',
            params: {
              id: row.refMaterialId
            }
          })
        }
        if (this.type === 'PURCHASE_RETURN') {
          this.$router.push({
            name: 'orderPersonalAdd',
            params: {
              type: row.refDetailType,
              page: 'order',
              id: row.refOrderId
            }
          })
        }
        if (this.type === 'SUPPLY_MATERIAL' || this.type === 'SUPPLY_RETURN') {
          this.$router.push({
            name: 'outsourceProductDetail',
            query: {
              id: row.refOrderId,
              type: row.refDetailType
            }
          })
        }
      },
      toCheckDetail (row) {
        if (!row.checkPlanId) {
          this.$message.error('该质检单未完成质检，无法查看详情')
          return
        }
        this.$router.push({
          name: 'checkListDetail',
          query: {
            type: 'detail',
            formType: 'OUT',
            checkFormId: row.checkFormId
          }
        })
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
          [1, 2, 3, 4, 5])
      },
      getDetail () {
        this.A_GET_WARE_OUT_DETAIL({
          storageOutId: this.storageOutId
        }).then((res) => {
          if (res.data) {
            this.materialList = res.data.materialList
            this.spanArr = rowspan(this.materialList, 'baseMaterialId')
          }
        })
      }
    }
  }

</script>

<style scoped>
  .sec-item {
    margin-right: 50px;
    line-height: 14px;
    color: #444444;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .s-label {
    color: #999999;
    font-size: 14px;
  }

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

  .reocrds img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .records-lis {
    font-size: 12px;
    color: #7CA870;
    line-height: 26px;
    margin-left: 30px;
  }

  .check-sec {
    line-height: 26px;
    font-size: 14px;
    color: #444444;
  }

  .sum {
    color: #E9A763;
  }

</style>
