<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="计量单位主档" :isShowBack="true" backText="返回计量单位主档">
      <template slot="btn">
        <el-button
          class="tz-search-submit tz-btn-add"
          :loading="btnLoading"
          round
          size="medium"
          @click="saveMaterialType('formData')"
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
          <el-form-item label="计量单位" prop="unitName">
            <el-input placeholder="请输入" v-model.trim="formData.unitName" maxlength="20"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'meteringAdd',
  data () {
    return {
      formData: {
        unitName: ''
      },
      rules: {
        unitName: [
          { required: true, message: '请输入计量单位', trigger: 'change' }
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
    ...mapActions(['ADD_METERING_TYPE']),
    // 保存计量单位
    saveMaterialType (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addMetering()
        }
      })
    },
    // 保存计量单位
    addMetering () {
      this.ADD_METERING_TYPE(this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
.contain-company /deep/ .el-form-item--medium {
  width: 100%;
}
</style>
