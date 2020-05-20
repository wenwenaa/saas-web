<template>
  <div>
    <!-- 头部 -->
    <tzHeadline title="仓库主档">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="warehouseAdd">新增仓库</el-button>
      </template>
    </tzHeadline>
    <!-- 列表 -->
    <el-table
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column align="center" prop="warehouseName" label="仓库名称"></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <div class="buttons">
            <div class="btns yellow" @click="confirmWarehouseDel(scope.row)">删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import * as urls from '../../../router/routePath'

export default {
  name: 'warehouseList',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      tableData: state => state.base.warehouseList,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    this.getWarehouseList()
  },
  methods: {
    ...mapActions([
      'GET_WAREHOUSE_LIST',
      'DEL_WAREHOUSE',
      'A_GET_HOUSE_DIC_LIST'
    ]),
    // 获取设备列表
    getWarehouseList () {
      this.GET_WAREHOUSE_LIST()
    },
    // 确认删除设备
    async confirmWarehouseDel (item) {
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.warehouseDel(item)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除物料类型
    async warehouseDel (item) {
      try {
        const { status } = await this.DEL_WAREHOUSE(item)
        if (status === 0) {
          this.$message.success('删除成功')
          this.getWarehouseList()
          this.A_GET_HOUSE_DIC_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入物料类型
    warehouseAdd () {
      this.$router.push({
        path: urls.BASE_WAREHOUSE_ADD
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
