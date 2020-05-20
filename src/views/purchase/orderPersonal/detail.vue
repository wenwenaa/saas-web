<template>
  <div class="addPage">
    <tzHeadline
      :title="dicAll[routeParams.type]"
      backText="返回"
      isShowBack
      :customBack="false"
      @back="goBack"
    >
      <template slot="btn">
        <div v-if="routeParams.type==='add' || routeParams.type==='edit'">
          <el-button
            round
            size="medium"
            class="tz-search-submit tz-btn-add"
            @click="submitForm('ruleForm')"
            :loading="!status&&loading"
          >保存</el-button>
          <el-button
            round
            size="medium"
            class="tz-search-submit tz-btn-add"
            @click="submitForm('ruleForm','auditor')"
            v-if="routeParams.type!=='edit'"
            :loading="status==='auditor'&&loading"
          >保存并送审</el-button>
        </div>
        <div v-else>
          <el-button class="tz-search-submit" round size="medium" @click="openPrint">打印</el-button>
          <el-button v-if="detailObj.status === 'DRAFT'" round size="medium" class="tz-btn-add" @click="editBtn">编辑</el-button>
          <el-button
            round
            size="medium"
            class="tz-search-submit tz-btn-add"
            v-if="detailObj.status === 'DRAFT'"
            @click="approveBtn(detailObj)"
          >送审</el-button>
        </div>
      </template>
    </tzHeadline>
    <el-form
      label-position="top"
      ref="ruleForm"
      label-width="80px"
      :rules="rules"
      :inline="true"
      :model="ruleForm"
      v-if="!view"
    >
      <el-row>
        <div class="section-label">基本信息</div>
        <el-col :span="3" class="pd-zero" v-if="!view">
          <el-form-item label="供应商" prop="baseSupplierId" ref="baseSupplierId">
            <el-select
              class="w100"
              v-model="ruleForm.baseSupplierId"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                v-for="(item,index) in supplierList"
                :key="index"
                :label="item.supplierName"
                :value="item.baseSupplierId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3" class="pd-zero" v-if="!view">
          <el-form-item label="负责人" prop="managerStuffId" ref="managerStuffId">
            <el-select
              class="w100"
              v-model="ruleForm.managerStuffId"
              placeholder="默认账号获取可修改"
              filterable
              clearable
            >
              <el-option
                v-for="(item,index) in employeeList"
                :key="index"
                :label="item.val"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="view">
      <div class="section-label">基本信息</div>
      <span class="mr50">
        <label class="gray">采购订单号：</label>
        {{detailObj.purchaseCode}}
      </span>
      <span class="mr50">
        <label class="gray">供应商：</label>
        {{detailObj.supplierName}}
      </span>
      <span class="mr50">
        <label class="gray">负责人：</label>
        {{detailObj.managerStuff}}
      </span>
      <p class="mr20 mt10 wordWrap">
        <label class="gray">备注：</label>
        {{detailObj.remark}}
      </p>
    </div>
    <div
      class="section-label mt20"
      v-if="!view && (routeParams.type === 'add' || routeParams.type === 'edit')"
    >
      <span class="lf-title">产品信息</span>
      <span class="rf-material">
        <el-button round size="medium" class="tz-search-submit mr20" @click="visible = true">添加物料</el-button>
        <el-date-picker
          v-model="deliveryDate"
          type="date"
          placeholder="设置默认交期"
          @change="setDate"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </span>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="!view"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left" />
      <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column prop="minSafetyStock" label="最低安全库存数量" align="center" />
      <el-table-column prop="displayTotalQuantity" label="库存数量" width="180" align="center">
        <template slot-scope="scope">{{scope.row.displayTotalQuantity}}</template>
      </el-table-column>
      <el-table-column label="采购数量" width="220" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.displayQuantity"
            :controls="false"
            :precision="6"
            :min="0"
            :max="99999999"
            placeholder="请输入"
          />
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column label="交期" width="220" align="center" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.sendDate"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" width="220" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.displayUnitPrice"
            :controls="false"
            :precision="6"
            :min="0"
            :max="99999999"
            placeholder="请输入"
          />
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="displayTotalPrice" label="含税总价" width="180" align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.displayQuantity * scope.row.displayUnitPrice ||0).toFixed(6)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <div class="btn">
            <el-button size="small" type="text" class="yellow f14" @click="delBtn(scope.$index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="remark mb10" v-if="!view">
      <div style="margin-bottom:20px;">备注</div>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="ruleForm.remark"
        maxlength="100"
        show-word-limit
        style="width:1020px;"
        :autosize="{ minRows: 5}"
      />
    </div>
    <div class="pic-box">
      <!-- <div v-if="!view" class="title f16 mb5">上传图片</div>-->
      <!--<div v-if="!view" class="gray mb10">附件支持上传图片和文件，大小不超过2M</div>-->
      <tzCommonFileUpload
        style="margin-top: 20px"
        type="all"
        :applicationType="(routeParams.type === 'add' || routeParams.type === 'edit') ? 'add' : 'detail'"
        :fileList="fileList||[]"
        @handleUploadFile="uploadSuccess"
      />
    </div>
    <div v-if="view && routeParams.type !== 'NONE'" class="section2">
      <div class="section-label">关联单据</div>
      <div class="order-list">
        <div
          class="order-item"
          v-for="(item, index) in detailObj.purchaseOrderRefsVos || []"
          :key="index"
        >
          <div class="left-order-item">
            <span class="order-item-title">{{dicTypeAll[routeParams.type]}}：</span>
            <span class="order-item-detail">{{item.refCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.stuff}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="step-box mt20" v-if="view">
      <p class="mb10">
        <span class="f16 mr10">订单状态</span>
        <tzBtn icon="tz-icon-view" cls="blue" @click="dialogVisible = true">查看记录</tzBtn>
      </p>
      <tzSteps2 :stepsList="dictionary.auditStatus" titleName="name" :activeVal="detailObj.status">
        <template v-slot:desc="slotProp">
          <div v-if="slotProp.step.type==='DRAFT'" class="desc-item">
            <el-button
              round
              size="medium"
              class="tz-search-transparent"
              v-if="detailObj.status === 'DRAFT'"
              @click="approveBtn(detailObj)"
            >送审</el-button>
            <el-button
              round
              size="medium"
              class="tz-search-transparent"
              v-if="detailObj.status === 'DRAFT'"
              @click="delAuditBtn(detailObj.purchaseOrderId)"
            >删除订单</el-button>
          </div>
          <div v-else-if="slotProp.step.type==='SUBMIT'" class="desc-item">
            <el-button
              v-if="detailObj.status === 'SUBMIT'"
              round
              size="mini"
              @click="recallAudit"
              class="tz-search-transparent mt8"
            >撤销</el-button>
          </div>
          <div v-else-if="slotProp.step.type==='CLOSED'" class="desc-item">
            <el-button
              v-if="detailObj.status === 'APPROVED'"
              round
              size="mini"
              class="tz-search-transparent mt8"
              @click="setClose(detailObj.purchaseOrderId)"
            >关闭订单</el-button>
            <el-button
              v-if="detailObj.status === 'CLOSED'"
              round
              size="mini"
              class="tz-search-transparent mt8"
              @click="setOpen(detailObj.purchaseOrderId)"
            >打开订单</el-button>
          </div>
        </template>
      </tzSteps2>
      <p class="mb10" v-if="view">
        <span class="f16 mr10">入库状态</span>
      </p>
      <tzSteps2
        v-if="view"
        :stepsList="dictionary.completionStatus1"
        titleName="name"
        :activeVal="detailObj.pushStatus"
      />
    </div>
    <div class="section-label mt20" v-if="view">
      <span
        class="lf-title"
      >产品信息·{{(routeParams.type=='NONE'|| routeParams.type=='add' || routeParams.type=='edit') ?'无来源':'汇总'}}</span>
    </div>
    <el-table
      :data="detailObj.purchaseOrderMaterialVos"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="view"
    >
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column prop="quantity" label="采购数量" align="center" />
      <el-table-column prop="unitName" label="单位" align="center" />
      <el-table-column prop="sendDate" label="交期" align="center">
        <template slot-scope="scope">{{scope.row.sendDate | momentTime('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="含税单价" align="center">
        <template slot-scope="scope">{{scope.row.unitPrice}}</template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="含税总价" align="center">
        <template
          slot-scope="scope"
        >{{detailObj.purchaseOrderMaterialVos.length === 1 ? (detailObj.totalPrice||0) : ((scope.row.quantity * scope.row.unitPrice)||0).toFixed(6)}}</template>
      </el-table-column>
      <el-table-column prop="stockQuantity" label="已入库数量" align="center">
        <template slot-scope="scope">{{scope.row.stockQuantity}}</template>
      </el-table-column>
      <el-table-column prop="returnQuantity" label="退货数量" align="center">
        <template slot-scope="scope">{{scope.row.returnQuantity}}</template>
      </el-table-column>
    </el-table>
    <div class="total" v-if="view">合计：{{detailObj.totalPrice||0}}元</div>
    <div
      class="section-label mt20"
      v-if="view && (routeParams.type==='APPLY' || routeParams.type==='SALE_PROD')"
    >
      <span class="lf-title">产品信息·明细</span>
    </div>
    <el-table
      border
      :data="detailObj.purchaseOrderMaterialVoDetais || []"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod"
      v-if="view && (routeParams.type==='APPLY' || routeParams.type==='SALE_PROD')"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left" />
      <el-table-column
        prop="typeName"
        label="物料类型"
        width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialCode"
        label="物料编码"
        width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="quantity" label="采购数量" align="center" />
      <el-table-column prop="unitName" label="单位" align="center" />
      <el-table-column prop="sendDate" label="交期" align="center">
        <template slot-scope="scope">{{scope.row.sendDate | momentTime('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="含税单价" align="center" />
      <el-table-column prop="displayTotalPrice" label="含税总价" align="center">
        <template
          slot-scope="scope"
        >{{(Number(scope.row.quantity)*Number(scope.row.unitPrice)).toFixed(6)}}</template>
      </el-table-column>
      <el-table-column prop="refCode" :label="dicTypeAll[routeParams.type]" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goOtherOrder(scope.row)">{{scope.row.refCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="displayQuantity" label="订单数量" align="center"></el-table-column>
    </el-table>
    <div class="section-label mt20" v-if="view">
      <span class="lf-title">入库记录</span>
    </div>
    <el-table
      :data="detailObj.stockInMaterialDtos || []"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="view"
    >
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column
        prop="typeName"
        label="物料类型"
        width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialCode"
        label="物料编码"
        width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip />
      <el-table-column prop="defaultWarehouseName" label="入库仓库" align="center" />
      <el-table-column prop="quantity" label="入库数量" align="center" />
      <el-table-column prop="managerStuff" label="入库人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.managerStuff||'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount3" label="入库时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.inTime | momentTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkFlag" label="完成状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.checkFlag | qualityTestStatus(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="inCode" label="入库单号" align="center">
        <template slot-scope="scope">
          <span
            size="small"
            type="text"
            class="yellow"
            @click="goInOrder(scope.row)"
          >{{scope.row.inCode}}</span>
        </template>
      </el-table-column>
    </el-table>
    <material
      isDisabled
      :visible="visible"
      @close="close"
      @submit="materialSubmit"
      :defaultData="tableData"
    />
    <tzView
      :visible="dialogVisible"
      @close="dialogVisible = false"
      paramsType="PURCHASE"
      :paramsCode="detailObj.purchaseCode"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下物料已超出采购参考数量"
      @submit="approveFn(detailObj)"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList"
        >
          <el-table-column
            property="materialName"
            label="物料名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <!-- 打印组件 -->
    <tzPrint
      :orders="[{ code: detailObj.purchaseCode, id: detailObj.purchaseOrderId }]"
      :visible="printVisible"
      type="PurchaseOrder"
      @cancle="closePrint"
    />
  </div>
</template>

<script>
import moment from 'moment'
import {
 mapActions, mapState, mapMutations, mapGetters
} from 'vuex'
import dic from '../../../mixins/dic'
import print from '../../../mixins/print'
import dictionary from '../../../global/dictionary'
import { isObject, spanMethod, rowspan } from '../../../utils/utils'

const dicAll = {
  detail: '采购订单详情',
  SALE_PROD: '采购订单详情(成品)',
  NONE: '采购订单详情',
  APPLY: '采购订单详情（下推）',
  SALE_MATERIAL: '采购订单详情（子件）',
  edit: '采购订单修改',
  add: '新增采购订单'
}
const dicTypeAll = {
  SALE_PROD: '销售单号',
  APPLY: '采购申请单号',
  SALE_MATERIAL: '销售单号'
}

export default {
  name: 'orderPersonalAdd',
  mixins: [dic, print],
  data () {
    return {
      dicAll,
      dicTypeAll,
      dictionary,
      fileList: [],
      tipVisible: false,
      orderList: [],
      deliveryDate: '',
      visible: false, // 物料选择
      dialogVisible: false,
      ruleForm: {
        baseSupplierId: '',
        managerStuff: '',
        managerStuffId: '',
        baseFileVos: [],
        purchaseOrderMaterialVos: [],
        remark: ''
      },
      rules: {
        baseSupplierId: [
          {
            required: true,
            message: '请输入供应商',
            trigger: 'change'
          }
        ],
        managerStuffId: [
          {
            required: true,
            message: '请输入负责人',
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      routeParams: {},
      detailObj: {},
      spanArr: [],
      status: ''
    }
  },
  created () {
    this.init()
  },
  filters: {
    qualityTestStatus (val, row) {
      const { inFlag, inCheckFlag } = row
      if (val === 'Y' && inFlag === 'Y' && inCheckFlag === 'Y') return '已入库'
      if (val === 'Y' && inFlag === 'N' && inCheckFlag === 'Y') return '未入库'
      if (val === 'N' && inFlag === 'N' && inCheckFlag === 'Y') return '未质检'
      if (inFlag === 'Y' && inCheckFlag === 'N') return '已入库'
      if (inFlag === 'N' && inCheckFlag === 'N') return '未入库'
      return ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo,
      supplierList: state => state.global.supplierList, // 供应商
      loading: state => state.global.btnLoading
    }),
    view () {
      const { type } = this.routeParams
      return (
        type === 'detail' ||
        type === 'NONE' ||
        type === 'APPLY' ||
        type === 'SALE_PROD' ||
        type === 'SALE_MATERIAL'
      )
    },
    ...mapGetters(['employeeList'])
  },
  /* beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (from.name === 'orderFinishedAdd') {
        // eslint-disable-next-line no-param-reassign
        vm.routeFlag = true
      }
    })
  },*/
  methods: {
    // 所有异步请求
    ...mapActions([
      'ADDORDER_PURCHASE_TYPE',
      'EDITORDER_PURCHASE_TYPE',
      'DETAILORDER_PURCHASE_TYPE',
      'POST_GLOBAL_AUDITOR',
      'POST_GLOBAL_RECALL_AUDIT',
      'ORDEROPEN_PURCHASE_TYPE',
      'ORDERCLOSE_PURCHASE_TYPE',
      'DELETEORDER_PURCHASE_TYPE',
      'SALEORDERCENSOR_PURCHASE_TYPE',
      'ORDERCENSOR_PURCHASE_TYPE',
      'DETAILQUERY_PURCHASE_TYPE'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    // 初始化数据
    init () {
      const { type, page, id } = this.$route.params
    this.routeParams = {
      type,
      page,
      id
    }
    document.title = dicAll[type]
    if (this.view && type === 'NONE') {
      this.getOrderDetail()
    } else if (this.view && type !== 'NONE') {
      this.getDownOrderDetail()
    }
    this.ruleForm.managerStuffId = this.userInfo.stuffId
    },
    // 返回
    goBack () {
      if (this.routeParams.type === 'edit') {
        this.routeParams.type = 'NONE'
        this.init()
        return
      }
      this.$router.back()
    },
    // 详情页编辑
    editBtn () {
      const { type } = this.$route.params
      const temp = this.setPage(type)
      if (type !== 'NONE') {
        this.$router.push({
          name: 'orderFinishedAdd',
          params: {
            type: 'edit',
            page: temp,
            id: this.routeParams.id
          }
        })
        return
      }
      this.getOrderDetail()

      this.routeParams.type = 'edit'
      document.title = dicAll.edit
    },
    goInOrder (row) {
      this.$router.push({
        name: 'warehouseInDetail',
        params: {
          id: row.refId
        },
        query: {
          type: row.inType
        }
      })
    },
    goOtherOrder (row) {
      if (row.purchaseType === 'SALE_PROD') {
        this.$router.push({
          path: `${this.$urls.SALE_DETAIL}/detail`,
          query: {
            id: row.refId
          }
        })
      } else if (row.purchaseType === 'SALE_MATERIAL') {
        this.$router.push({
          path: `${this.$urls.SALE_DETAIL}/detail`,
          query: {
            id: row.refId
          }
        })
      } else if (row.purchaseType === 'APPLY') {
        const temp = this.setPage(row.applyType)
        this.$router.push({
          name: 'applyFinishedAdd',
          params: {
            type: 'detail',
            page: temp,
            id: row.refId
          }
        })
      }
    },
    // 设置请求参数
    setParams () {
      const materialList = this.tableData.map(item => ({
        ...item,
        quantity: item.displayQuantity,
        materialType: item.typeName,
        displayTotalPrice: item.displayQuantity * item.displayUnitPrice
      }))
      // 重新选择负责人赋值操作
      this.staffList.forEach((element) => {
        if (element.id === this.ruleForm.managerStuffId) {
          this.ruleForm.managerStuff = element.realname
        }
      })
      const { type } = this.routeParams
      return {
        purchaseOrderId:
          type === 'add' ? undefined : this.detailObj.purchaseOrderId,
        ...this.ruleForm,
        purchaseOrderMaterialVos: materialList
      }
    },
    // 合并单元格
    objectSpanMethod ({ rowIndex, columnIndex }) {
      return spanMethod({ rowIndex, columnIndex }, this.spanArr, [
        0,
        1,
        2,
        3,
        4,
        5,
        8,
        9
      ])
    },
    // 新增采购订单（无来源）
    async getAdd (type) {
      const arg = this.setParams()
      const { status, data } = await this.ADDORDER_PURCHASE_TYPE(arg)
      if (status === 0 && type === 'auditor') {
        this.auditorFn(data)
      }
    },
    // 修改采购订单
    async getEdit () {
      try {
        const arg = this.setParams()
        const { status } = await this.EDITORDER_PURCHASE_TYPE(arg)
        if (status === 0) {
          this.goBack()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 无来源采购订单查看详情
    async getOrderDetail () {
      const arg = {
        purchaseOrderId: this.routeParams.id
      }
      const { status, data } = await this.DETAILORDER_PURCHASE_TYPE(arg)
      if (status === 0) {
        this.initDetail(data)
      }
    },
    initDetail (data = {}) {
      this.detailObj = data
      this.ruleForm = {
        baseSupplierId: data.baseSupplierId,
        managerStuff: data.managerStuff,
        managerStuffId: data.managerStuffId,
        baseFileVos: data.baseFileDtos,
        purchaseOrderMaterialVos: data.purchaseOrderMaterialVos,
        remark: data.remark
      }
      /* */
      this.tableData =
        data.purchaseOrderMaterialVos &&
        data.purchaseOrderMaterialVos.map(item => ({
          ...item,
          displayQuantity: item.quantity,
          displayUnitPrice: item.unitPrice,
          sendDate: moment(item.sendDate).format('YYYY-MM-DD')
        }))
      this.fileList = data.baseFileDtos
      this.spanArr = rowspan(
        data.purchaseOrderMaterialVoDetais || [],
        'baseMaterialId'
      )
    },
    // 销售订单下推(采购申请下推)采购订单查看详情
    async getDownOrderDetail () {
      const { status, data } = await this.DETAILQUERY_PURCHASE_TYPE(
        this.routeParams.id
      )
      if (status === 0) {
        this.initDetail(data)
      }
    },
    // 保存并送审
    auditorFn (item) {
      const arg = {
        targetType: 'PURCHASE',
        targetCode: item.purchaseCode,
        targetId: item.purchaseOrderId
      }
      this.POST_GLOBAL_AUDITOR([arg])
    },
    // 保存
    submitForm (formName, type) {
      this.status = type
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (!this.tableData.length) {
            this.$message.error('产品信息不能为空')
            return
          }
          // 判断物料申请数量或者交期必填否则无法保存
          for (let index = 0; index < this.tableData.length; index += 1) {
            const item = this.tableData[index]
            if (!item.displayQuantity || !item.sendDate) {
              this.$message.error('采购数量或者采购交期必填')
              return
            }
            if (!item.displayUnitPrice) {
              this.$message.error('含税单价不能为空且大于0')
              return
            }
          }
          if (this.routeParams.type === 'add') {
            this.getAdd(type)
          } else {
            this.getEdit()
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
    // 设置物料交期
    setDate () {
      const arr =
        this.tableData &&
        this.tableData.map(item => ({
          ...item,
          sendDate: this.deliveryDate
        }))
      this.tableData = arr
    },
    setPage (type) {
      let temp = ''
      if (type === 'NONE') {
        temp = 'none'
      } else if (type === 'SALE_PROD') {
        temp = 'finished'
      } else if (type === 'SALE_MATERIAL') {
        temp = 'subpart'
      } else if (type === 'APPLY') {
        temp = 'down'
      }
      return temp
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.ruleForm.baseFileVos = files
    },
    // 删除
    delBtn (index) {
      this.tableData.splice(index, 1)
    },
    // 关闭物料
    close () {
      this.visible = false
    },
    // 打开采购
    async setOpen (id) {
      try {
        const { status } = await this.ORDEROPEN_PURCHASE_TYPE({
          purchaseOrderId: id
        })
        if (status === 0) {
          this.$message.success('打开成功')
          this.detailObj = {
            ...this.detailObj,
            status: 'APPROVED'
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭采购
    async setClose (id) {
      try {
        const { status } = await this.ORDERCLOSE_PURCHASE_TYPE({
          purchaseOrderId: id
        })
        if (status === 0) {
          this.$message.success('关闭成功')
          this.detailObj = {
            ...this.detailObj,
            status: 'CLOSED'
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 撤销审核
    async recallAudit () {
      const arg = {
        targetType: 'PURCHASE',
        targetId: this.routeParams.id
      }
      const { status } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
      if (status === 0) {
        this.detailObj = {
          ...this.detailObj,
          status: 'DRAFT'
        }
      }
    },
    // 送审方法
    async approveFn (item) {
      try {
        const arg = {
          targetType: 'PURCHASE',
          targetCode: item.purchaseCode,
          targetId: item.purchaseOrderId
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.tipVisible = false
          const { type } = this.routeParams
          if (this.view && type === 'NONE') {
            this.getOrderDetail()
          } else if (this.view && type !== 'NONE') {
            this.getDownOrderDetail()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    async approveBtn (item) {
      const { type } = this.$route.params
      if (type === 'SALE_PROD') {
        const { status, data } = await this.SALEORDERCENSOR_PURCHASE_TYPE([
          item.purchaseOrderId
        ])
        if (status === 0) {
          if (data.length > 0) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.approveFn(item)
          }
        }
      } else if (type === 'APPLY') {
        const { status, data } = await this.ORDERCENSOR_PURCHASE_TYPE([
          item.purchaseOrderId
        ])
        if (status === 0) {
          if (data.length) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.approveFn(item)
          }
        }
      } else {
        this.approveFn(item)
      }
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.DELETEORDER_PURCHASE_TYPE(val)
      if (status === 0) {
        this.$message.success('删除成功')
        this.$router.back()
      }
    },
    // 删除
    delAuditBtn (val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示')
        .then((res) => {
          if (res === 'confirm') {
            this.delFn(val)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 选择物料
    async materialSubmit (val) {
      try {
        const tableData =
          val &&
          val.map(item => ({
            ...item,
            displayUnitPrice:
              item.unitPrice === 0 || item.unitPrice === '0.00'
                ? undefined
                : item.unitPrice,
            displayTotalQuantity: item.quantity
          }))
        this.tableData = [...this.tableData, ...tableData]
        this.close()
      } catch (e) {
        console.log(e)
        this.$message.error('新增失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.w100 {
  width: 100%;
}

.section-label {
  display: flex;
  width: 100%;
  line-height: 40px;

  .lf-title {
    flex: 1;
  }
}

.pic-box {
  .title {
    color: #444;
  }
}

.gray {
  color: #999;
}

.desc-item {
  margin-top: 10px;

  button {
    margin: 0 0 6px;
  }
}

.f16 {
  font-weight: 600;
}

.pd-zero {
  padding: 0 !important;
}

.step-box {
  .f18 {
    font-weight: bold;
  }

  .tz-icon-view {
    color: #7ca870;
  }
}

.el-date-editor.el-input {
  width: auto;
}
</style>
