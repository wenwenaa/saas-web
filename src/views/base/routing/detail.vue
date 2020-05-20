<template>
  <div class="content">
    <tzHeadline :title="title" backText="返回工艺路线" :isShowBack="isShowBack">
      <template slot="btn">
        <!-- :disabled="matchFlag" -->
        <el-button
          round
          size="medium"
          :loading="btnLoading"
          class="tz-search-submit tz-btn-add"
          v-if="routeParams.type !== 'detail'"
          @click="submitForm('ruleForm')"
        >保存</el-button>
      </template>
    </tzHeadline>
    <div class="main">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        :label-position="routeParams.type === 'detail'?'left':'top'"
        :inline="true"
        class="material-ruleForm"
      >
        <div class="caption f16" v-if="searchType === 'MATERIAL'">物料信息</div>
        <!-- <div class="reset-form-item">
          <span class="required">*</span>
          <label class="title">工艺路线类型</label>
          <el-form-item prop="processType" class="routing-item">
            <el-radio-group
              v-model.trim="ruleForm.processType"
              @change="selectRadio"
              :disabled="routeParams.type === 'edit'"
            >
              <el-radio label="MATERIAL">物料工艺路线</el-radio>
              <el-radio label="GLOBAL">全局工艺路线</el-radio>
            </el-radio-group>
          </el-form-item>
        </div> -->
        <el-row :gutter="24" v-if="searchType === 'MATERIAL'">
          <el-col :span="24">
            <div class="reset-form-item t16">
              <el-button
                round
                size="medium"
                :class="{'tz-btn-save': true, 'color': searchType !== 'GLOBAL'}"
                @click="selectMaterial"
              >选择物料</el-button>
            </div>
            <span class="mr30">物料编码：
              <el-tooltip :disabled="!materialInfo.materialCode || (materialInfo.materialCode && materialInfo.materialCode.length <= 8)" effect="dark" :content="materialInfo.materialCode" placement="top">
                <span style="vertical-align: middle" class="wordWrap ellipsis">
                  {{ materialInfo.materialCode && materialInfo.materialCode.length > 8 ? `${materialInfo.materialCode.substring(0, 8)}...` : (materialInfo.materialCode || '-') }}
                </span>
              </el-tooltip>
            </span>
            <span class="mr30">物料名称：
               <el-tooltip :disabled="!materialInfo.materialName || (materialInfo.materialName && materialInfo.materialName.length <= 8)" effect="dark" :content="materialInfo.materialName" placement="top">
                <span style="vertical-align: middle" class="wordWrap ellipsis ">
                  {{ materialInfo.materialName && materialInfo.materialName.length > 8 ? `${materialInfo.materialName.substring(0, 8)}...` : (materialInfo.materialName || '-') }}
                </span>
              </el-tooltip>
            </span>
            <span class="mr30">物料规格：
               <el-tooltip :disabled="!materialInfo.spec || (materialInfo.spec && materialInfo.spec.length <= 8)" effect="dark" :content="materialInfo.spec" placement="top">
                <span style="vertical-align: middle" class="wordWrap ellipsis ">
                  {{ materialInfo.spec && materialInfo.spec.length > 8 ? `${materialInfo.spec.substring(0, 8)}...` : (materialInfo.spec || '-') }}
                </span>
              </el-tooltip>
            </span>
            <span class="mr30">物料图号：
               <el-tooltip :disabled="!materialInfo.picNum || (materialInfo.picNum && materialInfo.picNum.length <= 8)" effect="dark" :content="materialInfo.picNum" placement="top">
                <span style="vertical-align: middle" class="wordWrap ellipsis ">
                  {{ materialInfo.picNum && materialInfo.picNum.length > 8 ? `${materialInfo.picNum.substring(0, 8)}...` : (materialInfo.picNum || '-') }}
                </span>
              </el-tooltip>
            </span>
          </el-col>
        </el-row>
        <div class="caption f16 t16 b16">工艺路线信息</div>
        <el-row :gutter="24" class="width100">
          <el-col :span="5" v-if="ruleForm.processType === 'GLOBAL'">
            <el-form-item label="工艺路线名称" :prop="processName">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.processName"
                :disabled="searchType!=='GLOBAL'"
                maxlength="15"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="reset-form-item" style="margin-bottom: 23px;">
          <label class="title">是否启用</label>
          <el-switch active-color="#7CA870" v-model.trim="ruleForm.enableFlag"></el-switch>
        </div>
      </el-form>
      <div class="main-wrap">
        <div class="l-side tech" style="position: relative">
          <el-input
            v-model.trim="processName"
            maxlength="15"
            clearable
            style="position: sticky;top: 0;background: #fff;z-index:10"
            placeholder="请输入工序名称或编码"
            @keyup.enter.native="filterProcess"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="filterProcess"></i>
          </el-input>
          <draggable
            class="dragArea list-group max-h"
            :list="leftList"
            :options="{group:'comp',pull:'clone',put:false,forceFallback:true}"
          >
            <div class="list-group-item" v-for="element in leftList" :key="element.id">
              <span class="mr20 d-inline-block w120">
                <el-tooltip :disabled="!element.seqName || (element.seqName && element.seqName.length <= 8)" effect="dark" :content="element.seqName" placement="top">
                  <span>{{ element.seqName && element.seqName.length > 8 ? `${element.seqName.substring(0, 8)}...` : element.seqName }}</span>
                </el-tooltip>
              </span>
              <span class="mr20 d-inline-block w120">
                <el-tooltip :disabled="!element.seqCode || (element.seqCode && element.seqCode.length <= 8)" effect="dark" :content="element.seqCode" placement="top">
                  <span>{{ element.seqCode && element.seqCode.length > 8 ? `${element.seqCode.substring(0, 8)}...` : element.seqCode }}</span>
                </el-tooltip>
              </span>
            </div>
          </draggable>
        </div>
        <div class="r-side">
          <div class="top-label">
            <span>序号</span>
            <span>工序类型</span>
            <span>工序编码</span>
            <span>工序名称</span>
            <span>计件单价（元）</span>
            <span>计时单价（元）</span>
            <span class="routing-label">操作</span>
          </div>
          <draggable
            tag="el-collapse"
            class="dragArea list-group"
            :list="rightList"
            group="comp"
            style="min-height:100%;"
          >
            <div class="list-group-item" v-for="(element, index) in rightList" :key="index">
              <span>{{index+1}}</span>
              <span>{{element.seqType | filterDic(arrDic)}}</span>
              <span>
                <el-tooltip :disabled="!element.seqCode || (element.seqCode && element.seqCode.length <= 4)" effect="dark" :content="element.seqCode" placement="top">
                  <div>{{ element.seqCode && element.seqCode.length > 4 ? `${element.seqCode.substring(0, 4)}...` : element.seqCode }}</div>
                </el-tooltip>
              </span>
              <span>
                <el-tooltip :disabled="!element.seqName || (element.seqName && element.seqName.length <= 4)" effect="dark" :content="element.seqName" placement="top">
                  <div>{{ element.seqName && element.seqName.length > 4 ? `${element.seqName.substring(0, 4)}...` : element.seqName }}</div>
                </el-tooltip>
              </span>
              <span>
                <el-input-number
                  v-model.trim="element.unitPrice"
                  :min="0"
                  :precision="6"
                  type="number"
                  :controls="false"
                  @input="routingChg(element)"
                  placeholder="请输入"
                  :max="99999999"
                ></el-input-number>
              </span>
              <span>
                <el-input-number
                  v-model.trim="element.standardHours"
                  :min="0"
                  :precision="6"
                  type="number"
                  :controls="false"
                  @input="routingChg(element)"
                  placeholder="请输入"
                  :max="99999999"
                ></el-input-number>
              </span>
              <span>
                <el-button
                  size="small"
                  type="text"
                  class="yellow f14"
                  @click="deleteBtn(element,index)"
                >删除</el-button>
              </span>
            </div>
            <div class="noData" v-if="rightList && rightList.length === 0">暂无数据</div>
          </draggable>
        </div>
      </div>
    </div>
    <material
      :visible="visible"
      :isMultiple="false"
      :isShowProcess="false"
      @close="dialogClose"
      @submit="materialSubmit"
    />
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
import dic from '../../../global/dictionary'

export default {
  name: 'routingDetail',
  components: {
    draggable
  },
  data () {
    return {
      title: '新增工艺路线',
      isShowBack: true,
      isShowExtend: true,
      isExtend: true,
      visible: false,
      leftList: [],
      rightList: [],
      processName: '',
      routeParams: {},
      materialInfo: {},
      arrDic: dic.processName,
      searchType: '',
      matchFlag: false,
      ruleForm: {
        baseMaterialId: '',
        processName: '',
        processType: 'MATERIAL',
        enableFlag: true,
        processSeqVoList: [],
        checked: false
      },
      rules: {
        processName: [
          { required: true, message: '请输入工序名称', trigger: 'change' }
        ]
        // processType: [
        //   { required: true, message: '请选择工序类型', trigger: 'change' }
        // ]
      }
    }
  },
  computed: {
    ...mapState({
      materialTypeList: state => state.global.materialTypeList,
      btnLoading: state => state.global.btnLoading
    })
  },
  created () {
    this.routeParams = this.$route.params
    this.ruleForm.processType = this.$route.params.direction
    this.searchType = this.$route.params.direction
    if (this.routeParams.type === 'add') {
      this.title = '新增工艺路线'
      document.title = '新增工艺路线'
    } else if (this.routeParams.type === 'edit') {
      this.title = '修改工艺路线'
      document.title = '修改工艺路线'
    }
    if (
      this.routeParams.type === 'detail' ||
      this.routeParams.type === 'edit'
    ) {
      this.getDetail()
    }
    this.getNoList()
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_ROUTING_ADD',
      'A_ROUTING_EDIT',
      'A_GET_ROUTING_DETAIL',
      'A_GET_ROUTING_NO_LIST'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      const arr = this.rightList.map((item, index) => ({
        baseSeqId: item.baseSeqId,
        seqName: item.seqName,
        seqNum: index + 1,
        standardHours: item.standardHours,
        unitPrice: item.unitPrice
      }))
      return {
        ...this.ruleForm,
        processSeqVoList: arr,
        baseMaterialId:
          this.searchType !== 'GLOBAL' ? this.ruleForm.baseMaterialId : '',
        enableFlag: this.ruleForm.enableFlag ? 'Y' : 'N'
      }
    },
    // 新增物料
    async getAdd () {
      const arg = this.setParams()
      this.A_ROUTING_ADD(arg)
    },
    // 编辑物料
    async getEdit () {
      const arg = this.setParams()
      this.A_ROUTING_EDIT(arg)
    },
    // 获取物料详情
    async getDetail () {
      const arg = {
        baseProcessId: this.routeParams.id
      }
      const { status, data } = await this.A_GET_ROUTING_DETAIL(arg)
      if (status === 0) {
        this.rightList = data.processSeqDtoList.map(item => ({
           ...item,
          standardHours:
            (item.standardHours === null || item.standardHours === 0) ? undefined : item.standardHours,
          unitPrice: (item.unitPrice === null || item.unitPrice === 0) ? undefined : item.unitPrice
        }))
        this.ruleForm = {
          ...data,
          enableFlag: data.enableFlag === 'Y'
        }
        this.searchType = data.processType
        this.materialInfo = {
          materialCode: data.materialCode,
          materialName: data.materialName,
          spec: data.materialSpec,
          picNum: data.materialPicNum
        }
        this.getNoList()
      }
    },
    // 查询搜索工序
    filterProcess (val) {
      this.getNoList(this.processName)
    },
    // 查询所有工序（不分页）
    async getNoList (val) {
      const arg = {
        keyword: val || ''
      }
      const { status, data } = await this.A_GET_ROUTING_NO_LIST(arg)
      if (status === 0) {
        const ids = this.rightList.map(item => ({
          baseSeqId: item.baseSeqId,
          companyId: item.companyId,
          enableFlag: item.enableFlag,
          seqCode: item.seqCode,
          seqName: item.seqName,
          seqType: item.seqType,
          standardHours:
            item.standardHours !== null ? item.standardHours : undefined,
          unitPrice: item.unitPrice !== null ? item.unitPrice : undefined
        }))
        const arr1 = ids.map(item => item.baseSeqId)
        this.leftList = data.filter(it => !arr1.includes(it.baseSeqId)).map(item => ({
          ...item,
          standardHours:
            item.standardHours !== null ? item.standardHours : undefined,
          unitPrice: item.unitPrice !== null ? item.unitPrice : undefined
        }))
      }
    },
    // 保存
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (
          this.ruleForm.processType === 'GLOBAL' &&
          this.ruleForm.processName === ''
        ) {
          this.$message.error('工艺路线名称必填')
          return
        }
        if (valid) {
          if (this.routeParams.type === 'add') {
            this.getAdd()
          } else {
            this.getEdit()
          }
        }
      })
    },
    // 删除工序
    deleteBtn (item, index) {
      this.rightList.splice(index, 1)
      this.leftList.push(item)
    },
    // 选择物料
    selectMaterial () {
      this.visible = true
    },
    // 隐藏物料
    dialogClose () {
      this.visible = false
    },
    // 选择物料回调
    materialSubmit (val) {
      this.materialInfo = val
      this.ruleForm.baseMaterialId = val.baseMaterialId
      this.dialogClose()
    },
    selectRadio (val) {
      if (val === 'GLOBAL') {
        this.materialInfo = {}
      } else {
        this.ruleForm.processName = ''
      }
      this.searchType = val
    },
    // 计时计件校验
    routingChg (item) {
      if (Number(item.standardHours) <= 0 || Number(item.unitPrice) <= 0) {
        // this.$message({
        //   type: 'error',
        //   message: '计件单价或者计时单价不能输入负数'
        // })
        this.matchFlag = true
      } else {
        this.matchFlag = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  background: #fff;
}
.w120 {
  width: 120px;
}
.main {
  .caption {
    color: #282828;
    font-weight: 600;
  }
  .gray {
    color: #999;
    margin-top: -10px;
  }
  .reset-form-item {
    display: inline-block;
    margin-right: 50px;
    .title {
      padding-right: 20px;
      color: #606266;
    }
  }
  .more-box {
    margin-left: 25%;
    padding-bottom: 20px;
  }
  .del-circle {
    margin-top: 50px;
  }
  .required {
    color: red;
    margin-right: 6px;
  }
  .routing-item {
    display: inline-block;
    margin-top: -10px;
    margin-bottom: 0;
  }
  .main-wrap {
    background: #fff;
    display: flex;
  }
  .main-wrap .l-side {
    width: 330px;
    border: 1px solid #e8e9ec;
    box-sizing: border-box;
    height: 460px;
    max-height: 460px;
    overflow-y: auto;
  }
  .main-wrap .r-side {
    flex: 1;
    margin-left: 10px;
    border: 1px solid #e8e9ec;
  }
  .routing-title {
    width: 34%;
    display: inline-block;
    margin-left: 45px;
  }
  .routing-title .p1 {
    display: inline-block;
    margin-right: 10px;
  }
  .routing-title .p2 {
    width: 60% !important;
    display: inline-block;
  }
  .l-side .list-group-item {
    padding: 15px;
    border-bottom: 1px solid #e8e9ec;
    position: relative;
    color: #7ca870;
  }
  .l-side .list-group-item:last-child {
    border-bottom: 0;
  }
  .l-side .list-group-item::after {
    position: absolute;
    right: 15px;
    top: 50%;
    content: "";
    width: 10px;
    height: 10px;
    transform: translateY(-50%) rotate(-45deg);
    border-bottom: 2px solid #999;
    border-right: 2px solid #999;
  }
  .top-label {
    display: flex;
    background: #fafbfe;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #e8e9ec;
  }
  .top-label span:first-child,
  .r-side .list-group-item span:first-child {
    width: 6%;
    flex: none !important;
  }
  .r-side {
    max-height: 460px;
    overflow-y: auto;
  }
  .top-label span:last-child,
  .r-side .list-group-item span:last-child {
    width: 10%;
    flex: none !important;
  }
  .top-label span {
    flex: 1;
    width: 120px;
    border-right: 1px solid #e8e9ec;
  }
  .el-collapse {
    border: none;
  }
  .r-side .list-group-item {
    display: flex;
    border-bottom: 1px solid #e8e9ec;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  .r-side .list-group-item .el-input {
    width: 95%;
  }
  .r-side .list-group-item span {
    text-align: center;
    flex: 1;
    height: 48px;
    line-height: 48px;
    width: 120px;
    border-right: 1px solid #e8e9ec;
    padding: 0 10px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    word-break: break-word;
    white-space: nowrap;
  }
  .table-border {
    border: 1px solid #e8e9ec;
  }
}
.t16 {
  margin-top: 16px;
}
.b16 {
  margin-bottom: 16px;
}
.t50 {
  margin-top: 50px;
}
.mr30 {
  margin-right: 30px;
}
.mr50 {
  margin-right: 50px;
}
.r-side {
  max-height: 500px;
  overflow-y: auto;
}
/deep/ .material-ruleForm .el-form-item__label {
  padding: 0;
}
.tech /deep/ .el-input__inner {
  border: none;
  border-radius: inherit;
  border-bottom: 1px solid #DCDFE6;
}

// .main .l-side .list-group-item:nth-child(1) {
//   border-top: 1px solid #DCDFE6;
// }
</style>
<style>
.el-checkbox-group {
  display: inline-block;
}
.el-select {
  width: 100%;
}
.width100 .el-form-item {
  width: 100%;
}
.no-border .el-input__inner {
  border: 0;
}
.color {
  color: #7CA870 !important;
  border-color: #fff !important;
  background-color: #E5EEE2 !important;
}
</style>
