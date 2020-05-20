<!--  -->
<template>
  <el-form :model="item" label-position="left" :rules="rules" ref="item" label-width="50px">
    <el-row class="lh">
      <el-col :span="3">
        <el-tooltip
          :disabled="!item.baseSeqName || (item.baseSeqName && item.baseSeqName.length <= 4)"
          effect="dark"
          :content="item.baseSeqName"
          placement="top"
        >
          <span
            :style="{color: item.seqType === 'SUPPLY' ? '#7CA870' : ''}"
            class="process-name ellipsis"
          >{{item.baseSeqName || '工序名称'}}</span>
        </el-tooltip>
      </el-col>
      <el-col :span="6">
        <el-form-item label="单价" v-if="item.seqType !== 'SUPPLY'">
          <el-input-number
            :min="0"
            v-model="item.unitPrice"
            :controls="inputNumControls"
            :max="99999999"
            :precision="6"
            placeholder="请先维护计件单价"
          />
        </el-form-item>
        <span v-else class="f16">
          委外进度：
          <span class="yellow">{{item.recallQuantity || 0}}</span>
          /{{item.planQuantity || 0}}
        </span>
      </el-col>
      <el-col class="text-left" :offset="1" :span="6">
        <span class="f16" v-if="item.seqType !== 'SUPPLY'">
          生产进度：
          <span class="yellow">{{item.currentSeqProdQuantity || 0}}</span>
          /{{item.planQuantity || 0}}
        </span>
        <span
          class="labelColor f16"
          v-if="(item.recallQuantity && item.recallQuantity !== 0)"
        >(报工：{{item.reportQuantity}}&nbsp;&nbsp;&nbsp;委外收回：{{item.recallQuantity}})</span>
      </el-col>
      <!-- <el-col class="text-r" :offset="7" :span="4">
        <el-link :underline="false" type="warning" class="r10" @click="del">删除</el-link>
      </el-col>-->
    </el-row>
    <main class="process-main">
      <section v-if="item.seqType !== 'SUPPLY'" style="padding: 0 16px">
        <el-row :gutter="8" class="table-h">
          <el-col :span="3">姓名</el-col>
          <el-col :span="3">设备名称</el-col>
          <el-col :span="2">报工数量</el-col>
          <el-col :span="5">
            良品数
            <el-dropdown @command="unitSwitch">
              <span class="green pointer ml10">
                <el-tooltip
                  :disabled="!curUnit.unitName || (curUnit.unitName && curUnit.unitName.length <= 5)"
                  effect="dark"
                  :content="curUnit.unitName"
                  placement="top"
                >
                  <span>{{curUnit.unitName && curUnit.unitName.length > 5 ? `${curUnit.unitName.substring(0, 5)}...` : curUnit.unitName}}</span>
                </el-tooltip>
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(it, i) in matUnitList"
                  :key="i"
                  :command="it.unitName"
                >{{it.unitName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="3">报废数</el-col>
          <el-col :span="2">不良品数</el-col>
          <el-col :span="3">不良原因</el-col>
          <el-col :span="2">工时</el-col>
          <el-col :span="1"></el-col>
        </el-row>
        <userItem
          ref="userItem"
          :info="item"
          v-for="(it, i) in item.prodOrderReportVoList || []"
          :key="i"
          :item="it"
          :index="i"
          :curUnit="curUnit"
          :len="item.prodOrderReportVoList.length"
          @del="delUser"
        />
        <el-row
          v-if="item.prodOrderReportVoList && item.prodOrderReportVoList.length === 0"
          class="table-noData"
        >
          <el-col :span="24">暂无数据</el-col>
        </el-row>
      </section>
      <div v-if="item.seqType !== 'SUPPLY'" class="text-center bor-top">
        <el-button type="text" class="green pointer" @click="addUser">添加员工</el-button>
      </div>
      <main class="flex-center outsource" v-if="item.seqType === 'SUPPLY'">
        <span>当前工序已委外</span>
      </main>
    </main>
  </el-form>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapState } from 'vuex'
import userItem from './userItem'

const rulesConfig = { required: true, trigger: 'change' }

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { userItem },
  props: {
    len: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default () {
        return {
          prodOrderReportVoList: []
        }
      }
    },
    processList: {
      type: Array,
      default () {
        return []
      }
    },
    omr: {
      type: Array,
      default () {
        return []
      }
    },
    prodInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    // 这里存放数据
    return {
      inputNumControls: false,
      rules: {
        baseUnitId: [{ ...rulesConfig, message: '请选择计量单位' }]
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      unitList: state => state.global.unitList,
      matUnitList: state => state.global.matUnitList
    }),
    curUnit () {
      const result = this.matUnitList.filter(
        it => it.unitName === this.item.unit
      )
      return result && result.length > 0 ? result[0] : {}
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 单位切换
    unitSwitch (name) {
      if (this.curUnit.unitName === name) {
        return
      }
      this.$set(this.item, 'unit', name)
    },
    // 提交
    submit () {
      this.item.sort = this.index + 1
      const staffResult = this.item.prodOrderReportVoList.map((it, i) => this.$refs.userItem[i].submit())
      let result = false
      this.$refs.item.validate(async (valid) => {
        result = valid
        return valid
      })
      return result && !staffResult.includes(false)
    },
    // 添加员工
    addUser () {
      const info = {}
      this.item.prodOrderReportVoList = [
        ...this.item.prodOrderReportVoList,
        info
      ]
      this.$emit('addUser')
    },
    // 删除员工
    delUser (index) {
      this.item.prodOrderReportVoList = this.item.prodOrderReportVoList.filter(
        (it, i) => i !== index
      )
      this.$emit('delUser')
    },
    // 删除工序
    del () {
      this.$emit('del', this.index)
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
.process-main {
  background-color: #f9f9f9;
  border: 1px solid #ebeef5;
}
.lh {
  line-height: 40px;
}
.bor-top {
  border-top: 1px solid #ebeef5;
}
.process-name {
  font-size: 18px;
  font-weight: 600;
  color: rgba(40, 40, 40, 1);
  display: inline-block;
  width: 120px;
}
.table-h {
  line-height: 40px;
  background-color: #f9f9f9;
  margin: 0 !important;
}
.outsource {
  height: 50px;
  border: 1px solid #ebeef5;
  background-color: #f9f9f9;
}
.table-noData {
  text-align: center;
  color: #606266;
}
</style>
