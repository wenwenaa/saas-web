<template>
  <div class="content">
    <tzHeadline :title="title" backText="返回物料主档" :isShowBack="isShowBack">
      <template slot="btn">
        <el-button
          round
          size="medium"
          :loading="btnLoading"
          class="tz-btn-add"
          @click="materialSave(routeParams.type)"
          :class="routeParams.type | className"
        >{{routeParams.type === 'detail'?'编辑':'保存'}}</el-button>
      </template>
    </tzHeadline>
    <div class="main">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        :label-position="routeParams.type === 'detail'?'left':'top'"
        class="material-ruleForm"
      >
        <div class="headTitle f16 font-bold">基本信息</div>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="物料名称" prop="materialName" ref="materialName">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.materialName"
                maxlength="200"
                :disabled="routeParams.type === 'edit'"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <tzToolTip v-else :content="`${ruleForm.materialName}`"></tzToolTip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码" prop="materialCode" class="relative" ref="materialCode">
              <el-checkbox
                v-model.trim="ruleForm.checked"
                class="absolute-checkbox"
                @change="getCode"
                :disabled="routeParams.type === 'edit'"
                v-if="routeParams.type !== 'detail'"
              >系统生成</el-checkbox>
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.materialCode"
                :disabled="routeParams.type === 'edit' || ruleForm.checked "
                maxlength="100"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <tzToolTip v-else :content="`${ruleForm.materialCode}`"></tzToolTip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料类型" prop="typeName" ref="typeName">
              <el-select
                v-model.trim="ruleForm.typeName"
                placeholder="请选择"
                v-if="routeParams.type !== 'detail'"
                clearable
              >
                <el-option
                  :key="index"
                  :value="item.typeName"
                  v-for="(item,index) in materialTypeList"
                  :label="item.typeName"
                ></el-option>
              </el-select>
              <tzToolTip v-else :content="`${ruleForm.typeName}`"></tzToolTip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料规格">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.spec"
                :disabled="routeParams.type === 'edit'"
                maxlength="200"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <tzToolTip v-else :content="`${ruleForm.spec}`"></tzToolTip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料图号">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.picNum"
                maxlength="200"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <tzToolTip v-else :content="`${ruleForm.picNum}`"></tzToolTip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="材质">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.materialType"
                maxlength="200"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <tzToolTip v-else :content="`${ruleForm.materialType}`"></tzToolTip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="含税单价">
              <el-input-number
                v-model.trim="ruleForm.unitPrice"
                :precision="6"
                :step="0.1"
                @change="sumRate"
                :min="0"
                type="number"
                :controls="false"
                :max="99999999"
                v-if="routeParams.type !== 'detail'"
                placeholder="请输入"
              ></el-input-number>
              <span v-else>{{ruleForm.unitPrice}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="税率" prop="taxPercent">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.taxPercent"
                @change="sumRate"
                type="number"
                v-if="routeParams.type !== 'detail'"
                clearable
              >
                <template slot="suffix">%</template>
              </el-input>
              <span v-else>{{ruleForm.taxPercent}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="未税单价">
              <el-input-number
                v-model.trim="ruleForm.untaxedPrice"
                :precision="6"
                :step="0.1"
                type="number"
                :controls="false"
                :max="99999999"
                v-if="routeParams.type !== 'detail'"
                :disabled="true"
                :min="0"
                placeholder="请输入"
              ></el-input-number>
              <span v-else>{{ruleForm.untaxedPrice?Number(ruleForm.untaxedPrice).toFixed(6):''}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="d-inline-block mr50 mr20">
          <label class="mr20">是否启用</label>
          <el-switch
            active-color="#7CA870"
            :disabled="routeParams.type === 'detail'"
            v-model.trim="ruleForm.enableFlag"
          ></el-switch>
        </div>
        <tzCommonFileUpload
          class="mt20"
          type="img"
           fileTitle="物料图片"
          fileTip="支持上传图片，图片支持jpg、png格式，上传的图片不能超过10张，每张图片不得大于2M"
          fileSubTitle="物料图片"
          :applicationType="routeParams.type !== 'detail' ? 'add' : 'detail'"
          :fileList="fileList || []"
          @handleUploadFile="uploadSuccess"
        />
        <div class="headTitle f16 font-bold">计量信息</div>
        <el-row :gutter="16" class="material-item">
          <el-col :span="24">
            <el-form-item label="主计量单位" prop="unitName" ref="unitName">
              <el-select
                v-model.trim="ruleForm.unitName"
                placeholder="请选择"
                :disabled="routeParams.type === 'edit'"
                v-if="routeParams.type !== 'detail'"
                clearable
              >
                <el-option
                  :key="index"
                  :value="item.unitName"
                  v-for="(item,index) in unitList"
                  :label="item.unitName"
                ></el-option>
              </el-select>
              <span v-else>{{ruleForm.unitName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <tzSearch :isShowExtend="true" :isShowBtn="false" @_handleExtend="handleExtend">
          <template slot="content">
            <el-row
              :gutter="24"
              v-for="(item,index) in ruleForm.baseMaterialUnitVoList"
              :key="index"
              class="mr25"
            >
              <el-col :span="6">
                <el-form-item
                  :label="'辅计量单位'+(index+1)"
                  :prop="`baseMaterialUnitVoList[${index}].unitName`"
                  :ref="`baseMaterialUnitVoList[${index}].unitName`"
                  :rules="{ required: item.exchangeRate ? Boolean(1) : Boolean(0), message: '请选择辅计量单位', trigger: 'change' }"
                >
                  <el-select
                    v-model.trim="item.unitName"
                    placeholder="请选择"
                    v-if="routeParams.type !== 'detail'"
                    clearable
                  >
                    <el-option
                      :key="index"
                      :value="item.unitName"
                      v-for="(item,index) in unitList"
                      :label="item.unitName"
                    ></el-option>
                  </el-select>
                  <!-- <el-tooltip v-else effect="dark" :content="item.unitName" placement="top">
                    <div class="wordWrap ellipsis" style="width:200px;" >{{item.unitName}}</div>
                  </el-tooltip>-->
                  <tzToolTip v-else :content="`${item.unitName}`"></tzToolTip>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :label="'主辅比'+(index+1)"
                  :prop="`baseMaterialUnitVoList[${index}].exchangeRate`"
                  :ref="`baseMaterialUnitVoList[${index}].exchangeRate`"
                  :rules="{ required: item.unitName ? Boolean(1) : Boolean(0), message: '请输入主辅比', trigger: 'change' }"
                >
                  <el-input
                    placeholder="请输入"
                    v-model.trim="item.exchangeRate"
                    v-if="routeParams.type !== 'detail'"
                    @change="unitChg(item.exchangeRate,`主辅比${index+1}`)"
                    type="number"
                    maxlength="10"
                    clearable
                  />
                  <span v-else>{{item.exchangeRate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="del-circle" v-if="index!=0 && routeParams.type !== 'detail'">
                <tzBtn icon="tz-icon-del-circle" @click="delMore(index)"></tzBtn>
              </el-col>
            </el-row>
            <div class="more-box">
              <el-button
                round
                size="medium"
                class="tz-search-submit"
                v-if="routeParams.type !== 'detail'"
                @click="addMore"
              >添加更多</el-button>
            </div>
          </template>
          <template slot="main">
            <div class="headTitle f16 font-bold">仓储信息</div>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="默认仓库">
                  <el-select
                    v-model.trim="ruleForm.defaultWarehouseId"
                    placeholder="请选择"
                    :disabled="routeParams.type === 'detail'"
                    clearable
                  >
                    <el-option
                      :key="item.baseWarehouseId"
                      :value="item.baseWarehouseId"
                      v-for="item in houseList"
                      :label="item.warehouseName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最低安全库存">
                  <el-input-number
                    v-model.trim="ruleForm.minSafetyStock"
                    :precision="6"
                    :step="0.1"
                    type="number"
                    :controls="false"
                    :min="0"
                    :max="99999999"
                    v-if="routeParams.type !== 'detail'"
                    placeholder="请输入"
                  ></el-input-number>
                  <span
                    v-else
                  >{{ruleForm.minSafetyStock?Number(ruleForm.minSafetyStock).toFixed(6):''}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最高安全库存">
                  <el-input-number
                    v-model.trim="ruleForm.maxSafetyStock"
                    :precision="6"
                    :step="0.1"
                    type="number"
                    :controls="false"
                    v-if="routeParams.type !== 'detail'"
                    :min="0"
                    :max="99999999"
                    placeholder="请输入"
                  ></el-input-number>
                  <span
                    v-else
                  >{{ruleForm.maxSafetyStock?Number(ruleForm.maxSafetyStock).toFixed(6):''}}</span>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                  <el-form-item label="出库上限">
                    <el-input placeholder="请输入"
                              v-model.trim="ruleForm.code"
                              maxlength="10"
                              clearable><template slot="suffix">%</template/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="发货上限">
                    <el-input placeholder="请输入"
                              v-model.trim="ruleForm.code"
                              maxlength="10"
                              clearable><template slot="suffix">%</template/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="入库上限">
                    <el-input placeholder="请输入"
                              v-model.trim="ruleForm.code"
                              maxlength="10"
                              clearable><template slot="suffix">%</template/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="采购上限">
                    <el-input placeholder="请输入"
                              v-model.trim="ruleForm.code"
                              maxlength="10"
                              clearable><template slot="suffix">%</template/>
                  </el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item label="最小包装数">
                  <el-input-number
                    v-model.trim="ruleForm.minPackingNum"
                    :precision="6"
                    :step="0.1"
                    type="number"
                    :controls="false"
                    :min="0"
                    :max="99999999"
                    v-if="routeParams.type !== 'detail'"
                    placeholder="请输入"
                  ></el-input-number>
                  <span
                    v-else
                  >{{ruleForm.minPackingNum?Number(ruleForm.minPackingNum).toFixed(6):''}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="headTitle f16 font-bold">质检信息</div>
            <div class="d-inline-block">
              <label class="mr20">选择质检种类</label>
              <span class="mr20">
                <el-checkbox
                  v-model.trim="ruleForm.inCheckFlag"
                  v-if="routeParams.type !== 'detail'"
                >来料检</el-checkbox>
                <span v-else>{{ruleForm.inCheckFlag === 'Y' ? '来料检' : ''}}</span>
              </span>
              <span>
                <el-checkbox
                  v-model.trim="ruleForm.outCheckFlag"
                  v-if="routeParams.type !== 'detail'"
                >出库检</el-checkbox>
                <span v-else>{{ruleForm.outCheckFlag === 'Y' ? '出库检' : ''}}</span>
              </span>
            </div>
            <!-- <div class="headTitle f16 font-bold">其他信息</div>
              <div class="d-inline-block mr50">
                <label class="mr20">是否批次号</label>
                <el-radio-group v-model.trim="ruleForm.resource">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </div>
              <div class="d-inline-block mr50">
                <label class="mr20">是否炉号</label>
                <el-radio-group v-model.trim="ruleForm.resource">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </div>
              <div class="d-inline-block mr50">
                <label class="mr20">是否热处理</label>
                <el-radio-group v-model.trim="ruleForm.resource">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
            </div>-->
            <el-form-item label="备注">
              <el-input
                type="textarea"
                resize="none"
                rows="4"
                placeholder="请输入"
                maxlength="500"
                v-if="routeParams.type !== 'detail'"
                v-model.trim="ruleForm.remark"
              />
              <span v-else class="wordWrap">{{ruleForm.remark}}</span>
            </el-form-item>
          </template>
        </tzSearch>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dic from '../../../mixins/dic'
import { isObject } from '../../../utils/utils'

export default {
  name: 'materialDetail',
  mixins: [dic],
  data () {
    const checkNum = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      if (value > 100 || value <= 0) {
        callback(new Error('税率不能大于100,小于等于0'))
      } else {
        callback()
      }
    }
    return {
      title: '新增物料主档',
      isShowBack: true,
      isExtend: true,
      applicationType: 'add',
      ruleForm: {
        materialName: '',
        materialCode: '',
        checked: false,
        typeName: '',
        spec: '',
        picNum: '',
        baseFileVoList: [],
        baseMaterialUnitVoList: [
          {
            unitName: undefined,
            exchangeRate: undefined
          }
        ],
        copyMaterialCode: '',
        materialType: '',
        unitPrice: undefined,
        untaxedPrice: undefined,
        taxPercent: '',
        enableFlag: true,
        unitName: '',
        defaultWarehouseId: '',
        minSafetyStock: undefined,
        maxSafetyStock: undefined,
        minPackingNum: undefined,
        inCheckFlag: false,
        outCheckFlag: false,
        remark: ''
      },
      rules: {
        materialName: [
          {
            required: true,
            message: '请输入物料名称',
            trigger: 'change'
          }
        ],
        materialCode: [
          {
            required: true,
            message: '请输入物料编码',
            trigger: 'change'
          }
        ],
        typeName: [
          {
            required: true,
            message: '请选择物料类型',
            trigger: 'change'
          }
        ],
        unitName: [
          {
            required: true,
            message: '请选择主计量单位',
            trigger: 'change'
          }
        ],
        taxPercent: [
          {
            trigger: 'change',
            validator: checkNum
          }
        ]
      },
      routeParams: {},
      fileList: []
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  created () {
    this.routeParams = this.$route.params
    if (this.routeParams.type === 'detail') {
      this.title = '详情物料主档'
      document.title = '详情物料主档'
      this.applicationType = 'detail'
    } else if (this.routeParams.type === 'edit') {
      this.title = '修改物料主档'
      document.title = '修改物料主档'
      this.ruleForm.checked = true
    }
    if (
      this.routeParams.type === 'detail' ||
      this.routeParams.type === 'edit'
    ) {
      this.getDetail()
    }
  },
  // watch: {
  //   // 获取含税单价
  //   'ruleForm.unitPrice': function (val, oldVal) { // eslint-disable-line
  //     if (val) {
  //       this.ruleForm.untaxedPrice = Number(val) / (1 + this.ruleForm.untaxedPrice / 100)
  //     }
  //   },
  //   // 获取税率
  //   'ruleForm.taxPercent': function (val, oldVal) { // eslint-disable-line
  //     if (val) {
  //       this.ruleForm.untaxedPrice = Number(val) / (1 + this.ruleForm.unitPrice / 100)
  //     }
  //   }
  // },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_MATERIAL_ADD',
      'A_MATERIAL_EDIT',
      'A_GET_MATERIAL_CODE_LIST',
      'A_GET_MATERIAL_DETAIL'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      const {
        taxPercent,
        unitPrice,
        minSafetyStock,
        maxSafetyStock,
        minPackingNum,
        untaxedPrice,
        baseMaterialUnitVoList
      } = this.ruleForm
      return {
        ...this.ruleForm,
        taxPercent: taxPercent !== '' ? Number(taxPercent) : 0,
        unitPrice: unitPrice !== undefined ? unitPrice : 0,
        minSafetyStock: minSafetyStock !== undefined ? minSafetyStock : 0,
        maxSafetyStock: maxSafetyStock !== undefined ? maxSafetyStock : 0,
        minPackingNum: minPackingNum !== undefined ? minPackingNum : 0,
        untaxedPrice: untaxedPrice !== undefined ? untaxedPrice : 0,
        inCheckFlag: this.ruleForm.inCheckFlag ? 'Y' : 'N',
        outCheckFlag: this.ruleForm.outCheckFlag ? 'Y' : 'N',
        enableFlag: this.ruleForm.enableFlag ? 'Y' : 'N',
        baseMaterialUnitVoList: baseMaterialUnitVoList.filter(
          it => it.unitName && it.unitName !== ''
        )
      }
    },
    // 新增物料
    async getAdd () {
      const arg = this.setParams()
      this.A_MATERIAL_ADD(arg)
    },
    // 编辑物料
    async getEdit () {
      const arg = this.setParams()
      this.A_MATERIAL_EDIT(arg)
    },
    // 含税单价不能小于等于0
    unitChg (val, type) {
      if (val <= 0) {
        const arr = this.ruleForm.baseMaterialUnitVoList.map(item => ({
          baseMaterialId: item.baseMaterialId,
          baseMaterialUnitId: item.baseMaterialUnitId,
          companyId: item.companyId,
          unitName: item.unitName,
          exchangeRate: item.exchangeRate !== '0' ? item.exchangeRate : ''
        }))
        this.ruleForm.baseMaterialUnitVoList = arr
        this.$message.error(`${type}不能小于等于0`)
      }
    },
    // 获取税率长度
    rateChg (val) {
      if (val > 100) {
        this.$message.error('税率不能大于100')
      } else if (val <= 0) {
        this.$message.error('税率小于等于0')
      }
    },
    // 税率求和
    sumRate (val) {
      if (this.ruleForm.unitPrice && this.ruleForm.taxPercent) {
        this.ruleForm.untaxedPrice =
          this.ruleForm.unitPrice /
          (1 + Number(this.ruleForm.taxPercent) / 100)
      } else {
        this.ruleForm.untaxedPrice = undefined
      }
    },
    // 获取系统生成物料编码
    async getCode () {
      try {
        if (this.ruleForm.checked) {
          if (!this.copyMaterialCode) {
            const { status, data } = await this.A_GET_MATERIAL_CODE_LIST({ moduleName: 'MATERIAL' })
            if (status === 0) {
              this.ruleForm.materialCode = data
              this.copyMaterialCode = data
            }
          } else {
            this.ruleForm.materialCode = this.copyMaterialCode
          }
        } else {
          this.ruleForm.materialCode = ''
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取物料详情
    async getDetail () {
      const arg = {
        baseMaterialId: this.routeParams.id
      }
      const { status, data } = await this.A_GET_MATERIAL_DETAIL(arg)
      if (status === 0) {
        this.fileList = data.baseFileDtoList
        this.ruleForm = {
          // ...data,unitPrice,taxPercent
          baseMaterialId: data.baseMaterialId,
          companyId: data.companyId,
          materialName: data.materialName,
          materialCode: data.materialCode,
          typeName: data.typeName,
          unitName: data.unitName,
          spec: data.spec,
          picNum: data.picNum,
          baseFileVoList: data.baseFileDtoList || [],
          materialType: data.materialType,
          untaxedPrice: data.untaxedPrice ? data.untaxedPrice : undefined,
          taxPercent: data.taxPercent ? data.taxPercent : undefined,
          defaultWarehouseId:
            data.defaultWarehouseId !== 0 ? data.defaultWarehouseId : '',
          remark: data.remark,
          minSafetyStock: data.minSafetyStock ? data.minSafetyStock : undefined,
          maxSafetyStock: data.maxSafetyStock ? data.maxSafetyStock : undefined,
          minPackingNum: data.minPackingNum ? data.minPackingNum : undefined,
          unitPrice: data.unitPrice ? data.unitPrice : undefined,
          baseMaterialUnitVoList:
            data.baseMaterialUnitDtoList !== null
              ? data.baseMaterialUnitDtoList
              : [
                  {
                    unitName: '',
                    exchangeRate: ''
                  }
                ],
          checked: !!data.materialCode,
          enableFlag: data.enableFlag === 'Y',
          inCheckFlag:
            this.routeParams.type === 'edit'
              ? data.inCheckFlag === 'Y'
              : data.inCheckFlag,
          outCheckFlag:
            this.routeParams.type === 'edit'
              ? data.outCheckFlag === 'Y'
              : data.outCheckFlag
        }
        // 详情页自动计算未税单价
        this.sumRate(this.ruleForm.taxPercent)
      }
    },
    // 编辑保存
    materialSave (type) {
      if (type === 'detail') {
        this.routeParams.type = 'edit'
        this.title = '修改物料主档'
        document.title = '修改物料主档'
        this.getDetail()
      } else {
        this.submitForm('ruleForm')
      }
    },
    // 保存
    submitForm (formName) {
      // const array = this.ruleForm.baseMaterialUnitVoList
      // for (let i = 0; i < array.length; i += 1) {
      //   const element = array[i]
      //   if (element.exchangeRate && element.unitName === '') {
      //     this.$message.error('主辅比必填')
      //     break
      //   } if (element.unitName && (element.exchangeRate === null || element.exchangeRate === '')) {
      //     this.$message.error('辅计量单位必填')
      //     break
      //   }
      //   this.$message.success('通过')
      //   break
      // }
      // return

      if (
        this.ruleForm.minSafetyStock === undefined ||
        this.ruleForm.maxSafetyStock === undefined ||
        this.ruleForm.maxSafetyStock > this.ruleForm.minSafetyStock
      ) {
        this.$refs[formName].validate((valid, object) => {
          if (this.ruleForm.taxPercent > 100) {
            this.rateChg(this.ruleForm.taxPercent)
          } else if (this.ruleForm.unitPrice <= 0) {
            this.unitChg(this.ruleForm.unitPrice, '含税单价')
          } else if (this.ruleForm.minSafetyStock <= 0) {
            this.unitChg(this.ruleForm.minSafetyStock, '最低安全库存')
          } else if (this.ruleForm.maxSafetyStock <= 0) {
            this.unitChg(this.ruleForm.maxSafetyStock, '最高安全库存')
          } else if (this.ruleForm.minPackingNum <= 0) {
            this.unitChg(this.ruleForm.minPackingNum, '最小包装数')
          } else if (valid) {
            if (this.routeParams.type === 'add') {
              this.getAdd()
            } else {
              this.getEdit()
            }
          } else {
            let dom = null
            if (isObject(object) && Object.keys(object).length > 0) {
              dom = this.$refs[Object.keys(object)[0]]
              if (!isObject(dom) && dom.length > 0) {
                dom[0].$el.scrollIntoView({
                  // 滚动到指定节点
                  block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
                  behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
                })
                return
              }
              dom.$el.scrollIntoView({
                // 滚动到指定节点
                block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
                behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
              })
            }
          }
        })
      } else {
        this.$message.error('最低安全库存不能大于等于最高安全库存')
      }
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.ruleForm.baseFileVoList = files
    },
    // 计量单位收起隐藏
    handleExtend (val) {
      this.isExtend = !val
    },
    // 添加更多
    addMore () {
      this.ruleForm.baseMaterialUnitVoList.push({
        unitName: undefined,
        exchangeRate: undefined
      })
    },
    // 删除更多
    delMore (index) {
      this.isExtend = true
      this.ruleForm.baseMaterialUnitVoList.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.el-select {
  display: block;
}
.main {
  .material-item {
    float: left;
    width: 25%;
  }

  .mr25 {
    margin-left: 24% !important;
  }

  .more-box {
    margin-left: 25%;
    padding-bottom: 20px;
  }

  .del-circle {
    margin-top: 50px;
  }

  .item-pic {
    width: 160px;
    height: 160px;
    margin-right: 20px;
  }
}

/deep/ .material-ruleForm .el-form-item__label {
  padding: 0;
}
</style>
<style>
.content .el-checkbox-group {
  display: inline-block;
}
.content.el-select,
.el-input-number {
  width: 100%;
}
.content .el-input-number .el-input__inner {
  text-align: left !important;
}
</style>
