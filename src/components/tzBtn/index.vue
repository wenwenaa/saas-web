<template>
  <el-button
    :class="`button-default ${cls}`"
    type="text"
    :icon="`tz-button-icon ${icon}`"
    size="medium"
    @click="$emit('click')"
  >
    <slot></slot>
  </el-button>
</template>
<script>
export default {
  name: 'tzBtn',
  props: {
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 自定义样式
    cls: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
.button-default {
  padding: 0 10px;
  color: #282828;
}
.button-default:hover {
  color: #282828;
  opacity: 0.8;
}
</style>
