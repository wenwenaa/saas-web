<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="新增仓库" :isShowBack="true" backText="返回仓库主档">
      <template slot="btn">
        <el-button
          class="tz-search-submit tz-btn-add"
          round
          size="medium"
          :loading="btnLoading"
          @click="saveWarehouse('formData')"
        >保存</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form
      size="medium"
      :inline="true"
      :rules="rules"
      ref="formData"
      @submit.native.prevent
      :model="formData"
      label-width="100px"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-input placeholder="请输入" v-model.trim="formData.warehouseName" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'warehouseAdd',
  data () {
    return {
      formData: {
        warehouseName: ''
      },
      rules: {
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  methods: {
    ...mapActions(['ADD_WAREHOUSE']),
    // 保存设备
    saveWarehouse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addWarehouse()
        }
      })
    },
    // 新增设备
    addWarehouse () {
      this.ADD_WAREHOUSE(this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
.contain-company /deep/ .el-form-item--medium {
  width: 100%;
}
</style>
