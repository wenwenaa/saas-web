<template>
  <section class="tz-list-events">
    <section class="flex-center">
      <div class="flex-fill2">
        <slot name="btns"></slot>
      </div>
      <div class="text-right" style="width:400px; ">
        <el-input
          size="small"
          style="width:280px; margin-right:10px;"
          :placeholder="placeholder"
          suffix-icon="el-icon-search"
          v-model.trim="keyWords"
          @keyup.enter.native="handleSearch"
        />
        <el-button size="small" type="tz-outline" @click="extend = !extend" style="width: 97px;">
          {{!extend ? '高级搜索' : '收&nbsp;&nbsp;&nbsp;起'}}
          <i
            class="tz-button-icon d-arrow-down"
            :class="{'d-arrow-up': extend}"
          ></i>
        </el-button>
      </div>
    </section>
    <section
      class="tz-list-events-container bg-light-gray"
      :style="{'max-height':  extend ? '300px' : 0}"
    >
      <slot name="main"></slot>
    </section>
  </section>
</template>

<script>
export default {
  name: 'list-events',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索关键字'
    }
  },
  data () {
    return {
      extend: false,
      keyWords: ''
    }
  },
  methods: {
    handleSearch () {
      this.$emit('_handleSearch', this.keyWords)
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
    transition: max-height 0.8s;
    overflow: hidden;
  }
}
</style>

