<template>
  <el-dialog :title="title" :visible.sync="visible" width="700px" :before-close="handleClose">
    <section class="main">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-table border ref="multipleTable" :data="orders" :height="300">
            <el-table-column prop="code" label="需要打印的订单号" align="center"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-form
            label-position="top"
            :rules="rules"
            :model="formData"
            size="medium"
            ref="formData"
          >
            <el-form-item label="打印模板" prop="printTemplateId">
              <el-select v-model="formData.printTemplateId" placeholder="请选择打印模板">
                <el-option
                  v-for="(item, i) in templateList"
                  :key="i"
                  :label="item.templateName"
                  :value="item.printTemplateId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="打印机" prop="clientId">
              <el-select v-model="formData.clientId" placeholder="请选择打印机">
                <el-option
                  v-for="(item, i) in printerList"
                  :key="i"
                  :label="item.printerName"
                  :value="item.clientId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="份数" prop="num">
              <el-input-number v-model="formData.num" :step="1" :precision="0" :min="1"></el-input-number>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-checkbox class="fl checkbox" v-if="type === 'ProdOrder'" v-model="isSub" true-label="1" false-label="2">包含子订单</el-checkbox>
      <el-button @click="handleClose" round size="medium" class="tz-staff-cancel">取 消</el-button>
      <el-button
        type="primary"
        round
        size="medium"
        class="tz-staff-submit"
        @click="submit('formData')"
      >打 印</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const orderType = {
  sale: '销售订单',
  ProdOrder: '生产订单',
  PurchaseOrder: '采购订单',
  SupplyOrder: '成品委外',
  SALE_RETURN: '销售退货入库',
  PROD: '生产入库',
  PURCHASE: '采购入库',
  SUPPLY: '委外入库',
  OTHER_IN: '无来源入库',
  SUPPLY_MATERIAL: '委外发料出库',
  SUPPLY_RETURN: '委外退货出库',
  PROD_MATERIAL: '生产领料出库',
  SALE_OUT: '销售发货出库',
  PURCHASE_RETURN: '采购退货出库',
  OTHER_OUT: '无来源出库',
  stock_exchange: '调拨',
  stock_taking: '盘点'
}
const actionType = {
  sale: 'A_GET_PRINT_SALE_DATA',
  ProdOrder: 'A_GET_PRINT_PROD_DATA',
  PurchaseOrder: 'A_GET_PRINT_PURCHASE_DATA',
  SupplyOrder: 'A_GET_PRINT_OUTSOURCE_OUT_PRODUCT_DATA',
  SALE_RETURN: 'A_GET_PRINT_WAREHOUSE_IN_DATA',
  PROD: 'A_GET_PRINT_WAREHOUSE_IN_DATA',
  PURCHASE: 'A_GET_PRINT_WAREHOUSE_IN_DATA',
  SUPPLY: 'A_GET_PRINT_WAREHOUSE_IN_DATA',
  OTHER_IN: 'A_GET_PRINT_WAREHOUSE_IN_DATA',
  SUPPLY_MATERIAL: 'A_GET_PRINT_WAREHOUSE_OUT_DATA',
  SUPPLY_RETURN: 'A_GET_PRINT_WAREHOUSE_OUT_DATA',
  PROD_MATERIAL: 'A_GET_PRINT_WAREHOUSE_OUT_DATA',
  SALE_OUT: 'A_GET_PRINT_WAREHOUSE_OUT_DATA',
  PURCHASE_RETURN: 'A_GET_PRINT_WAREHOUSE_OUT_DATA',
  OTHER_OUT: 'A_GET_PRINT_WAREHOUSE_OUT_DATA',
  stock_exchange: 'A_GET_PRINT_ALLOCATION_DATA',
  stock_taking: 'A_GET_PRINT_INVENTORY_DATA'
}
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '打印设置'
    },
    orders: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      printerList: state => state.global.printerList,
      templateList: state => state.global.templateList
    }),
    initClientId () {
      const localClientId = localStorage.getItem('clientId')
      const clientIds = this.printerList.map(it => it.clientId)
      if (localClientId && clientIds.includes(Number(localClientId))) {
        return Number(localClientId)
      }
      return clientIds.length > 0 ? clientIds[0] : undefined
    }
  },
  data () {
    return {
      rules: {
        printTemplateId: [
          { required: true, message: '请选择打印模板', trigger: 'blur' }
        ],
        clientId: [
          { required: true, message: '请选择打印机', trigger: 'blur' }
        ],
        num: [{ required: true, message: '请输入打印份数', trigger: 'blur' }]
      },
      isSub: '1',
      formData: {
        printTemplateId: null,
        clientId: null,
        num: 1
      },
      details: []
    }
  },
  watch: {
    'formData.clientId': (val) => {
      if (val) {
        localStorage.setItem('clientId', val)
      }
    },
    visible (val) {
      if (!val) {
        this.handleClose()
      } else {
        this.getTemplates()
        this.getPrinters()
      }
    },
    orders (val) {
      if (this.visible) {
        Promise.all(this.setGetDetailFun(val)).then((data) => {
        this.details = data.map(item => item.data)
      })
      }
    }
  },
  methods: {
    ...mapActions([
      'GET_GLOBAL_TEMPLATES',
      'GET_GLOBAL_PRINTERS',
      'DETAIL_SALES_ORDER',
      'GET_GLOBAL_PRINT',
      'A_GET_PRINT_SALE_DATA',
      'A_GET_PRINT_PURCHASE_DATA',
      'A_GET_PRINT_PURCHASE_APPLY_DATA',
      'A_GET_PRINT_PROD_DATA',
      'A_GET_PRINT_OUTSOURCE_OUT_PRODUCT_DATA',
      'A_GET_PRINT_OUTSOURCE_PROCESS_DATA',
      'A_GET_PRINT_WAREHOUSE_IN_DATA',
      'A_GET_PRINT_WAREHOUSE_OUT_DATA',
      'A_GET_PRINT_ALLOCATION_DATA',
      'A_GET_PRINT_INVENTORY_DATA'
    ]),
    setGetDetailFun (val) {
      const { type } = this
      const arr = []
      if (val.length > 0) {
        val.forEach((it) => {
          arr.push(this[actionType[type]]({ id: it.id }))
        })
      }
      return arr
    },
    async getTemplates () {
      try {
        const arg = { formType: this.type }
        const { status, data } = await this.GET_GLOBAL_TEMPLATES(arg)
        if (status === 0) {
          const temp = data
          this.formData.printTemplateId =
            temp && temp.length > 0 ? temp[0].printTemplateId : undefined
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getPrinters () {
      try {
        const { status } = await this.GET_GLOBAL_PRINTERS()
        if (status === 0) {
          this.formData.clientId = this.initClientId
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭
    handleClose () {
      this.details = []
      this.formData = {
        printTemplateId: null,
        clientId: null,
        num: 1
      }
      this.$emit('cancle')
    },
    // 设置打印请求fun到数组中
    setFunList () {
      const {
        orders,
        details,
        formData,
        type,
        isSub
      } = this
      const arr = []
      orders.forEach((item, partI) => {
        for (let i = 0; i < formData.num; i += 1) {
          const { children = [], ...partData } = details[partI]
          const data = type === 'ProdOrder' && isSub === '1' ? { children, ...partData } : { ...partData }
          const taskName = `${orderType[type]}_${item.code}_${i + 1}`
          arr.push(this.GET_GLOBAL_PRINT({ data, ...formData, taskName }))
        }
      })
      console.log(arr)
      return arr
    },
    // 打印
    async submit (formName) {
      try {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Promise.all(this.setFunList())
              .then((data) => {
                console.log(data)
                this.$message.success('打印成功')
                this.handleClose()
              })
              .catch((val) => {
                console.log(val)
                this.$message.error('打印失败')
              })
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  background-color: #f9f9f9;
  padding: 16px;
}
</style>
