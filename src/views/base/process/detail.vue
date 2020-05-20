<template>
  <div class="content">
    <tzHeadline :title="title" backText="返回工序主档" :isShowBack="isShowBack">
      <template slot="btn">
        <el-button
          round
          size="medium"
          :loading="btnLoading"
          class="tz-search-submit tz-btn-add"
          @click="submitForm('ruleForm')"
          v-if="routeParams.type !== 'detail'"
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
        class="material-ruleForm"
      >
        <div class="caption f16">基本信息</div>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="工序类型" prop="seqType">
              <el-select
                v-model.trim="ruleForm.seqType"
                placeholder="请选择"
                :disabled="routeParams.type === 'edit'"
                v-if="routeParams.type !== 'detail'"
                clearable
              >
                <el-option
                  :key="item.type"
                  :value="item.type"
                  v-for="item in arrDic"
                  :label="item.name"
                ></el-option>
              </el-select>
              <span v-else>{{ruleForm.seqType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="工序编码" prop="seqCode" class="relative">
              <el-checkbox
                v-model.trim="ruleForm.checked"
                @change="getCode"
                class="absolute-checkbox"
                :disabled="routeParams.type === 'edit'"
                v-if="routeParams.type === 'add'"
              >系统生成</el-checkbox>
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.seqCode"
                maxlength="20"
                :disabled="routeParams.type === 'edit' || ruleForm.checked"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <span v-else>{{ruleForm.seqCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="工序名称" prop="seqName">
              <el-input
                placeholder="请输入"
                v-model.trim="ruleForm.seqName"
                maxlength="15"
                v-if="routeParams.type !== 'detail'"
                clearable
              />
              <span v-else>{{ruleForm.seqName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="reset-form-item">
          <label class="title">是否启用</label>
          <el-switch
            active-color="#7CA870"
            v-model.trim="ruleForm.enableFlag"
            v-if="routeParams.type !== 'detail'"
          ></el-switch>
          <span v-else>{{ruleForm.enableFlag==='Y'?'启用':'不启用'}}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import dic from '../../../global/dictionary'
import { becomeObj } from '../../../utils/utils'

const allType = {
  add: '新增工序主档',
  detail: '修改工序主档',
  edit: '修改工序主档'
}
export default {
  name: 'processDetail',
  data () {
    return {
      title: '新增工序主档',
      isShowBack: true,
      isShowExtend: true,
      isExtend: true,
      ruleForm: {
        seqName: '',
        seqCode: '',
        enableFlag: true,
        checked: false,
        seqType: ''
      },
      copySeqCode: '',
      routeParams: {},
      arrDic: dic.processName,
      rules: {
        seqName: [
          { required: true, message: '请输入工序名称', trigger: 'change' }
        ],
        seqCode: [
          { required: true, message: '请输入工序编码', trigger: 'change' }
        ],
        seqType: [
          { required: true, message: '请选择工序类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  created () {
    const { type } = this.$route.params
    this.routeParams.type = type
    this.title = allType[type]
    document.title = allType[type]
    if (type === 'detail' || type === 'edit') {
      const { item = {}} = this.$route.query
      const newItem = becomeObj(item)
      this.routeParams = { type, item: newItem }
      this.ruleForm = {
        seqType: this.routeParams.item.seqType,
        seqName: this.routeParams.item.seqName,
        seqCode: this.routeParams.item.seqCode,
        checked: false,
        enableFlag: this.routeParams.item.enableFlag === 'Y'
      }
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'A_PROCESS_ADD',
      'A_PROCESS_EDIT',
      'A_GET_MATERIAL_CODE_LIST'
    ]),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      return {
        ...this.ruleForm,
        baseSeqId:
          this.routeParams.type !== 'add'
            ? this.routeParams.item.baseSeqId
            : '',
        enableFlag: this.ruleForm.enableFlag ? 'Y' : 'N'
      }
    },
    // 新增工序
    async getAdd () {
      const arg = this.setParams()
      this.A_PROCESS_ADD(arg)
    },
    // 编辑工序
    async getEdit () {
      const arg = this.setParams()
      this.A_PROCESS_EDIT(arg)
    },
    async getCode () {
      try {
        if (this.ruleForm.checked) {
          if (!this.copySeqCode) {
            const { status, data } = await this.A_GET_MATERIAL_CODE_LIST({ moduleName: 'SEQ' })
            if (status === 0) {
              this.copySeqCode = data
              this.ruleForm.seqCode = data
            }
          } else {
            this.ruleForm.seqCode = this.copySeqCode
          }
        } else {
          this.ruleForm.seqCode = ''
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 保存
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.routeParams.type === 'add') {
            this.getAdd()
          } else {
            this.getEdit()
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  background: #fff;
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
}
.t16 {
  margin-top: 16px;
}
.b16 {
  margin-bottom: 16px;
}
/deep/ .material-ruleForm .el-form-item__label {
  padding: 0;
}
</style>
<style>
.el-checkbox-group {
  display: inline-block;
}
.el-select {
  width: 100%;
}
</style>
