<template>
  <el-dialog :title="title" :visible="visible" :width="width" @close="close">
    <el-input
      class="mb20"
      placeholder="您可以搜索物料名称/编码/类型/图号"
      v-model.trim="keyword"
      clearable
      @keyup.enter.native="search"
    >
      <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
    </el-input>
    <el-table
      border
      :data="list"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      header-align="center"
      height="310px"
    >
      <el-table-column align="center" type="index" width="55" label="序号" />
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip />
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip />
      <el-table-column align="center" prop="materialSpec" label="物料规格" show-overflow-tooltip />
      <el-table-column align="center" prop="materialPicNum" label="物料图号" show-overflow-tooltip />
      <el-table-column align="center" prop="saleOrderNum" label="销售订单条数" width="120px" />
      <el-table-column align="center" prop="buyQuantityTotal" label="订单总数量" />
      <el-table-column align="center" prop="processQuantityTotal" label="已下推总数" />
      <el-table-column align="center" prop="notProcessQuantityTotal" label="未下推总数" />
      <el-table-column prop="unitName" label="单位" align="center" />
    </el-table>
    <div slot="footer">
      <el-pagination
        :layout="layout"
        :total="total"
        :current-page="pageIndex"
        :page-size="pageSize"
        @current-change="currentChange"
      />
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { removeEmpty } from '../../../../utils/utils'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '销售订单汇总表-物料'
    },
    width: {
      type: String,
      default: '900px'
    }
  },
  computed: {
    ...mapState({
      list: state => state.product.pushDown.sumList,
      total: state => state.product.pushDown.sumTotal,
      tableLoading: state => state.global.tableLoading
    })
  },
  data () {
    return {
      layout: 'prev, pager, next',
      pageIndex: 1,
      pageSize: 5,
      keyword: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.reset()
        this.getList()
      }
    }
  },
  methods: {
    ...mapActions(['A_GET_SALE_ORDER_SUM_LIST']),
    // 数据重置
    reset () {
      this.pageIndex = 1
      this.keyword = ''
    },
    // 关闭
    close (done) {
      this.$emit('cancel')
    },
    // 请求参数
    setParams () {
      const { pageIndex, pageSize, keyword } = this
      return removeEmpty({ pageIndex, pageSize, keyword })
    },
    // 获取数据
    getList () {
      const arg = this.setParams()
      this.A_GET_SALE_ORDER_SUM_LIST(arg)
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

<style lang="less" scoped>
.mb20 {
  margin-bottom: 16px;
}
</style>
