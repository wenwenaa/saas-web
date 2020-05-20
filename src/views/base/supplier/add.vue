<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline
      :title="formData.type==='add' ? '新增供应商主档' : '编辑供应商主档'"
      :isShowBack="true"
      :backText="formData.type === 'detail' ? '返回上一层' : '返回供应商主档'"
    >
      <template slot="btn">
        <el-button
          class="tz-search-submit tz-btn-add"
          :loading="btnLoading"
          round
          size="medium"
          @click="saveSupplier('formData')"
        >保存</el-button>
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
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input placeholder="请输入" v-model.trim="formData.supplierName" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商编码" prop="supplierCode">
            <template>
              <el-input
                placeholder="请输入"
                v-model.trim="formData.supplierCode"
                :disabled="systemGenerate"
                maxlength="20"
              />
              <div class="system" v-if="formData.type === 'add'">
                <el-checkbox v-model="systemGenerate">系统生成</el-checkbox>
              </div>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人" prop="contactName">
            <el-input placeholder="请输入" v-model.trim="formData.contactName" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input placeholder="请输入" v-model.trim="formData.contactPhone" maxlength="11"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入" v-model.trim="formData.email" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="传真" prop="fax">
            <el-input placeholder="请输入" v-model.trim="formData.fax" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地址" prop="address">
            <el-input placeholder="请输入" v-model.trim="formData.address" maxlength="20"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="formData.remark" resize="none" maxlength="100"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  checkMobile,
  verificationEmail,
  verificationFax
} from '../../../utils/validator'

export default {
  name: 'supplierAdd',
  data () {
    return {
      formData: {
        fax: '',
        email: '',
        remark: '',
        address: '',
        type: 'add',
        contactName: '',
        supplierName: '',
        supplierCode: '',
        contactPhone: ''
      },
      copySupplierCode: '',
      systemGenerate: false,
      rules: {
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'change' }
        ],
        supplierCode: [
          { required: true, message: '请输入客户编码', trigger: 'change' }
        ],
        contactName: [
          { required: true, message: '请输入联系人名称', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          { validator: checkMobile, trigger: 'change' }
        ],
        email: [{ validator: verificationEmail, trigger: 'change' }],
        fax: [{ validator: verificationFax, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  watch: {
    // 获取系统生成的客户编码
    async systemGenerate () {
      try {
        if (this.systemGenerate && this.formData.type === 'add') {
          if (!this.copySupplierCode) {
            const { status, data } = await this.A_GET_MATERIAL_CODE_LIST({ moduleName: 'SUPPLIER' })
            if (status === 0) {
              this.copySupplierCode = data
              this.formData.supplierCode = data
            }
          } else {
            this.formData.supplierCode = this.copySupplierCode
          }
        } else {
          this.formData.supplierCode = ''
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
    const { type, id } = this.$route.query
    this.formData.type = type
    if (type === 'edit') {
      this.systemGenerate = true
      document.title = '编辑供应商主档'
    }
    if (type === 'edit' || type === 'detail') {
      this.getSupplierDetail(id)
    }
  },
  methods: {
    ...mapActions([
      'ADD_SUPPLIER',
      'GET_SUPPLIER_DETAIL',
      'A_GET_MATERIAL_CODE_LIST'
    ]),
    // 保存客户
    saveSupplier (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSupplier()
        }
      })
    },
    // 新增客户
    addSupplier () {
      this.ADD_SUPPLIER(this.formData)
    },
    // 获取客户详情
    async getSupplierDetail (id) {
      try {
        const { status, data } = await this.GET_SUPPLIER_DETAIL({ id })
        if (status === 0) {
          this.formData = {
            ...data,
            type: this.formData.type
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
.el-form--inline .el-form-item {
  position: relative;
}
.el-form--inline .el-form-item .system {
  position: absolute;
  right: 3px;
  top: -48px;
}
</style>
