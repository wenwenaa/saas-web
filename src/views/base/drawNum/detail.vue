<template>
  <div>
    <tzHeadline :title="drawTitle" backText="返回图号主档" :isShowBack="isShowBack">
      <template slot="btn">
        <el-button
          round
          size="medium"
          :loading="btnLoading"
          @click="drawSave(routeParams.type)"
          :class="routeParams.type | className"
        >{{routeParams.type != 'edit'?'编辑':'保存'}}</el-button>
      </template>
    </tzHeadline>
    <div class="main">
      <div class="headTitle font-bold mb10 f16">基本信息</div>
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="d-flex">
            <label class="labelColor label80 flex-shrink-0">物料名称：</label>
            <tzToolTip :content="ruleForm.materialName"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <label class="labelColor label80 flex-shrink-0">物料编码：</label>
            <tzToolTip :content="ruleForm.materialCode"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <label class="labelColor label80 flex-shrink-0">物料规格：</label>
            <tzToolTip :content="ruleForm.spec"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <label class="labelColor label80 flex-shrink-0">物料图号：</label>
            <tzToolTip :content="ruleForm.picNum"></tzToolTip>
          </div>
        </el-col>
      </el-row>
      <div class="d-flex mb20 mt20">
        <div class="labelColor mb10 d-flex" v-if="routeParams.type === 'detail'">图纸<div v-if="fileList.length === 0" class="ml10">（暂未上传图片)</div></div>
        <tzCommonFileUpload
          fileTitle="上传图纸"
          fileTip="支持上传图片，图片支持jpg、png格式，上传的图片不能超过10张，每张图片不得大于2M"
          fileSubTitle=""
          type="img"
          :style="{marginTop: routeParams.type === 'detail' ? '-32px' : '0',marginLeft: routeParams.type === 'detail' ? '16px' : '0'}"
          :applicationType="routeParams.type === 'detail' ? 'detail' : 'add'"
          :fileList="fileList"
          @handleUploadFile="uploadSuccess"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'materialDetail',
  data () {
    return {
      isShowBack: true,
      applicationType: 'add',
      routeParams: {},
      ruleForm: {
        materialCode: '',
        materialName: '',
        picNum: '',
        spec: '',
        baseFileVoList: []
      },
      fileList: [],
      drawTitle: '详情图号主档'
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
    // nxSkin
  },
  created () {
    this.routeParams = this.$route.params
    const { type } = this.routeParams
    if (type === 'detail' || type === 'edit') {
      this.getDetail()
    }

    if (this.routeParams.type === 'detail') {
      this.drawTitle = '详情图号主档'
      document.title = '详情图号主档'
    } else if (this.routeParams.type === 'edit') {
      this.drawTitle = '修改图号主档'
      document.title = '修改图号主档'
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions(['A_DRAW_NUM_EDIT', 'A_GET_DRAW_NUM_DETAIL']),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      return {
        ...this.ruleForm,
        baseFileVoList: this.ruleForm.baseFileVoList
      }
    },
    // 获取图号详情
    async getDetail () {
      const arg = {
        baseMaterialId: this.routeParams.id
      }
      const { status, data } = await this.A_GET_DRAW_NUM_DETAIL(arg)
      if (status === 0) {
        this.fileList = data.baseFileDtoList || []
        if (this.routeParams.type === 'detail') {
          this.applicationType = 'detail'
        }
        this.ruleForm = {
          baseMaterialId: data.baseMaterialId,
          materialCode: data.materialCode,
          materialName: data.materialName,
          baseFileVoList: data.baseFileDtoList,
          picNum: data.picNum,
          spec: data.spec
        }
      }
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.ruleForm.baseFileVoList = files
    },
    // 编辑图号
    async getEdit () {
      const arg = this.setParams()
      this.A_DRAW_NUM_EDIT(arg)
    },
    // 编辑保存
    drawSave (type) {
      if (type === 'detail') {
        this.routeParams.type = 'edit'
        this.drawTitle = '修改图号主档'
      } else if (type === 'edit') {
        if (this.ruleForm.picNum) {
          this.getEdit()
        } else {
          this.$message.error('物料图号为空不能上传图片,请维护物料图号信息')
        }
      }
    }
  },
  watch: {
    // 监听type类型
    routeParams (val) {
      if (val.type === 'detail') {
        this.drawTitle = '详情图号主档'
      } else {
        this.drawTitle = '修改图号主档'
      }
    }
  },
  mounted () {
    this.routeParams = this.$route.params
  }
}
</script>
<style lang="less" scoped>
</style>
