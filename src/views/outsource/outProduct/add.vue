<template>
  <div class="addPage">
    <tzHeadline
      :title="type|filterDic(dic.outSourceTypes,'type',pageType)"
      :isShowBack="isShowBack"
    >
      <template slot="btn">
        <el-button
          round
          size="medium"
          class="tz-btn-add"
          @click="addBtn('save','personForm')"
          :loading="status === 'save' && loading"
        >保存</el-button>
        <el-button
          round
          size="medium"
          class="tz-btn-add"
          @click="addBtn('check','personForm')"
          :loading="status === 'check' && loading"
          v-if="pageType==='add'"
        >保存并送审</el-button>
      </template>
    </tzHeadline>
    <el-form
      label-position="top"
      :rules="rules"
      label-width="80px"
      :inline="true"
      :model="personForm"
      ref="personForm"
    >
      <el-col>
        <el-col :span="5">
          <el-form-item label="负责人" prop="managerStuffId" ref="managerStuff">
            <el-select v-model.trim="personForm.managerStuffId" filterable placeholder="请选择">
              <el-option
                v-for="item in employeeList"
                :key="item.id"
                :label="item.val"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="供应商" prop="baseSupplierId" ref="baseSupplierId">
            <el-select v-model.trim="personForm.baseSupplierId" filterable placeholder="请选择">
              <el-option
                v-for="item in supplierList"
                :key="item.baseSupplierId"
                :label="item.supplierName"
                :value="item.baseSupplierId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
    <div class="section2" v-if="type==='SALE'">
      <div class="section-label">关联单据</div>
      <div class="order-list">
        <div class="order-item" v-for="(item,index) in orderInfoList" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">销售订单号：</span>
            <span class="order-item-detail">{{item.saleCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.createBy}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section3" v-if="type==='NONE'">
      <div class="d-flex justify-between" style="width:100%;">
        <div class="section-label">产品信息</div>
        <el-button round size="medium" class="tz-search-submit" @click="addMaterial">添加物料</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="委外数量" width="220" align="center" class-name="required-red">
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
              <el-input-number
                v-model="scope.row.supplyOrderQuantity"
                :controls="controls"
                placeholder="请输入数量"
                :min="min"
                :precision="precision"
                :max="max"
              ></el-input-number>
              <i class="el-icon-edit"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="委外单价" width="180" align="center">
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
              <el-input-number
                v-model="scope.row.unitPrice"
                :controls="controls"
                placeholder="请输入单价"
                :precision="precision"
                :min="min"
                :max="max"
              ></el-input-number>
              <i class="el-icon-edit"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="btn">
              <el-button
                size="small"
                type="text"
                class="yellow f14"
                @click="deleMaterial(scope.$index,tableData)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="section3" v-if="type==='SALE'">
      <div class="d-flex justify-between" style="width:100%;">
        <div class="section-label">产品信息·销售成品委外</div>
        <el-button round size="medium" class="tz-search-submit" @click="resetMaterial">重置</el-button>
      </div>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售订单号" width="180" align="center">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.saleCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="订单数量" width="180" align="center"></el-table-column>
        <el-table-column label="委外参考数量" prop="referQuantity" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.referQuantity < 0">0</div>
            <div v-else>{{scope.row.referQuantity}}</div>
          </template>
        </el-table-column>
        <el-table-column label="委外数量" width="220" align="center" class-name="required-red">
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
              <el-input-number
                v-model="scope.row.supplyOrderQuantity"
                :controls="controls"
                placeholder="请输入数量"
                :min="min"
                :precision="precision"
                :max="max"
              ></el-input-number>
              <i class="el-icon-edit"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="委外单价" width="220" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.unitPrice"
              :controls="controls"
              placeholder="请输入单价"
              :min="min"
              :precision="precision"
              :max="max"
              @change="priceChange(scope.row)"
            ></el-input-number>
            <i class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="btn">
              <el-button
                size="small"
                type="text"
                class="yellow f14"
                @click="deleMaterial(scope.$index,tableData)"
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
    <tzCommonFileUpload @handleUploadFile="handleUploadFile" :fileList="fileList"></tzCommonFileUpload>
    <material
      isDisabled
      :visible="visible"
      @close="visible = false"
      @submit="materialSubmit"
      :defaultData="tableData"
    />
    <tzTipDialog
      :visible="tipVisible"
      :singleBtn="singleBtn"
      @close="tipVisible=false"
      @submit="dialogSubmit"
    >
      <template v-slot:tipTitle>您提交的订单中，以下单据已超出委外参考量</template>
      <template v-slot:tipTable>
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList"
        >
          <el-table-column property="materialName" label="物料名称" align="center"></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
  </div>
</template>

<script>
import {
 mapState, mapActions, mapGetters, mapMutations
} from 'vuex'
import mix from '../../../mixins/dic'
import dic from '../../../global/dictionary'
import * as urls from '../../../router/routePath'
import { isObject, spanMethod, rowspan } from '../../../utils/utils'

export default {
  name: 'outsourceProductAdd',
  data () {
    return {
      rules: {
        managerStuffId: [
          {
            required: true,
            message: '请选择负责人',
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
      pageType: 'add',
      supplyId: '',
      spanArr: [],
      fileList: [],
      orderInfoList: [],
      detailObj: {},
      tipVisible: false,
      singleBtn: false,
      orderList: [],
      params: {},
      dic,
      min: 0,
      precision: 6,
      max: 99999999,
      remark: '',
      controls: false,
      isShowBack: true,
      personForm: {},
      tableData: [],
      position: 0,
      type: '',
      visible: false,
      status: '',
      resetFlag: false
    }
  },
  mixins: [mix],
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      userInfo: state => state.global.userInfo,
      loading: state => state.global.btnLoading
    })
  },
  created () {
    this.$set(this.personForm, 'managerStuffId', this.userInfo.stuffId)
    const {
 ids, type, pageType, supplyId
} = this.$route.query
    this.type = type
    this.pageType = pageType || 'add'
    if (this.pageType === 'add') {
      document.title = this.dic.outSourceTypes.filter(
        item => item.type === this.type
      )[0].add
      if (this.type === 'SALE') {
        const idArr = ids.toString().split(',')
        this.getOrderDetail(idArr)
      }
    } else {
      this.supplyId = supplyId
      document.title = this.dic.outSourceTypes.filter(
        item => item.type === this.type
      )[0].edit
      this.getSupplyOrderDetail()
    }
  },
  methods: {
    ...mapActions([
      'A_ADD_OUT_PRODUCT',
      'A_GET_SALE_OUT_DETAIL',
      'A_GET_OUT_PRODUCT_ORDER_DETAIL',
      'A_EDIT_OUT_PRODUCT_ORDER',
      'A_CHECK_OUT_PRODUCT_ORDER',
      'POST_GLOBAL_AUDITOR'
    ]),
    ...mapMutations(['BTN_LOADING']),
    // 继续提交
    dialogSubmit () {
      this.tipVisible = false
      this.saveAndCheck(this.params)
    },
    // 获取委外成品的详情
    getSupplyOrderDetail () {
      this.A_GET_OUT_PRODUCT_ORDER_DETAIL({
        id: this.supplyId
      }).then((res) => {
        if (res.data) {
          this.detailObj = res.data
          this.tableData =
            this.type === 'NONE'
              ? res.data.supplyOrderMaterial
              : res.data.supplyOrderSalesMaterial
          if (this.type === 'SALE') {
            this.tableData = this.tableData.map(item => ({
              ...item,
              supplyOrderQuantity: item.quantity,
              quantity: item.saleOrderQuantity
            }))
          }
          if (!this.resetFlag) {
            this.personForm = {
              managerStuffId: res.data.managerStuffId,
              baseSupplierId: res.data.baseSupplierId
            }
            this.orderInfoList = res.data.supplyOrderTop
            this.remark = res.data.remark
            this.fileList = res.data.baseFileDtoList || []
          }
          this.spanArr = rowspan(this.tableData, 'baseMaterialId')
        }
      })
    },
    priceChange (row) {
      this.tableData.forEach((i, index) => {
        if (i.baseMaterialId === row.baseMaterialId) {
          this.tableData[index].unitPrice = row.unitPrice
        }
      })
    },
    toOrderDetail (row) {
      if (this.type === 'SALE') {
        this.$router.push({
          path: `${urls.SALE_DETAIL}/detail`,
          query: {
            id: row.saleOrderId
          }
        })
      }
    },
    resetMaterial () {
      if (this.pageType === 'edit') {
        this.resetFlag = true
        this.getSupplyOrderDetail()
      } else {
        const idArr = this.$route.query.ids.toString().split(',')
        this.getOrderDetail(idArr)
      }
    },
    async getOrderDetail (params) {
      const { status, data } = await this.A_GET_SALE_OUT_DETAIL(params)
      if (status === 0) {
        this.tableData = data.supplyOrderMaterial.map(item => ({
          ...item,
          supplyOrderQuantity: undefined,
          referQuantity: item.referQuantity < 0 ? 0 : item.referQuantity,
          unitPrice: undefined
        }))
        this.tableData.sort((a, b) => b.baseMaterialId - a.baseMaterialId)
        this.orderInfoList = data.supplyOrderTop
        this.spanArr = []
        this.spanArr = rowspan(this.tableData, 'baseMaterialId')
      }
    },
    addBtn (status1, formName) {
      const supplyOrderMaterial = this.tableData
      const managerStuff = this.employeeList.filter(
        item => item.id === this.personForm.managerStuffId
      )[0].val
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          const params = {
            supplyOrderMaterial,
            remark: this.remark,
            ...this.personForm,
            managerStuff,
            baseFileVoList: this.fileList,
            supplyType: this.type
          }
          if (!params.managerStuffId) {
            this.$message.warning('负责人不能为空')
            return
          }
          if (!this.tableData.length) {
            this.$message.warning('产品信息不能为空')
            return
          }
          if (!this.tableData.every(item => item.supplyOrderQuantity)) {
            this.$message.warning('委外数量不能为空')
            return
          }
          if (status1 === 'save' && this.pageType === 'add') {
            this.A_ADD_OUT_PRODUCT(params).then((res) => {
              if (res.status === 0) {
                this.BTN_LOADING()
                this.$message.success('新增成功')
                this.$router.push({
                  name: 'outsourceProduct'
                })
              }
            })
          }
          if (
            status1 === 'check' &&
            this.pageType === 'add' &&
            this.type === 'SALE'
          ) {
            const paraArr = this.tableData.map(item => ({
              quantityDisplay: item.supplyOrderQuantity,
              saleOrderMaterialId: item.saleOrderMaterialId,
              saleOrderCode: item.saleCode,
              materialName: item.materialName,
              materialCode: item.materialCode,
              saleOrderId: item.saleOrderId
            }))
            this.A_CHECK_OUT_PRODUCT_ORDER({
              saleOrderMaterialVoList: paraArr
            }).then((res) => {
              if (res.status === 0) {
                if (res.data.length) {
                  this.BTN_LOADING()
                  this.orderList = res.data
                  this.tipVisible = true
                  this.params = params
                } else {
                  this.saveAndCheck(params)
                }
              }
            })
          }
          if (
            status1 === 'check' &&
            this.pageType === 'add' &&
            this.type === 'NONE'
          ) {
            this.saveAndCheck(params)
          }
          if (status1 === 'save' && this.pageType === 'edit') {
            this.A_EDIT_OUT_PRODUCT_ORDER({
              ...params,
              supplyOrderId: this.detailObj.supplyOrderId
            }).then((res) => {
              if (res.status === 0) {
                this.$message.success('编辑成功')
                this.$router.push({
                  name: 'outsourceProduct'
                })
              }
            })
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
    saveAndCheck (params) {
      this.A_ADD_OUT_PRODUCT(params).then((res) => {
        if (res.status === 0) {
          this.POST_GLOBAL_AUDITOR([
            {
              targetId: res.data.supplyOrderId,
              targetCode: res.data.supplyCode,
              targetType: 'SUPPLY'
            }
          ]).then((res1) => {
            if (res1.status === 0) {
              this.BTN_LOADING()
              this.$message.success('保存并送审成功')
              this.$router.push({
                name: 'outsourceProduct'
              })
            }
          })
        }
      })
    },
    handleUploadFile (fileList) {
      this.fileList = fileList.files
    },
    deleMaterial (index, rows) {
      rows.splice(index, 1)
      this.spanArr = rowspan(this.tableData, 'baseMaterialId')
    },
    addMaterial () {
      this.visible = true
    },
    materialSubmit (data) {
      const datas = data.map(item => ({
        baseMaterialId: item.baseMaterialId,
        materialName: item.materialName,
        materialCode: item.materialCode,
        typeName: item.typeName,
        spec: item.spec,
        picNum: item.picNum,
        supplyOrderQuantity: undefined,
        unitName: item.unitName
      }))
      this.tableData = [...this.tableData, ...datas]
      // this.resetSpan()
      this.visible = false
    },
    objectSpanMethod ({ rowIndex, columnIndex }) {
      return spanMethod(
        {
          rowIndex,
          columnIndex
        },
        this.spanArr,
        [0, 1, 2, 3, 4, 9]
      )
    }
  }
}
</script>

<style scoped>
</style>>
