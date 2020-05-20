<!-- lzx -->
<template>
  <div>
    <tzHeadline title="新增母件" isShowBack backText="返回多阶BOM主档">
      <template slot="btn">
        <el-button
          class="tz-search-submit tz-btn-add"
          type="primary"
          :loading="btnLoading"
          round
          size="medium"
          @click="submit('addForm')"
        >保存并提交</el-button>
      </template>
    </tzHeadline>
    <el-form
      :model="addForm"
      label-position="top"
      :rules="rules"
      ref="addForm"
      class="form"
      label-width="80px"
    >
      <h1 class="head-title">物料母件</h1>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="物料名称" prop="materialName">
            <section class="material-add" @click="addMaterial">
              <!--{{addForm.materialName || '点击选择物料'}}-->
              <el-tooltip :disabled="!addForm.materialName || (addForm.materialName && addForm.materialName.length <= 8)" effect="dark" :content="addForm.materialName" placement="top">
                <span>{{ addForm.materialName && addForm.materialName.length > 8 ? `${addForm.materialName.substring(0, 8)}...` : (addForm.materialName || '点击选择物料') }}</span>
              </el-tooltip>
            </section>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物料编码" prop="materialCode">
            <el-input v-model.trim="materialInfo.materialCode" :placeholder="addForm.materialName ? '--' : '请输入'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物料类型">
            <el-input :placeholder="addForm.materialName ? '--' : '请输入'" v-model.trim="materialInfo.typeName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物料规格">
            <el-input v-model.trim="materialInfo.spec" :placeholder="addForm.materialName ? '--' : '请输入'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主计量单位">
            <el-input v-model.trim="materialInfo.unitName" :placeholder="addForm.materialName ? '--' : '请输入'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工艺路线">
            <el-input :placeholder="addForm.materialName ? '--' : '请输入'" v-model.trim="materialInfo.display" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <material
      :visible="visible"
      :isMultiple="false"
      @close="close"
      :isDisabled="false"
      @submit="materialSubmit"
      :defaultVal="materialInfo"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

import { mapState, mapActions } from 'vuex'

const rulesConfig = { required: true, trigger: 'change' }

export default {
  name: 'bomAdd',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      visible: false,
      addForm: {
        materialName: ''
      },
      materialInfo: {},
      rules: {
        materialName: [{ ...rulesConfig, message: '请选择物料' }]
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 所有异步请求
    ...mapActions(['A_BOM_ADD']),
    // 打开关闭添加物料
    addMaterial () {
      this.visible = true
    },
    // 关闭添加
    close () {
      this.visible = false
    },
    // 选择物料后的回调
    materialSubmit (val) {
      this.materialInfo = val
      this.addForm.baseMaterialId = val.baseMaterialId
      this.addForm.materialName = val.materialName
      this.close()
    },
    // 母件新增
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.A_BOM_ADD(this.addForm)
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {}
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.material-add {
  width: 100%;
  color: #7ca870;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 15px;
  height: 40px;
}
</style>
