 <template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline :title="formData.type === 'edit' ? '编辑调拨' : '新增调拨'" :isShowBack="true" backText="返回">
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
          <el-form-item label="调拨人员" prop="managerStuffId">
            <el-select v-model="formData.managerStuffId" clearable filterable placeholder="请选择" @change="changeManage">
              <el-option
                v-for="item in employeeList"
                :key="item.id"
                :label="item.val"
                :value="item.id">
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
          <el-button class="tz-search-submit addProduct" round size="medium" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="addPage">
      <div class="section3">
        <el-table
          border
          :span-method="cellMerge"
          style="width: 100%; margin-top: 20px"
          :data="formData.stockExchangeMaterials"
          :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="typeName" label="物料类型" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialCode" label="物料编码" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialName" label="物料名称" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="spec" label="物料规格" width="" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="outWarehouseName" label="所在仓库" width="" align="center"></el-table-column>
          <el-table-column prop="stockQuantity" label="在库数量" width="" align="center">
            <template slot-scope="scope">
              {{scope.row.stockQuantity}}
            </template>
          </el-table-column>
          <el-table-column prop="inWarehouseName" label="调拨仓库" class-name="required-red" align="center">
            <template slot-scope="scope">
              <div class="changeWare" @click="changeWare(scope.$index)">
                {{scope.row.inWarehouseName}}<i class="el-icon-edit"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="调拨数量" width="" align="center" class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" v-model.trim="scope.row.quantity" :controls="false" :min="0" :max="99999999" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="remark" label="备注" width="250" align="center">
            <template slot-scope="scope">
              <el-input placeholder="请输入" clearable v-model.trim="scope.row.remark" maxlength="50"/>
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="unitName" label="单位"></el-table-column>
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
    <el-input type="textarea" v-model="formData.remark" class="commonTextarea" resize="none" maxlength="100"></el-input>
    <tzWare :dialogVisible="dialogVisible" @cancle="cancle" @submit="getWareList" />
  </div>
</template>
<script>
import {
  mapActions, mapGetters, mapState, mapMutations
} from 'vuex'
import dic from '../../../mixins/dic'
import { becomeObj } from '../../../utils/utils'
import * as urls from '../../../router/routePath'

export default {
  mixins: [dic],
  name: 'allocationAdd',
  data () {
    return {
      spanArr: [],
      tableData: [],
      wareHouseIndex: 0,
      dialogVisible: false,
      defaultMaterials: [],
      formData: {
        remark: '',
        managerStuff: '',
        managerStuffId: '',
        stockExchangeMaterials: []
      },
      rules: {
        managerStuffId: [
          { required: true, message: '请选择调拨人员', trigger: 'change' }
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
    const { data } = this.$route.query
    const newData = becomeObj(data)
    this.defaultMaterials = newData
    this.chooseMaterial(newData)
  },
  methods: {
    ...mapMutations(['BTN_LOADING']),
    ...mapActions([
      'ADD_ALLOCATION_LIST' // 新增调拨
    ]),
    // 传递过来的物料
    chooseMaterial (materials) {
      materials.forEach((item) => {
        const stockMaterials = item.stockMaterials.map(stockItem => ({
          ...item,
          remark: '',
          quantity: undefined,
          inWarehouseId: '',
          inWarehouseName: '',
          stockQuantity: stockItem.quantity,
          outWarehouseId: stockItem.baseWarehouseId,
          outWarehouseName: stockItem.wareHouseName,
          stockMaterialId: stockItem.stockMaterialId,
          materialQuantity: item.allQuantity
        }))
        this.formData.stockExchangeMaterials = [...this.formData.stockExchangeMaterials, ...stockMaterials]
      })
      this.getSpanArr(this.formData.stockExchangeMaterials)
    },
    // 重置
    reset () {
      this.spanArr = []
      this.formData.stockExchangeMaterials = []
      this.chooseMaterial(this.defaultMaterials)
    },
    getSpanArr (data) {
      for (let i = 0; i < data.length; i += 1) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else if (data[i].baseMaterialId === data[i - 1].baseMaterialId) {
          this.spanArr[this.pos] += 1
          this.spanArr.push(0)
        } else {
          this.spanArr.push(1)
          this.pos = i
        }
      }
    },
    cellMerge ({ rowIndex, columnIndex }) {
      if (columnIndex < 5) {
        const newRow = this.spanArr[rowIndex]
        const newCol = newRow > 0 ? 1 : 0
        return {
          rowspan: newRow,
          colspan: newCol
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    // 删除物料
    deleteMaterial ({ $index }) {
      this.formData.stockExchangeMaterials.splice($index, 1)
      this.spanArr = []
      this.getSpanArr(this.formData.stockExchangeMaterials)
    },
    // 选择仓库
    changeWare (e) {
      this.wareHouseIndex = e
      this.dialogVisible = true
    },
    cancle () {
      this.dialogVisible = false
    },
    // 获取仓库
    getWareList (e) {
      if (!e.baseWarehouseId) {
        this.$message.error('请选择仓库')
        return
      }
      this.formData.stockExchangeMaterials[this.wareHouseIndex].inWarehouseId = e.baseWarehouseId
      this.formData.stockExchangeMaterials[this.wareHouseIndex].inWarehouseName = e.warehouseName
      this.cancle()
    },
    // 保存设备
    saveSale (formName) {
      const { stockExchangeMaterials } = this.formData
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < stockExchangeMaterials.length; i += 1) {
            const name = stockExchangeMaterials[i].materialName
            if (!stockExchangeMaterials[i].inWarehouseId) {
              this.$message.error(`${name}的调拨仓库不能为空`)
              return
            }
            if (stockExchangeMaterials[i].inWarehouseId === stockExchangeMaterials[i].outWarehouseId) {
              this.$message.error(`${name}的所在仓库和调拨仓库相同`)
              return
            }
            if (!stockExchangeMaterials[i].quantity) {
              this.$message.error(`${name}的调拨数量不能为空`)
              return
            }
            if (stockExchangeMaterials[i].stockQuantity < stockExchangeMaterials[i].quantity) {
              this.$message.error(`${name}调拨数量不能大于在库数量`)
              return
            }
          }
          this.addSalesOrder()
        }
      })
    },
    // 新增设备
    async addSalesOrder () {
      try {
        this.BTN_LOADING(true)
        const { status } = await this.ADD_ALLOCATION_LIST(this.formData)
        if (status === 0) {
          this.$message.success('新增调拨成功')
          this.BTN_LOADING(false)
          this.$router.push({
            path: urls.ALLOCATION
          })
        } else {
          this.BTN_LOADING(false)
        }
      } catch (e) {
        this.BTN_LOADING(false)
        console.log(e)
      }
    },
    changeManage (e) {
      const list = this.employeeList.filter(item => item.id === e)
      this.formData.managerStuff = `(${list[0].stuffNo})|${list[0].realname}`
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
