<template>
  <div>
    <!-- 头部 -->
    <tzHeadline title="物料类型">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="materialTypeAdd">新增物料类型</el-button>
      </template>
    </tzHeadline>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      border
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column align="center" prop="typeName" label="物料类型" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <div class="buttons">
            <div class="btns yellow" @click="confirmMaterialTypeDel(scope.row)">删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import keepAlive from '../../../mixins/keepAlive'
import * as urls from '../../../router/routePath'

export default {
  name: 'materialtypeList',
  mixins: [keepAlive],
  data () {
    return {
      type: ''
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.base.materialtypeList,
      tableLoading: state => state.global.tableLoading
    })
  },
  activated () {
    this.getMaterialTypeList()
  },
  methods: {
    ...mapActions([
      'GET_MATERIAL_TYPE_LIST',
      'DEL_MATERIAL_TYPE',
      'A_GET_MATERIAL_TYPE_DIC_LIST'
    ]),

    // 获取设备列表
    getMaterialTypeList () {
      this.GET_MATERIAL_TYPE_LIST()
    },
    // 确认删除设备
    async confirmMaterialTypeDel (item) {
      this.$confirm('确认删除？')
        .then((res) => {
          if (res === 'confirm') {
            this.materialTypeDel(item)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 删除物料类型
    async materialTypeDel (item) {
      try {
        const { status } = await this.DEL_MATERIAL_TYPE(item)
        if (status === 0) {
          this.$message.success('删除成功')
          this.getMaterialTypeList()
          this.A_GET_MATERIAL_TYPE_DIC_LIST()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入物料类型
    materialTypeAdd () {
      this.$router.push({
        path: urls.BASE_MATERIAL_TYPE_ADD
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
