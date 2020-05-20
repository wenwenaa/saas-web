<template>
  <span :style="{ 'color': colors[status]}" class="status">
    <!--<i :style="{ 'background': colors[status]}"></i>-->
    {{content}}
  </span>
</template>
<script>

export default {
  name: 'tzStatus',
  props: {
    status: {
      type: String,
      default: 'DRAFT'
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      colors: {
        DRAFT: '#E9A763',
        SUBMIT: '#7CA870',
        APPROVED: '#999999',
        CLOSED: '#F56C6C',
        NONE: '#E9A763',
        PARTIAL: '#7CA870',
        FULL: '#999999',
        Y: '#7CA870',
        N: '#F56C6C',
        U: '#E9A763'
      }
    }
  }
}
</script>
<style scoped lang="less">
.status {
  i {
    display:inline-block;
    width:4px;
    height:4px;
    border-radius:50%;
    vertical-align:middle;
  }
}
</style>
