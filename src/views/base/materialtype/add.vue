<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="新增物料类型" :isShowBack="true" backText="返回物料类型">
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
          <el-form-item label="物料类型" prop="typeName">
            <el-input placeholder="请输入" v-model.trim="formData.typeName" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'materialTypeAdd',
  data () {
    return {
      formData: {
        typeName: ''
      },
      rules: {
        typeName: [
          { required: true, message: '请输入物料类型', trigger: 'change' }
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
    ...mapActions(['ADD_MATERIAL_TYPE']),
    // 保存设备
    saveMaterialType (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addMaterialType()
        }
      })
    },
    // 新增设备
    addMaterialType () {
      this.ADD_MATERIAL_TYPE(this.formData)
    }
  }
}
</script>
<style lang="less" scoped>
.contain-company /deep/ .el-form-item--medium {
  width: 100%;
}
</style>
