<template>
  <div class="addPage">
    <tzHeadline :title="type|filterDic(dic.wareInTypes,'type','name')" :isShowBack="true">
      <template slot="btn">
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('receive','personForm')"
          :loading="status === 'receive' && loading">保存</el-button>
        <el-button round size="medium" class="tz-btn-add" @click="addBtn('stockIn','personForm')"
          :loading="status === 'stockIn' && loading">保存并入库</el-button>
      </template>
    </tzHeadline>
    <el-form label-position="top" :rules="rules" label-width="80px" :inline="true" :model="personForm" ref="personForm">
      <el-col>
        <el-col :span="5">
          <el-form-item label="负责人" prop="managerStuff" ref="managerStuff">
            <el-select v-model.trim="personForm.managerStuff" filterable placeholder="请选择">
              <el-option v-for="item in employeeList" :key="item.id" :label="item.val" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="type==='PURCHASE'||type==='SUPPLY'||type==='OTHER_IN'">
          <el-form-item label="供应商">
            <el-select v-model.trim="personForm.baseSupplierId" filterable placeholder="请选择"
              :disabled="type==='PURCHASE'||type==='SUPPLY'">
              <el-option v-for="item in supplierList" :key="item.baseSupplierId" :label="item.supplierName"
                :value="item.baseSupplierId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="type==='SALE'">
          <el-form-item label="客户" prop="baseCustomerId" ref="baseCustomerId">
            <el-select v-model.trim="personForm.baseCustomerId" filterable placeholder="请选择" disabled>
              <el-option v-for="item in customerList" :key="item.baseCustomerId" :label="item.customerName"
                :value="item.baseCustomerId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
    <div class="section2">
      <div class="section-label">{{type|filterDic(dic.wareInTypes,'type','order')}}</div>
      <div class="order-list">
        <div class="order-item" v-for="(item,index) in detailData.orderInfoList" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">{{type|filterDic(dic.wareInTypes,'type','order')}}号：</span>
            <span class="order-item-detail">{{item.refCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.createBy}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section3">
      <div class="d-flex justify-between" style="width:100%;">
        <div class="section-label">产品信息·{{type|filterDic(dic.wareInTypes,'type','material')}}</div>
        <el-button round size="medium" class="tz-search-submit" @click="addMaterial" v-if="type==='OTHER_IN'">添加物料
        </el-button>
        <el-button round size="medium" class="tz-search-submit" @click="resetMaterial" v-else>重置</el-button>
      </div>
      <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px"
        :header-cell-style="{'background-color': '#F9F9F9'}">
        <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库仓库" width="180" align="center" class-name="required-red">
          <template slot-scope="scope">
            <div class="ware" @click="wareSelect(scope)">
              <span>{{scope.row.baseWarehouseName?scope.row.baseWarehouseName:'请选择仓库'}}</span>
              <i class="el-icon-edit edit-icon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="本次入库数量" width="220" align="center" v-if="type!=='SALE'" class-name="required-red">
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
              <el-input-number v-model="scope.row.inQuantity" :controls="controls" placeholder="请输入数量" :min="min"
                :precision="6" :max="max">
              </el-input-number>
              <i class="el-icon-edit"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="本次退货数量" width="220" align="center" v-if="type==='SALE'" class-name="required-red">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.inQuantity" :controls="controls" placeholder="请输入数量" :min="min"
              :precision="6" :max="max">
            </el-input-number>
            <i class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="采购单号" width="180" align="center" v-if="type==='PURCHASE'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderQuantity" label="采购数量" width="180" align="center" v-if="type==='PURCHASE'">
        </el-table-column>
        <el-table-column label="委外订单号" width="180" align="center" v-if="type==='SUPPLY'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderQuantity" label="委外数量" width="180" align="center" v-if="type==='SUPPLY'">
        </el-table-column>
        <el-table-column label="生产单号" width="180" align="center" v-if="type==='PROD'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderQuantity" label="计划数量" width="180" align="center" v-if="type==='PROD'">
        </el-table-column>
        <el-table-column label="销售订单号" width="180" align="center" v-if="type==='SALE'">
          <template slot-scope="scope">
            <div class="yellow" @click="toOrderDetail(scope.row)">{{scope.row.refCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="已发货数量" prop="deliveryQuantity" align="center" v-if="type==='SALE'"></el-table-column>
        <el-table-column prop="stockInQuantity" label="已入库数量" align="center" v-if="type!=='SALE'&&type!=='OTHER_IN'">
        </el-table-column>
        <el-table-column label="已退货数量" prop="returnQuantity" align="center"
          v-if="type==='SALE'||type==='PURCHASE'||type==='SUPPLY'"></el-table-column>
        <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="btn">
              <el-button size="small" type="text" class="yellow f14" @click="deleMaterial(scope.$index,tableData)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="remark">
      <div style="margin-bottom:20px;">备注</div>
      <el-input type="textarea" placeholder="请输入内容" v-model="remark" maxlength="100" show-word-limit
        style="width:1020px;" :autosize="{ minRows: 5}"/>
    </div>
    <tzCommonFileUpload @handleUploadFile="handleUploadFile" />
    <material isDisabled :visible="visible" @close="close" @submit="materialSubmit" :defaultData="tableData" />
    <tzWare :dialogVisible="wareVisible" @submit="wareSubmit" @cancle="wareCancle" />
    <check-dialog :dialogVisible="checkVisible" @cancle="submitClose" @dialogSubmit="submitClose"
      :successData="successData" :failData="failData" />
    <tip-dialog :dialogVisible="tipVisible" :tipData="tipData" @cancle="tipVisible=false" :tipType="tipeType"
      :type="type" @dialogSubmit="submitTipClose" />
  </div>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapGetters,
    mapMutations
  } from 'vuex'
  import mix from '../../../mixins/dic'
  import checkDialog from '../components/checkDialog.vue'
  import tipDialog from '../components/tipDialog.vue'
  import dic from '../../../global/dictionary'
  import * as urls from '../../../router/routePath'
  import {
    isObject,
    spanMethod,
    rowspan
  } from '../../../utils/utils'

  export default {
    data () {
      return {
        rules: {
          managerStuff: [{
            required: true,
            message: '请选择负责人',
            trigger: 'change'
          }],
          baseCustomerId: [{
            required: true,
            message: '请选择客户',
            trigger: 'change'
          }]
        },
        dic,
        min: 0,
        max: 99999999,
        successData: [],
        failData: [],
        checkVisible: false,
        wareVisible: false,
        remark: '',
        controls: false,
        personForm: {},
        tableData: [],
        spanArr: [],
        type: '',
        visible: false,
        wareAmount: '',
        wareName: '',
        wareIndex: 0,
        fileList: [],
        detailData: {},
        tipeType: '',
        tipVisible: false,
        tipData: [],
        orderIds: [],
        orderMaterialIds: [],
        status: '',
        out: false,
        spanArr5: []
      }
    },
    mixins: [mix],
    components: {
      checkDialog,
      tipDialog
    },
    computed: {
      ...mapGetters(['employeeList']),
      ...mapState({
        userInfo: state => state.global.userInfo,
        loading: state => state.global.btnLoading
      })
    },
    created () {
      this.$set(
        this.personForm,
        'managerStuff',
        `(${this.userInfo.stuffNo})|${this.userInfo.realname}`
      )
      const {
        type,
        orderIds,
        orderMaterialIds
      } = this.$route.query
      this.type = type
      document.title = this.dic.wareInTypes.filter(
        item => item.type === this.type
      )[0].name
      let params = {}
      if (type !== 'OTHER_IN') {
        this.orderIds = orderIds && orderIds.toString().split(',')
        this.orderMaterialIds = orderMaterialIds
          ? orderMaterialIds.toString().split(',')
          : undefined
        params = {
          orderIds: this.orderIds,
          orderMaterialIds: this.orderMaterialIds,
          type
        }
        this.getOrderDetail(params)
      }
    },
    methods: {
      ...mapActions(['A_ADD_WARE_IN', 'A_GET_ORDER_DETAIL']),
      ...mapMutations(['BTN_LOADING']),
      toOrderDetail (row) {
        if (this.type === 'SALE') {
          this.$router.push({
            path: `${urls.SALE_DETAIL}/detail`,
            query: {
              id: row.refOrderId
            }
          })
        }
        if (this.type === 'PROD') {
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
        if (this.type === 'SUPPLY') {
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
      submitClose () {
        this.checkVisible = false
        this.$router.push({
          name: 'warehouseIn'
        })
      },
      submitTipClose () {
        this.out = true
        this.addBtn(this.status, 'personForm')
        this.tipVisible = false
      },
      resetMaterial () {
        const params = {
          orderIds: this.orderIds,
          orderMaterialIds: this.orderMaterialIds,
          type: this.$route.query.type
        }
        this.getOrderDetail(params)
      },
      async getOrderDetail (params) {
        const {
          status,
          data
        } = await this.A_GET_ORDER_DETAIL(params)
        if (status === 0) {
          this.$set(this.personForm, 'baseCustomerId', data.baseCustomerId)
          this.$set(this.personForm, 'baseSupplierId', data.baseSupplierId)
          this.detailData = data
          this.tableData = data.materialDtos
          this.resetSpan()
        }
      },
      addBtn (status, formName) {
        this.status = status
        const materialList = this.tableData.map(item => ({
          baseMaterialId: item.baseMaterialId,
          materialName: item.materialName,
          materialCode: item.materialCode,
          typeName: item.typeName,
          spec: item.spec,
          quantity: item.inQuantity || undefined,
          refCode: this.type !== 'OTHER_IN' ? item.refCode : null,
          refMaterialId: this.type !== 'OTHER_IN' ? item.refMaterialId : null,
          baseWarehouseId: item.baseWarehouseId,
          inCheckFlag: item.inCheckFlag
        }))
        materialList.forEach((item) => {
          if (!item.baseWarehouseId) {
            const arr = materialList.filter(
              i => i.baseMaterialId === item.baseMaterialId
            )
            if (arr.length) {
              this.$set(item, 'baseWarehouseId', arr[0].baseWarehouseId)
              // item.baseWarehouseId = arr[0].baseWarehouseId
            }
          }
        })
        this.$refs[formName].validate((valid, object) => {
          if (valid) {
            const params = {
              status,
              inType: this.type === 'SALE' ? 'SALE_RETURN' : this.type,
              materialList,
              fileList: this.fileList,
              remark: this.remark,
              ...this.personForm
            }
            // if (!params.managerStuff) {
            //   this.$message.warning('负责人不能为空')
            //   return
            // }
            if (!this.tableData.length) {
              this.$message.warning('产品信息不能为空')
              return
            }
            if (!this.tableData.every(item => item.inQuantity)) {
              if (this.type === 'SALE') {
                this.$message.warning('退货数量不能为空')
              } else {
                this.$message.warning('本次入库数量不能为空')
              }
              return
            }
            if (!materialList.every(item => item.baseWarehouseId)) {
              this.$message.warning('入库仓库不能为空')
              return
            }
            const arr = this.tableData.filter(
              item => Number(item.deliveryQuantity) < Number(item.inQuantity) &&
              this.type === 'SALE'
            )
            if (arr.length) {
              this.tipData = arr
              this.tipeType = '入库'
              this.tipVisible = true
              return
            }
            const arr1 = this.tableData.filter(
              item => Number(item.inQuantity) + Number(item.stockInQuantity) >
              Number(item.orderQuantity) &&
              (this.type === 'PROD' || this.type === 'PURCHASE')
            )
            if (arr1.length && !this.out) {
              this.tipData = arr1
              this.tipeType = '入库'
              this.tipVisible = true
              return
            }
            if (status === 'stockIn') {
              this.A_ADD_WARE_IN(params).then((res) => {
                if (res.data) {
                  this.successData = res.data.inMaterial
                  this.failData = res.data.checkList
                  this.checkVisible = true
                }
              })
            } else {
              this.A_ADD_WARE_IN(params)
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
      wareCancle () {
        this.wareVisible = false
      },
      deleMaterial (index, rows) {
        rows.splice(index, 1)
        this.resetSpan()
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
          inQuantity: undefined,
          baseWarehouseName: item.defaultWarehouseName,
          baseWarehouseId: item.defaultWarehouseId,
          unitName: item.unitName,
          inCheckFlag: item.inCheckFlag === 'Y' ? 'Y' : 'N'
        }))
        this.tableData = [...this.tableData, ...datas]
        this.resetSpan()
        this.visible = false
      },
      close () {
        this.visible = false
      },
      wareSubmit (ware) {
        this.wareVisible = false
        this.tableData[this.wareIndex].baseWarehouseName = ware.warehouseName
        this.tableData[this.wareIndex].baseWarehouseId = ware.baseWarehouseId
      },
      resetSpan () {
        this.spanArr = []
        this.spanArr = rowspan(this.tableData, 'baseMaterialId')
      },
      objectSpanMethod ({
        rowIndex,
        columnIndex
      }) {
        return spanMethod({
            rowIndex,
            columnIndex
          },
          this.spanArr,
          this.type !== 'OTHER_IN' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5])
      }
    }
  }

</script>

<style scoped>
</style>
