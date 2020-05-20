!<!-- 生产新增修改 -->
<template>
  <div class="addPage">
    <tzHeadline :title="`${type === 'add' ? '新增' : '修改'}工序委外单`" backText="返回" isShowBack>
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
          <el-form-item class="w100" label="委外工序" prop="supplySeqName" ref="supplySeqName">
            <el-input placeholder="请输入" v-model.trim="formData.supplySeqName" clearable disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w100" label="供应商" prop="baseSupplierId" ref="baseSupplierId">
            <el-select
              class="w100"
              v-model.trim="formData.baseSupplierId"
              placeholder="全部"
              clearable
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
        <el-col :span="6">
          <el-form-item class="w100" label="负责人" prop="managerStuffId" ref="managerStuffId">
            <el-select
              clearable
              filterable
              class="w100"
              v-model="formData.managerStuffId"
              placeholder="负责人"
            >
              <el-option
                v-for="(staff, index) in employeeList"
                :key="index"
                :label="staff.val"
                :value="staff.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="section-label">关联单据</div>
      <div class="order-list">
        <div class="order-item" v-for="(item, index) in newRelevanceDoc" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">生产单号：</span>
            <span class="order-item-detail">{{item.prodOrderCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.managerStuff}}</span>
          </div>
        </div>
      </div>
      <section class="d-flex flex-center justify-between mb20">
        <div class="section-label">产品信息·生产工序委外</div>
        <el-button round size="medium" class="tz-search-submit" @click="reset">重置</el-button>
      </section>
      <!--:span-method="objectSpanMethod"-->
      <el-table
        border
        :data="materialData"
        :span-method="objectSpanMethod"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip />
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
        <el-table-column prop="prodOrderCode" width="170" label="生产订单号" align="center">
          <template slot-scope="scope">
            <span class="yellow" @click="goProd(scope.row.prodOrderId)">{{scope.row.prodOrderCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="processDisplay" label="工艺路线" align="center" show-overflow-tooltip />
        <el-table-column prop="planQuantity" label="计划数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.planQuantity || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="referenceQuantity" label="工序委外参考数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.referenceQuantity || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="supplyOrderQuantity"
          label="委外数量"
          class-name="required-red addEdit"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <el-input-number
              style="width: 100px"
              v-model.trim.number="scope.row.supplyOrderQuantity"
              :controls="false"
              :min="0"
              :max="99999999"
              size="medium"
              placeholder="数量"
              :precision="6"
            />
            <i class="el-icon-edit" />
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="委外单价" width="140" align="center" class-name="addEdit">
          <template slot-scope="scope">
            <el-input-number
              style="width: 100px"
              v-model.trim.number="scope.row.unitPrice"
              :controls="false"
              :min="0"
              :max="99999999"
              size="medium"
              placeholder="单价"
              :precision="6"
              @change="(val) => unitPriceC(val, scope.row)"
            />
            <i class="el-icon-edit" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="btn">
              <span class="yellow" @click="delMat(scope.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="18">
          <el-form-item class="w100 mt20" label="备注">
            <el-input
              class="w100"
              type="textarea"
              placeholder="请输入内容"
              v-model="formData.remark"
              maxlength="500"
              show-word-limit
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
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下单据已超出工序委外参考量"
      @submit="tipSubmit"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column
            property="processDisplay"
            label="工艺路线"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            property="prodOrderCode"
            label="生产单号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapActions, mapState, mapGetters } from 'vuex'
import dic from '../../../mixins/dic'
import { isObject, rowspan, spanMethod } from '../../../utils/utils'
import { filterDic } from '../../../filters/index'

const rulesConfig = { required: true, trigger: 'change' }
export default {
  name: 'outsourceProcessAdd',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  mixins: [dic],
  data () {
    // 这里存放数据
    return {
      type: '',
      rules: {
        supplySeqName: [{ ...rulesConfig, message: '请输入委外工序' }],
        managerStuffId: [{ ...rulesConfig, message: '请选择负责人' }],
        baseSupplierId: [{ ...rulesConfig, message: '请选择供应商' }]
      },
      formData: {
        supplySeqName: '',
        baseSupplierId: '',
        managerStuffId: '',
        remark: ''
      },
      submitType: 1, // 提交类型
      materialData: [], // 物料信息
      tipVisible: false, // 展开提示弹出框
      orderList: [], // 提示数据
      fileList: [], // 附件数据
      relevanceDoc: [], // 关联单据
      copyMaterialData: '', // 关联单据信息副本
      spanArr: []
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    const { type } = this.$route.params
    this.type = type
    if (type === 'add') {
      this.getRelevanceDoc()
    }
    if (type === 'edit') {
      this.getDetail()
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      btnLoading: state => state.global.btnLoading,
      userInfo: state => state.global.userInfo
    }),
    newRelevanceDoc () {
      const orders = this.materialData.map(it => it.prodOrderCode)
      return this.relevanceDoc.filter(it => orders.includes(it.prodOrderCode))
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    ...mapActions([
      'A_GET_BOM_VERSION_LIST',
      'A_GET_OUTSOURCE_PROCESS_ADD',
      'A_GET_OUTSOURCE_PROCESS_DETAIL',
      'A_GET_OUTSOURCE_PROCESS_UPDATE',
      'OUTSOURCE_PROCESS_SAVE_CHECK_APPROVE',
      'A_GET_OUTSOURCE_PROCESS_RELEVANCE_DOC'
    ]),
    // 委外单价改变
    unitPriceC (val, row) {
      this.materialData.forEach((it, i) => {
        if (it.baseMaterialId === row.baseMaterialId) {
          this.$set(this.materialData[i], 'unitPrice', val)
        }
      })
    },
    // 获取关联单据
    async getRelevanceDoc () {
      try {
        const { ids, seqId } = this.$route.query
        const {
          status,
          data
        } = await this.A_GET_OUTSOURCE_PROCESS_RELEVANCE_DOC({
          baseSeqId: seqId,
          prodOrderIdStr: ids
        })
        if (status === 0) {
          this.relevanceDoc = data.prodSeqRelateProdVoList || []
          this.materialData = data.prodSeqRelateProdMaterialVoList
            ? data.prodSeqRelateProdMaterialVoList.map(it => ({
                ...it,
                unitPrice: undefined,
                supplyOrderQuantity: undefined
              }))
            : []
          this.copyMaterialData = this.materialData
            ? JSON.stringify(this.materialData)
            : ''
          this.formData.supplySeqName = data.supplySeqName || ''
          this.formData.managerStuffId = this.userInfo.stuffId
          this.spanArr = rowspan(this.materialData, 'baseMaterialId')
        }
      } catch (e) {
        console.log(e)
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
        10
      ])
    },
    // 跳转生产订单
    goProd (id) {
      const arg = {
        name: 'prodDetail',
        params: { id }
      }
      this.$router.push(arg)
    },
    // 提示  继续提交
    tipSubmit () {
      this.tipVisible = false
      this.submit()
    },
    // 获取详情数据
    async getDetail () {
      try {
        const { supplySeqId } = this.$route.query
        const { status, data } = await this.A_GET_OUTSOURCE_PROCESS_DETAIL({
          supplySeqId
        })
        if (status === 0) {
          const {
            baseSeqName,
            baseSeqId,
            supplyCode,
            baseSupplierId,
            managerStuffId,
            remark,
            prodSeqRelateProdVoList,
            baseFileDtoList
          } = data
          this.copyMaterialData = data.supplySeqMaterialList
            ? JSON.stringify(data.supplySeqMaterialList)
            : ''
          this.relevanceDoc = prodSeqRelateProdVoList || []
          this.materialData =
            data.supplySeqMaterialList.map(it => ({
              ...it,
              unitPrice:
                it.unitPrice && it.unitPrice !== 0 ? it.unitPrice : undefined
            })) || []
          this.spanArr = rowspan(this.materialData, 'baseMaterialId')
          this.formData = {
            supplySeqName: baseSeqName,
            baseSeqId,
            baseSupplierId,
            managerStuffId,
            remark,
            supplyCode
          }
          this.fileList = baseFileDtoList
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.fileList = files
    },
    // 提交数据
    submit () {
      if (this.type === 'add') {
        this.add()
        return
      }
      this.update()
    },
    // 重置
    reset () {
      this.materialData =
        this.copyMaterialData !== ''
          ? JSON.parse(this.copyMaterialData).map(it => ({
              ...it,
              unitPrice:
                it.unitPrice && it.unitPrice !== 0 ? it.unitPrice : undefined
            }))
          : []
      this.spanArr = rowspan(this.materialData, 'baseMaterialId')
    },
    // 设置请求参数
    setParams () {
      const { supplySeqId, seqId } = this.$route.query
      const { managerStuffId, baseSeqId } = this.formData
      const managerStuff = filterDic(
        managerStuffId,
        this.employeeList,
        'id',
        'val'
      )
      return {
        supplySeqId: this.type === 'add' ? undefined : supplySeqId,
        type: this.submitType,
        baseSeqId: this.type === 'add' ? seqId : baseSeqId,
        managerStuff,
        ...this.formData,
        baseFileVoList: this.fileList,
        prodSeqRelateProdMaterialVoList: this.materialData
      }
    },
    // 保存并送审校验
    async check (type) {
      if (type === 2) {
        const arg = this.materialData.map(it => ({
          prodOrderSeqId: it.prodOrderSeqId,
          planQuantity: it.planQuantity,
          supplyOrderQuantity: it.supplyOrderQuantity,
          processDisplay: it.processDisplay,
          prodOrderCode: it.prodOrderCode
        }))
        const {
          status,
          data
        } = await this.OUTSOURCE_PROCESS_SAVE_CHECK_APPROVE(arg)
        if (status === 0) {
          if (data && data.length > 0) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.submit()
          }
        }
      }
    },
    // submitForm 保存  type 1 保存 2 保存送审
    submitForm (formName, type) {
      this.$refs[formName].validate(async (valid, object) => {
        try {
          if (valid) {
            const res = this.materialData.filter(it => !it.supplyOrderQuantity)
            if (res.length > 0) {
              this.$message.error('请维护委外数量')
              return
            }
            this.submitType = type
            if (type === 2) {
              this.check(type)
              return
            }
            this.submit()
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
    // 添加生产
    add () {
      const arg = this.setParams()
      this.A_GET_OUTSOURCE_PROCESS_ADD(arg)
    },
    // 更新生产
    update () {
      const arg = this.setParams()
      this.A_GET_OUTSOURCE_PROCESS_UPDATE(arg)
    },
    // 删除物料
    delMat (index) {
      this.materialData.splice(index, 1)
      this.spanArr = rowspan(this.materialData, 'baseMaterialId')
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
