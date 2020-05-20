!<!-- 编辑工艺路线  -->
<template>
  <el-dialog :title="title" :visible="visible" width="1100px" @close="cancel">
     <badItem
        ref="causeItem"
        :list="reportNgList"
        v-for="(item, i) in reportNgList"
        :key="i"
        :item="item"
        :index="i"
        @del="del"
      />
    <div>
        <el-button type="text" class="text-color" @click="addBad">添加不良原因</el-button>
    </div>
    <div slot="footer">
      <el-button round size="medium" class="tz-staff-cancel" @click="cancel">取 消</el-button>
      <el-button type="primary" round size="medium" class="tz-staff-submit" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import badItem from './component/badItem'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { badItem },
  props: {
    // 控制显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // modal title
    title: {
      type: String,
      default: '维护不良原因'
    },
    // 检验不良总数的和
    checkBadNum: {
      type: Number,
      default: 0
    },
    // 默认不良数据
    defaultData: {
      type: Array,
      default () {
        return [{}]
      }
    }
  },
  data () {
    // 这里存放数据
    return {
      reportNgList: [{}]
    }
  },
  // 监听属性 类似于data概念
  computed: {
  },
  // 监控data中的数据变化
  watch: {
    visible (val) {
      if (val) {
        this.reportNgList = [...this.defaultData]
      }
    }
  },
  // 方法集合
  methods: {
    sum () {
      const sum = this.reportNgList
        .map(item => item.ngNum)
        .filter(i => i)
        .reduce((prev, cur) => prev + cur, 0)
      return sum
    },
    // 添加不良
    addBad () {
      this.reportNgList.push({})
    },
    // 删除不良
    del (index) {
      this.reportNgList.splice(index, 1)
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 确认
    submit () {
      // if (this.checkBadNum - this.sum() > 0) {
      //   this.$message.error('维护的不良数量与实际的不良不符')
      //   return
      // }
      const result = this.reportNgList.map((it, i) => this.$refs.causeItem[i].submit('form'))
      if (result.includes(false)) {
        return
      }
      this.$emit('submit', this.reportNgList)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {}
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.text-color {
    color: #7CA870;
    margin: 0 50%;
    transform: translate(-50%);
    line-height: 10px;
}
.text-color:hover {
    color: #7CA870;
    opacity: 0.8;
}

</style>
