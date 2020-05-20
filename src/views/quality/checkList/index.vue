<template>
  <div class="contain-company" ref="rootPlacement">
    <!-- 头部 -->
    <tzHeadline title="检验单列表" />
    <!-- 搜索 -->
    <el-form :inline="true" size="medium" label-position="left">
      <tzSearch @search="search" @clear="clear" :isShowExtend="true">
        <template slot="content">
          <el-form-item label="质检类型" prop="formType">
            <el-select v-model.trim="formData.formType" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.formType"
                v-for="item in qualityTypes">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="质检单号">
            <el-input
              clearable
              placeholder="请输入"
              @keyup.enter.native="search"
              v-model.trim="formData.formCode">
            </el-input>
          </el-form-item>
          <el-form-item label="质检结果" prop="result">
            <el-select v-model.trim="formData.result" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :label="item.name"
                v-for="item in qualityResults"
                :value="item.result">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="main">
          <el-form-item label="物料类型">
            <el-select v-model.trim="formData.typeName" clearable filterable placeholder="请选择">
              <el-option
                :key="item.baseMaterialTypeId"
                :label="item.typeName"
                v-for="item in materialTypeList"
                :value="item.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.materialCode"
              @keyup.enter.native="search"/>
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.materialName"
              @keyup.enter.native="search"/>
          </el-form-item>
          <br />
          <el-form-item label="物料规格">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.spec"
              @keyup.enter.native="search"/>
          </el-form-item>
          <el-form-item label="工序">
            <el-input
              clearable
              placeholder="请输入"
              v-model.trim="formData.seqName"
              @keyup.enter.native="search"/>
          </el-form-item>
          <el-form-item label="质检人员">
            <el-select v-model.trim="formData.managerStuffId" clearable filterable placeholder="请选择">
              <el-option
                :key="item.id"
                :label="item.val"
                v-for="item in employeeList"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="创建时间">
            <el-date-picker
              clearable
              v-model.trim="time"
              :editable="false"
              @change="getTime"
              start-placeholder="创建时间"
              end-placeholder="结束时间"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              >
            </el-date-picker>
          </el-form-item>
        </template>
      </tzSearch>
    </el-form>
    <el-table
      border
      ref="formData"
      :data="tableData"
      rowClassName="table-cell"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :header-cell-style="{'background-color': '#F9F9F9'}">
      <el-table-column align="center" type="selection" width="46"></el-table-column>
      <el-table-column align="center" prop="formCode" label="质检单号" width="200px;">
        <template slot-scope="scope">
          <div class="yellow" @click="enterDetail(scope.row)">{{scope.row.formCode}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="formType" label="质检类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.formType | filterDic(dics.qualityCheck)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="seqName" label="检验工序" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.formType === 'PROD'">{{scope.row.seqName}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="materialCode" label="物料编码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="materialName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="spec" label="物料规格" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="result" label="质检结果">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.result === 'U'">-</div>
            <tzStatus v-else :status="scope.row.result" :content="scope.row.result | filterDic(dics.qualityResult)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="managerStuff" label="质检人">
        <template slot-scope="scope">
          <div v-if="scope.row.managerStuff">{{scope.row.managerStuff}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="checkTime" label="质检日期">
        <template slot-scope="scope">
          {{scope.row.checkTime | momentTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="buttons operation">
            <div class="btns green pointer" @click="openPlan(scope.row)" v-if="scope.row.result === 'U'">检验</div>
            <div class="btns" v-else style="cursor: pointer;" @click="enterDetail(scope.row)">详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <tzPagination
      :total="total"
      :page-size="formData.pageSize"
      :current-page="formData.pageIndex"
      @_pageSizeChange="pageSizeChange"
      @_currentPageChange="currentPageChange" />
    <!-- 打开方案检测 -->
    <div class="programme">
      <el-dialog title="检验方案选择" :visible.sync="form.dialogFormVisible" @close="closeDiaLog">
        <el-form ref="form" :model="form" :rules="rules"  :inline="true" size="medium" label-position="left">
          <el-form-item label="检验类型" prop="checkType">
            <el-radio-group v-model.trim="form.checkType" @change="radioChange">
              <el-radio v-for="item in form.checkTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="检验方案" prop="checkPlanId" v-if="form.checkType === 1">
            <el-select placeholder="请输入质检方案名称" v-model="form.checkPlanId" filterable @change="getCheckPlanId">
              <el-option v-for="item in qualityGlobal" :label="item.planName" :value="item.checkPlanId" :key="item.checkPlanId" />
            </el-select>
          </el-form-item>
          <el-form-item label="检验方案" prop="materialName" v-else>
            <el-input v-model="form.materialName" disabled/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="nextStep" round size="small" @click="enterPage('add')">下一步</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  mapActions, mapGetters, mapState, mapMutations
} from 'vuex'
import keepAlive from '../../../mixins/keepAlive'
import dic from '../../../mixins/dic'
import dics from '../../../global/dictionary'
import { becomeString } from '../../../utils/utils'
import copyParams from '../../../mixins/copyParams'

export default {
  name: 'checkList',
  mixins: [keepAlive, dic, copyParams],
  data () {
    // const checkMethod = (rule, value, callback) => {
    //   if (this.form.checkType === 1 && !value) {
    //     callback(new Error('请选择检验方案'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      time: '',
      form: { // 打开校验
        checkType: 1,
        checkPlanId: '',
        checkTypes: [
          {
            id: 1,
            name: '全局检验方案'
          },
          {
            id: 2,
            name: '物料检验方案'
          }
        ],
        materialName: '',
        dialogFormVisible: false
      },
      formData: { // 查询
        pageIndex: 1,
        pageSize: 10,
        formType: '', // 质检类型
        formCode: '', // 质检单号
        result: '', // 质检结果
        typeName: '',
        materialCode: '',
        materialName: '',
        spec: '',
        seqName: '',
        managerStuffId: '',
        startCreateTime: '',
        endCreateTime: ''
      },
      qualityTypes: [ // 质检类型
        {
          id: 1,
          name: '全部',
          formType: ''
        },
        {
          id: 2,
          name: '入库检',
          formType: 'IN'
        },
        {
          id: 3,
          name: '出库检',
          formType: 'OUT'
        },
        {
          id: 4,
          name: '过程检',
          formType: 'PROD'
        }
      ],
      qualityResults: [ // 质检结果
        {
          id: 1,
          name: '全部',
          result: ''
        },
        {
          id: 2,
          name: '合格',
          result: 'Y'
        },
        {
          id: 3,
          name: '未质检',
          result: 'U'
        },
        {
          id: 4,
          name: '不合格',
          result: 'N'
        }
      ],
      dics, // 引入全局
      total: 0,
      tableData: [],
      rules: {
        checkType: [
          { required: true, message: '请选择检验类型', trigger: ['blur', 'change'] }
        ]
        // checkPlanId: [
        //   { validator: checkMethod }
        // ]
      },
      transmit: {
        checkFormId: '', // 质检单号Id
        checkPlanId: '',
        baseMaterialId: '',
        formType: '', // 质检类型
        checkType: ''
      },
      qualityGlobal: [],
      type: 'add'
    }
  },
  computed: {
    ...mapGetters(['employeeList']),
    ...mapState({
      tableLoading: state => state.global.tableLoading
    })
  },
  mounted () {
    this.copyParamsFun(this.formData)
    this.getCheckList()
    this.getCheckNoPageList()
  },
  activated () {
    if (this.type === 'add') {
      this.clear()
    } else {
      console.log(this.copyParamsObj)
      this.formData = { ...this.copyParamsObj }
      this.getCheckList()
    }
  },
  methods: {
    ...mapMutations(['TABLE_LOADING']),
    ...mapActions([
      'A_GET_QUALITY_CHECK_LIST',
      'A_GET_QUERY_MATERIAL_NAME',
      'A_GET_QUALITY_GLOBAL_NO_PAGE_LIST'
    ]),
    // 查询列表
    search () {
      this.formData.pageIndex = 1
      this.copyParamsFun(this.formData)
      this.getCheckList()
    },
    // 清空列表
    clear () {
      this.formData = {
        pageIndex: 1,
        pageSize: 10,
        formType: '', // 质检类型
        formCode: '', // 质检单号
        result: '', // 质检结果
        typeName: '',
        materialCode: '',
        materialName: '',
        spec: '',
        seqName: '',
        managerStuffId: '',
        startCreateTime: '',
        endCreateTime: ''
      }
      this.copyParamsFun(this.formData)
      this.getCheckList()
    },
    // 打开检验方案
    openPlan (item) {
      this.form.checkType = 1 // 鉴别全局 || 物料质检
      this.form.dialogFormVisible = true
      this.transmit.formType = item.formType // 质检类型
      this.form.materialName = `${item.materialName}物料的质检方案` // 物料名称
      this.transmit.checkFormId = item.checkFormId // 质检formId
      this.transmit.baseMaterialId = item.baseMaterialId // 物料id
    },
    closeDiaLog () {
      this.form.checkPlanId = ''
    },
    // 获取创建时间
    getTime (e) {
      [this.formData.startCreateTime, this.formData.endCreateTime] = e
    },
    // 物料质检方案
    radioChange (e) {
      if (e === 2) {
        this.queryMaterialName()
      } else {
        this.getCheckPlanId()
      }
    },
    getCheckPlanId () {
      this.transmit.checkPlanId = this.form.checkPlanId
    },
    // 获取检验单列表
    async getCheckList () {
      try {
        this.TABLE_LOADING(true)
        const { status, data } = await this.A_GET_QUALITY_CHECK_LIST(this.formData)
        if (status === 0) {
          this.total = data.total
          this.tableData = data.records
        }
        this.TABLE_LOADING(false)
      } catch (e) {
        this.TABLE_LOADING(false)
        console.log(e)
      }
    },
    // 获取全局质检方案 无分页
    async getCheckNoPageList () {
      try {
        const { status, data } = await this.A_GET_QUALITY_GLOBAL_NO_PAGE_LIST({ planName: '' })
        if (status === 0) {
          this.qualityGlobal = data
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 查询物料的质检方案名称
    async queryMaterialName () {
      try {
        const { status, data } = await this.A_GET_QUERY_MATERIAL_NAME({ baseMaterialId: this.transmit.baseMaterialId })
        if (status === 0) {
          if (!data) {
            this.transmit.checkPlanId = ''
          } else {
            this.transmit.checkPlanId = data.checkPlanId
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 进入新增设备/编辑设备
    enterPage (type) {
      this.type = type
      if (this.form.checkType === 1 && !this.form.checkPlanId) {
        this.$message.error('请选择检验方案')
        return
      }
      this.form.dialogFormVisible = false
      this.transmit.checkType = this.form.checkType
      const list = becomeString(this.transmit)
      this.$router.push({
        name: 'checkListAdd',
        query: {
          type,
          list
        }
      })
    },
    enterDetail (item) {
      this.type = 'detail'
      if (item.result === 'U') {
        this.$message.error('该质检单未完成质检，无法查看详情')
        return
      }
      if (item.formType === 'PROD') {
        this.$router.push({
          name: 'checkListProdDetail',
          query: {
            type: 'detail',
            id: item.checkFormId
          }
        })
      } else {
        const { formType, checkFormId } = item
        this.$router.push({
          name: 'checkListDetail',
          query: {
            type: 'detail',
            formType,
            checkFormId
          }
        })
      }
    },
    // 页码
    pageSizeChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageSize = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getCheckList()
    },
    currentPageChange (e) {
      this.formData = { ...this.copyParamsObj }
      this.formData.pageIndex = e
      this.copyParamsFun(this.formData)
      this.$refs.rootPlacement.scrollTop = 0
      this.getCheckList()
    }
  }
}
</script>
<style>
  .contain-company .el-table-expand {
    border-left: 4px solid #7CA870!important;
  }
  .contain-company .el-table__expanded-cell {
    padding: 0 50px!important;
  }
  .operation {
    justify-content: center;
  }
  .operation .btns {
    margin-right: 10px;
  }
  .el-radio__input.is-checked+.el-radio__label,.el-select-dropdown__item.selected {
    color: #7CA870!important;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #7CA870!important;
    border-color: #7CA870!important;
  }
  .el-select .el-input.is-focus .el-input__inner,.el-select .el-input__inner:focus {
    border-color: #7CA870!important;
  }
  .el-dialog {
    width: 461px;
  }
  .el-dialog__title {
    font-size: 14px;
  }
  .el-form-item__content {
    font-size: 16px;
  }
  .el-dialog__footer {
    padding-top: 0;
  }
  .el-dialog__body {
    padding-bottom: 10px;
  }
  .nextStep {
    background: #7CA870!important;
    color: #fff!important;
  }
  .nextStep:active {
    border-color: #7CA870;
  }
  .green {
    color: #7CA870;
  }
  .programme .el-form--inline .el-form-item__label:before {
    content: '*';
    width: 18px;
    height: 10px;
    color: #F56C6C;
    margin-right: 4px;
  }
</style>
