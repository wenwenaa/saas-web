<!-- 发送短信验证码组件 -->
<template>
  <el-button :type="type" :size="size" :round="round" :disabled="disabled">{{ init }}</el-button>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  props: {
    start: {
      type: Boolean,
      default: false
    },
    initStr: {
      type: String,
      default: '获取验证码'
    },
    second: {
      default: 60,
      validator (val) {
        return /^\d*$/.test(val)
      }
    },
    runStr: {
      type: String,
      default: '秒后重新获取'
    },
    resetStr: {
      type: String,
      default: '重新获取'
    },
    round: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'mini'
    },
    type: {
      type: String,
      default: 'primary'
    }
  },
  data () {
    // 这里存放数据
    return {
      disabled: false,
      runSecond: this.second,
      init: this.initStr,
      timer: null,
      newSecond: this.second
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    start (val) {
      if (val) {
        this.run()
      }
    }
  },
  // 方法集合
  methods: {
    // 倒计时
    run () {
      this.disabled = true
      this.timer = setInterval(() => {
        this.newSecond -= 1
        this.init = `${this.newSecond}${this.runStr}`
        // eslint-disable-next-line no-unused-expressions
        if (this.newSecond <= 0) {
          this.timeout()
        }
      }, 1000)
    },
    // 清除倒计时
    timeout () {
      clearInterval(this.timer)
      this.disabled = false
      this.init = this.resetStr
      this.newSecond = this.second
      this.$emit('end')
    },
    // 重置所有值
    resetVal () {
      this.timeout()
      this.init = '获取验证码'
    }

  },
  beforeDestroy () {
    this.timeout()
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {}
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
