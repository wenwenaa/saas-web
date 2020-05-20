<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline :title="formData.type === 'edit' ? '编辑设备主档' : '新增设备主档'" :isShowBack="true" backText="返回设备主档">
      <template slot="btn">
        <el-button class="tz-search-submit tz-btn-add" :loading="btnLoading" round size="medium" @click="saveEquipment('formData')">保存</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form
      size="medium"
      :inline="true"
      :rules="rules"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="设备编码" prop="equipmentCode">
            <template>
              <el-input
                placeholder="请输入"
                v-model.trim="formData.equipmentCode"
                :disabled="systemGenerate"
                maxlength="20"
              ></el-input>
              <div class="system" v-if="formData.type === 'add'">
                <el-checkbox v-model="systemGenerate">系统生成</el-checkbox>
              </div>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input placeholder="请输入" v-model.trim="formData.equipmentName" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所在车间" prop="workshop">
            <el-input placeholder="请输入" v-model.trim="formData.workshop" maxlength="20"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="坐标位置" prop="location">
            <el-input placeholder="请输入" v-model.trim="formData.location" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否启用" label-position="left" prop="enableFlag">
            <el-switch v-model.trim="formData.enableFlag" active-color="#7CA870"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'equipmentAdd',
  data () {
    return {
      delivery: true,
      formData: {
        type: 'add',
        workshop: '',
        location: '',
        enableFlag: true,
        equipmentName: '',
        equipmentCode: ''
      },
      systemGenerate: false,
      rules: {
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  mounted () {
    const { type, id } = this.$route.query
    if (type === 'edit') {
      this.systemGenerate = true
      this.formData.type = 'edit'
      document.title = '编辑设备主档'
      this.getEquipmentDetail(id)
    }
  },
  watch: {
    systemGenerate () {
      if (this.systemGenerate && this.formData.type === 'add') {
        this.formData.equipmentCode = '该编码后台自动生成'
      } else {
        this.formData.equipmentCode = ''
      }
    }
  },
  methods: {
    ...mapActions([
      'ADD_EQUIPMENT',
      'GET_EQUIPMENT_DETAIL'
    ]),
    // 保存设备
    saveEquipment (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addEquipment()
        }
      })
    },
    // 新增设备
    addEquipment () {
      if (this.systemGenerate && this.formData.type === 'add') {
        this.formData.equipmentCode = ''
      }
      const formData = {
        ...this.formData,
        enableFlag: this.formData.enableFlag ? 'Y' : 'N'
      }
      this.ADD_EQUIPMENT(formData)
    },
    // 获取设备详情
    async getEquipmentDetail (id) {
      try {
        const { status, data } = await this.GET_EQUIPMENT_DETAIL({ id })
        if (status === 0) {
          this.formData = {
            ...data,
            type: this.formData.type,
            enableFlag: data.enableFlag === 'Y'
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contain-company /deep/ .el-form-item--medium {
  width: 100%;
}
.el-form--inline .el-form-item .system {
  position: absolute;
  right: 3px;
  top: -48px;
}
</style>
