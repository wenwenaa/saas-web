!<!-- 生产新增修改 -->
<template>
  <div class="addPage">
    <tzHeadline :title="`${type === 'add' ? '新增' : '修改'}订单`" backText="返回" isShowBack>
      <template slot="btn">
        <el-button
          round
          size="medium"
          class="tz-btn-add"
          :loading="submitType === 1 && btnLoading"
          @click="submitForm('formData', 1)"
        >保存</el-button>
        <el-button
          round
          size="medium"
          :loading="submitType === 2 && btnLoading"
          class="tz-btn-add"
          @click="submitForm('formData', 2)"
        >保存并送审</el-button>
      </template>
    </tzHeadline>
    <el-form ref="formData" label-position="top" :rules="rules" :inline="true" :model="formData">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item class="w100" label="负责人" prop="managerStuff" ref="managerStuff">
            <el-select
              clearable
              filterable
              class="w100"
              v-model="formData.managerStuff"
              placeholder="负责人"
            >
              <el-option
                v-for="(staff, index) in employeeList"
                :key="index"
                :label=" staff.val"
                :value=" staff.val"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w100" label="计划时间" prop="time" ref="time">
            <el-date-picker
              v-model="formData.time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              value-format="yyyy-MM-dd"
              style="width: 400px"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="source === 'SALE'" class="section2">
        <div class="section-label">关联单据</div>
        <div class="order-list">
          <div class="order-item" v-for="(item, index) in relevanceDoc" :key="index">
            <div class="left-order-item">
              <span class="order-item-title">销售订单号：</span>
              <span class="order-item-detail">{{item.saleOrderCode}}</span>
            </div>
            <div class="right-order-item">
              <span class="order-item-title">创建人：</span>
              <span class="order-item-detail">{{item.salerStuff}}</span>
            </div>
          </div>
        </div>
      </div>
      <section class="d-flex justify-between align-items mt10 mb10">
        <div class="section-label">产品信息·生产母件</div>
        <el-button
          v-if="type === 'add' && source === 'NONE'"
          round
          size="medium"
          class="tz-search-submit"
          @click="materialOpen"
        >选择物料</el-button>
      </section>
      <el-table
        :span-method="objectSpanMethod"
        :data="copyRelevanceDoc"
        border
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
        <el-table-column label="工艺路线" align="center">
          <template slot-scope="scope">
            <el-tooltip
              :disabled="!scope.row.display || (scope.row.display && scope.row.display.length <= 8)"
              :content="scope.row.display || '添加工艺路线'"
              placement="top"
            >
              <el-button
                type="text"
                class="green pointer"
                @click="handleProcess(scope.row, scope.$index, 'part')"
              >{{(scope.row.display && scope.row.display.length > 8 ? `${scope.row.display.substring(0, 8)}...` : scope.row.display) || '添加工艺路线'}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="quantityDisplay" label="库存数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.inventoryNum || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="materialInfo.baseBomId" prop="action" label="BOM版本" align="center">
          <template slot-scope="scope">
            <el-dropdown v-if="type === 'add'" @command="selectVer">
              <span class="green pointer">
                {{curVer.baseBomVersionId ? `${curVer.versionName || '未命名'}(${curVer.versionNum})` : '选择版本'}}
                <i
                  class="el-icon-arrow-down el-icon--right"
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(ver, index) in versionList"
                  :key="index"
                  :command="ver.baseBomVersionId"
                >{{ver.versionName || '未命名'}}{{ver.versionNum}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span
              v-else
            >{{scope.row.baseBomVersionId ? `${scope.row.versionName || '未命名'}(${scope.row.versionNum})` : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="source === 'SALE'" prop="saleOrderCode" label="销售订单号" align="center">
          <template slot-scope="scope">
            <span class="yellow" @click="goSales(scope.row)">{{scope.row.saleOrderCode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="source === 'SALE'"
          prop="quantityDisplay"
          label="订单数量"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.quantityDisplay}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="source === 'SALE'"
          prop="notProcessQuantity"
          label="生产参考量"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.notProcessQuantity > 0 ? scope.row.notProcessQuantity : 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="center" />
        <el-table-column prop="quantity" label="计划数量" width="140" align="center" class-name="addEdit">
          <template slot-scope="scope">
            <el-input-number
              style="width: 100px"
              v-model.trim.number="scope.row.quantity"
              :controls="false"
              :min="0"
              :max="99999999"
              size="medium"
              placeholder="数量"
              :precision="6"
              @change="partPlayNumC"
            />
            <i class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column
          v-if="source === 'SALE' && copyRelevanceDoc.length > 1"
          prop="amount3"
          label="操作"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="btn">
              <el-button
                size="small"
                type="text"
                class="yellow f14"
                @click="delPart(scope.$index)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <section class="d-flex justify-between align-items mt10 mb10">
        <div class="section-label">产品信息·生产子件</div>
        <el-button round size="medium" class="tz-search-submit" @click="resetSub">重置</el-button>
      </section>
      <el-table :data="subData" border :header-cell-style="{'background-color': '#F9F9F9'}">
        <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="工艺路线" align="center">
          <template slot-scope="scope">
            <el-tooltip
              :disabled="!scope.row.display || (scope.row.display && scope.row.display.length <= 8)"
              :content="scope.row.display || '添加工艺路线'"
              placement="top"
            >
              <el-button
                type="text"
                class="green pointer"
                @click="handleProcess(scope.row, scope.$index, 'sub')"
              >{{(scope.row.display && scope.row.display.length > 8 ? `${scope.row.display.substring(0, 8)}...` : scope.row.display) || '添加工艺路线'}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="quantityDisplay" label="库存数量" align="center" />
        <el-table-column prop="recommendNum" label="参考数量" align="center">
          <template slot-scope="scope">{{(partSum*scope.row.useCount).toFixed(6) || 0}}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="计划数量" align="center" width="140" class-name="addEdit">
          <template slot-scope="scope">
            <el-input-number
              style="width: 100px"
              v-model="scope.row.quantity"
              :controls="false"
              :min="0"
              :max="99999999"
              size="medium"
              placeholder="数量"
              :precision="6"
            />
            <i class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="center" />
        <el-table-column prop="amount3" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="btn">
              <el-button
                size="small"
                type="text"
                class="yellow f14"
                @click="delSub(scope.$index)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="18">
          <el-form-item class="w100" label="备注">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="formData.remark"
              maxlength="500"
              show-word-limit
              clearable
              :autosize="{ minRows: 8}"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <tzCommonFileUpload
      applicationType="add"
      :fileList="fileList"
      @handleUploadFile="uploadSuccess"
    />
    <gloProcessRoute
      :visible="visible"
      @cancel="proCancel"
      :dafBaseProcess="curBaseProcessSeqDtos || ''"
      @submit="proSubmit"
    >
      <el-row
        style="line-height: 30px;"
        class="f16"
        v-if="curMaterialInfo && Object.keys(curMaterialInfo).length > 0"
        :gutter="16"
      >
        <el-col :span="8">
          物料编码：
          <el-tooltip
            :disabled="!curMaterialInfo.materialCode || (curMaterialInfo.materialCode && curMaterialInfo.materialCode.length <= 12)"
            effect="dark"
            :content="curMaterialInfo.materialCode"
          >
            <span>{{curMaterialInfo.materialCode && curMaterialInfo.materialCode.length > 12 ? `${curMaterialInfo.materialCode.substring(0, 12)}...` : curMaterialInfo.materialCode}}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="8">
          物料名称：
          <el-tooltip
            :disabled="!curMaterialInfo.materialName || (curMaterialInfo.materialName && curMaterialInfo.materialName.length <= 12)"
            effect="dark"
            :content="curMaterialInfo.materialName"
          >
            <span>{{curMaterialInfo.materialName && curMaterialInfo.materialName.length > 12 ? curMaterialInfo.materialName.substring(0, 12) + '...' : curMaterialInfo.materialName}}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="8">
          物料规格：
          <el-tooltip
            :disabled="!curMaterialInfo.spec || (curMaterialInfo.spec && curMaterialInfo.spec.length <= 12)"
            effect="dark"
            :content="curMaterialInfo.spec"
          >
            <span>{{curMaterialInfo.spec && curMaterialInfo.spec.length > 12 ? curMaterialInfo.spec.substring(0, 12) + '...' : curMaterialInfo.spec}}</span>
          </el-tooltip>
        </el-col>
      </el-row>
    </gloProcessRoute>
    <material
      :visible="matVisible"
      :isMultiple="false"
      @close="materialClose"
      @submit="materialSubmit"
      :defaultVal="materialInfo"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下销售单已超出生产参考量"
      @submit="tipSubmit"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column property="saleOrderCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
 mapActions, mapState, mapMutations, mapGetters
} from 'vuex'
import moment from 'moment'
import dic from '../../../mixins/dic'
import { sum, isObject } from '../../../utils/utils'

const rulesConfig = { required: true, trigger: 'change' }
export default {
  name: 'addProd',
  mixins: [dic],
  data () {
    // 这里存放数据
    return {
      type: '',
      rules: {
        managerStuff: [{ ...rulesConfig, message: '请选择负责人' }],
        time: [{ ...rulesConfig, message: '请选择时间' }]
      },
      versionList: [],
      curVer: {},
      formData: {
        time: []
      },
      submitType: 1, // 提交类型
      subData: [], // 子件数据
      copySubData: '', // 子件副本
      partData: [], // 母件信息
      visible: false, // 工艺路线显示隐藏
      matVisible: false, // 物料显示隐藏
      tipVisible: false, // 展开提示弹出框
      orderList: [], // 提示数据
      materialInfo: {}, // 母件信息
      curMaterialInfo: { baseProcessSeqDtos: [] }, // 当前母件信息
      curBaseProcessSeqDtos: '', // 当前选择工艺路线
      fileList: [], // 附件数据
      curProIndex: null, // 当前修改物料工艺路线索引
      editType: 'part', // 当前修改物料工艺路线的类型  子件母件
      copyRelevanceDoc: [] // 关联单据信息副本
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    const { type } = this.$route.params
    const { query } = this.$route
    this.type = type
    if (type === 'add' && Object.keys(query).length > 0) {
      this.getProdRelevanceDoc()
    }
    if (type === 'edit') {
      this.getDetail()
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  // 生命周期 - 销毁
  destroyed () {
    this.SET_PROD_RELEVANCE_DOC()
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      relevanceDoc: state => state.product.prod.relevanceDoc,
      btnLoading: state => state.global.btnLoading
    }),
    source () {
      const { relevanceDoc } = this
      return relevanceDoc && relevanceDoc.length > 0 ? 'SALE' : 'NONE'
    },
    partSum () {
      const { copyRelevanceDoc } = this
      return sum(copyRelevanceDoc, 'quantity')
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    ...mapActions([
      'A_GET_PROD_PART_SUB_INFO',
      'A_GET_BOM_VERSION_LIST',
      'A_GET_PROD_RELEVANCE_DOC',
      'A_GET_PROD_ADD',
      'A_GET_PROD_DETAIL',
      'A_GET_PROD_UPDATE',
      'PROD_SAVE_CHECK_APPROVE'
    ]),
    ...mapMutations(['SET_PROD_RELEVANCE_DOC']),
    // 跳转销售订单
    goSales (row) {
      const arg = {
        path: `${this.$urls.SALE_DETAIL}/detail`,
        query: { id: row.saleOrderId }
      }
      this.$router.push(arg)
    },
    // 提示  继续提交
    tipSubmit () {
      this.tipVisible = false
      if (this.type === 'add') {
        this.addProd()
        return
      }
      this.updateProd()
    },
    // 母件计划数量改变
    partPlayNumC () {
      this.subData = this.subData.map(it => ({
        ...it,
        quantity:
          !(this.partSum * it.useCount) || this.partSum * it.useCount === 0
            ? undefined
            : this.partSum * it.useCount
      }))
    },
    // 合并单元格
    objectSpanMethod ({ rowIndex, columnIndex }) {
      let arr = [8, 9, 10, 11, 12, 13]
      if (!this.materialInfo.baseBomId) {
        arr = [7, 8, 9, 10, 11, 12]
      }
      const len = this.copyRelevanceDoc.length
      if (!arr.includes(columnIndex)) {
        if (rowIndex === 0) {
          return { rowspan: len, colspan: 1 }
        }
        return { rowspan: 0, colspan: 0 }
      }
      return { rowspan: 1, colspan: 1 }
    },
    // 获取详情数据
    async getDetail () {
      try {
        const { prodOrderId } = this.$route.query
        const { status, data } = await this.A_GET_PROD_DETAIL({ prodOrderId })
        if (status === 0) {
          const { prodOrderDtos, baseFileDtos, prodOrderSales } = data
          const saleOrderMaterialIdStr = prodOrderSales
            .map(it => it.saleOrderMaterialId)
            .join()
          const res = await this.A_GET_PROD_RELEVANCE_DOC({
            saleOrderMaterialIdStr
          })
          const partData =
            (prodOrderDtos && prodOrderDtos.filter(it => it.rootNode)).map(
              it => ({
                ...it,
                quantity: it.quantity ? Number(it.quantity) : undefined,
                display: it.prodOrderProcessSeqs
                  ? it.prodOrderProcessSeqs.map(item => item.seqName).join('-')
                  : '',
                baseProcessSeqDtos: it.prodOrderProcessSeqs
              })
            ) || []
          const subData =
            (prodOrderDtos && prodOrderDtos.filter(it => !it.rootNode)).map(
              it => ({
                ...it,
                quantity: it.quantity ? Number(it.quantity) : undefined,
                display: it.prodOrderProcessSeqs
                  ? it.prodOrderProcessSeqs.map(item => item.seqName).join('-')
                  : '',
                baseProcessSeqDtos: it.prodOrderProcessSeqs
              })
            ) || []
          if (res.status === 0) {
            const temp = prodOrderSales.map((it, i) => ({
              ...it,
              saleOrderCode: it.saleCode,
              salerStuff:
                this.relevanceDoc[i] && this.relevanceDoc[i].salerStuff,
              notProcessQuantity:
                this.relevanceDoc[i] && this.relevanceDoc[i].notProcessQuantity
            }))
            this.SET_PROD_RELEVANCE_DOC(temp)
            if (
              prodOrderSales &&
              prodOrderSales.length > 0 &&
              this.source === 'SALE'
            ) {
              this.copyRelevanceDoc = this.relevanceDoc.map(it => ({
                ...partData[0],
                quantity: it.quantity === 0 ? undefined : it.quantity,
                saleOrderCode: it.saleCode,
                saleOrderId: it.saleOrderId,
                saleOrderMaterialId: it.saleOrderMaterialId,
                notProcessQuantity: it.notProcessQuantity
              }))
            } else {
              this.copyRelevanceDoc = partData || []
            }
          }
          const [materialInfo = {}] = partData
          this.materialInfo = materialInfo
          this.partData = partData
          this.subData = subData
          this.copySubData = subData ? JSON.stringify(subData) : ''
          this.fileList = baseFileDtos
          const {
            planStartDate,
            planEndDate,
            remark,
            managerStuff
          } = materialInfo
          const time1 = planStartDate
            ? moment(planStartDate).format('YYYY-MM-DD')
            : undefined
          const time2 = planEndDate
            ? moment(planEndDate).format('YYYY-MM-DD')
            : undefined
          const time = time1 && time2 ? [time1, time2] : []
          this.formData = { remark, managerStuff, time }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取关联单据
    async getProdRelevanceDoc () {
      try {
        const { saleOrderMaterialIdStr, materialId } = this.$route.query
        const { status } = await this.A_GET_PROD_RELEVANCE_DOC({
          saleOrderMaterialIdStr
        })
        if (status === 0) {
          this.getPartSubInfo({ materialId })
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.fileList = files
    },
    // 点击工艺路线
    handleProcess (row, index, type) {
      this.curProIndex = index
      this.editType = type
      this.curMaterialInfo = row
      this.curBaseProcessSeqDtos = row.baseProcessSeqDtos
        ? JSON.stringify(row.baseProcessSeqDtos)
        : ''
      this.visible = true
    },
    // 重置子件
    resetSub () {
      const { copySubData, partSum } = this
      const list =
        copySubData && copySubData !== '' ? JSON.parse(copySubData) : []
      this.subData = list
      list.forEach((it, i) => {
        const num = it.useCount && partSum ? partSum * it.useCount : undefined
        this.$set(this.subData[i], 'quantity', num)
      })
    },
    // 选择工艺路线的回调
    proSubmit (val) {
      const { editType, curProIndex } = this
      const baseProcessSeqDtos =
        (val.processList &&
          val.processList.map((it, i) => ({ ...it, seqNum: i + 1 }))) ||
        []
      if (editType === 'part') {
        this.partData.forEach((item, i) => {
          this.$set(this.partData[i], 'display', val.display)
          this.$set(this.partData[i], 'baseProcessSeqDtos', baseProcessSeqDtos)
          this.$set(this.partData[i], 'processType', val.processType)
        })
        this.copyRelevanceDoc.forEach((item, i) => {
          this.$set(this.copyRelevanceDoc[i], 'display', val.display)
          this.$set(
            this.copyRelevanceDoc[i],
            'baseProcessSeqDtos',
            baseProcessSeqDtos
          )
          this.$set(this.copyRelevanceDoc[i], 'processType', val.processType)
        })
        // this.$set(this.partData[curProIndex], 'display', val.display)
        // this.$set(this.partData[curProIndex], 'baseProcessSeqDtos', baseProcessSeqDtos)
        // this.$set(this.partData[curProIndex], 'processType', val.processType)
        // this.$set(this.copyRelevanceDoc[curProIndex], 'display', val.display)
        // this.$set(this.copyRelevanceDoc[curProIndex], 'baseProcessSeqDtos', baseProcessSeqDtos)
        // this.$set(this.copyRelevanceDoc[curProIndex], 'processType', val.processType)
      } else {
        this.$set(this.subData[curProIndex], 'display', val.display)
        this.$set(
          this.subData[curProIndex],
          'baseProcessSeqDtos',
          baseProcessSeqDtos
        )
        this.$set(this.subData[curProIndex], 'processType', val.processType)
      }
      this.visible = false
    },
    // submitForm 保存  type 1 保存 2 保存送审
    submitForm (formName, type) {
      this.$refs[formName].validate(async (valid, object) => {
        try {
          if (valid) {
            this.submitType = type
            const { subData, copyRelevanceDoc } = this
            const checkPart = copyRelevanceDoc.filter(it => !it.quantity)
            const checkProcess = copyRelevanceDoc.filter(
              it => !it.baseProcessSeqDtos ||
                (it.baseProcessSeqDtos && it.baseProcessSeqDtos.length === 0)
            )
            const checkSubProcess = subData.filter(
              it => !it.baseProcessSeqDtos ||
                (it.baseProcessSeqDtos && it.baseProcessSeqDtos.length === 0)
            )
            const checkSub = subData.filter(it => !it.quantity)
            if (copyRelevanceDoc && copyRelevanceDoc.length === 0) {
              this.$message.error('请选择要生产的物料')
              return
            }
            if (checkProcess && checkProcess.length > 0) {
              this.$message.error('请维护母件的工艺路线')
              return
            }
            if (checkSubProcess && checkSubProcess.length > 0) {
              this.$message.error('请维护子件的工艺路线')
              return
            }
            if (checkPart.length > 0) {
              this.$message.error('请维护母件的计划数量')
              return
            }
            if (checkSub.length > 0) {
              this.$message.error('请维护子件的计划数量')
              return
            }
            if (this.source === 'SALE') {
              const arg = this.setParams()
              const { status, data } = await this.PROD_SAVE_CHECK_APPROVE(arg)
              if (status === 0 && data && data.length > 0) {
                this.orderList = data.map(it => ({ saleOrderCode: it }))
                this.tipVisible = true
                return
              }
              if (status === 1) {
                return
              }
            }
            if (this.type === 'add') {
              this.addProd()
              return
            }
            this.updateProd()
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
        } catch (e) {
          console.log(e)
        }
      })
    },
    // 设置请求参数
    setParams () {
      const {
        fileList,
        subData,
        formData,
        copyRelevanceDoc,
        source,
        submitType
      } = this
      const { prodOrderId } = this.$route.query
      const newId = prodOrderId ? Number(prodOrderId) : undefined
      const { remark, time, managerStuff } = formData
      const [planStartDate, planEndDate] = time
      const prodOrderSales =
        copyRelevanceDoc &&
        copyRelevanceDoc.map(it => ({
          prodOrderId: newId,
          quantity: it.quantity,
          saleCode: it.saleOrderCode,
          saleOrderId: it.saleOrderId,
          saleOrderMaterialId: it.saleOrderMaterialId
        }))
      const children =
        subData &&
        subData.map(it => ({
          remark,
          managerStuff,
          planEndDate,
          planStartDate,
          prodOrderId: newId,
          baseBomVersionId: it.baseBomVersionId,
          baseMaterialId: it.baseMaterialId,
          baseBomId: it.baseBomId,
          quantity: it.quantity,
          rootNode: it.rootNode,
          prodCode: it.prodCode,
          prodType: source,
          prodOrderProcessSeqs:
            it.baseProcessSeqDtos &&
            it.baseProcessSeqDtos.map(sub => ({
              prodOrderId: newId,
              baseMaterialId: sub.baseMaterialId,
              baseProcessId: sub.baseProcessId,
              baseSeqId: sub.baseSeqId,
              enableFlag: sub.enableFlag,
              processName: sub.processName,
              processType: sub.processType,
              seqCode: sub.seqCode,
              seqName: sub.seqName,
              seqNum: sub.seqNum,
              seqType: sub.seqType,
              standardHours: sub.standardHours,
              unitPrice: sub.unitPrice
            }))
        }))
      const prodOrderVos =
        copyRelevanceDoc &&
        copyRelevanceDoc.map(it => ({
          baseBomVersionId: it.baseBomVersionId,
          baseMaterialId: it.baseMaterialId,
          baseBomId: it.baseBomId,
          prodOrderId: newId,
          prodCode: it.prodCode,
          prodOrderProcessSeqs:
            it.baseProcessSeqDtos &&
            it.baseProcessSeqDtos.map(sub => ({
              prodOrderId: newId,
              baseMaterialId: sub.baseMaterialId,
              baseProcessId: sub.baseProcessId,
              baseSeqId: sub.baseSeqId,
              enableFlag: sub.enableFlag,
              processName: sub.processName,
              processType: sub.processType,
              seqCode: sub.seqCode,
              seqName: sub.seqName,
              seqNum: sub.seqNum,
              seqType: sub.seqType,
              standardHours: sub.standardHours,
              unitPrice: sub.unitPrice
            })),
          remark,
          managerStuff,
          quantity:
            source === 'NONE' ? copyRelevanceDoc[0].quantity : undefined,
          rootNode: it.rootNode,
          prodType: source,
          planEndDate,
          planStartDate,
          children
        }))
      const baseFileVos =
        fileList &&
        fileList.map(it => ({
          fileAddress: it.fileAddress,
          fileSize: it.fileSize,
          fileType: it.fileType,
          prodOrderId: newId
        }))
      return {
        type: submitType,
        prodOrderSales: source === 'NONE' ? [] : prodOrderSales,
        baseFileVos,
        prodOrderVos
      }
    },
    // 添加生产
    addProd () {
      const arg = this.setParams()
      this.A_GET_PROD_ADD(arg)
    },
    // 更新生产
    updateProd () {
      const arg = this.setParams()
      this.A_GET_PROD_UPDATE(arg)
    },
    // 返回
    back () {
      this.$router.push({ name: 'prod' })
    },
    // 打开物料选择
    materialOpen () {
      this.matVisible = true
    },
    // 物料关闭
    materialClose () {
      this.matVisible = false
    },
    // 删除母件
    delPart (index) {
      this.partData = this.partData.filter((it, i) => i !== index)
      this.copyRelevanceDoc = this.copyRelevanceDoc.filter(
        (it, i) => i !== index
      )
      const result = this.relevanceDoc.filter((it, i) => i !== index)
      this.SET_PROD_RELEVANCE_DOC(result)
    },
    // 删除子件
    delSub (index) {
      this.subData = this.subData.filter((it, i) => i !== index)
    },
    // 选择物料回调
    materialSubmit (val) {
      const arg = { materialId: val.baseMaterialId }
      this.getPartSubInfo(arg)
      this.materialClose()
    },
    // 查询物料母件和子件信息
    async getPartSubInfo (arg) {
      try {
        const { status, data } = await this.A_GET_PROD_PART_SUB_INFO(arg)
        if (status === 0 && data && data.length > 0) {
          const partData =
            (data && data.filter(it => it.rootNode)).map(it => ({
              ...it,
              quantity: it.quantity ? Number(it.quantity) : undefined,
              display:
                it.baseProcessSeqDtos &&
                it.baseProcessSeqDtos.map(item => item.seqName).join('-')
            })) || []
          if (partData && partData.length > 0) {
            if (this.source === 'SALE') {
              this.copyRelevanceDoc = this.relevanceDoc.map(it => ({
                ...partData[0],
                quantity:
                  it.notProcessQuantity === 0
                    ? undefined
                    : it.notProcessQuantity,
                saleOrderCode: it.saleOrderCode,
                saleOrderId: it.saleOrderId,
                saleOrderMaterialId: it.saleOrderMaterialId,
                inventoryNum: partData[0].quantityDisplay,
                quantityDisplay: it.quantityDisplay,
                notProcessQuantity: it.notProcessQuantity,
                processQuantity: it.processQuantity
              }))
            } else {
              this.copyRelevanceDoc = partData
            }
          }
          const subData =
            (data && data.filter(it => !it.rootNode)).map(it => ({
              ...it,
              quantity:
                it.useCount && this.partSum
                  ? this.partSum * it.useCount
                  : undefined,
              display:
                it.baseProcessSeqDtos &&
                it.baseProcessSeqDtos.map(item => item.seqName).join('-')
            })) || []
          this.copySubData = subData ? JSON.stringify(subData) : ''
          const [materialInfo = {}] = partData
          this.materialInfo = materialInfo
          this.partData = partData
          this.subData = subData
          if (materialInfo.baseBomId) {
            this.getVerList()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 查询该颗料的版本数据
    async getVerList () {
      try {
        const arg = { baseBomId: this.materialInfo.baseBomId }
        const { status, data } = await this.A_GET_BOM_VERSION_LIST(arg)
        if (status === 0) {
          this.versionList = data
          this.setVer(this.materialInfo.baseBomVersionId)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭工艺路线
    proCancel () {
      this.visible = false
    },
    // 设置版本初始值
    setVer (versionNum) {
      const result = this.versionList.filter(
        it => it.baseBomVersionId === versionNum
      )
      const [temp] = result
      this.curVer = temp
    },
    // 选择版本
    selectVer (baseBomVersionId) {
      if (this.curVer.baseBomVersionId === baseBomVersionId) {
        return
      }
      const result = this.versionList.filter(
        it => it.baseBomVersionId === baseBomVersionId
      )
      const [temp] = result
      this.curVer = temp
      const arg = {
        bomVersionId: temp.baseBomVersionId,
        materialId: this.materialInfo.baseMaterialId
      }
      this.getPartSubInfo(arg)
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
