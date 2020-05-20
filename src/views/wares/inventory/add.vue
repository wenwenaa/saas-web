<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="盘点" :isShowBack="true" backText="返回">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="saveSale('formData')" :loading="btnLoading">保存</el-button>
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
          <el-form-item label="盘点仓库" prop="baseWarehouseId">
            <el-select disabled v-model.trim="formData.baseWarehouseId" clearable filterable placeholder="请选择" >
              <el-option
                v-for="item in houseList"
                :label="item.warehouseName"
                :key="item.baseWarehouseId"
                :value="item.baseWarehouseId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="盘点人员" prop="managerStuff">
            <el-select v-model="formData.managerStuff" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :value="item.val"
                :label="item.val"
                v-for="item in employeeList">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 产品信息 -->
    <div class="productInfo">
      <div class="title">
        <div class="headTitle">产品信息</div>
        <div class="right">
          <el-button class="tz-search-submit addProduct" round size="medium" @click="addProduct">新增产品</el-button>
        </div>
      </div>
    </div>
    <div class="addPage">
      <div class="section3">
        <el-table :data="formData.stockTakingMaterials" border style="width: 100%; margin-top: 20px" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="typeName" label="物料类型" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialCode" label="物料编码" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialName" label="物料名称" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="spec" label="物料规格" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="quantity" label="在库数量" width="" align="center">
            <template slot-scope="scope">
              {{scope.row.quantity}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
          <el-table-column prop="takingQuantity" label="盘点实际数量" align="center" class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" @blur="actualBlur(scope.$index)" v-model.trim="scope.row.takingQuantity" :controls="false" :max="99999999" :min="0" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="differenceValue" label="差异值" width="" align="center">
            <template slot-scope="scope">
              {{scope.row.differenceValue === '' ? '——' : scope.row.differenceValue}}
            </template>
          </el-table-column>
          <el-table-column prop="result" label="盘点结果" width="" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.result">
                {{scope.row.result | filterDic(dics.inventoryResult)}}
              </div>
              <div v-else>——</div>
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
    <el-input type="textarea" v-model="formData.remark" class="commonTextarea" maxlength="100" resize="none"/>
    <material :visible="visible" @close="close" :baseWarehouseId="formData.baseWarehouseId" :defaultData="formData.stockTakingMaterials" :isDisabled="true" @submit="chooseMaterial" />
  </div>
</template>
<script>
import {
  mapActions, mapGetters, mapState, mapMutations
} from 'vuex'
import dic from '../../../mixins/dic'
import dics from '../../../global/dictionary'
import { becomeObj } from '../../../utils/utils'
import * as urls from '../../../router/routePath'

export default {
  mixins: [dic],
  name: 'inventoryAdd',
  data () {
    return {
      dics,
      visible: false,
      isDisabled: false,
      formData: {
        remark: '',
        managerStuff: '',
        baseWarehouseId: 0,
        stockTakingMaterials: []
      },
      rules: {
        baseWarehouseId: [
          { required: true, message: '请选择盘点仓库', trigger: 'change' }
        ],
        managerStuff: [
          { required: true, message: '请选择盘点人员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  mounted () {
    const { type } = this.$route.params
    const { id } = this.$route.query
    this.formData.baseWarehouseId = id && id !== '' ? Number(id) : null
    this.formData.type = type
    if (type === 'allAdd') {
      this.getAllList()
    } else {
      const { materials } = this.$route.query
      this.newChooseMaterial(becomeObj(materials))
    }
  },
  methods: {
    ...mapMutations(['BTN_LOADING']),
    ...mapActions([
      'ADD_INVENTORY_LIST',
      'GET_ALL_MATERIAL'
    ]),
    // 获取所有的仓库的物料
    async getAllList () {
      try {
        const arg = {
          baseWarehouseId: this.formData.baseWarehouseId
        }
        const { status, data } = await this.GET_ALL_MATERIAL(arg)
        if (status === 0) {
          this.newChooseMaterial(data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    addProduct () {
      this.visible = true
    },
    // 打开、关闭物料选择框
    close () {
      this.visible = false
    },
    // 从物料主档选择选择物料
    chooseMaterial (materials) {
      const stockTakingMaterials = materials.map(item => ({
        ...item,
        result: '',
        remark: '',
        takingQuantity: undefined,
        differenceValue: '',
        quantity: item.stockQuantity,
        baseWarehouseId: this.formData.baseWarehouseId
      }))
      this.formData.stockTakingMaterials = [...this.formData.stockTakingMaterials, ...stockTakingMaterials]
      this.close()
    },
    // 从盘点 或者 全部盘点
    newChooseMaterial (materials) {
      const stockTakingMaterials = materials.map(item => ({
        ...item,
        result: '',
        remark: '',
        takingQuantity: undefined,
        differenceValue: ''
      }))
      this.formData.stockTakingMaterials = [...this.formData.stockTakingMaterials, ...stockTakingMaterials]
      this.close()
    },
    actualBlur (index) {
      const { quantity, takingQuantity } = this.formData.stockTakingMaterials[index]
      if (takingQuantity !== undefined) {
        const differenceValue = takingQuantity - quantity
        this.formData.stockTakingMaterials[index].differenceValue = differenceValue
        if (differenceValue > 0) {
          this.formData.stockTakingMaterials[index].result = 'SURPLUS'
        } else if (differenceValue < 0) {
          this.formData.stockTakingMaterials[index].result = 'LOSS'
        } else {
          this.formData.stockTakingMaterials[index].result = 'BALANCE'
        }
      }
    },
    // 删除物料
    deleteMaterial ({ $index }) {
      this.formData.stockTakingMaterials.splice($index, 1)
    },
    // 保存设备
    saveSale (formName) {
      const { stockTakingMaterials } = this.formData
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < stockTakingMaterials.length; i += 1) {
            const name = stockTakingMaterials[i].materialName
            // if (!stockTakingMaterials[i].quantity) {
            //   this.$message.error(`${name}的在库数量不能为空`)
            //   return
            // }
            if (stockTakingMaterials[i].takingQuantity === undefined) {
              this.$message.error(`${name}盘点实际数量不能为空`)
              return
            }
          }
          this.addInventoryOrder()
        }
      })
    },
    // 新增盘点
    async addInventoryOrder () {
      try {
        this.BTN_LOADING(true)
        const { status } = await this.ADD_INVENTORY_LIST(this.formData)
        if (status === 0) {
          this.$message.success('新增成功')
          this.$router.push({
            path: urls.INVENTORY
          })
          this.BTN_LOADING(false)
        } else {
          this.BTN_LOADING(false)
        }
      } catch (e) {
        this.BTN_LOADING(false)
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
.contain-company /deep/ .el-form-item__label {
  width: 240px;
  max-width: 240px;
}
.contain-company /deep/ .el-divider--horizontal {
  margin: 20px 0;
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
.addProduct {
  margin-right: 20px;
}
.addPage /deep/ .el-input__prefix {
  display: none;
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
.tzupload {
  margin-top: 20px;
}
</style>
