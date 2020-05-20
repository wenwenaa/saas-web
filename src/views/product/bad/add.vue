<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline
      :title="formData.type === 'add' ? '新增不良类型' : '编辑不良类型'"
      :isShowBack="true"
      backText="返回不良类型主档"
    >
      <template slot="btn">
        <el-button
          class="tz-btn-add"
          round
          size="medium"
          :loading="btnLoading"
          @click="saveBad('formData')"
        >保存</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <el-form
      size="medium"
      :inline="true"
      :rules="rules"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="top"
    >
      <div class="title">物料母件</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="不良类型" prop="ngType" ref="ngType">
            <el-input placeholder="请输入" v-model.trim="formData.ngType" maxlength="20"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in formData.ngReasons" :key="index">
          <el-form-item
            label="不良原因"
            :prop="`ngReasons[${index}]`"
            :ref="`ngReasons[${index}]`"
            :rules="{ required: true, message: '请输入不良原因', trigger: 'change' }"
          >
            <el-input
              placeholder="请输入不良原因(15字以内)"
              maxlength="15"
              v-model.trim="formData.ngReasons[index]"
            />
            <img
              class="del"
              v-if="formData.ngReasons.length > 1"
              @click="delNgReason(index)"
              src="../../../assets/images/icon/del-circle.png"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button class="tz-btn-add mb20" round size="medium" @click="addBadReason">添加不良原因</el-button>
      <br />
      <el-form-item label="是否启用" label-position="left" prop="enableFlag">
        <el-switch v-model.trim="formData.enableFlag" active-color="#7CA870"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { isObject } from '../../../utils/utils'

export default {
  name: 'bad',
  data () {
    return {
      formData: {
        type: 'add',
        ngType: '',
        ngReasons: [''],
        enableFlag: true
      },
      rules: {
        ngType: [
          { required: true, message: '请输入不良类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  mounted () {
    const { type, id } = this.$route.query
    if (type === 'edit') {
      document.title = '编辑不良原因主档'
      this.formData.type = 'edit'
      this.getBadDetail(id)
    }
  },
  methods: {
    ...mapActions(['ADD_BAD', 'GET_BAD_DETAIL']),
    // 添加不良原因
    addBadReason () {
      this.formData.ngReasons = [...this.formData.ngReasons, '']
    },
    // 删除不良原因
    delNgReason (index) {
      this.formData.ngReasons.splice(index, 1)
    },
    // 保存不良原因
    saveBad (formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.addBad()
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
    },
    // 新增不良原因
    addBad () {
      const formData = {
        ...this.formData,
        enableFlag: this.formData.enableFlag ? 'Y' : 'N'
      }
      const badLength = formData.ngReasons.length
      const uniqeLength = Array.from(new Set(formData.ngReasons)).length
      if (badLength !== uniqeLength) {
        this.$message.error('不良原因有重复')
        return
      }
      this.ADD_BAD(formData)
    },
    // 获取不良原因详情
    async getBadDetail (id) {
      try {
        const { status, data } = await this.GET_BAD_DETAIL({ id })
        if (status === 0) {
          this.formData = {
            ...data,
            enableFlag: data.enableFlag === 'Y'
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contain-company /deep/ .el-form-item--medium {
  width: 100%;
}
.contain-company /deep/ .el-form-item--medium input {
  width: 100%;
}
.contain-company /deep/ .el-form-item__label,
.contain-company /deep/ .el-input__inner {
  width: 240px;
  height: 40px;
  font-size: 14px;
  color: #000000;
  line-height: 40px;
}
.contain-company /deep/ .el-input--medium .el-input__inner {
  height: 40px;
  line-height: 40px;
}
.title {
  margin-top: 20px;
  height: 18px;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  margin-bottom: 20px;
  color: rgba(12, 27, 48, 1);
  font-family: PingFangSC-Medium, PingFang SC;
}
.del {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  margin-right: 40px;
}
.contain-company /deep/ .el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
