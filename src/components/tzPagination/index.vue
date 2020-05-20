<template>
  <div class="tz-pagination bg-white text-right left-bottom">
    <div>
      <slot></slot>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      :layout="layout"
    />
  </div>
</template>
<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data () {
    return {}
  },
  watch: {
    total (val) {
      if (this.currentPage !== 1 && (val % this.pageSize) === 0) {
        this.handleCurrentChange(this.currentPage - 1)
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('_pageSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('_currentPageChange', val)
    }
  }
}
</script>

<style lang="less" scoped>
.tz-pagination {
  padding: 8px 16px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 1058px;
}
.left-bottom {
  // left: 192px;
  // width: calc(100% - 192px);
  position: absolute;
}
</style>

