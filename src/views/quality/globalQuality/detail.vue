<template>
  <div class="contain-company">
    <!-- 头部 -->
    <tzHeadline title="全局质检方案详情" :isShowBack="true" backText="返回">
      <template slot="btn">
        <el-button class="tz-search-submit tz-btn-add" round size="medium"  @click="enterPage">编辑</el-button>
      </template>
    </tzHeadline>
    <!-- 搜索 -->
    <div style="margin-top: 20px;"></div>
    <el-form
      size="medium"
      label-width="100px"
      label-position="top">
        <!-- 基本信息 -->
        <div class="info">
          <div class="title">基本信息</div>
        </div>
        <div class="detailList">
          <el-row :gutter="20">
            <el-col :span="10">
              <div class="item">检验方案名称：<span>{{detail.planName}}</span></div>
            </el-col>
          </el-row>
        </div>
        <!-- 抽检要求 -->
        <div class="info" style="margin-top: 25px;">
          <div class="title">抽检要求</div>
          <img src="../../../assets/images/icon/notEnabled.png" v-if="detail.rangeFlag === 'N'" />
        </div>
        <el-table :data="detail.checkPlanRangeVos" border style="width: 100%; margin-top: 20px;" class="spotCheck" :header-cell-style="{'background-color': '#F9F9F9'}" v-if="detail.rangeFlag === 'Y'">
          <el-table-column prop="start" label="抽检数量下限" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="end" label="抽检数量上限" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ratio" label="抽检比例" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.ratio}}</span><span>%</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 尺寸SPEC -->
        <div class="info" style="margin-top: 42px;">
          <div class="title">尺寸SPEC</div>
          <img src="../../../assets/images/icon/notEnabled.png" v-if="detail.specFlag === 'N'" />
        </div>
        <div class="detailList" v-if="detail.specFlag === 'Y'">
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="item" style="display:flex;">检验方法：<tzToolTip :content="detail.specMethod" activeColor="#444" /></div>
            </el-col>
            <el-col :span="5">
              <div class="item" style="display:flex;">检验工具：<tzToolTip :content="detail.specTool" activeColor="#444" /></div>
            </el-col>
          </el-row>
        </div>
        <el-table :data="detail.checkPlanSpecVos" border style="width: 100%;margin-top: 20px;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}" v-if="detail.specFlag === 'Y'">
          <el-table-column prop="position" label="检验位置" align="center" show-overflow-tooltip />
          <el-table-column prop="minValue" label="SPEC下限" align="center" show-overflow-tooltip />
          <el-table-column prop="maxValue" label="SPEC上限" align="center" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" align="center" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
        </el-table>
        <!-- 其他项目检验 -->
        <div class="info" style="margin-top: 42px;">
          <div class="title">其他项目检验</div>
          <img src="../../../assets/images/icon/notEnabled.png" v-if="detail.otherFlag === 'N'" />
        </div>
        <el-table :data="detail.checkPlanOtherVos" border style="width: 100%; margin-top: 20px;" class="clearInput" :header-cell-style="{'background-color': '#F9F9F9'}" v-if="detail.otherFlag === 'Y'">
          <el-table-column prop="checkName" label="检验项目" align="center" show-overflow-tooltip />
          <el-table-column prop="checkDesc" label="检验要求" align="center" show-overflow-tooltip />
          <el-table-column prop="checkMethod" label="检验方法" align="center" show-overflow-tooltip />
          <el-table-column prop="checkTool" label="检验工具" align="center" show-overflow-tooltip />
        </el-table>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'globalQualityDetail',
  data () {
    return {
      detail: {}
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.getGlobalQuality(id)
  },
  methods: {
    ...mapActions([
      'A_GET_GLOBAL_QUALITY_DETAIL'
    ]),
    // 获取详情
    async getGlobalQuality (id) {
      try {
        const { status, data } = await this.A_GET_GLOBAL_QUALITY_DETAIL({ checkPlanId: id })
        if (status === 0) {
          this.detail = data
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 新增/编辑质检方案
    enterPage () {
      this.$router.push({
        name: 'globalQualityAdd',
        query: {
          type: 'edit',
          id: this.detail.checkPlanId
        }
      })
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
    margin-right: 15px;
    font-family: PingFangSC-Medium,PingFang SC;
    color:rgba(40,40,40,1);
  }
  .info img {
    width: 50px;
    height: 17px;
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
</style>
