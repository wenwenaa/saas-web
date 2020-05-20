<template>
  <span :style="{ 'background-color': isEnable ? '#7CA870' : '#D2D2D2'}" class="content">
    <i :class="isEnable ? 'el-icon-check' : 'el-icon-close'"></i>
  </span>
</template>
<script>
export default {
  name: 'tzEnable',
  props: {
    isEnable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped lang="less">
.content {
  display: inline-block;
  width: 44px;
  height: 22px;
  text-align: center;
  border-radius: 16px;
  line-height: 22px;
  i {
    color: #fff;
    font-size: 16px;
    border-radius: 50%;
    margin-top: 3px;
  }
}
</style>
