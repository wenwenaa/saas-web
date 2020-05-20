<template>
  <div class="schedule">
    <tzHeadline title="我处理的"></tzHeadline>
    <el-form :inline="true" size="medium">
      <tzSearch :isShowExtend="false" @search="search" @clear="clear">
        <template slot="content">
          <el-form-item label="单据类型">
            <el-select v-model.trim="searchObj.targetType" placeholder="全部" clearable>
              <el-option :key="item.type" :value="item.type" v-for="item in dic.moduleName" :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单号">
            <el-input placeholder="请输入" v-model.trim="searchObj.targetCode" maxlength="30" clearable
              @keyup.enter.native="search"/>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="待处理" name="first">
        <tableItem :tableData="waitList" type="first" @submit="firstSubmit"></tableItem>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="second">
        <tableItem :tableData="finishList" type="second" @submit="secondSubmit"></tableItem>
      </el-tab-pane>
    </el-tabs>
    <tzPagination :currentPage="activeName === 'first' ? firstIndex : secondIndex"
      :page-size="activeName === 'first' ? firstSize : secondSize"
      :total="activeName === 'first' ? waitTotal : finishTotal" @_currentPageChange="pageChange"
      @_pageSizeChange="pageSizeChange" />
  </div>
</template>

<script>
  import {
    mapActions,
    mapState,
    mapMutations
  } from 'vuex'
  import dic from '../../../global/dictionary'
  import tableItem from './component/tableItem.vue'
  import keepAlive from '../../../mixins/keepAlive'
  import copyParams from '../../../mixins/copyParams'

  export default {
    name: 'schedule',
    data () {
      return {
        searchObj: {},
        dic,
        firstIndex: 1,
        secondIndex: 1,
        firstSize: 10,
        secondSize: 10,
        // pageSize: 10,
        activeName: 'first'
      }
    },
    mixins: [keepAlive, copyParams],
    computed: {
      ...mapState({
        waitList: state => state.orderCheck.waitList,
        waitTotal: state => state.orderCheck.waitTotal,
        finishList: state => state.orderCheck.finishList,
        finishTotal: state => state.orderCheck.finishTotal
      })
    },
    components: {
      tableItem
    },
    created () {
      this.copyParamsFun(this.searchObj)
    },
    activated () {
      this.getWaitList()
    },
    destroyed () {
      const arg = {
        records: [],
        total: 0
      }
      this.M_SET_FINISH_LIST(arg)
      this.M_SET_WAIT_LIST(arg)
    },
    methods: {
      ...mapActions(['A_GET_WAIT_LIST', 'A_GET_FINISH_LIST']),
      ...mapMutations(['M_SET_WAIT_LIST', 'M_SET_FINISH_LIST']),
      // 查询
      search () {
        this.copyParamsFun(this.searchObj)
        if (this.activeName === 'first') {
          this.firstIndex = 1
          this.getWaitList()
        } else {
          this.secondIndex = 1
          this.getFinishList()
        }
      },
      // 待处理审核回调
      firstSubmit () {
        this.getWaitList()
        this.getFinishList()
      },
      // 待处理审核回调
      secondSubmit () {
        this.getFinishList()
      },
      // 清空
      clear () {
        this.searchObj = {}
        this.copyParamsFun(this.searchObj)
        if (this.activeName === 'first') {
          this.firstIndex = 1
          this.getWaitList()
        } else {
          this.secondIndex = 1
          this.getFinishList()
        }
      },
      // 页码改变
      pageChange (val) {
        this.searchObj = {
          ...this.copyParamsObj
        }
        if (this.activeName === 'first') {
          this.firstIndex = val
          this.getWaitList()
        } else {
          this.secondIndex = val
          this.getFinishList()
        }
      },
      // size改变
      pageSizeChange (size) {
        if (this.activeName === 'first') {
          this.firstSize = size
          this.getWaitList()
        } else {
          this.secondSize = size
          this.getFinishList()
        }
      },
      // 切换tab
      handleClick (tab) {
        this.searchObj = {
          ...this.copyParamsObj
        }
        if (tab.name === 'second') {
            this.getFinishList()
        } else {
          this.getWaitList()
        }
      },
      // 待处理列表
      getWaitList () {
        const arg = {
          ...this.searchObj,
          pageIndex: this.firstIndex,
          pageSize: this.firstSize
        }
        this.A_GET_WAIT_LIST(arg)
      },
      // 已处理列表
      getFinishList () {
        const arg = {
          ...this.searchObj,
          pageIndex: this.secondIndex,
          pageSize: this.secondSize
        }
        this.A_GET_FINISH_LIST(arg)
      }
    }
  }

</script>

<style>
  .schedule .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #7ca870;
  }

  .schedule .el-tabs--border-card>.el-tabs__header .el-tabs__item:hover {
    color: #7ca870;
  }

  .schedule .el-button--text {
    color: #444444;
  }

  .schedule .el-button--text.edit-color {
    color: #7ca870;
  }

  .schedule .el-tabs__item {
    font-size: 14px;
  }

</style>
