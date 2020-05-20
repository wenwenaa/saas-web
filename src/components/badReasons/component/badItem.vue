<template>
  <el-form ref="item" :model="item" :rules="rules">
    <el-row :gutter="16">
      <el-col :span="8">
        <el-form-item prop="ngType">
          <el-select v-model="item.ngType" clearable filterable placeholder="请选择不良类型" class="w100" @change="badTypeC"
            size="medium">
            <el-option v-for="item in badTypeList" :key="item.baseNgTypeId" :label="item.ngType"
              :value="item.baseNgTypeId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="ngReason">
          <el-select v-model="item.ngReason" clearable filterable placeholder="请选择不良原因" class="w100" size="medium">
            <el-option v-for="(item, index) in badCauseList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item prop="ngQuantity">
          <el-input-number class="w100" v-model="item.ngQuantity" :controls="inputNumControls" :max="99999999" :min="0"
            :precision="6" size="medium" placeholder="不良数" />
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <div v-if="list.length > 1" class="del-btn" @click="del">
          <img src="../../../assets/images/icon/del-circle.png" alt />
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  import dic from '../../../mixins/dic'

  const rulesConfig = {
    required: true,
    trigger: 'change'
  }

  export default {
    mixins: [dic],
    props: {
      // 当前循环的数据
      list: {
        type: Array,
        default () {
          return []
        }
      },
      item: {
        type: Object,
        default () {
          return {
            ngType: undefined,
            ngReason: undefined,
            ngNum: undefined
          }
        }
      },
      index: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapState({})
    },
    data () {
      const isRepeat = (rule, value, callback) => {
        const {
          list,
          item
        } = this
        const check = list.filter(it => it.baseNgTypeId === item.baseNgTypeId).filter(it => it.ngReason === value)
        if (!value || value === '') {
          callback(new Error('请选择不良原因'))
          return
        }
        if (check.length > 1) {
          callback(new Error('该类型下的不良原因已被维护'))
          return
        }
        callback()
      }
      const checkNgQuantity = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入不良数'))
        }
        if (value === 0) {
          return callback(new Error('不良数量不能为0'))
        }
        return callback()
      }
      return {
        inputNumControls: false,
        badCauseList: [],
        rules: {
          ngType: [{
            ...rulesConfig,
            message: '请选择不良类型'
          }],
          ngReason: [{
              message: '请选择不良原因',
              trigger: 'change'
            },
            {
              validator: isRepeat,
              trigger: 'change'
            }
          ],
          ngQuantity: [{
            validator: checkNgQuantity,
            trigger: 'change'
          }]
        }
      }
    },
    methods: {
      ...mapActions([]),
      submit () {
        let result = false
        this.$refs.item.validate(async (valid) => {
          result = valid
          return valid
        })
        return result
      },
      // 不良类型改变
      async badTypeC (val) {
        this.$set(this.item, 'ngReason', undefined)
        const badCauseList = this.badTypeList.filter(item => item.baseNgTypeId === val)[0].ngReasons || []
        const ngType = this.badTypeList.filter(item => item.baseNgTypeId === val)[0].ngType || []
        this.$set(this.item, 'ngType', ngType)
        this.badCauseList = badCauseList || []
      },
      // 删除
      del () {
        this.$emit('del', this.index)
      }
    }
  }

</script>
<style lang="less" scoped>
  .w100 {
    width: 100%;
  }

  .del-btn {
    width: 16px;
    height: 16px;
    line-height: 36px;
    cursor: pointer;
  }

</style>
