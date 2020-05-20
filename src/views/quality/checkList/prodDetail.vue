<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="过程检详情" :isShowBack="true" backText="返回" />
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
        <div class="detailList" v-if="formData.baseMaterialVo">
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
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">物料图号：</p><tzToolTip :content="formData.baseMaterialVo.picNum" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item"><p class="labelColor labelWidth flex-shrink-0">计划数量：</p><span>{{formData.baseMaterialVo.quantityDisplay}}{{formData.baseMaterialVo.unitName}} </span></div>
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
        <tzCommonFileUpload applicationType='detail' class="tzupload" :fileTitleShow="false" :fileList="formData.baseFileDtos" />
        <!-- 关联单据 -->
        <div class="info" style="margin-top: 20px;">
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

        <!-- 检验结果 -->
        <el-form-item label-position="left" prop="enableFlag" style="margin-bottom: 0;">
          <div class="info" style="margin-top: 40px;margin-bottom: 20px;">
            <div class="title">检验结果 · {{formData.seqName}}</div>
          </div>
        </el-form-item>
        <el-table :data="formData.checkFormNgVos" v-if="formData.checkFormNgVos && formData.checkFormNgVos.length" border style="width: 100%;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="ngType" label="不良类型" align="center" show-overflow-tooltip />
          <el-table-column prop="ngReason" label="不良原因" align="center" show-overflow-tooltip />
          <el-table-column prop="ngQuantity" label="不良数量" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 最终结果 -->
        <el-table :data="finalResult" border style="width: 100%;margin-top: 20px;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}">
          <el-table-column prop="totalQuantity" label="报检数" align="center" show-overflow-tooltip />
          <el-table-column prop="goodQuantity" label="良品数" align="center" show-overflow-tooltip />
          <el-table-column prop="ngQuantity" label="不良品数" align="center" show-overflow-tooltip />
          <el-table-column prop="total" label="检验数量" align="center" show-overflow-tooltip />
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
import dic from '../../../global/dictionary'
import dics from '../../../mixins/dic'

export default {
  name: 'globalQualityAdd',
  mixins: [dics],
  data () {
    return {
      dic,
      formData: {},
      finalResult: [{}]
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.getProdDetail(id)
  },
  methods: {
    ...mapActions([
      'A_PROD_QUALITY_VIEW_DETAIL'
    ]),
    // 获取详情
    async getProdDetail (id) {
      try {
        const { status, data } = await this.A_PROD_QUALITY_VIEW_DETAIL({ checkFormId: id })
        if (status === 0) {
          this.formData = {
            ...data,
            baseFileDtos: data.baseFileDtos || []
          }
          const {
            totalQuantity, goodQuantity, ngQuantity, result
          } = data
          const total = Number(goodQuantity) + Number(ngQuantity)
          this.finalResult = [{
            totalQuantity,
            goodQuantity,
            ngQuantity,
            total,
            result
          }]
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
  .detailList .item {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 20px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 500;
    color:rgba(153,153,153,1);

  }
  .detailList .item span {
    color: #444444;
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
</style>
