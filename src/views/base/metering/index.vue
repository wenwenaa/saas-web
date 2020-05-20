<template>
  <div>
    <!-- 头部 -->
    <tzHeadline title="计量单位主档">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="addMetering">新增计量单位</el-button>
      </template>
    </tzHeadline>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      border
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column align="center" prop="unitName" label="计量单位"></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <div class="buttons">
            <div class="btns yellow" @click="confirmMeteringDel(scope.row)">删除</div>
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
  name: 'meteringList',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      tableData: state => state.base.meterUnitList,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    this.getMeteringList()
  },
  methods: {
    ...mapActions([
      'GET_METERING_LIST',
      'DEL_METERING_TYPE',
      'A_GET_UNIT_DIC_LIST'
    ]),
    // 获取计量单位列表
    getMeteringList () {
      this.GET_METERING_LIST()
    },
    // 确认删除计量单位
    async confirmMeteringDel (item) {
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.meteringDel(item)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除计量单位
    async meteringDel (item) {
      try {
        const { status } = await this.DEL_METERING_TYPE(item)
        if (status === 0) {
          this.$message.success('删除成功')
          this.getMeteringList()
          this.A_GET_UNIT_DIC_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入计量单位
    addMetering () {
      this.$router.push({
        path: urls.BASE_METERING_ADD
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
