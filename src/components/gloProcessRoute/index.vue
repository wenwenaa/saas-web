<template>
 <div class="process">
    <el-dialog :title="title" :visible="visible" width="1100px" @close="cancel">
    <slot></slot>
    <el-radio-group style="padding: 16px 0" class="radio" v-model="processType">
      <el-radio
        v-for="(item, i) in dic.processType"
        :label="item.type"
        :value="item.type"
        :key="i"
      >{{item.name}}</el-radio>
    </el-radio-group>
    <div v-if="processType === 'Y'">
      <h1 class="head-title" style="line-height: 20px;margin-bottom: 16px">全局工艺路线</h1>
      <el-input
        class="search"
        placeholder="您可以搜索工序类型/工序代码/工序名称"
        v-model.trim="processName"
        clearable
        @keyup.enter.native="search"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
      </el-input>
      <el-table
        class="table-border"
        header-align="center"
        ref="multipleTable"
        :data="list"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        @row-dblclick="dbRowClick"
        :height="340"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="materialsTypeName" label="所属性质" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.processType | filterDic(dic.routingName)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="processName" label="工艺路线名称" align="center" />
        <el-table-column prop="display" label="工艺路线" align="center" show-overflow-tooltip />
      </el-table>
    </div>
    <div v-if="processType === 'N'">
      <h1 class="head-title" style="line-height: 20px;margin-bottom: 16px">编辑工艺路线</h1>
      <div class="main-wrap">
        <div class="l-side" style="position: relative">
           <el-input
              v-model.trim="keyword"
              maxlength="15"
              clearable
              style="position: sticky;top: 0;background: #fff;z-index:10"
              placeholder="请输入工序名称或编码"
              @keyup.enter.native="searchSeq"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchSeq"></i>
            </el-input>
          <draggable
            class="dragArea list-group"
            :list="leftList"
            :options="{group:'comp',pull:'clone',put:false,forceFallback:true}"
          >
            <div class="list-group-item" v-for="left in leftList" :key="left.id">
              <span class="mr50 d-inline-block w80">
                <el-tooltip :disabled="!left.seqName || (left.seqName && left.seqName.length <= 4)" effect="dark" :content="left.seqName" placement="top">
                  <span>{{ left.seqName && left.seqName.length > 4 ? `${left.seqName.substring(0, 4)}...` : left.seqName }}</span>
                </el-tooltip>
              </span>
              <span class="mr50 d-inline-block w80">
                <el-tooltip :disabled="!left.seqCode || (left.seqCode && left.seqCode.length <= 4)" effect="dark" :content="left.seqCode" placement="top">
                  <span>{{ left.seqCode && left.seqCode.length > 4 ? `${left.seqCode.substring(0, 4)}...` : left.seqCode }}</span>
                </el-tooltip>
              </span>
            </div>
          </draggable>
          <div class="noData" v-if="leftList && leftList.length === 0">暂无数据</div>
        </div>
        <div class="r-side">
          <div class="top-label">
            <span>序号</span>
            <span>工序类型</span>
            <span>工序编码</span>
            <span>工序名称</span>
            <span>计件单价(元)</span>
            <span>计时单价(元)</span>
            <span>操作</span>
          </div>
          <draggable
            tag="el-collapse"
            class="dragArea list-group"
            :list="rightList"
            group="comp"
            style="min-height:100%;"
          >
            <div
              class="list-group-item"
              v-for="(right, index) in rightList"
              :key="right.baseSeqId"
            >
              <span>{{index+1}}</span>
              <span>{{right.seqType | filterDic(dic.processName)}}</span>
              <span  class="label80 d-inline-block">
                <el-tooltip :disabled="!right.seqCode || (right.seqCode && right.seqCode.length <= 4)" effect="dark" :content="right.seqCode" placement="top">
                  <p>{{ right.seqCode && right.seqCode.length > 4 ? `${right.seqCode.substring(0, 4)}...` : right.seqCode }}</p>
                </el-tooltip>
              </span>
              <span class="label80 d-inline-block">
                <el-tooltip :disabled="!right.seqName || (right.seqName && right.seqName.length <= 4)" effect="dark" :content="right.seqName" placement="top">
                  <p>{{ right.seqName && right.seqName.length > 4 ? `${right.seqName.substring(0, 4)}...` : right.seqName }}</p>
                </el-tooltip>
              </span>
              <span>
                <el-input-number
                  style="width: 70px"
                  v-model="right.standardHours"
                  :controls="false"
                  :max="99999999"
                  :min="0"
                  :precision="6"
                  size="medium"
                  placeholder="数量"
                />
                <i class="el-icon-edit ml8"></i>
              </span>
              <span>
                <el-input-number
                  style="width: 70px"
                  v-model="right.unitPrice"
                  :controls="false"
                  :max="99999999"
                  :min="0"
                  :precision="6"
                  size="medium"
                  placeholder="数量"
                />
                <i class="el-icon-edit ml8"></i>
              </span>
              <span>
                <el-link :underline="false" type="warning" @click.stop.prevent="deleteBtn(index)">删除</el-link>
              </span>
            </div>
            <div class="noData" v-if="rightList && rightList.length === 0">暂无数据</div>
          </draggable>
        </div>
      </div>
    </div>
    <div slot="footer" class="d-flex justify-between">
      <el-pagination
        v-if="processType === 'Y'"
        layout="prev, pager, next"
        :total="total"
        :current-page="pageIndex"
        :page-size="pageSize"
        @current-change="currentChange"
      ></el-pagination>
      <div v-else />
      <div>
        <el-button @click="cancel" round size="medium" class="tz-staff-cancel">取 消</el-button>
        <el-button type="primary" round size="medium" class="tz-staff-submit" @click="submit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
 </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import draggable from 'vuedraggable'
import dic from '../../global/dictionary'
import { removeEmpty } from '../../utils/utils'

export default {
  components: { draggable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 工艺路线默认的工艺路线
    dafBaseProcess: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '工艺路线'
    }
  },
  computed: {
    ...mapState({
      list: state => state.global.process.list,
      total: state => state.global.process.total
    })
  },
  data () {
    return {
      dic,
      processType: 'Y',
      pageIndex: 1,
      pageSize: 10,
      row: {},
      keyword: '',
      processName: '',
      leftList: [],
      rightList: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        const defaultData = (this.dafBaseProcess && JSON.parse(this.dafBaseProcess)) || []
        this.$set(this, 'rightList', defaultData)
        this.reset()
        this.getList()
        this.getData()
      }
    }
  },
  methods: {
    ...mapActions(['A_GET_GLOBAL_PROCESS_ROUTE_LIST', 'A_GET_ROUTING_NO_LIST']),
    // 查询工序
    searchSeq () {
      this.getData()
    },
    // 查询所有工序（不分页）
    async getData (val) {
      const arg = { keyword: this.keyword }
      const { status, data } = await this.A_GET_ROUTING_NO_LIST(arg)
      if (status === 0) {
        const ids = (this.rightList && this.rightList.map(it => it.baseSeqId)) || []
        this.leftList = (data && data.filter(it => !ids.includes(it.baseSeqId))) || []
      }
    },
    // 删除工序
    deleteBtn (index) {
      this.leftList.push(this.rightList[index])
      this.rightList.splice(index, 1)
    },
    // reset 重置
    reset () {
      this.pageIndex = 1
      this.processName = ''
      this.keyword = ''
      this.processType = 'Y'
      this.row = {}
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 确认
    submit () {
      if (this.processType === 'Y') {
        if (!this.row.baseProcessId) {
          this.$message.error('请选择工艺路线')
          return
        }
        const arg = {
          processType: this.processType,
          display: this.row.processSeqDtoList.map(it => it.seqName).join('-'),
          processList: this.row.processSeqDtoList
        }
        this.$emit('submit', arg)
        return
      }
      // const check = this.rightList.filter(it => (!it.standardHours || !it.unitPrice))
      // if (check && check.length > 0) {
      //   this.$message.error('请维护计件单价或计时单价')
      //   return
      // }
      const arg = {
        processType: this.processType,
        display: this.rightList.map(it => it.seqName).join('-'),
        processList: this.rightList
      }
      this.$emit('submit', arg)
    },
    // 设置选中一行样式
    tableRowClassName ({ row }) {
      if (row.baseProcessId === this.row.baseProcessId) {
        return 'warning-row'
      }
      return ''
    },
    // 单击选中
    rowClick (row) {
      this.row = row
    },
    // 双击
    dbRowClick (row) {
      this.row = row
      this.submit()
    },
    // 设置请求值
    setParams () {
      const {
        pageIndex,
        pageSize,
        processName = ''
      } = this
      const arg = {
        pageIndex,
        pageSize,
        keyword: processName
      }
      return removeEmpty(arg)
    },
    getList () {
      const arg = this.setParams()
      this.A_GET_GLOBAL_PROCESS_ROUTE_LIST(arg)
    },
    currentChange (index) {
      this.pageIndex = index
      this.getList()
    },
    search () {
      this.pageIndex = 1
      this.getList()
    }
  }
}
</script>

<style>
.fixed-search {
 position: sticky;
 top: 0;
 background: #fff;
 z-index: 10
}
.ml8 {
  margin-left: 8px;
}
.process .el-table .warning-row td:last-child::after {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  content: "√";
  color: #7ca870;
}

.process .el-table .warning-row {
  color: #7ca870;
}
</style>
<style lang="less" scoped>
.search {
  margin: 10px 0;
}
.w80 {
  width:80px;
}
.main-wrap {
  background: #fff;
  display: flex;
}
.main-wrap .l-side {
  width: 330px;
  border: 1px solid #e8e9ec;
  box-sizing: border-box;
  height: 400px;
  max-height: 400px;
  overflow-y: auto;
}
.main-wrap .r-side {
  flex: 1;
  margin-left: 10px;
  border: 1px solid #e8e9ec;
}
.routing-title {
  width: 34%;
  display: inline-block;
  margin-left: 45px;
}
.routing-title .p1 {
  display: inline-block;
  margin-right: 10px;
}
.routing-title .p2 {
  width: 60% !important;
  display: inline-block;
}
.l-side .list-group-item {
  padding: 15px;
  border-bottom: 1px solid #e8e9ec;
  position: relative;
  color: #7ca870;
}
.l-side .list-group-item:last-child {
  border-bottom: 0;
}
.l-side .list-group-item::after {
  position: absolute;
  right: 15px;
  top: 50%;
  content: "";
  width: 10px;
  height: 10px;
  transform: translateY(-50%) rotate(-45deg);
  border-bottom: 2px solid #999;
  border-right: 2px solid #999;
}
.top-label {
  display: flex;
  background: #fafbfe;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f9f9f9;
  border-bottom: 1px solid #e8e9ec;
}
.top-label span:first-child,
.r-side .list-group-item span:first-child {
  width: 6%;
  flex: none !important;
}
.r-side {
  max-height: 400px;
  overflow-y: auto;
}
.top-label span:last-child,
.r-side .list-group-item span:last-child {
  width: 10%;
  flex: none !important;
}
.top-label span {
  flex: 1;
  width: 120px;
  border-right: 1px solid #e8e9ec;
}
.el-collapse {
  border: none;
}
.r-side .list-group-item {
  display: flex;
  border-bottom: 1px solid #e8e9ec;
  align-items: center;
  margin: 0;
  padding: 0;
}
.r-side .list-group-item .el-input {
  width: 95%;
}
.r-side .list-group-item span {
  text-align: center;
  flex: 1;
  height: 48px;
  line-height: 48px;
  width: 120px;
  border-right: 1px solid #e8e9ec;
  padding: 0 10px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;
}
.table-border {
  border: 1px solid #e8e9ec;
}
</style>
