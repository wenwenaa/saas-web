<template>
  <div>
    <el-dialog :visible.sync="visible" width="600px" :before-close="handleClose" :show-close="showClose">
      <div class="success-head">
        <i class="el-icon-warning" style="color:#F9D65D;font-size:24px;"></i>
        <span class="tip">温馨提示</span>
      </div>
      <div class="tip-title">
        <p>{{content}}</p>
        <slot name="tipTitle"></slot>
      </div>
      <div class="tip-table">
        <slot name="tipTable"></slot>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="tip-footer">
          <slot name="btnList" v-if="singleBtn">
            <el-button type="primary" round size="medium" class="tz-staff-submit" @click="handleClose">知道了</el-button>
          </slot>
          <slot name="btnList" v-else>
            <el-button @click="handleClose" round size="medium" class="tz-staff-cancel">取 消</el-button>
            <el-button type="primary" round size="medium" class="tz-staff-submit" @click="dialogSubmit">{{submitText}}</el-button>
          </slot>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    singleBtn: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    submitText: {
      type: String,
      default: '继续提交'
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    dialogSubmit () {
      this.$emit('submit')
    }
  }
}

</script>

<style lang="scss" scoped>
  .success-head {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .tip {
    color: #282828;
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
    line-height: 24px;
  }

  .tip-title {
    color: #444444;
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .tip-footer {
    text-align: center;
  }

</style>>
