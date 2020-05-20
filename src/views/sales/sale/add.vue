<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline :title="formData.type === 'edit' ? '编辑销售订单' : '新增销售订单'" :isShowBack="true" backText="返回">
      <template slot="btn">
        <el-button class="tz-search-submit tz-btn-add" round size="medium" @click="saveSale('formData', 'save')" :loading="btnLoading">保存</el-button>
        <el-button class="tz-search-submit tz-btn-add" v-if="formData.type==='add'" round size="medium" @click="saveSale('formData', 'examine')" :loading="modalLoading">保存并送审</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <div class="headTitle" style="margin-top: 15px;">基本信息</div>
    <el-form
      size="medium"
      :inline="true"
      :rules="rules"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="top">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="销售订单号" prop="saleCode">
            <template>
              <el-input placeholder="请输入" :disabled="salesChecked" clearable v-model.trim="formData.saleCode" maxlength="20"/>
              <div class="choose"><el-checkbox v-if="formData.type === 'add'" v-model="salesChecked" @change="systemGeneration">系统生成</el-checkbox></div>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户订单号" prop="customerCode">
            <el-input placeholder="请输入" clearable v-model.trim="formData.customerCode" maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" prop="baseCustomerId">
            <el-select v-model.trim="formData.baseCustomerId" clearable filterable placeholder="请选择">
              <el-option
                :key="item.baseCustomerId"
                :label="item.customerName"
                v-for="item in customerList"
                :value="item.baseCustomerId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="销售人员" prop="salerStuffId">
            <el-select v-model="formData.salerStuffId" clearable filterable placeholder="请选择" @change="chooseSaleStaff">
              <el-option
                v-for="item in staffList"
                :key="item.id"
                :label="item.realname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="接单日期" prop="location">
            <el-date-picker
              clearable
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="formData.acceptDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 产品信息 -->
    <div class="productInfo">
      <div class="title">
        <div class="headTitle">产品信息</div>
        <div class="right">
          <el-button class="tz-search-submit mr20" round size="medium" @click="close">新增产品</el-button>
          <el-date-picker
            clearable
            type="date"
            :editable="false"
            format="yyyy-MM-dd"
            :picker-options="currentDate"
            @change="setDefaultDeliveryTime"
            value-format="yyyy-MM-dd"
            v-model="defaultDeliveryTime"
            placeholder="设置默认交期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="addPage">
      <div class="section3">
        <el-table :data="formData.saleOrderMaterialVoList" border style="width: 100%; margin-top: 20px" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="materialType" label="物料类型" width="130" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialCode" label="物料编码" width="130" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialName" label="物料名称" width="130" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="spec" label="物料规格" width="130" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialPicNum" label="物料图号" width="130" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="customerMaterialCode" label="客户料号" width="130" align="center" show-overflow-tooltip class-name="addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" clearable v-model.trim="scope.row.customerMaterialCode" maxlength="10"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="含税单价" width="130" align="center" class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" v-model.trim="scope.row.unitPrice" :controls="false" :max="99999999" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="库存数量" width="130" align="center">
            <template slot-scope="scope">
              {{scope.row.quantity || 0}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
          <el-table-column prop="quantityDisplay" label="订单数量" width="130" align="center" class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" v-model.trim="scope.row.quantityDisplay" :controls="false" :max="99999999" :precision="6" :min="0"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="sendDate" label="交期" width="160" align="center" class-name="required-red">
            <template slot-scope="scope">
              <el-date-picker
                clearable
                type="date"
                :editable="false"
                format="yyyy-MM-dd"
                :picker-options="currentDate"
                value-format="yyyy-MM-dd"
                v-model="scope.row.sendDate"
                placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="250" align="center" show-overflow-tooltip class-name="addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" clearable v-model.trim="scope.row.remark" maxlength="50"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <div class="btn">
                <el-button size="small" type="text" class="yellow f14" @click="deleteMaterial(scope)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="headTitle" style="margin-top: 18px;margin-bottom: 6px;">备注</div>
    <el-input type="textarea" v-model="formData.remark" class="commonTextarea" resize="none" maxlength="500"/>
    <material :visible="visible" @close="cancel" @submit="chooseMaterial" :isDisabled="true" :defaultData="formData.saleOrderMaterialVoList"  />
    <tzCommonFileUpload @handleUploadFile="handleUploadFile" class="mt20" :fileList="formData.baseFileDtoList" />
  </div>
</template>
<script>
import moment from 'moment'
import { mapActions, mapState, mapMutations } from 'vuex'
import dic from '../../../mixins/dic'
import { verChinese } from '../../../utils/validator'

export default {
  mixins: [dic],
  name: 'saleAdd',
  data () {
    return {
      salesChecked: false,
      tableData: [1],
      visible: false,
      currentDate: this.beginDate(),
      defaultDeliveryTime: '',
      copySaleCode: '',
      formData: {
        type: '',
        saleCode: '',
        customerCode: '',
        salerStuffId: '',
        salerStuff: '',
        baseCustomerId: '',
        acceptDate: '',
        remark: '',
        baseFileVoList: [],
        saleOrderMaterialVoList: []
      },
      rules: {
        saleCode: [
          { required: true, message: '销售订单号不能为空', trigger: ['blur', 'change'] },
          { validator: verChinese }
        ],
        customerCode: [
          { required: false, trigger: ['blur'] },
          { validator: verChinese }
        ],
        baseCustomerId: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        salerStuffId: [
          { required: true, message: '请选择销售人员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading,
      modalLoading: state => state.global.modalLoading
    })
  },
  mounted () {
    const { id } = this.$route.query
    const { type } = this.$route.params
    this.formData.type = type
    if (type === 'edit') {
      this.salesChecked = true
      document.title = '编辑销售订单'
      this.getSalesDetail(id)
    }
  },
  methods: {
    ...mapMutations(['BTN_LOADING', 'MODAL_LOADING']),
    ...mapActions([
      'POST_GLOBAL_AUDITOR',
      'A_GET_MATERIAL_CODE_LIST', // 生成销售订单号
      'ADD_SALES_ORDER', // 新增销售订单
      'DETAIL_SALES_ORDER' // 销售订单详情
    ]),
    beginDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      }
    },
    // 系统生成销售单号
    systemGeneration () {
      if (this.salesChecked && this.formData.type === 'add') {
        if (!this.copySaleCode) {
          this.getSalesOrder()
        } else {
          this.formData.saleCode = this.copySaleCode
        }
      } else {
        this.formData.saleCode = ''
      }
    },
    async getSalesOrder () {
      try {
        const { status, data } = await this.A_GET_MATERIAL_CODE_LIST({ moduleName: 'SALE' })
        if (status === 0) {
          this.copySaleCode = data
          this.formData.saleCode = this.copySaleCode
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 选择员工
    chooseSaleStaff (e) {
      this.staffList.forEach((item) => {
        if (item.id === e) {
          this.formData.salerStuff = item.realname
        }
      })
    },
    // 打开、关闭物料选择框
    close () {
      this.visible = !this.visible
    },
    cancel () {
      this.visible = false
    },
    // 选择物料
    chooseMaterial (materials) {
      const newMaterial = materials.map(item => ({
        ...item,
        quantityDisplay: undefined,
        customerMaterialCode: '',
        materialPicNum: item.picNum,
        materialType: item.typeName,
        sendDate: this.defaultDeliveryTime
      }))
      this.formData.saleOrderMaterialVoList = [...this.formData.saleOrderMaterialVoList, ...newMaterial]
      this.close()
    },
    // 设置默认交期
    setDefaultDeliveryTime (e) {
      this.formData.saleOrderMaterialVoList = this.formData.saleOrderMaterialVoList.map(item => ({
        ...item,
        sendDate: e
      }))
    },
    // 删除物料
    deleteMaterial ({ $index }) {
      this.formData.saleOrderMaterialVoList.splice($index, 1)
    },
    handleUploadFile ({ files }) {
      this.formData.baseFileVoList = files
    },
    // 保存设备
    saveSale (formName, type) {
      const { saleOrderMaterialVoList } = this.formData
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!saleOrderMaterialVoList.length) {
            this.$message.error('产品信息不能为空')
            return
          }
          for (let i = 0; i < saleOrderMaterialVoList.length; i += 1) {
            const name = saleOrderMaterialVoList[i].materialName
            if (!saleOrderMaterialVoList[i].unitPrice) {
              this.$message.error(`${name}的含税单价不能为空`)
              return
            }
            if (!saleOrderMaterialVoList[i].quantityDisplay) {
              this.$message.error(`${name}的订单数量不能为空`)
              return
            }
            if (!saleOrderMaterialVoList[i].sendDate) {
              this.$message.error(`${name}的交期不能为空`)
              return
            }
          }
          this.addSalesOrder(type)
        }
      })
    },
    // 新增设备
    async addSalesOrder (type) {
      try {
        this.BTN_LOADING(true)
        this.MODAL_LOADING(true)
        const { status, data } = await this.ADD_SALES_ORDER(this.formData)
        if (status === 0) {
          if (type === 'examine') {
            // 保存并送审
            this.checkReview(data)
          } else {
            this.$message.success('保存成功')
            setTimeout(() => {
              this.$router.go(-1)
              this.BTN_LOADING(false)
              this.MODAL_LOADING(false)
            }, 1000)
          }
        } else {
          this.BTN_LOADING(false)
          this.MODAL_LOADING(false)
        }
      } catch (e) {
        this.BTN_LOADING(false)
        this.MODAL_LOADING(false)
        console.log(e)
      }
    },
    // 送审
    async checkReview (data) {
      try {
        const { saleOrderId, saleCode } = data
        const arg = {
          targetId: saleOrderId,
          targetCode: saleCode,
          targetType: 'SALE'
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.$message.success('保存送审成功')
          setTimeout(() => {
            this.$router.go(-1)
            this.BTN_LOADING(false)
            this.MODAL_LOADING(false)
          }, 1000)
        } else {
          this.BTN_LOADING(false)
          this.MODAL_LOADING(false)
        }
      } catch (e) {
        console.log(e)
        this.BTN_LOADING(false)
        this.MODAL_LOADING(false)
      }
    },
    // 获取订单详情
    async getSalesDetail (id) {
      try {
        const { status, data } = await this.DETAIL_SALES_ORDER({ id })
        if (status === 0) {
          data.saleOrderMaterialDtoList = data.saleOrderMaterialDtoList.map((item) => {
            let { quantity } = item
            if (quantity) {
              quantity = Number(quantity).toFixed(6)
            }
            return {
              ...item,
              sendDate: moment(item.sendDate).format('YYYY-MM-DD'),
              materialType: item.typeName,
              materialPicNum: item.picNum,
              quantity: item.materialStock,
              quantityDisplay: quantity || undefined
            }
          })
          this.formData = {
            ...data,
            baseFileVoList: data.baseFileDtoList,
            saleOrderMaterialVoList: data.saleOrderMaterialDtoList,
            acceptDate: data.acceptDate ? moment(data.acceptDate).format('YYYY-MM-DD') : null,
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
/deep/ .el-form-item {
  position: relative;
}
.contain-company /deep/ .el-form-item--medium,/deep/ .el-select,/deep/ .el-input--medium {
  width: 100%;
}
.choose {
  right: 0;
  top: -36px;
  position: absolute;
}
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}
/deep/ .el-checkbox__label {
  color: #1989FA;
}
.productInfo .title {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;
}
.addPage /deep/ .el-input--suffix .el-input__inner {
  padding: 0;
}
.addPage /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner,.addPage /deep/ .el-input-number {
  width: auto;
}
.addPage /deep/ .el-input-number.is-without-controls .el-input__inner {
  padding: 0;
}
.commonTextarea /deep/ .el-textarea__inner {
  height: 120px;
  max-width: 1022px;
}
</style>
