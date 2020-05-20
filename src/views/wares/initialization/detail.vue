<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="库存详情" :isShowBack="true" backText="返回">
      <template slot="btn"></template>
    </tzHeadline>
    <!-- 物料合计 -->
    <div class="headTitle" style="margin-bottom: 20px;">物料合计</div>
    <el-table border :data="getDetail" :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="safetyStock" label="安全库存"></el-table-column>
      <el-table-column align="center" prop="stockQuantity" label="当前仓库库存">
        <template slot-scope="scope">{{scope.row.stockQuantity}}</template>
      </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
    </el-table>
    <div style="margin-top: 20px;"></div>

    <!-- 出入库记录 -->
    <div class="headTitle records" style="margin-bottom: 20px;margin-top: 20px;">
      <div>出入库记录</div>
    </div>
    <el-table border :data="getReportList" :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" prop="inOutCode" label="单号"></el-table-column>
      <el-table-column align="center" prop="inOutType" label="类型">
        <template
          slot-scope="scope"
        >{{scope.row.inOutType | filterDic(dic.wareInStatus,'type','name')}}{{scope.row.inOutType | filterDic(dic.wareOutStatus,'type','name')}}</template>
      </el-table-column>
      <el-table-column align="center" prop="quantity" label="数量"></el-table-column>
      <el-table-column align="center" prop="warehouseName" label="仓库"></el-table-column>
      <el-table-column align="center" prop="warehouseQuantity" label="变动后数量">
        <template slot-scope="scope">{{scope.row.warehouseQuantity}}</template>
      </el-table-column>
      <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.remark || '——'}}</template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="操作时间">
        <template slot-scope="scope">{{scope.row.createTime | momentTime}}</template>
      </el-table-column>
      <el-table-column align="center" prop="takingQuantity" label="操作">
        <template slot-scope="scope">
          <div class="yellow" @click="goInOut(scope.row)">查看</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages">
      <el-pagination
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="changePage"
        layout="prev, pager, next"
        :total="tableTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import dic from '../../../global/dictionary'
import * as urls from '../../../router/routePath'

export default {
  name: 'init',
  data () {
    return {
      dic,
      id: '',
      pageIndex: 1,
      pageSize: 10,
      getDetail: [],
      warehouseId: '',
      getReportList: [],
      tableTotal: 0
    }
  },
  mounted () {
    const { id, baseMaterialId } = this.$route.query
    this.id = id
    this.baseMaterialId = baseMaterialId
    this.getReportDetail()
    this.getReportRecord()
  },
  computed: {
  },
  methods: {
    ...mapActions([
      'GET_WAREHOUSE_DETAIL',
      'GET_RECORD_PAGES'
    ]),
    // 获取库存详情
    async getReportDetail () {
      try {
        const { status, data } = await this.GET_WAREHOUSE_DETAIL({ id: this.id })
        if (status === 0) {
          this.getDetail = [data]
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取出入库记录
    async getReportRecord () {
      try {
        const arg = {
          warehouseId: this.warehouseId,
          materialId: this.baseMaterialId,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }
        const { status, data } = await this.GET_RECORD_PAGES(arg)
        if (status === 0) {
          this.getReportList = data.records
          this.tableTotal = data.total
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入调拨详情
    goTo (type, id = '') {
      this.$router.push({
        path: `${urls.ALLOCATION_DETAIL}/${type}`,
        query: { id }
      })
    },
    goInOut (item) {
      const name = item.hisType === 'IN' ? 'warehouseInDetail' : 'warehouseOutDetail'
      this.$router.push({
        name,
        params: {
          id: item.inOutId
        },
        query: {
          type: item.inOutType
        }
      })
    },
    changePage (e) {
      this.pageIndex = e
      this.getReportRecord()
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
.detail .lists .item .name,
.detail .lists .item .tip {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  display: inline-block;
  color: rgba(153, 153, 153, 1);
  font-family: PingFangSC-Regular, PingFang SC;
}
.detail .lists .item .tip {
  color: #444444;
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
.relation .item:last-child {
  margin-right: 0;
}
.relation .current {
  color: #7ca870;
  background: #ffffff;
}
.records {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pages {
  display: flex;
  justify-content: flex-end;
}
</style>
