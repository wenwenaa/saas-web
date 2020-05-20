<template>
  <el-tooltip :disabled="!(content && content !== '' && content.length >= length)" :content="content" :placement="placement" :effect="effect">
    <div ref="tzToolTip" :style="{width: `${parentNodeWidth - labelWidth - 20}px`}" class="ellipsis">
      <span class="middle" :style="{color: activeColor}">{{content}}</span>
      <!--{{content && content !== '' && content.length > len ? `${content.substring(0, len)}...` :  content}}-->
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'tzToolTip',
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    effect: {
      type: String,
      default: 'dark'
    },
    len: {
      type: Number,
      default: 12
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    index: {
      type: Number,
      default: 0
    },
    activeColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      length: 0,
      parentNodeWidth: 0
    }
  },
  mounted () {
    const { tzToolTip } = this.$refs
    this.resetLen()
    this.parentNodeWidth = (tzToolTip && tzToolTip.parentNode && tzToolTip.parentNode.parentNode && tzToolTip.parentNode.parentNode.clientWidth) || 0
    window.onresize = () => {
      this.resetLen()
      this.parentNodeWidth = (tzToolTip && tzToolTip.parentNode && tzToolTip.parentNode.parentNode && tzToolTip.parentNode.parentNode.clientWidth) || 0
    }
  },
  methods: {
    resetLen () {
      const clientW = document.body.clientWidth
      if (clientW > 1280) {
        this.length = 20
      } else {
        this.length = 10
      }
    }
  }
}
</script>

<style scoped>
.middle {
  vertical-align: middle;
}
</style>
