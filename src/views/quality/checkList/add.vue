<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline :title="list.formType === 'IN' ? '来料检验数据维护' : '出货检验数据维护'" :isShowBack="true" backText="返回">
      <template slot="btn">
        <el-button class="tz-search-submit tz-btn-add" round size="medium" @click="save('formData')" :loading="loading">保存</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <div style="margin-top: 20px;"></div>
    <el-form
      size="medium"
      :inline="true"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="top">
        <!-- 基本信息 -->
        <div class="info">
          <div class="title">基本信息</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="质检人员" prop="managerStuffId">
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
          <el-col :span="4">
            <el-form-item label="质检单号" prop="formCode">
              <el-input placeholder="请输入" v-model.trim="formData.formCode" maxlength="20" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="list.checkType === 1">
            <el-form-item label="检验方案名称" prop="planName">
              <el-input placeholder="请输入" v-model.trim="formData.planName" maxlength="20" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 关联单据 -->
        <div class="info">
          <div class="title">关联单据</div>
        </div>
        <div class="relation">
          <div class="list">
            <div class="item">
              <span class="title">{{formData.formType === 'IN' ? '入' : '出'}}库单：</span>
              <span class="tip">{{formData.refCode}}</span>
            </div>
            <div class="item">
              <span class="title">创建人：</span>
              <span class="tip">{{formData.refCodeCreateBy}}</span>
            </div>
          </div>
        </div>
        <!-- 产品信息 -->
        <el-form-item label-position="left" prop="enableFlag">
          <div class="info" style="margin-top: 20px;">
            <div class="title">产品信息</div>
          </div>
        </el-form-item>
        <el-table :data="formData.baseMaterialVo" border style="width: 100%;" class="spotCheck" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
          <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
          <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
          <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
          <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
          <el-table-column prop="quantityDisplay" label="送检数量" align="center" show-overflow-tooltip />
          <el-table-column prop="unitName" label="单位" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 抽检要求 -->
        <div v-if="formData.checkPlanVo && formData.checkPlanVo.rangeFlag === 'Y'">
          <el-form-item label-position="left">
            <div class="info" style="margin-top: 20px;">
              <div class="title">抽检要求</div>
            </div>
          </el-form-item>
          <el-table :data="formData.checkPlanRangeVo" border style="width: 100%;" class="spotCheck" :header-cell-style="{'background-color': '#F9F9F9'}">
            <el-table-column prop="start" label="抽检数量下限" align="center" show-overflow-tooltip />
            <el-table-column prop="end" label="抽检数量上限" align="center" show-overflow-tooltip />
            <el-table-column prop="materialType" label="抽检比例" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.ratio}}%</div>
              </template>
            </el-table-column>
            <el-table-column prop="materialType" label="应抽检数量" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="newColor">{{scope.row.samplingQuantity}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 尺寸SPEC -->
        <div v-if="formData.checkPlanVo && formData.checkPlanVo.specFlag === 'Y'">
          <el-form-item label-position="left" style="margin-bottom: 0">
            <div class="info" style="margin-top: 42px;">
              <div class="title">尺寸SPEC</div>
            </div>
          </el-form-item>
          <div class="detailList" style="margin-bottom: 22px;">
            <el-row :gutter="20">
              <el-col :span="5">
                <div class="item">检验方法：<span>{{formData.checkPlanVo.specMethod}}</span></div>
              </el-col>
              <el-col :span="5">
                <div class="item">检验工具：<span>{{formData.checkPlanVo.specTool}}</span></div>
              </el-col>
            </el-row>
          </div>
          <el-table :data="formData.checkPlanSpecVos" :span-method="objectSpanMethod" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
            <el-table-column prop="seq" label="序号" align="center" show-overflow-tooltip />
            <el-table-column prop="position" label="检验位置" align="center" show-overflow-tooltip />
            <el-table-column prop="minValue" label="SPEC下限" align="center" show-overflow-tooltip />
            <el-table-column prop="maxValue" label="SPEC上限" align="center" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" align="center" show-overflow-tooltip />
            <el-table-column prop="value" label="实际值" align="center" show-overflow-tooltip class-name="required-red addEdit">
              <template slot-scope="scope">
                <el-input-number placeholder="请输入" v-model.trim="scope.row.value" :controls="false" :min="0" :max="99999999" :precision="6" @change="sizeChange(scope.row)" />
                <i class="el-icon-edit"></i>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="单项结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div v-if="!scope.row.result">-</div>
                  <tzStatus v-else :status="scope.row.result" :content="scope.row.result | filterDic(dic.qualityResult)" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="itemResult" label="检测结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.itemResult">
                  <el-radio :label="item.type" v-for="item in dic.qualityResults" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button size="small" type="text" class="yellow" @click="delSpec(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="continue" @click="specContinueAdd">继续添加</div>
        </div>
        <!-- 其他项目检 -->
        <div v-if="formData.checkPlanVo && formData.checkPlanVo.otherFlag === 'Y'">
          <el-form-item label-position="left" prop="enableFlag">
            <div class="info" style="margin-top: 42px;">
              <div class="title">其他项目检验</div>
            </div>
          </el-form-item>
          <el-table :data="formData.checkPlanOtherVos" :span-method="objectSpanMethod1" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
            <el-table-column prop="seq" label="序号" align="center" show-overflow-tooltip />
            <el-table-column prop="checkName" label="检验项目" align="center" show-overflow-tooltip />
            <el-table-column prop="checkDesc" label="检验要求" align="center" show-overflow-tooltip />
            <el-table-column prop="checkMethod" label="检验方法" align="center" show-overflow-tooltip />
            <el-table-column prop="checkTool" label="检验工具" align="center" show-overflow-tooltip />
            <el-table-column prop="value" label="检验值/描述" align="center" show-overflow-tooltip class-name="required-red addEdit">
              <template slot-scope="scope">
                <el-input placeholder="请输入"  v-model.trim="scope.row.value" maxlength="20" />
                <i class="el-icon-edit"></i>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="单项结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.result" @change="otherChange(scope.row)">
                  <el-radio :label="item.type" v-for="item in dic.qualityResults" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column prop="itemResult" label="检测结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.itemResult">
                  <el-radio :label="item.type" v-for="item in dic.qualityResults" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button size="small" type="text" class="yellow" @click="delOther(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="continue" @click="otherContinueAdd">继续添加</div>
        </div>
        <!-- 检验结果 -->
        <el-form-item label-position="left" prop="enableFlag">
          <div class="info" style="margin-top: 42px;">
            <div class="title">检验结果</div>
          </div>
        </el-form-item>
        <el-table :data="formData.checkFormNgVos" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="ngType" label="不良类型" align="center" show-overflow-tooltip />
          <el-table-column prop="ngReason" label="不良原因" align="center" show-overflow-tooltip />
          <el-table-column prop="ngQuantity" label="不良数量" align="center" show-overflow-tooltip />
          <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="buttons operation">
                <div class="btns yellow" @click="delBadReason(scope.$index)">删除</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="continue" @click="badReasonAdd">添加不良原因</div>
        <!-- 最终结果 -->
        <el-table :data="finalResult" border style="width: 100%;margin-top: 20px;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="goodQuantity" label="良品数量" align="center" class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" v-model.trim="scope.row.goodQuantity" :controls="false" :min="0" :max="99999999" :precision="6" @change="calculation" />
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="ngQuantity" label="不良品数量" align="center" show-overflow-tooltip />
          <el-table-column prop="checkRatio" label="检验良率" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.checkRatio}}%
            </template>
          </el-table-column>
          <el-table-column prop="total" label="检验数量" align="center" show-overflow-tooltip />
          <el-table-column prop="totalQuantity" label="送检数量" align="center" show-overflow-tooltip />
          <el-table-column prop="result" label="检测结果" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.result">
                <el-radio :label="item.type" v-for="item in dic.qualityResults" :key="item.id">{{item.name}}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
        <!-- 备注 -->
        <div class="headTitle" style="margin-top: 18px;margin-bottom: 6px;">备注</div>
        <el-input type="textarea" v-model="formData.remark" class="commonTextarea" resize="none" maxlength="500"/>
        <tzCommonFileUpload @handleUploadFile="handleUploadFile" class="tzupload" />
        <!-- 不良原因组件 -->
        <badReasons :visible="tips.badVisible" @cancel="cancel" @submit="getBadReasons" />
        <!-- 温馨提示 -->
        <tzTipDialog :visible="tips.visible" submitText="去维护" :content="tips.content" @submit="enterPage" @close="handleClose" :showClose="false" />
        <tzTipDialog :visible="tips.visible1" submitText="继续提交" :content="tips.content" @submit="continueSubmit" @close="handleCancel" :showClose="false" :singleBtn="tips.singleBtn">
          <div slot="tipTitle">
            <div class="item" v-for="(item,index) in tips.cozyTips" :key="index">{{item}}</div>
          </div>
        </tzTipDialog>
    </el-form>
  </div>
</template>
<script>
import {
  mapActions, mapGetters, mapMutations, mapState
} from 'vuex'
import { becomeObj, spanMethod, rowspan } from '../../../utils/utils'
import dic from '../../../global/dictionary'
import dics from '../../../mixins/dic'

export default {
  name: 'globalQualityAdd',
  mixins: [dics],
  data () {
    return {
      dic,
      list: {},
      tips: {
        content: '',
        visible: false,
        singleBtn: true,
        badVisible: false,
        visible1: false,
        cozyTips: []
      },
      formData: {},
      params: {},
      finalResult: [{}],
      spanArr: [], // 合并单元格
      spanArr1: [], // 合并单元格
      copyCheckPlanSpecVos: [], // 尺寸spec 初始数据
      copyCheckPlanOtherVos: [] // 其他项目检 初始数据
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      loading: state => state.global.btnLoading
    })
  },
  mounted () {
    const { list } = this.$route.query
    this.list = becomeObj(list)
    const { checkPlanId, formType } = this.list
    // 判断如果没有物料质检checkPlanId 需要去物料质检方案维护
    if (!checkPlanId) {
      this.tips.visible = true
      this.tips.content = '该物料没有维护质检方案'
    } else {
      // checkType 为1时 全局质检 为2时 为物料质检
      // 质检单类型IN=入库, OUT=出库, PROD=过程检
      this.inQualityGlobalInit()
    }
    if (formType === 'OUT') {
      document.title = '出货检验数据维护'
    } else {
      document.title = '来料检验数据维护'
    }
    // 最终检验结果
    this.finalResult = [{
      total: 0,
      goodQuantity: undefined,
      ngQuantity: 0,
      checkRatio: 0,
      totalQuantity: '',
      result: 'Y'
    }]
  },
  methods: {
    ...mapMutations(['BTN_LOADING']),
    ...mapActions([
      'A_GET_IN_QUALITY_GLOBAL_INIT',
      'A_ADD_QUALITY_INIT'
    ]),
    // 前往维护物料质检方案
    enterPage () {
      if (this.list.checkType === 1) {
        this.$router.push({
          name: 'globalQuality'
        })
      } else {
        this.$router.push({
          name: 'materialQuality'
        })
      }
    },
    handleClose () {
      this.$router.go(-1)
    },
    // 尺寸spec 实际值修改 改变单项结果值
    sizeChange (row) {
      if (row.value >= row.minValue && row.value <= row.maxValue) {
        this.formData.checkPlanSpecVos[row.index].result = 'Y'
      } else {
        this.formData.checkPlanSpecVos[row.index].result = 'N'
      }
      // 筛选出所有相同的seq项
      const filterSpecSeq = this.formData.checkPlanSpecVos.filter(item => item.seq === row.seq)
      // 筛选相同的seq项是否有一项结果为不合格
      const filterNo = filterSpecSeq.filter(item => item.result === 'N')
      // 如果不合格的项为0 为合格 有一项不合格就为不合格
      if (filterNo.length === 0) {
        this.changeSpecResult(row, 'checkPlanSpecVos', 'Y')
      } else {
        this.changeSpecResult(row, 'checkPlanSpecVos', 'N')
      }
    },
    changeSpecResult (row, type, result) {
      for (let i = 0; i < this.formData[type].length; i += 1) {
        if (row.seq === this.formData[type][i].seq) {
          this.formData[type][i].itemResult = result
        }
      }
    },
    // 其他项目检
    otherChange (row) {
      // 筛选出所有相同的seq项
      const filterOtherSeq = this.formData.checkPlanOtherVos.filter(item => item.seq === row.seq)
      // 筛选相同的seq项是否有一项结果为不合格
      const filterNo = filterOtherSeq.filter(item => item.result === 'N')
      // 如果不合格的项为0 为合格 有一项不合格就为不合格
      if (filterNo.length === 0) {
        this.changeSpecResult(row, 'checkPlanOtherVos', 'Y')
      } else {
        this.changeSpecResult(row, 'checkPlanOtherVos', 'N')
      }
    },
    // 尺寸spec继续添加
    specContinueAdd () {
      const { checkPlanSpecVos } = this.formData
      console.log(checkPlanSpecVos)
      let index = (checkPlanSpecVos && checkPlanSpecVos.length) ? checkPlanSpecVos[checkPlanSpecVos.length - 1].index : -1
      const seq = (checkPlanSpecVos && checkPlanSpecVos.length) ? checkPlanSpecVos[checkPlanSpecVos.length - 1].seq : 0
      console.log(index, seq)
      const copyCheckPlanSpecVos = this.copyCheckPlanSpecVos.map((item) => {
        index += 1
        return {
          ...item,
          index,
          seq: seq + 1
        }
      })
      this.formData.checkPlanSpecVos = [...this.formData.checkPlanSpecVos, ...copyCheckPlanSpecVos]
      this.spanArr = rowspan(this.formData.checkPlanSpecVos, 'seq')
    },
    // 其他项目继续添加
    otherContinueAdd () {
      const { checkPlanOtherVos } = this.formData
      let index = (checkPlanOtherVos && checkPlanOtherVos.length) ? checkPlanOtherVos[checkPlanOtherVos.length - 1].index : -1
      const seq = (checkPlanOtherVos && checkPlanOtherVos.length) ? checkPlanOtherVos[checkPlanOtherVos.length - 1].seq : 0
      const copyCheckPlanOtherVos = this.copyCheckPlanOtherVos.map((item) => {
        index += 1
        return {
          ...item,
          index,
          seq: seq + 1
        }
      })
      this.formData.checkPlanOtherVos = [...this.formData.checkPlanOtherVos, ...copyCheckPlanOtherVos]
      this.spanArr1 = rowspan(this.formData.checkPlanOtherVos, 'seq')
    },
    // 添加不良原因
    badReasonAdd () {
      this.tips.badVisible = true
    },
    // 关闭不良原因
    cancel () {
      this.tips.badVisible = false
    },
    // 获取不良原因数据
    getBadReasons (e) {
      this.formData.checkFormNgVos = e
      this.countNgNums()
    },
    // 删除不良原因数据
    delBadReason (index) {
      this.formData.checkFormNgVos.splice(index, 1)
      this.countNgNums()
    },
    // 计算不良数
    countNgNums () {
      this.finalResult[0].ngQuantity = 0
      this.formData.checkFormNgVos.forEach((item) => {
        this.finalResult[0].ngQuantity += item.ngQuantity
      })
      this.calculation()
      this.cancel()
    },
    // 计算检验良率 检验数量
    calculation () {
      const { goodQuantity, ngQuantity } = this.finalResult[0]
      if (goodQuantity === undefined || goodQuantity === null) return
      this.finalResult[0].total = Number(goodQuantity) + Number(ngQuantity)
      if (this.finalResult[0].total === 0) {
        this.finalResult[0].checkRatio = 0
      } else {
        this.finalResult[0].total = this.finalResult[0].total.toFixed(6)
        const checkRatio = Number(goodQuantity) / this.finalResult[0].total * 100
        this.finalResult[0].checkRatio = checkRatio.toFixed(6)
      }
      if (this.finalResult[0].total > this.finalResult[0].totalQuantity) {
        this.tips.visible1 = true
        this.tips.content = '检验数量超过送检数量'
      }
    },
    // 入库检全局质检初始化
    async inQualityGlobalInit () {
      try {
        const arg = {
          checkFormId: this.list.checkFormId,
          checkPlanId: this.list.checkPlanId,
          checkType: this.list.checkType,
          formType: this.list.formType
        }
        const { status, data } = await this.A_GET_IN_QUALITY_GLOBAL_INIT(arg)
        if (status === 0) {
          this.formData = data
          this.formData.baseMaterialVo = [data.baseMaterialVo]
          // 抽检数量 判断是否在区间内
          this.finalResult[0].totalQuantity = data.baseMaterialVo[0].quantityDisplay
          if (data.checkPlanRangeVo && data.checkPlanRangeVo.ratio) {
            const samplingQuantity = Number(data.baseMaterialVo[0].quantityDisplay) * Number(data.checkPlanRangeVo.ratio) / 100
            data.checkPlanRangeVo.samplingQuantity = samplingQuantity.toFixed(6)
            this.formData.checkPlanRangeVo = [data.checkPlanRangeVo]
          } else if (data.checkPlanVo.rangeFlag === 'Y') {
            this.tips.visible = true
            this.formData.checkPlanRangeVo = []
            this.tips.content = '抽检数量不符合抽检要求区间'
          }
          // 尺寸质检spec
          this.formData.checkPlanSpecVos = (data.checkPlanSpecVos && data.checkPlanSpecVos.map((item, index) => ({
            ...item,
            index,
            seq: 1,
            result: '',
            itemResult: 'Y'
          }))) || []
          this.copyCheckPlanSpecVos = JSON.parse(JSON.stringify(this.formData.checkPlanSpecVos))
          this.spanArr = rowspan(this.formData.checkPlanSpecVos, 'seq')
          // 其他项目检
          this.formData.checkPlanOtherVos = (data.checkPlanOtherVos && data.checkPlanOtherVos.map((item, index) => ({
            ...item,
            index,
            seq: 1,
            result: 'Y',
            itemResult: 'Y'
          }))) || []
          this.copyCheckPlanOtherVos = JSON.parse(JSON.stringify(this.formData.checkPlanOtherVos))
          this.spanArr1 = rowspan(this.formData.checkPlanOtherVos, 'seq')
          const { stuffId } = JSON.parse(sessionStorage.getItem('userInfo'))
          // 初始化质检人员
          this.formData.managerStuffId = stuffId
          this.changeManage(stuffId)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 新增
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setParams()
        }
      })
    },
    // 删除SPEC
    delSpec (row) {
      const delSpecIndex = []
      this.formData.checkPlanSpecVos.forEach((item, index) => {
        if (row.seq === item.seq) {
          delSpecIndex.push(index)
        }
      })
      this.formData.checkPlanSpecVos.splice(delSpecIndex[0], delSpecIndex.length)
      // 删除后重新排序
      const includesArr = []
      this.formData.checkPlanSpecVos = this.formData.checkPlanSpecVos.map((item, index) => {
        let seq = ''
        if (includesArr.includes(item.seq)) {
          const idx = includesArr.indexOf(item.seq)
          seq = idx + 1
        } else {
          includesArr.push(item.seq)
          const idx = includesArr.indexOf(item.seq)
          seq = idx + 1
        }
        return {
          ...item,
          index,
          seq
        }
      })
      this.spanArr = rowspan(this.formData.checkPlanSpecVos, 'seq')
    },
    // 删除其他项目
    delOther (row) {
      const delOtherIndex = []
      this.formData.checkPlanOtherVos.forEach((item, index) => {
        if (row.seq === item.seq) {
          delOtherIndex.push(index)
        }
      })
      this.formData.checkPlanOtherVos.splice(delOtherIndex[0], delOtherIndex.length)
      // 删除后重新排序
      const includesArr = []
      this.formData.checkPlanOtherVos = this.formData.checkPlanOtherVos.map((item, index) => {
        let seq = ''
        if (includesArr.includes(item.seq)) {
          const idx = includesArr.indexOf(item.seq)
          seq = idx + 1
        } else {
          includesArr.push(item.seq)
          const idx = includesArr.indexOf(item.seq)
          seq = idx + 1
        }
        return {
          ...item,
          index,
          seq
        }
      })
      this.spanArr1 = rowspan(this.formData.checkPlanOtherVos, 'seq')
    },
    setParams () {
      const {
        checkPlanOtherVos, checkPlanSpecVos, checkFormNgVos, checkPlanVo, formCode, refCode, refId, baseMaterialId, remark, managerStuff, managerStuffId, baseFileVos, checkFormId, checkPlanRangeVo
      } = this.formData
      const { formType, checkPlanId, checkType } = this.list
      if (checkPlanVo.specFlag === 'Y') {
        // 判断尺寸Spec的实际值是否为空
        if (checkPlanSpecVos.length === 0) {
          return this.$message.error('尺寸SPEC至少要维护一条数据')
        }
        for (let i = 0; i < checkPlanSpecVos.length; i += 1) {
          if (!checkPlanSpecVos[i].value) {
            this.$message.error('尺寸Spec实际值必填')
            return
          }
        }
      }
      if (checkPlanVo.otherFlag === 'Y') {
        // 判断检验其他项目检验实际值是否为空
        if (checkPlanOtherVos.length === 0) {
          return this.$message.error('其他项目检验至少要维护一条数据')
        }
        for (let i = 0; i < checkPlanOtherVos.length; i += 1) {
          if (!checkPlanOtherVos[i].value) {
            this.$message.error('其他项目检验值/描述必填')
            return
          }
        }
      }
      const finalResult = this.finalResult[0]
      const { total, totalQuantity, goodQuantity } = finalResult
      if (goodQuantity === undefined || goodQuantity === null) {
        this.$message.error('良品数必填')
        return
      }
      if (total > totalQuantity) {
        this.tips.visible1 = true
        this.tips.content = '检验数量超过送检数量'
        return
      }
      this.params = {
        refId,
        remark,
        refCode,
        formType,
        formCode,
        checkFormId,
        checkPlanId,
        baseFileVos,
        managerStuff,
        baseMaterialId,
        managerStuffId,
        checkFormNgVos,
        ...finalResult,
        checkPlanRangeVo: checkPlanRangeVo ? checkPlanRangeVo[0] : null,
        checkPlanSourceId: checkPlanId,
        checkFormItemSpecVos: checkPlanSpecVos,
        checkFormItemOtherVos: checkPlanOtherVos,
        checkPlanSourceType: checkType === 1 ? 'GLOBAL' : 'MATERIAL'
      }
      // samplingQuantity 为应抽检数量
      if (checkPlanVo.rangeFlag === 'Y') {
        const cozyTips = []
        const { samplingQuantity } = checkPlanRangeVo[0]
        if (checkPlanVo.specFlag === 'Y') {
          const newLength = checkPlanSpecVos.length / this.copyCheckPlanSpecVos.length
          if (newLength > samplingQuantity) {
            cozyTips.push('尺寸SEPC：检验数量超过抽检数量要求')
          }
          if (newLength < samplingQuantity) {
            cozyTips.push('尺寸SEPC：检验数量未达到抽检数量要求')
          }
        }
        if (checkPlanVo.otherFlag === 'Y') {
          const newLength = checkPlanOtherVos.length / this.copyCheckPlanOtherVos.length
          if (newLength > samplingQuantity) {
            cozyTips.push('其他项目检：检验数量超过抽检数量要求')
          }
          if (newLength < samplingQuantity) {
            cozyTips.push('其他项目检：检验数量未达到抽检数量要求')
          }
        }
        if (total > samplingQuantity) {
          cozyTips.push('检验结果：检验数量超过抽检数量要求')
        }
        if (total < samplingQuantity) {
          cozyTips.push('检验结果：检验数量未达到抽检数量要求')
        }
        if (cozyTips.length) {
          this.tips.visible1 = true
          this.tips.singleBtn = false
          this.tips.cozyTips = cozyTips
          this.tips.content = '您提交的质检单存在检验数量不合规'
          return
        }
      }
      this.addQuality()
    },
    // 继续提交
    continueSubmit () {
      this.addQuality()
      this.tips.visible1 = false
      this.tips.singleBtn = true
    },
    // 取消
    handleCancel () {
      this.tips.visible1 = false
    },
    async addQuality () {
      try {
        this.BTN_LOADING(true)
        const { status } = await this.A_ADD_QUALITY_INIT(this.params)
        if (status === 0) {
          this.$message.success('保存成功')
          setTimeout(() => {
            this.$router.go(-1)
            this.BTN_LOADING(false)
          }, 500)
        } else {
          this.BTN_LOADING(false)
        }
      } catch (e) {
        this.BTN_LOADING(false)
        console.log(e)
      }
    },
    handleUploadFile ({ files }) {
      this.formData.baseFileVos = files
    },
    objectSpanMethod ({ rowIndex, columnIndex }) {
      return spanMethod({
        rowIndex,
        columnIndex
      }, this.spanArr, [0, 7, 8])
    },
    objectSpanMethod1 ({ rowIndex, columnIndex }) {
      return spanMethod({
        rowIndex,
        columnIndex
      }, this.spanArr1, [0, 7, 8])
    },
    // 获取员工主档
    changeManage (e) {
      const list = this.employeeList.filter(item => item.id === e)
      this.formData.managerStuff = `(${list[0].stuffNo})|${list[0].realname}`
    }
  }
}
</script>
<style lang="less" scoped>
  .info {
    display: flex;
    line-height: 18px;
    align-items: center;
  }
  .info .title {
    font-size: 16px;
    font-weight: 550;
    line-height: 18px;
    margin-right: 56px;
    font-family: PingFangSC-Medium,PingFang SC;
    color:rgba(40,40,40,1);
  }
  .info .switch {
    font-size:16px;
    font-weight:400;
    margin-left: 10px;
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(68,68,68,1);
  }
  /deep/ .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  /deep/ .el-input-number {
    width: 100%;
  }
  .spotCheck /deep/ .el-input-number {
    width: 50%;
  }
  .continue {
    width: 100%;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    line-height: 48px;
    text-align: center;
    border: 1px solid #EBEEF5;
    border-top: none;
    font-family: PingFangSC-Medium,PingFang SC;
    color:rgba(124,168,112,1);
  }
  .detailList {
    margin-top: 15px;
  }
  .detailList .item {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 500;
    color:rgba(153,153,153,1);

  }
  .detailList .item span {
    color: #444444;
  }
  .relation {
    overflow: hidden;
    margin-top: 10px;
  }
  .relation .list {
    height:40px;
    float: left;
    padding: 0 15px;
    line-height: 40px;
    border-radius:8px;
    margin-right: 20px;
    background:rgba(124,168,112,0.2);
  }
  .relation .list .item:nth-child(1) {
    margin-right: 68px;
  }
  .relation .list > div {
    display: inline-block;
  }
  .relation .list .title {
    color: #999999;
  }
  .relation .list .tip {
    color: #444444;
  }
  .newColor {
    color: #1989FA;
  }
  /deep/ .el-table__empty-block {
    display: none;
  }
  .commonTextarea /deep/ .el-textarea__inner {
    height: 120px;
    max-width: 1022px;
  }
  .tzupload {
    margin-top: 20px;
  }
</style>
