<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="调拨详情" :isShowBack="true" backText="返回">
      <template slot="btn">
        <tzBtn icon="tz-icon-print" @click="openPrint">打印</tzBtn>
      </template>
    </tzHeadline>
    <!-- 基础信息 -->
    <el-row>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label100 flex-shrink-0">调拨单号：</div>
           <tzToolTip :content="getDetail.exchangeCode"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">调拨人员：</div>
           <tzToolTip :content="getDetail.managerStuff"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">调拨时间：</div>
           <tzToolTip :content="getDetail.createTime | momentTime"></tzToolTip>
        </div>
      </el-col>
    </el-row>
     <div class="d-flex mb20">
      <div class="labelColor" style="width:57px;">备注：</div>
      <div class="content wordWrap">{{getDetail.remark}}</div>
    </div>

    <!-- 产品信息 -->
    <div class="headTitle content">调拨内容</div>
    <el-table
      border
      :span-method="cellMerge"
      :data="stockExchangeMaterials"
      :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="outWarehouseName" label="所在仓库"></el-table-column>
      <el-table-column align="center" prop="outCode" label="出库单据"></el-table-column>
      <el-table-column align="center" prop="inWarehouseName" label="调拨仓库"></el-table-column>
      <el-table-column align="center" prop="inCode" label="入库单据"></el-table-column>
      <el-table-column align="center" prop="quantity" label="调拨数量"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <!-- <el-table-column align="center" prop="remark" label="备注" width="250">
        <template slot-scope="scope">
          {{scope.row.remark || '—'}}
        </template>
      </el-table-column> -->
    </el-table>
    <tzPrint
      :orders="[{ code: getDetail.exchangeCode, id: getDetail.stockExchangeId }]"
      :visible="printVisible"
      type="stock_exchange"
      @cancle="closePrint"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import print from '../../../mixins/print'

export default {
  name: 'allocationDetail',
  mixins: [print],
  data () {
    return {
      id: '',
      spanArr: [],
      getDetail: {},
      stockExchangeMaterials: []
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.id = id
    this.getAllocationDetail()
  },
  methods: {
    ...mapActions([
      'DETAIL_ALLOCATION'
    ]),
    // 获取客户详情
    async getAllocationDetail () {
      try {
        const { status, data } = await this.DETAIL_ALLOCATION({ id: this.id })
        if (status === 0) {
          this.getDetail = data
          this.chooseMaterial(data.stockExchangeMaterials)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 传递过来的物料
    chooseMaterial (materials) {
      this.stockExchangeMaterials = materials.map(item => ({
        ...item,
        remark: item.remark,
        quantity: item.quantity,
        inWarehouseName: item.inWareHouseName,
        outWarehouseName: item.outWareHouseName
      }))
      this.getSpanArr(this.stockExchangeMaterials)
    },
    getSpanArr (data) {
      for (let i = 0; i < data.length; i += 1) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else if (data[i].baseMaterialId === data[i - 1].baseMaterialId) {
          this.spanArr[this.pos] += 1
          this.spanArr.push(0)
        } else {
          this.spanArr.push(1)
          this.pos = i
        }
      }
    },
    cellMerge ({ rowIndex, columnIndex }) {
      if (columnIndex < 4) {
        const newRow = this.spanArr[rowIndex]
        const newCol = newRow > 0 ? 1 : 0
        return {
          rowspan: newRow,
          colspan: newCol
        }
      }
      return {
        rowspan: 1,
        colspan: 1
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
.detail .lists .item:last-child {
  width: 780px;
  word-break: break-all;
}
.content {
  margin-bottom: 20px;
}
</style>
