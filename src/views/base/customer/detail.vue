<template>
  <div>
    <!-- 头部 -->
    <tzHeadline title="客户详情" :isShowBack="true" backText="返回客户主档">
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="customerAdd">编辑</el-button>
      </template>
    </tzHeadline>
    <div>
      <div class="headTitle font-bold mb10">基本信息</div>
      <el-row :gutter="18" class="mb20" style="line-height:30px">
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">客户名称：</div>
            <tzToolTip :content="getDetail.customerName"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">客户编码：</div>
            <tzToolTip :content="getDetail.customerCode"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">联系人：</div>
            <tzToolTip :content="getDetail.contactName"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">联系电话：</div>
            <tzToolTip :content="getDetail.contactPhone"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">邮箱：</div>
            <tzToolTip :content="getDetail.email"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">传真：</div>
            <tzToolTip :content="getDetail.fax"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0">地址：</div>
            <tzToolTip :content="getDetail.address"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="d-flex">
            <div class="labelColor label80 flex-shrink-0" style="width:50px;">备注：</div>
            <div class="wordWrap">{{getDetail.remark}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex'
import * as urls from '../../../router/routePath'

export default {
  name: 'customerDetail',
  data () {
    return {
      id: '',
      getDetail: {}
    }
  },
  mounted () {
    const {
      id
    } = this.$route.query
    this.id = id
    this.getCustomerDetail()
  },
  methods: {
    ...mapActions([
      'GET_CUSTOMER_DETAIL'
    ]),
    // 获取客户详情
    async getCustomerDetail () {
      try {
        const {
          status,
          data
        } = await this.GET_CUSTOMER_DETAIL({
          id: this.id
        })
        if (status === 0) {
          this.getDetail = data
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入页面
    customerAdd () {
      this.$router.push({
        path: urls.BASE_CUSTOMER_ADD,
        query: {
          type: 'edit',
          id: this.id
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
</style>
