<template>
  <div>
    <div class="topHeader">
      <header class="headline">
        <section>
          <span class="title">{{title}}</span>
          <el-link
            class="back"
            :underline="false"
            v-if="isShowBack"
            icon="icon-headline-back"
            @click="back"
          >{{backText}}</el-link>
        </section>
        <section>
          <slot name="btn"></slot>
        </section>
      </header>
      <el-divider style="margin: 8px"></el-divider>
    </div>
    <div style="height: 88px;" />
  </div>
</template>
<script>
export default {
  name: 'tzHeadline',
  props: {
    // 是否显示返回按钮
    isShowBack: {
      type: Boolean,
      default: false
    },
    // 返回按钮文案
    backText: {
      type: String,
      default: '返回'
    },
    // 标题
    title: {
      type: String,
      default: '标题'
    },
    // 返回走默认返回上一级
    customBack: {
      type: Boolean,
      default: true
    }
  },
  created () {
    // console.log(this.$router)
    // console.log(this.$route)
  },
  methods: {
    // 返回
    back () {
      if (!this.customBack) {
        this.$emit('back')
        return
      }
      this.$router.back()
    }
  }
}
</script>
<style scoped lang="less">
.topHeader {
  // top: 60px;
  // right: 22px;
  // left: 206px;
  // top: 120px;
  width: calc(100% - 32px);
  z-index: 2000;
  position: absolute;
  padding-top: 10px;
  background: #fff;
  // min-width: 1120px;
}
.headline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 40px;
}
.title {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
}
.back {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0c1b30;
  vertical-align: bottom;
  margin-left: 16px;
}
.back:hover {
  color: #7ca870!important;
}
.el-divider--horizontal {
  margin: 16px 0;
  height: 2px;
}
</style>
