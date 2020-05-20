<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="盘点详情" :isShowBack="true" backText="返回">
      <template slot="btn">
        <tzBtn icon="tz-icon-print" @click="openPrint">打印</tzBtn>
      </template>
    </tzHeadline>
    <!-- 基础信息 -->
    <el-row>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label100 flex-shrink-0">盘点单号：</div>
           <tzToolTip :content="getDetail.takingCode"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">盘点人员：</div>
           <tzToolTip :content="getDetail.managerStuff"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex contentColor mb20">
          <div class="labelColor label80 flex-shrink-0">盘点时间：</div>
           <tzToolTip :content="getDetail.createTime | momentTime"></tzToolTip>
        </div>
      </el-col>
    </el-row>
     <div class="d-flex mb20">
      <div class="labelColor" style="width:57px;">备注：</div>
      <div class="content wordWrap">{{getDetail.remark}}</div>
    </div>
    <!-- 产品信息 -->
    <div class="headTitle" style="margin-bottom: 20px;">盘点内容</div>
    <el-table
      border
      :data="getDetail.stockTakingMaterials"
      :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="盘点前数量"></el-table-column>
      <el-table-column align="center" prop="takingQuantity" label="盘点实际数量">
        <template slot-scope="scope">
          {{scope.row.takingQuantity}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="result" label="盘点结果">
        <template slot-scope="scope">
          {{scope.row.result | filterDic(dics.inventoryResult)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
     <tzPrint
      :orders="[{ code: getDetail.takingCode, id: getDetail.stockTakingId }]"
      :visible="printVisible"
      type="stock_taking"
      @cancle="closePrint"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import dics from '../../../global/dictionary'
import print from '../../../mixins/print'

export default {
  name: 'inventoryDetail',
  mixins: [print],
  data () {
    return {
      dics,
      id: '',
      getDetail: {}
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.id = id
    this.getInventoryDetail()
  },
  methods: {
    ...mapActions([
      'DETAIL_INVENTORY_ORDER'
    ]),
    // 获取客户详情
    async getInventoryDetail () {
      try {
        const { status, data } = await this.DETAIL_INVENTORY_ORDER({ id: this.id })
        if (status === 0) {
          this.getDetail = data
        }
      } catch (e) {
        console.log(e)
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
.nowrap {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-bottom: 0!important;
  position: relative;
  top: 4px;
}
.detail .lists .item:last-child {
  width: 1040px;
}
</style>
