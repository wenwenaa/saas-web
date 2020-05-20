<template>
  <section class="tz-list-events">
    <div class="flex-fill2"
         style="width: 100%">
      <slot name="content"></slot>
      <el-button round
                 size="medium"
                 class="tz-search-submit"
                 @click="search"
                 v-if="isShowBtn">查询</el-button>
      <el-button type="text"
                 size="medium"
                 class="tz-search-clear"
                 icon="el-icon-error"
                 @click="clear"
                 v-if="isShowBtn">清空</el-button>
    </div>
    <section class="tz-list-events-container"
             :style="{'max-height':  extend ? '370px' : 0}">
      <slot name="main"></slot>
    </section>
    <div class="line"
         v-if="!isShowBtn"></div>
    <div style="text-align: center">
      <el-button
        type="text"
        v-if="isShowExtend"
        @click="unfold"
        style="color: #999"
        :icon="extend ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
      >{{!extend ? '展开' : '收起'}}</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'list-search',
  props: {
    isShowExtend: {
      type: Boolean,
      default: false
    },
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      extend: false
    }
  },
  methods: {
    // 查询
    search () {
      this.$emit('search')
    },
    // 清空
    clear () {
      this.$emit('clear')
    },
    unfold () {
      this.extend = !this.extend
      this.$emit('_handleExtend', this.extend)
    }
  }
}
</script>
<style lang="less" scoped>
.tz-list-events {
  width: 100%;
  margin-bottom: 16px;

  &-container {
    width: 100%;
    max-height: 20px;
    transition: max-height 0.5s;
    overflow: hidden;
  }
  .line {
    border-top: 1px solid #ebeef5;
  }
}
</style>

