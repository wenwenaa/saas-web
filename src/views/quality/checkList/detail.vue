<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline :title="list.formType === 'IN' ? '来料检详情' : '出货检详情'" :isShowBack="true" backText="返回" />
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
        <div class="info" style="margin-bottom: 20px;">
          <div class="title">基本信息</div>
        </div>
        <div class="detailList checkList" v-if="formData.baseMaterialVo">
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">质检单号：</p><tzToolTip :content="formData.formCode" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">质检人：</p><tzToolTip :content="formData.managerStuff" activeColor="#444" /></div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">物料名称：</p><tzToolTip :content="formData.baseMaterialVo.materialName" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">物料编码：</p><tzToolTip :content="formData.baseMaterialVo.materialCode" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">物料类型：</p><tzToolTip :content="formData.baseMaterialVo.typeName" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">物料规格：</p><tzToolTip :content="formData.baseMaterialVo.spec" activeColor="#444" /></div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">物料图号：</p><tzToolTip :content="formData.baseMaterialVo.picNum" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">送检数量：</p><span>{{formData.totalQuantity}}{{formData.baseMaterialVo.unitName}}</span></div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">备注：</p><span>{{formData.remark}}</span></div>
            </el-col>
          </el-row>
        </div>
        <!-- 图片和附件 -->
        <div class="info" style="margin-top: 20px;">
          <div class="title">图片和附件</div>
        </div>
        <tzCommonFileUpload applicationType='detail' class="tzupload" :fileList="formData.baseFileDtos" :fileTitleShow="false" />
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
            <el-table-column prop="samplingQuantity" label="应抽检数量" align="center" show-overflow-tooltip />
          </el-table>
        </div>
        <!-- 尺寸SPEC -->
        <div v-if="formData.checkPlanVo && formData.checkPlanVo.specFlag === 'Y'">
          <el-form-item label-position="left" style="margin-bottom: 20px;">
            <div class="info" style="margin-top: 42px;">
              <div class="title">尺寸SPEC</div>
            </div>
          </el-form-item>
          <div class="detailList" style="margin-bottom: 22px;">
            <el-row :gutter="20">
              <el-col :span="5">
                <div class="item d-flex" style="margin-bottom: 0;"><p class="labelColor labelWidth flex-shrink-0">检验方法：</p><span>{{formData.checkPlanVo.specMethod}}</span></div>
              </el-col>
              <el-col :span="5">
                <div class="item d-flex" style="margin-bottom: 0;"><p class="labelColor labelWidth flex-shrink-0">检验工具：</p><span>{{formData.checkPlanVo.specTool}}</span></div>
              </el-col>
            </el-row>
          </div>
          <el-table :data="formData.checkFormItemSpecVos" :span-method="objectSpanMethod" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
            <el-table-column prop="seq" label="序号" align="center" show-overflow-tooltip />
            <el-table-column prop="position" label="检验位置" align="center" show-overflow-tooltip />
            <el-table-column prop="minValue" label="SPEC下限" align="center" show-overflow-tooltip />
            <el-table-column prop="maxValue" label="SPEC上限" align="center" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" align="center" show-overflow-tooltip />
            <el-table-column prop="value" label="实际值" align="center" show-overflow-tooltip />
            <el-table-column prop="result" label="单项结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <tzStatus :status="scope.row.result" :content="scope.row.result | filterDic(dic.qualityResult)" />
              </template>
            </el-table-column>
            <el-table-column prop="itemResult" label="检测结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <tzStatus :status="scope.row.itemResult" :content="scope.row.itemResult | filterDic(dic.qualityResult)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 其他项目检 -->
        <div v-if="formData.checkPlanVo && formData.checkPlanVo.otherFlag === 'Y'">
          <el-form-item label-position="left" prop="enableFlag">
            <div class="info" style="margin-top: 42px;">
              <div class="title">其他项目检验</div>
            </div>
          </el-form-item>
          <el-table :data="formData.checkFormItemOtherVos" :span-method="objectSpanMethod1" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
            <el-table-column prop="seq" label="序号" align="center" show-overflow-tooltip />
            <el-table-column prop="checkName" label="检验项目" align="center" show-overflow-tooltip />
            <el-table-column prop="checkDesc" label="检验要求" align="center" show-overflow-tooltip />
            <el-table-column prop="checkMethod" label="检验方法" align="center" show-overflow-tooltip />
            <el-table-column prop="checkTool" label="检验工具" align="center" show-overflow-tooltip />
            <el-table-column prop="value" label="检验值/描述" align="center" show-overflow-tooltip />
            <el-table-column prop="result" label="单项结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <tzStatus :status="scope.row.result" :content="scope.row.result | filterDic(dic.qualityResults)" />
              </template>
            </el-table-column>
            <el-table-column prop="itemResult" label="检测结果" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <tzStatus :status="scope.row.itemResult" :content="scope.row.result | filterDic(dic.qualityResults)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 检验结果 -->
        <el-form-item label-position="left" prop="enableFlag">
          <div class="info" style="margin-top: 42px;">
            <div class="title">检验结果</div>
          </div>
        </el-form-item>
        <el-table :data="formData.checkFormNgVos" border style="width: 100%;" v-if="formData.checkFormNgVos && formData.checkFormNgVos.length" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="ngType" label="不良类型" align="center" show-overflow-tooltip />
          <el-table-column prop="ngReason" label="不良原因" align="center" show-overflow-tooltip />
          <el-table-column prop="ngQuantity" label="不良数量" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 最终结果 -->
        <el-table :data="finalResult" border style="width: 100%;margin-top: 20px;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="goodQuantity" label="良品数量" align="center" show-overflow-tooltip />
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
              <tzStatus :status="scope.row.result" :content="scope.row.result | filterDic(dic.qualityResults)" />
            </template>
          </el-table-column>
        </el-table>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { spanMethod, rowspan } from '../../../utils/utils'
import dic from '../../../global/dictionary'
import dics from '../../../mixins/dic'

export default {
  name: 'globalQualityAdd',
  mixins: [dics],
  data () {
    return {
      dic,
      list: {},
      formData: {},
      finalResult: [{}],
      spanArr: []
    }
  },
  mounted () {
    const { formType, checkFormId } = this.$route.query
    this.list = {
      formType,
      checkFormId
    }
    if (formType === 'OUT') {
      document.title = '出货检详情'
    } else {
      document.title = '来料检详情'
    }
    this.inOutQualityDetail()
  },
  methods: {
    ...mapActions([
      'A_IN_OUT_QUALITY_DETAIL'
    ]),
    // 计算不良数
    countNgNums () {
      this.finalResult[0].ngQuantity = 0
      this.formData.checkFormNgVos.forEach((item) => {
        this.finalResult[0].ngQuantity += item.ngQuantity
      })
      this.calculation()
      this.cancel()
    },
    // 出入库检详情
    async inOutQualityDetail () {
      try {
        const { status, data } = await this.A_IN_OUT_QUALITY_DETAIL(this.list)
        if (status === 0) {
          this.formData = data
          if (data.checkPlanVo.rangeFlag === 'Y') {
            data.checkPlanRangeVo.samplingQuantity = Number(data.totalQuantity) * Number(data.checkPlanRangeVo.ratio) / 100
            this.formData.checkPlanRangeVo = [data.checkPlanRangeVo]
          }
          // 尺寸质检spec
          this.formData.checkFormItemSpecVos = data.checkFormItemSpecVos || []
          this.spanArr = rowspan(this.formData.checkFormItemSpecVos, 'seq')
          // 其他项目检
          this.formData.checkFormItemOtherVos = data.checkFormItemOtherVos || []
          this.spanArr1 = rowspan(this.formData.checkFormItemOtherVos, 'seq')
          // 最终检验
          const { goodQuantity, ngQuantity, totalQuantity } = data
          let checkRatio
          const total = Number(goodQuantity) + Number(ngQuantity)
          if (total === 0) {
            checkRatio = 0
          } else {
            checkRatio = Number(goodQuantity) / total * 100
            checkRatio = checkRatio.toFixed(6)
          }
          this.finalResult = [{
            total,
            goodQuantity,
            ngQuantity,
            checkRatio,
            totalQuantity,
            result: data.result
          }]
        }
      } catch (e) {
        console.log(e)
      }
    },
    objectSpanMethod ({ rowIndex, columnIndex }) {
      return spanMethod({
        rowIndex,
        columnIndex
      }, this.spanArr, [0, 7])
    },
    objectSpanMethod1 ({ rowIndex, columnIndex }) {
      return spanMethod({
        rowIndex,
        columnIndex
      }, this.spanArr1, [0, 7])
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
    cursor: pointer;
    font-weight: 500;
    line-height: 48px;
    text-align: center;
    border: 1px solid #EBEEF5;
    border-top: none;
    font-family: PingFangSC-Medium,PingFang SC;
    color:rgba(124,168,112,1);
  }
  .detailList .item {
    line-height: 20px;
    margin-bottom: 20px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 500;
  }
  .relation {
    overflow: hidden;
    margin-top: 20px;
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
  .checkList .item {
    display: flex;
  }
</style>
