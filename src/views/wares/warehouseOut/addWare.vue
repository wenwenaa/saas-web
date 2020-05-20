<template>
  <div class="addPage">
    <tzHeadline
      :title="type|filterDic(dic.wareOutTypes,'type','name')"
      backText="返回"
      :isShowBack="isShowBack"
    >
      <template slot="btn">
        <el-button
          round
          size="medium"
          class="tz-btn-add"
          @click="addBtn('shipment','personForm')"
          :loading="status==='shipment'&&loading"
        >保存</el-button>
        <el-button
          round
          size="medium"
          class="tz-btn-add"
          @click="addBtn('stockOut','personForm')"
          :loading="status==='stockOut'&&loading"
        >保存并出库</el-button>
      </template>
    </tzHeadline>
    <el-form
      label-position="top"
      label-width="80px"
      :inline="true"
      :model="personForm"
      :rules="rules"
      ref="personForm"
    >
      <el-col>
        <el-col :span="5">
          <el-form-item label="负责人" prop="managerStuff" ref="managerStuff">
            <el-select v-model.trim="personForm.managerStuff" filterable placeholder="请选择">
              <el-option
                v-for="item in employeeList"
                :key="item.id"
                :label="item.val"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="type==='PURCHASE'||type==='SUPPLY_MATERIAL'||type==='SUPPLY'">
          <el-form-item label="供应商" prop="baseSupplierId" ref="baseSupplierId">
            <el-select
              v-model.trim="personForm.baseSupplierId"
              filterable
              placeholder="请选择"
              disabled
            >
              <el-option
                v-for="item in supplierList"
                :key="item.baseSupplierId"
                :label="item.supplierName"
                :value="item.baseSupplierId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="type==='SALE'||type==='OTHER_OUT'">
          <el-form-item label="客户" prop="baseCustomerId" ref="baseCustomerId">
            <el-select
              v-model.trim="personForm.baseCustomerId"
              filterable
              placeholder="请选择"
              :disabled="type==='SALE'?true:false"
            >
              <el-option
                v-for="item in customerList"
                :key="item.baseCustomerId"
                :label="item.customerName"
                :value="item.baseCustomerId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="出库仓库" prop="baseWarehouseId" ref="baseWarehouseId">
            <el-select
              v-model.trim="personForm.baseWarehouseId"
              filterable
              placeholder="请选择"
              @change="wareChange"
            >
              <el-option
                v-for="item in houseList"
                :key="item.baseWarehouseId"
                :label="item.warehouseName"
                :value="item.baseWarehouseId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
    <div class="section2" v-if="type!=='OTHER_OUT'">
      <div class="section-label">{{type|filterDic(dic.wareOutTypes,'type','order')}}</div>
      <div class="order-list">
        <div class="order-item" v-for="(item,index) in orderList" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">{{type|filterDic(dic.wareOutTypes,'type','order')}}号：</span>
            <span class="order-item-detail">{{item.refCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.createBy}}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="section3"
      v-if="type==='PROD_MATERIAL'||type==='SUPPLY_MATERIAL'"
      style="margin-bottom:20px;"
    >
      <div class="d-flex justify-between" style="width:100%;">
        <div class="section-label">产品信息·源物料</div>
      </div>
      <el-table
        :data="tableData1"
        border
        style="width: 1131px; margin-top: 20px"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="picNum"
          label="物料图号"
          width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="采购单号" width="180" align="center" v-if="type==='PURCHASE'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="生产单号" width="180" align="center" v-if="type==='PROD_MATERIAL'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="销售订单号" width="180" align="center" v-if="type==='SALE'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="委外订单号"
          width="180"
          align="center"
          v-if="type==='SUPPLY_MATERIAL'||type==='SUPPLY'"
        >
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderQuantity"
          :label="type ==='SUPPLY_MATERIAL' ? '委外数量' : '计划数量'"
          width="180"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
    <div class="section3">
      <div class="d-flex justify-between" style="width:100%;">
        <div class="section-label">产品信息·{{type|filterDic(dic.wareOutTypes,'type','material')}}</div>
        <div>
          <el-button
            round
            size="medium"
            class="tz-search-submit"
            @click="addMaterial"
            v-if="type==='OTHER_OUT'||type==='PROD_MATERIAL' || type==='SUPPLY_MATERIAL'"
          >添加物料</el-button>
          <el-button
            round
            size="medium"
            class="tz-search-submit"
            @click="resetMaterial"
            v-if="type!=='OTHER_OUT'||type==='PROD_MATERIAL'"
          >重置</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="minSafetyStock" label="最小安全库存数量" align="center">
          <template slot-scope="scope">{{scope.row.minSafetyStock?scope.row.minSafetyStock:'_'}}</template>
        </el-table-column>
        <el-table-column prop="stockQuantity" label="当前库存数量" align="center">
          <template slot-scope="scope">{{scope.row.stockQuantity?scope.row.stockQuantity:0}}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="库存总量" align="center">
          <template slot-scope="scope">{{scope.row.quantity?scope.row.quantity:0}}</template>
        </el-table-column>
        <el-table-column
          :label="type==='PURCHASE'||type==='SUPPLY'?'本次退货数量':'本次出库数量'"
          width="260"
          align="center"
          v-if="type!=='PROD_MATERIAL'"
          class-name="required-red addEdit"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.outQuantity"
              :controls="controls"
              placeholder="请输入数量"
              :min="min"
              :precision="6"
              :max="max"
            ></el-input-number>
            <i class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="本次领料数量"
          width="220"
          align="center"
          v-if="type==='PROD_MATERIAL'"
          class-name="required-red"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.outQuantity"
              :controls="controls"
              placeholder="请输入数量"
              :min="min"
              :precision="6"
              :max="max"
            ></el-input-number>
            <i class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="采购单号" width="180" align="center" v-if="type==='PURCHASE'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="生产单号" width="180" align="center" v-if="type==='PROD_MATERIAL'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="销售订单号" width="180" align="center" v-if="type==='SALE'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="委外订单号"
          width="180"
          align="center"
          v-if="type==='SUPPLY_MATERIAL'||type==='SUPPLY'"
        >
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderQuantity"
          :label="type==='SUPPLY_MATERIAL'?'所需发料数量':'订单数量'"
          align="center"
          v-if="type!=='OTHER_OUT'"
        ></el-table-column>
        <el-table-column
          prop="prodQuantity"
          label="已领料数量"
          align="center"
          v-if="type==='PROD_MATERIAL'"
        ></el-table-column>
        <el-table-column prop="deliveryQuantity" label="已发货数量" align="center" v-if="type==='SALE'"></el-table-column>
        <el-table-column
          prop="stockInQuantity"
          label="已入库数量"
          align="center"
          v-if="type==='PURCHASE'||type==='SUPPLY_MATERIAL'"
        ></el-table-column>
        <el-table-column
          prop="returnQuantity"
          label="已退货数量"
          align="center"
          v-if="type==='SALE'||type==='PURCHASE'||type==='SUPPLY_MATERIAL'"
        ></el-table-column>
        <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="btn">
              <el-button
                size="small"
                type="text"
                class="yellow f14"
                @click="deleMaterial(scope.$index)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="remark">
      <div style="margin-bottom:20px;">备注</div>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="remark"
        maxlength="100"
        show-word-limit
        style="width:1020px;"
        :autosize="{ minRows: 5}"
      />
    </div>
    <tzCommonFileUpload @handleUploadFile="handleUploadFile" />
    <material
      isDisabled
      :visible="visible"
      @close="close"
      @submit="materialSubmit"
      :defaultData="tableData"
      :baseWarehouseId="personForm.baseWarehouseId"
    />
    <check-dialog
      :dialogVisible="checkVisible"
      @cancle="submitClose"
      @dialogSubmit="submitClose"
      :successData="successData"
      :failData="failData"
      successTitle="出货已出库"
      failTitle="出货未出库"
    />
    <tip-dialog
      :dialogVisible="tipVisible"
      :tipData="tipData"
      @cancle="tipVisible=false"
      :tipType="tipeType"
      @dialogSubmit="submitTipClose"
      :type="type"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import mix from '../../../mixins/dic'
import checkDialog from '../components/checkDialog.vue'
import tipDialog from '../components/tipDialog.vue'
import dic from '../../../global/dictionary'
import * as urls from '../../../router/routePath'
import { isObject, spanMethod, rowspan } from '../../../utils/utils'

export default {
  data () {
    return {
      rules: {
        managerStuff: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change'
          }
        ],
        baseCustomerId: [
          {
            required: true,
            message: '请选择客户',
            trigger: 'change'
          }
        ],
        baseWarehouseId: [
          {
            required: true,
            message: '请选择出库仓库',
            trigger: 'change'
          }
        ],
        baseSupplierId: [
          {
            required: true,
            message: '请选择供应商',
            trigger: 'change'
          }
        ]
      },
      dic,
      min: 0,
      max: 99999999,
      successData: [],
      failData: [],
      checkVisible: false,
      remark: '',
      controls: false,
      isShowBack: true,
      personForm: {},
      tableData: [],
      spanArr: [],
      type: '',
      visible: false,
      wareAmount: '',
      wareName: '',
      wareIndex: 0,
      fileList: [],
      orderList: [],
      tipVisible: false,
      tipData: [],
      tipeType: '',
      out: false,
      status: '',
      tableData1: [],
      orderIds: [],
      orderMaterialIds: []
    }
  },
  mixins: [mix],
  components: {
    checkDialog,
    tipDialog
  },
  created () {
    const { type, orderIds, orderMaterialIds } = this.$route.query
    this.type = type
    document.title = this.dic.wareOutTypes.filter(
      item => item.type === this.type
    )[0].name
    this.$set(
      this.personForm,
      'managerStuff',
      `(${this.userInfo.stuffNo})|${this.userInfo.realname}`
    )
    let params = {}
    if (this.type !== 'OTHER_OUT' && this.houseList.length) {
      this.orderIds = orderIds && orderIds.toString().split(',')
      this.orderMaterialIds = orderMaterialIds
        ? orderMaterialIds.toString().split(',')
        : undefined
      params = {
        orderIds: this.orderIds,
        orderMaterialIds: this.orderMaterialIds,
        type
      }
      this.getOrderDetail(params, '')
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      userInfo: state => state.global.userInfo,
      loading: state => state.global.btnLoading
    })
  },
  watch: {
    houseList (val) {
      if (val.length) {
        if (this.type !== 'OTHER_OUT') {
          if (this.$route.query.orderIds) {
            if (this.$route.query.orderIds.includes(',')) {
              this.orderIds = this.$route.query.orderIds.split(',')
            } else {
              this.orderIds.push(this.$route.query.orderIds)
            }
          }
          if (this.$route.query.orderMaterialIds) {
            if (this.$route.query.orderMaterialIds.includes(',')) {
              this.orderMaterialIds = this.$route.query.orderMaterialIds.split(
                ','
              )
            } else {
              this.orderMaterialIds.push(this.$route.query.orderMaterialIds)
            }
          } else {
            this.orderMaterialIds = undefined
          }
          const params = {
            orderIds: this.orderIds,
            orderMaterialIds: this.orderMaterialIds,
            type: this.$route.query.type
          }
          this.getOrderDetail(params, '')
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'A_ADD_WARE_OUT',
      'A_GET_ORDER_DETAIL',
      'A_GET_WARE_MATERIAL_AMOUNT'
    ]),
    toOrderDetail (row) {
      if (this.type === 'SALE') {
        this.$router.push({
          path: `${urls.SALE_DETAIL}/detail`,
          query: {
            id: row.refOrderId
          }
        })
      }
      if (this.type === 'PROD_MATERIAL') {
        this.$router.push({
          name: 'prodDetail',
          params: {
            id: row.refMaterialId
          }
        })
      }

      if (this.type === 'PURCHASE') {
        this.$router.push({
          name: 'orderPersonalAdd',
          params: {
            type: row.refDetailType,
            page: 'order',
            id: row.refOrderId
          }
        })
      }
      if (this.type === 'SUPPLY_MATERIAL' || this.type === 'SUPPLY') {
        this.$router.push({
          name: 'outsourceProductDetail',
          query: {
            id: row.refOrderId,
            type: row.refDetailType
          }
        })
      }
    },
    closeDialog () {
      this.checkVisible = false
    },
    submitTipClose () {
      this.out = true
      this.addBtn(this.status, 'personForm')
      this.tipVisible = false
    },
    wareChange (val) {
      if (this.type !== 'OTHER_OUT') {
        const params = {
          orderIds: this.orderIds,
          orderMaterialIds: this.orderMaterialIds,
          type: this.$route.query.type
        }
        this.getOrderDetail(params, val)
      } else {
        this.tableData = []
      }
    },
    submitClose () {
      this.checkVisible = false
      this.$router.push({
        name: 'warehouseOut'
      })
    },
    resetMaterial () {
      const params = {
        orderIds: this.orderIds,
        orderMaterialIds: this.orderMaterialIds,
        type: this.$route.query.type
      }
      this.getOrderDetail(params, this.personForm.baseWarehouseId)
    },
    async getOrderDetail (params, id) {
      const param1 = {
        ...params,
        warehouseId: id
      }
      const { status, data } = await this.A_GET_ORDER_DETAIL(param1)
      if (status === 0) {
        this.$set(this.personForm, 'baseCustomerId', data.baseCustomerId)
        this.$set(this.personForm, 'baseSupplierId', data.baseSupplierId)
        this.orderList = data.orderInfoList
        this.tableData = data.materialDtos || []
        this.tableData1 = data.orderMtrDtos || []
        this.resetSpan()
      }
    },
    addBtn (status, formName) {
      this.status = status
      let outType = this.type
      if (this.type === 'PURCHASE') {
        outType = 'PURCHASE_RETURN'
      }
      if (this.type === 'SUPPLY') {
        outType = 'SUPPLY_RETURN'
      }
      const params = {
        status,
        outType,
        materialList: this.tableData.map(item => ({
          ...item,
          quantity: item.outQuantity,
          baseWarehouseId: this.personForm.baseWarehouseId,
          baseSupplierId: this.personForm.baseSupplierId,
          outCheckFlag: item.outCheckFlag === 'Y' ? 'Y' : 'N'
        })),
        fileList: this.fileList,
        remark: this.remark,
        ...this.personForm
      }
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (!this.tableData.length) {
            this.$message.warning('产品信息不能为空')
            return
          }
          if (!this.tableData.every(item => item.outQuantity)) {
            if (this.type === 'PROD_MATERIAL') {
              this.$message.warning('本次领料数量不能为空')
            } else if (this.type === 'PURCHASE') {
              this.$message.warning('本次退货数量不能为空')
            } else {
              this.$message.warning('本次出库数量不能为空')
            }
            return
          }
          const outArr = this.tableData.filter(
            item => Number(item.outQuantity) > Number(item.stockQuantity)
          )
          if (outArr.length) {
            this.tipData = outArr
            this.tipeType = '库存'
            this.tipVisible = true
            return
          }
          const outArr1 = this.tableData.filter(
            item => Number(item.outQuantity) + Number(item.deliveryQuantity) >
              Number(item.orderQuantity)
          )
          if (outArr1.length && !this.out) {
            this.tipData = outArr1
            this.tipeType = '发货'
            this.tipVisible = true
            return
          }
          if (status === 'stockOut') {
            this.A_ADD_WARE_OUT(params).then((res) => {
              if (res.data) {
                this.successData = res.data.inMaterial
                this.failData = res.data.checkList
                this.checkVisible = true
              }
            })
          } else {
            this.A_ADD_WARE_OUT(params)
          }
        } else {
          let dom = null
          if (isObject(object) && Object.keys(object).length > 0) {
            dom = this.$refs[Object.keys(object)[0]]
            dom.$el.scrollIntoView({
              // 滚动到指定节点
              block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
              behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
            })
          }
        }
      })
    },
    handleUploadFile (fileList) {
      this.fileList = fileList.files
    },
    wareSelect (scope) {
      this.wareIndex = scope.$index
      this.wareVisible = true
    },
    deleMaterial (index) {
      this.tableData.splice(index, 1)
      this.resetSpan()
    },
    addMaterial () {
      if (!this.personForm.baseWarehouseId) {
        this.$message.warning('请先选择出库仓库')
      } else {
        this.visible = true
      }
    },
    async materialSubmit (material) {
      let datas = material.map(item => ({
        baseMaterialId: item.baseMaterialId,
        materialName: item.materialName,
        materialCode: item.materialCode,
        typeName: item.typeName,
        spec: item.spec,
        picNum: item.picNum,
        baseWarehouseId: this.personForm.baseWarehouseId,
        outCheckFlag: item.outCheckFlag === 'Y' ? 'Y' : 'N',
        minSafetyStock: item.minSafetyStock,
        stockQuantity: item.stockQuantity,
        quantity: item.quantity,
        unitName: item.unitName
      }))
      if (this.type === 'PROD_MATERIAL' || this.type === 'SUPPLY_MATERIAL') {
        const materialIds = datas.map(item => item.baseMaterialId)
        const refCodes = this.orderList.map(item => item.refCode)
        const allArr = []
        this.orderList.forEach((item) => {
          const arr = datas.map(i => ({
            ...i,
            refMaterialId: item.refMaterialId,
            refCode: item.refCode,
            orderQuantity: 0,
            prodQuantity: 0
          }))
          allArr.push(...arr)
        })
        datas = allArr
        const { status, data } = await this.A_GET_WARE_MATERIAL_AMOUNT({
          materialIds,
          refCodes
        })
        if (data.length && status === 0) {
          datas.forEach((item, index) => {
            data.forEach((i) => {
              if (
                i.baseMaterialId === item.baseMaterialId &&
                i.refCode === item.refCode
              ) {
                datas[index].prodQuantity = i.quantity
              }
            })
          })
        }
      }
      this.tableData = [...this.tableData, ...datas]
      this.resetSpan()
      this.visible = false
    },
    close () {
      this.visible = false
    },
    resetSpan () {
      this.spanArr = []
      this.spanArr = rowspan(this.tableData, 'baseMaterialId')
    },
    objectSpanMethod ({
 row, column, rowIndex, columnIndex
}) {
      return spanMethod(
        {
          rowIndex,
          columnIndex
        },
        this.spanArr,
        [1, 2, 3, 4, 5, 6, 7, 8]
      )
    }
  }
}
</script>

<style>
</style>
