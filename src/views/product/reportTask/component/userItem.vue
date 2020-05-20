<template>
  <el-form ref="item" :model="item" :rules="rules">
    <el-row :gutter="8" class="table-item">
      <el-col :span="3">
        <el-form-item prop="reportStuffId">
          <section class="user-add ellipsis" @click="addUser">{{item.reportStuff || '请选择员工'}}</section>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <!--prop="baseEquipmentId"-->
        <el-form-item>
          <el-select
            v-model="item.baseEquipmentId"
            clearable
            filterable
            placeholder="请选择设备"
            style="width:100%;"
          >
            <el-option
              v-for="item in equipmentList"
              :key="item.baseEquipmentId"
              :label="item.equipmentName"
              :value="item.baseEquipmentId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-input-number
            style="width: 100%"
            :value="workTotal"
            :controls="inputNumControls"
            disabled
            :min="0"
            :max="99999999"
            :precision="6"
            placeholder="报工数量"
          />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item prop="goodQuantity">
          <el-input style="width: 100%" v-model.trim="item.goodQuantity" placeholder="良品数">
            <template slot="append">
              <span
                v-if="curUnit.unitName && curUnit.type !== 'main'"
              >{{mainUnit.unitName}}={{conversionVal}}{{curUnit.unitName}}</span>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item>
          <el-input-number
            style="width: 100%"
            v-model.trim="item.discardQuantity"
            :controls="inputNumControls"
            :min="0"
            :precision="4"
            placeholder="报废数"
          />
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-input-number
            style="width: 100%"
            v-model.trim="item.ngQuantity"
            :controls="inputNumControls"
            :min="0"
            :precision="4"
            disabled
            placeholder="不良品数"
          />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item>
          <section class="user-add ellipsis" @click="addBad">
            {{item.bad || '请选择不良原因'}}
            <i
              v-if="item.bad"
              class="el-icon-circle-close icon"
              @click.stop.prevent="delBad"
            />
          </section>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-input-number
            style="width: 100%"
            v-model="item.workHours"
            :controls="inputNumControls"
            :min="0"
            placeholder="工时"
          />
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <el-link :underline="false" type="warning" @click="del">删除</el-link>
      </el-col>
    </el-row>
    <tz-staff :accountFlag="false" dialogTitle="选择报工人员" :dialogVisible="visible" @submit="selectStaff" @cancle="cancel" />
    <badReasons
      :defaultData="defaultData"
      :visible="badVisible"
      @cancel="cancelBad"
      @submit="selectBad"
    />
  </el-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import dic from '../../../../mixins/dic'
import { sum } from '../../../../utils/utils'
import { checkNum } from '../../../../utils/validator'

const rulesConfig = { required: true, trigger: ['blur', 'change'] }

export default {
  mixins: [dic],
  props: {
    curUnit: {
      type: Object,
      default () {
        return {}
      }
    },
    len: {
      type: Number,
      default: 0
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    remain: {
      type: Number,
      default: 100
    }
  },
  created () {},
  computed: {
    ...mapState({
      matUnitList: state => state.global.matUnitList
    }),
    workTotal () {
      const { goodQuantity, ngQuantity, discardQuantity } = this.item
      const temp = {
        goodQuantity,
        ngQuantity,
        discardQuantity
      }
      const sumVal = Object.values(temp)
        .filter(i => i)
        .reduce((prev, cur) => Number(prev) + Number(cur), 0)
      return sumVal === 0 ? undefined : sumVal
    },
    defaultData () {
      const { prodOrderReportNgVos } = this.item
      return prodOrderReportNgVos && prodOrderReportNgVos.length > 0
        ? prodOrderReportNgVos
        : [{}]
    },
    mainUnit () {
      const result = this.matUnitList.filter(it => it.type === 'main')
      return result && result.length > 0 ? result[0] : {}
    },
    conversionVal () {
      const { goodQuantity } = this.item
      return goodQuantity ? goodQuantity * this.curUnit.exchangeRate : 0
    }
  },
  watch: {},
  data () {
    const checkStuffId = (rule, value, callback) => {
      const { reportStuffId } = this.item
      if (!reportStuffId || reportStuffId === '') {
        callback(new Error('请选择员工'))
      } else {
        callback()
      }
    }
    return {
      visible: false, // 员工选择  显示隐藏
      badVisible: false, // 不良原因 显示隐藏
      inputNumControls: false,
      rules: {
        item: {},
        reportStuffId: [
          { trigger: ['blur', 'change'], message: '请选择员工' },
          { validator: checkStuffId }
        ],
        /* baseEquipmentId: [{ ...rulesConfig, message: '请选择设备' }],*/
        goodQuantity: [
          { ...rulesConfig, message: '请输入良品数' },
          { validator: checkNum }
        ]
      }
    }
  },
  methods: {
    ...mapActions([]),
    // 提交
    submit () {
      let result = false
      this.$refs.item.validate(async (valid) => {
        result = valid
        return valid
      })
      return result
    },
    // 打开选择员工
    addUser () {
      this.visible = true
    },
    // 关闭选择员工
    cancel () {
      this.visible = false
    },
    // 员工确认之后回调
    selectStaff (val) {
      this.item.reportStuffId = val.id ? `${val.id}` : ''
      this.item.reportStuff = val.realname
      if (!val.id) {
        this.clearValidate('item')
      }
      this.cancel()
    },
    clearValidate () {
      this.$refs.item.clearValidate()
    },
    // 打开选择不良
    addBad () {
      this.badVisible = true
    },
    // 关闭选择不良
    cancelBad () {
      this.badVisible = false
    },
    // 不良确认之后回调
    selectBad (val) {
      const badName = val
        .map(it => `${it.ngType}-${it.ngReason}-${it.ngQuantity}`)
        .join()
      this.item.prodOrderReportNgVos = val
      this.item.bad = badName
      const ngNumSum = sum(val, 'ngQuantity')
      this.$set(this.item, 'ngQuantity', ngNumSum)
      this.cancelBad()
    },
    // 删除不良原因
    delBad () {
      this.item.prodOrderReportNgVos = []
      this.item.bad = ''
      this.$set(this.item, 'ngQuantity', undefined)
    },
    // 删除
    del () {
      this.$emit('del', this.index)
    }
  }
}
</script>
<style lang="less" scoped>
.table-item {
  margin: 8px 0;
  // text-align: center;
  line-height: 40px;
}
.user-add {
  width: 100%;
  color: #7ca870;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  position: relative;
}
.user-add:hover .icon {
  display: inline-block;
}
.icon {
  margin-left: -4px;
  line-height: 40px;
  position: absolute;
  right: 4px;
  z-index: 100;
  display: none;
}
</style>
