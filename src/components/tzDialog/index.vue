<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :before-close="dialogClose"
    :type="dialogSingle"
    custom-class="dialog-box">
    <slot name="single"></slot>
    <slot name="multiple"></slot>
    <div slot="footer"
         class="dialog-footer">
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'tzDialog',
  props: {
    dialogTitle: {
      type: String,
      default: '自定义'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '30%'
    },
    dialogSingle: {
      type: String,
      default: 'single'
    }
  },
  methods: {
    dialogClose () {
      this.$emit('dialogClose')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .dialog-box .el-dialog__title {
  font-size: 14px;
}
</style>
