<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="新增过程检验单" :isShowBack="true" backText="返回">
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
      :rules="rules"
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
        </el-row>
        <!-- 关联单据 -->
        <div class="info">
          <div class="title">关联单据</div>
        </div>
        <div class="relation">
          <div class="list">
            <div class="item">
              <span class="title">生产订单号：</span>
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
          <el-table-column prop="quantityDisplay" label="计划数量" align="center" show-overflow-tooltip />
          <el-table-column prop="unitName" label="单位" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 检验结果 -->
        <el-form-item label-position="left" prop="enableFlag" style="margin-bottom: 0;">
          <div class="info" style="margin-top: 42px;">
            <div class="title">检验结果</div>
          </div>
        </el-form-item>
        <div>
          <el-form-item label="工序" prop="baseSeqId">
            <el-select v-model="formData.baseSeqId" clearable filterable placeholder="请选择工序" @change="changeManage">
              <el-option
                v-for="item in workProcedures"
                :key="item.baseSeqId"
                :label="item.baseSeqName"
                :value="item.baseSeqId">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
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
          <el-table-column prop="totalQuantity" label="报检数" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" v-model.trim="scope.row.totalQuantity" :controls="false" :min="0" :max="99999999" :precision="6" />
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="goodQuantity" label="良品数" align="center" show-overflow-tooltip class-name="required-red addEdit">
            <template slot-scope="scope">
              <el-input-number placeholder="请输入" v-model.trim="scope.row.goodQuantity" :controls="false" :min="0" :max="99999999" :precision="6" @change="calculation" />
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
          <el-table-column prop="ngQuantity" label="不良品数" align="center" show-overflow-tooltip />
          <el-table-column prop="total" label="检验数量" align="center" show-overflow-tooltip />
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
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import dic from '../../../global/dictionary'
import dics from '../../../mixins/dic'

export default {
  name: 'globalQualityAdd',
  mixins: [dics],
  data () {
    return {
      dic,
      tips: {
        badVisible: false
      },
      formData: {},
      params: {},
      finalResult: [{}],
      workProcedures: [],
      rules: {
        managerStuffId: [
          { required: true, message: '请选择质检人员', trigger: 'blur' }
        ],
        baseSeqId: [
          { required: true, message: '请输入工序', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    loading: state => state.$store.state.global.btnLoading
  },
  mounted () {
    const { id } = this.$route.query
    this.getProdDetail(id)
    this.getWorkProcedure(id)
    // 最终检验结果
    this.finalResult = [{
      totalQuantity: undefined,
      goodQuantity: undefined,
      ngQuantity: 0,
      result: 'Y',
      total: 0
    }]
  },
  methods: {
    ...mapMutations(['BTN_LOADING']),
    ...mapActions([
      'A_PROD_QUALITY_INFO',
      'A_PROD_WORKING_PROCEDURE',
      'A_PROD_ADD_QUALITY'
    ]),
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
      console.log(e)
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
      if (!goodQuantity) return
      this.finalResult[0].total = Number(goodQuantity) + Number(ngQuantity)
    },
    // 生产初始化
    async getProdDetail (id) {
      try {
        const { status, data } = await this.A_PROD_QUALITY_INFO({ refId: id })
        if (status === 0) {
          this.formData = data
          const { baseMaterialId } = data.baseMaterialVo
          this.formData.baseMaterialId = baseMaterialId
          this.formData.baseMaterialVo = [data.baseMaterialVo]
          const { stuffId } = JSON.parse(sessionStorage.getItem('userInfo'))
          this.formData.managerStuffId = stuffId
          this.changeManage(stuffId)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 生产初始化工序
    async getWorkProcedure (id) {
      try {
        const { status, data } = await this.A_PROD_WORKING_PROCEDURE({ refId: id })
        if (status === 0) {
          this.workProcedures = data
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
    setParams () {
      const {
        refCode, refId, baseMaterialId, managerStuff, managerStuffId, remark, baseSeqId, checkFormNgVos, baseFileVos
      } = this.formData
      const { goodQuantity, totalQuantity, total } = this.finalResult[0]
      if (!totalQuantity) {
        this.$message.error('报检数必填且不能为零')
        return
      }
      if (goodQuantity === undefined || goodQuantity === null) {
        this.$message.error('良品数必填')
        return
      }
      if (total > totalQuantity) {
        this.$message.error('检验数不能大于报检数')
        return
      }
      this.params = {
        refId,
        remark,
        refCode,
        baseSeqId,
        baseFileVos,
        managerStuff,
        baseMaterialId,
        managerStuffId,
        checkFormNgVos,
        ...this.finalResult[0]
      }
      this.addQuality()
    },
    async addQuality () {
      try {
        this.BTN_LOADING(true)
        const { status } = await this.A_PROD_ADD_QUALITY(this.params)
        this.BTN_LOADING()
        if (status === 0) {
          this.$message.success('保存成功')
          this.$router.push({
            name: 'checkList'
          })
        }
      } catch (e) {
        console.log(e)
        this.BTN_LOADING()
      }
    },
    handleUploadFile ({ files }) {
      this.formData.baseFileVos = files
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
  /deep/ .addEdit .cell {
    display: flex;
    align-items: center;
  }
</style>
