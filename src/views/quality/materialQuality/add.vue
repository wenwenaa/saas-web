<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline :title="formData.type === 'edit' ? '编辑物料质检方案' : '维护物料质检方案'" :isShowBack="true" backText="返回">
      <template slot="btn">
        <el-button class="tz-search-submit tz-btn-add" round size="medium" @click="save('formData')" :loading="loading">保存</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <div style="margin-top: 20px;"></div>
    <el-form
      size="medium"
      :inline="true"
      :rules="rules"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="top">
        <!-- 基本信息 -->
        <div class="info">
          <div class="title">基本信息</div>
        </div>
        <div class="checkType">
          <div class="title">检验类型：</div>
          <div class="item"><span v-if="list.inCheckFlag === 'Y'" style="margin-right: 10px;">来料检</span> <span v-if="list.outCheckFlag === 'Y'">出库检</span></div>
        </div>
        <div class="detailList checkList">
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="item">物料名称：<tzToolTip :content="list.materialName" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item">物料编码：<tzToolTip :content="list.materialCode" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item">物料类型：<tzToolTip :content="list.typeName" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item">物料规格：<tzToolTip :content="list.spec" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item">物料图号：<tzToolTip :content="list.picNum" activeColor="#444" /></div>
            </el-col>
          </el-row>
        </div>
        <!-- 抽检要求 -->
        <el-form-item label-position="left" prop="enableSpot">
          <div class="info" style="margin-top: 20px;">
            <div class="title">抽检要求</div>
            <el-switch v-model.trim="formData.enableSpot" active-color="#7CA870" />
            <div class="switch">{{formData.enableSpot ? '启用' : '关闭'}}</div>
          </div>
        </el-form-item>
        <el-table :data="formData.checkPlanRangeVos" border style="width: 100%;" class="spotCheck" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="start" label="抽检数量下限" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" :disabled="!formData.enableSpot" v-model.trim="scope.row.start" :controls="false" :min="0" :max="99999999" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="end" label="抽检数量上限" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" :disabled="!formData.enableSpot" v-model.trim="scope.row.end" :controls="false" :min="0" :max="99999999" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="ratio" label="抽检比例" align="center" class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" :disabled="!formData.enableSpot" v-model.trim="scope.row.ratio" :controls="false" :min="0" :max="100" :precision="6" /><span style="margin-left: 10px;">%</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btn">
                <el-button size="small" type="text" :class="{'yellow': true, 'f14': true, 'becomeGrey': !formData.enableSpot}" @click="delSpot(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div :class="{'continue': true, 'becomeGrey': !formData.enableSpot}" @click="addSpot">继续添加</div>
        <!-- 尺寸SPEC -->
        <el-form-item label-position="left" prop="enableSize" style="margin-bottom: 0">
          <div class="info" style="margin-top: 42px;">
            <div class="title">尺寸SPEC</div>
            <el-switch v-model.trim="formData.enableSize" active-color="#7CA870" />
            <div class="switch">{{formData.enableSize ? '启用' : '关闭'}}</div>
          </div>
        </el-form-item>
        <div class="must">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="检验方法" prop="specMethod">
                <el-input placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="formData.specMethod" maxlength="20" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="检验工具" prop="specTool">
                <el-input placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="formData.specTool" maxlength="20" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-table :data="formData.checkPlanSpecVos" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="position" label="检验位置" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="scope.row.position" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="minValue" label="SPEC下限" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="scope.row.minValue" :controls="false" :min="0" :max="99999999" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="maxValue" label="SPEC上限" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="scope.row.maxValue" :controls="false" :min="0" :max="99999999" :precision="6"></el-input-number>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="scope.row.unit" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip class-name="addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableSize" v-model.trim="scope.row.remark" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btn">
                <el-button size="small" type="text" :class="{'yellow': true, 'f14': true, 'becomeGrey': !formData.enableSize}" @click="delSize(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div :class="{'continue': true, 'becomeGrey': !formData.enableSize}" @click="addSize">继续添加</div>
        <!-- 其他项目检验 -->
        <el-form-item label-position="left" prop="enableOthers">
          <div class="info" style="margin-top: 42px;">
            <div class="title">其他项目检验</div>
            <el-switch active-color="#7CA870" v-model.trim="formData.enableOthers" />
            <div class="switch">{{formData.enableOthers ? '启用' : '关闭'}}</div>
          </div>
        </el-form-item>
        <el-table :data="formData.checkPlanOtherVos" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="checkName" label="检验项目" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableOthers" v-model.trim="scope.row.checkName" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="checkDesc" label="检验要求" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableOthers" v-model.trim="scope.row.checkDesc" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="checkMethod" label="检验方法" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableOthers" v-model.trim="scope.row.checkMethod" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="checkTool" label="检验工具" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input placeholder="请输入" :disabled="!formData.enableOthers" v-model.trim="scope.row.checkTool" maxlength="20"/>
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="materialType" label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btn">
                <el-button size="small" type="text" :class="{'yellow': true, 'f14': true, 'becomeGrey': !formData.enableOthers}" @click="delOthers(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div :class="{'continue': true, 'becomeGrey': !formData.enableOthers}" @click="addOthers">继续添加</div>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { becomObj } from '../../../utils/utils'

export default {
  name: 'globalQualityAdd',
  data () {
    const checkMethod = (rule, value, callback) => {
      if (this.formData.enableSize && !value) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      type: '',
      list: {},
      formData: {
        baseMaterialId: '',
        planType: 'MATERIAL', // 检验类型
        enableSpot: true, // 抽检启用
        rangeFlag: '', // 抽检启用
        checkPlanRangeVos: [{}], // 抽检要求列表
        enableSize: true, // 尺寸启用
        specFlag: '', // 尺寸启用
        specMethod: '', // 尺寸SPEC检验方法
        specTool: '', // 尺寸SPEC检验工具
        checkPlanSpecVos: [{}],
        enableOthers: true,
        checkPlanOtherVos: [{}],
        otherFlag: ''
      },
      rules: {
        specMethod: [
          { validator: checkMethod }
        ],
        specTool: [
          { validator: checkMethod }
        ]
      }
    }
  },
  computed: {
    loading: state => state.$store.state.global.btnLoading
  },
  mounted () {
    const { type, list } = this.$route.query
    this.type = type
    this.list = becomObj(list)
    this.formData.baseMaterialId = this.list.baseMaterialId
    if (type === 'edit') {
      this.type = 'edit'
      document.title = '编辑物料质检方案'
      this.getGlobalQuality(this.list.checkPlanId)
    }
  },
  methods: {
    ...mapMutations(['BTN_LOADING']),
    ...mapActions([
      'A_GET_GLOBAL_QUALITY_ADD',
      'A_GET_GLOBAL_QUALITY_EDIT',
      'A_GET_MATERIAL_QUALITY_DETAIL'
    ]),
    delSpot (index) {
      if (this.formData.enableSpot) {
        this.formData.checkPlanRangeVos.splice(index, 1)
      } else {
        this.$message('抽检要求已关闭')
      }
    },
    // 抽检继续添加
    addSpot () {
      if (this.formData.enableSpot) {
        this.formData.checkPlanRangeVos.push({})
      } else {
        this.$message('抽检要求已关闭')
      }
    },
    // 删除尺寸spec
    delSize (index) {
      if (this.formData.enableSize) {
        this.formData.checkPlanSpecVos.splice(index, 1)
      } else {
        this.$message('尺寸SPEC已关闭')
      }
    },
    // 尺寸添加
    addSize () {
      if (this.formData.enableSize) {
        this.formData.checkPlanSpecVos.push({})
      } else {
        this.$message('尺寸SPEC已关闭')
      }
    },
    // 删除尺寸spec
    delOthers (index) {
      if (this.formData.enableOthers) {
        this.formData.checkPlanOtherVos.splice(index, 1)
      } else {
        this.$message('其他项目检验已关闭')
      }
    },
    // 添加其他项目检验
    addOthers () {
      if (this.formData.enableOthers) {
        this.formData.checkPlanOtherVos.push({})
      } else {
        this.$message('其他项目检验已关闭')
      }
    },
    // 保存校验
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setParams()
        }
      })
    },
    // 新增
    setParams () {
      const { enableSpot, enableSize, enableOthers } = this.formData
      let { checkPlanRangeVos, checkPlanSpecVos, checkPlanOtherVos } = this.formData
      // 校验抽检要求
      if (enableSpot) {
        if (checkPlanRangeVos.length === 0) {
          this.$message.error('已启用抽检要求，需至少输入一行数据！')
          this.formData.checkPlanRangeVos = [{}]
          return
        }
        for (let i = 0; i < checkPlanRangeVos.length; i += 1) {
          checkPlanRangeVos[i].seqNum = i + 1
          if (!checkPlanRangeVos[i].end || !checkPlanRangeVos[i].start || !checkPlanRangeVos[i].ratio) {
            this.$message.error(`抽检要求第${i + 1}行有误，必填项不能为零和空！`)
            return
          }
          if (checkPlanRangeVos[i].start >= checkPlanRangeVos[i].end) {
            this.$message.error(`抽检要求第${i + 1}行有误，抽检上限必须大于抽检下限！`)
            return
          }
          if (i > 0 && checkPlanRangeVos[i].start < checkPlanRangeVos[i - 1].end) {
            this.$message.error(`抽检要求第${i + 1}行抽检下限必须大于等于${i}行抽检上限！`)
            return
          }
        }
      }
      // 校验尺寸SPEC
      if (enableSize) {
        if (checkPlanSpecVos.length === 0) {
          this.$message.error('已启用尺寸SPEC，需至少输入一行数据！')
          this.formData.checkPlanSpecVos = [{}]
          return
        }
        for (let i = 0; i < checkPlanSpecVos.length; i += 1) {
          if (!checkPlanSpecVos[i].maxValue || !checkPlanSpecVos[i].minValue || !checkPlanSpecVos[i].position || !checkPlanSpecVos[i].unit) {
            this.$message.error(`尺寸SPEC第${i + 1}行有误，必填项不能为零和空！`)
            return
          }
          if (checkPlanSpecVos[i].maxValue <= checkPlanSpecVos[i].minValue) {
            this.$message.error(`尺寸SPEC第${i + 1}行有误，SPEC上限必须大于SPEC下限！`)
            return
          }
        }
      }
      // 其他项目检验
      if (enableOthers) {
        if (checkPlanOtherVos.length === 0) {
          this.$message.error('已启用其他项目检验，需至少输入一行数据')
          this.formData.checkPlanOtherVos = [{}]
          return
        }
        for (let i = 0; i < checkPlanOtherVos.length; i += 1) {
          if (!checkPlanOtherVos[i].checkDesc || !checkPlanOtherVos[i].checkMethod || !checkPlanOtherVos[i].checkName || !checkPlanOtherVos[i].checkTool) {
            this.$message.error(`其他项目检验第${i + 1}行有误，必填项不能为空！`)
            return
          }
        }
      }
      if (checkPlanRangeVos.length && !checkPlanRangeVos[0].end && !checkPlanRangeVos[0].start && !checkPlanRangeVos[0].ratio) {
        checkPlanRangeVos = []
      }
      if (checkPlanSpecVos.length && !checkPlanSpecVos[0].maxValue && !checkPlanSpecVos[0].minValue && !checkPlanSpecVos[0].position && !checkPlanSpecVos[0].unit && !checkPlanSpecVos[0].remark) {
        checkPlanSpecVos = []
      }
      if (checkPlanOtherVos.length && !checkPlanOtherVos[0].checkDesc && !checkPlanOtherVos[0].checkMethod && !checkPlanOtherVos[0].checkName && !checkPlanOtherVos[0].checkTool) {
        checkPlanOtherVos = []
      }
      const formData = {
        ...this.formData,
        checkPlanRangeVos,
        checkPlanSpecVos,
        checkPlanOtherVos,
        rangeFlag: enableSpot ? 'Y' : 'N',
        specFlag: enableSize ? 'Y' : 'N',
        otherFlag: enableOthers ? 'Y' : 'N'
      }
      this.addGlobalQuality(formData)
    },
    async addGlobalQuality (formData) {
      try {
        this.BTN_LOADING(true)
        let data
        if (this.type === 'add') {
          data = await this.A_GET_GLOBAL_QUALITY_ADD(formData)
        } else {
          data = await this.A_GET_GLOBAL_QUALITY_EDIT(formData)
        }
        this.BTN_LOADING()
        if (data.status === 0) {
          this.$message.success('保存成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        }
      } catch (e) {
        console.log(e)
        this.BTN_LOADING()
      }
    },
    // 获取详情
    async getGlobalQuality (id) {
      try {
        const { status, data } = await this.A_GET_MATERIAL_QUALITY_DETAIL({ checkPlanId: id })
        if (status === 0) {
          this.formData = {
            ...data,
            enableSize: data.specFlag === 'Y',
            enableSpot: data.rangeFlag === 'Y',
            enableOthers: data.otherFlag === 'Y',
            checkPlanRangeVos: data.checkPlanRangeVos.length === 0 ? [{}] : data.checkPlanRangeVos,
            checkPlanSpecVos: data.checkPlanSpecVos.length === 0 ? [{}] : data.checkPlanSpecVos,
            checkPlanOtherVos: data.checkPlanOtherVos.length === 0 ? [{}] : data.checkPlanOtherVos
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
  .becomeGrey {
    color: #c0c4cc;
  }
  /deep/ .el-form--label-top .el-form-item__label:before {
    content: '*';
    width: 18px;
    height: 10px;
    color: #F56C6C;
    margin-right: 3px;
  }
  .detailList {
    margin-top: 15px;
  }
  .detailList .item {
    height: 20px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 20px;
    font-family: PingFangSC-Regular,PingFang SC;
    color:rgba(153,153,153,1);

  }
  .detailList .item span {
    color: #444444;
  }

  .checkType {
    margin-top: 20px;
  }
  .checkType div {
    line-height: 20px;
    display: inline-block;
  }
  .checkType .title {
    color:#444444;
    font-size: 16px;
    font-weight: 400;
    font-family: PingFangSC-Regular,PingFang SC;
  }
  .checkType .item {
    color: #606266;
    font-size: 14px;
    line-height: 20px;
  }
  /deep/ .el-table__empty-block {
    display: none;
  }
  .checkList .item {
    display: flex;
  }
</style>

