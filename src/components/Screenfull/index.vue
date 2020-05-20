<template>
  <div>
    <div class="base-screen" :class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click">
      <span v-if='isFullscreen'>取消全屏</span>
      <span v-else>全屏显示</span>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data () {
    return {
      isFullscreen: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    click () {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      return true
    },
    init () {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style scoped>
.base-screen{
  padding-left: 30px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
}
.fullscreen{
  background: url('../../assets/images/icon/fullscreen.png') no-repeat;
  background-size: auto 100%;
}
.exit-fullscreen{
  background: url('../../assets/images/icon/exit-fullscreen.png') no-repeat;
  background-size: auto 100%;
}
</style>
