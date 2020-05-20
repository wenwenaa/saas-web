!<!-- 报工 -->
<template>
  <div ref="mainContainer">
    <!-- 头部 -->
    <tzHeadline title="新增报工" isShowBack :customBack="false" @back="back" backText="返回生产订单详情">
      <template slot="btn">
        <el-button
          v-show="isShowBtn"
          class="tz-btn-add"
          round
          size="medium"
          :loading="btnLoading"
          @click="submit"
        >保存</el-button>
      </template>
    </tzHeadline>
    <main class="content">
      <h1 class="headTitle font-bold">基础数据</h1>
      <el-row>
        <el-col :span="6" style="line-height:30px">
          <div class="d-flex">
            <span class="labelColor d-inline-block label80 flex-shrink-0">生产订单号:</span>
            <tzToolTip :content="detail.prodOrderCode"></tzToolTip>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="d-flex">
            <span class="labelColor d-inline-block label80 flex-shrink-0">物料编码:</span>
            <tzToolTip :content="detail.materialCode"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <span class="labelColor d-inline-block label80 flex-shrink-0">物料名称:</span>
            <tzToolTip :content="detail.materialName"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <span class="labelColor d-inline-block label80 flex-shrink-0">物料规格:</span>
            <tzToolTip :content="detail.spec"></tzToolTip>
          </div>
        </el-col>
      </el-row>
      <h1 class="headTitle font-bold mt10">报工工序</h1>
      <div v-if="list.length > 0">
        <processItem
          ref="processItem"
          class="inner mt10"
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          :prodInfo="detail"
          @del="delProcess"
          @addUser="reset"
          @delUser="reset"
        />
      </div>
      <div v-else class="noData">暂无工序</div>
      <!-- <el-dropdown @command="addProcess">
        <el-button round size="medium" class="tz-search-submit">
          添加报工
          <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(it, i) in processList"
            :key="i"
            :command="it.baseSeqId"
            :disabled="SeqIds.includes(it.baseSeqId)"
          >{{it.seqName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </main>
    <nav class="quickNav" v-if="navList.length > 0">
      <div
        class="nav-item"
        v-for="(item, index) in navList"
        :key="index"
        @click="floorJump(item.seqId)"
      >
        <span>
          <i class="nav-icon round" v-if="curIndex === index" />
          <i class="nav-icon" v-else />
          <span
            :style="{color: curIndex === index ? '#1989FA' : ''}"
            :class="{'green1':item.seqType === 'SUPPLY'}"
          >{{item.seqName && item.seqName.length > 4 ? `${item.seqName.substring(0, 4)}...` : item.seqName}}</span>
        </span>
      </div>
    </nav>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapActions, mapState } from 'vuex'
import processItem from './component/processItem'

export default {
  name: 'reportTask',
  // import引入的组件需要注入到对象中才能使用
  components: { processItem },
  data () {
    // 这里存放数据
    return {
      scrollDom: null,
      visible: false,
      detail: [],
      navList: [],
      /* processList: [], */
      list: [],
      curIndex: 0,
      inner: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    }),
    isShowBtn () {
      return this.navList.map(it => it.seqType).includes('SELF')
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    ...mapActions([
      'A_GET_REPORT_TASK_INIT',
      'A_GET_PROD_ADD_REPORT_TASK',
      'A_GET_GLOBAL_MAT_UNIT_LIST'
    ]),
    reset () {
      const list = document.getElementsByClassName('inner')
      const arrHeights = []
      for (let i = 0; i < list.length; i += 1) {
        arrHeights.push(list[i].offsetTop - 180)
      }
      this.inner = arrHeights
    },
    initScrollDom () {
      this.scrollDom = this.$refs.mainContainer.parentNode
      this.initEvent(this.scrollDom)
    },
    initEvent (dom) {
      dom.addEventListener('scroll', this.scrollHander)
    },
    scrollHander () {
      const top = this.scrollDom.scrollTop
      const { inner } = this
      this.inner.forEach((item, index) => {
        if (top >= inner[index] && top < inner[index + 1]) {
          this.curIndex = index
        }
      })
    },
    // 返回
    back () {
      const { id } = this.$route.params
      this.$router.push({
        name: 'prodDetail',
        params: { id }
      })
    },
    // 楼层跳转
    floorJump (seqId) {
      /**/
      let index = null
      this.navList.forEach((it, i) => {
        if (it.seqId === seqId) {
          index = i
        }
      })
      this.curIndex = index
      this.$refs.mainContainer.parentNode.scrollTop = this.inner[index]
    },
    // 添加报工
    /* addProcess (id) {
      this.list.push(this.processList.filter(it => it.baseSeqId === id)[0])
    },*/
    // 获取详情
    async getDetail () {
      try {
        const { id } = this.$route.params
        const { status, data } = await this.A_GET_REPORT_TASK_INIT({
          prodOrderId: id
        })
        if (status === 0) {
          this.detail = data
          this.list =
            (data.prodOrderSeqVoList &&
              data.prodOrderSeqVoList.map(it => ({
                ...it,
                prodOrderReportVoList: []
              }))) ||
            []
          this.navList =
            (data.prodOrderSeqVoList &&
              data.prodOrderSeqVoList.map(it => ({
                seqName: it.baseSeqName,
                seqId: it.baseSeqId,
                seqType: it.seqType
              }))) ||
            []
          this.getUnitList()
          this.$nextTick(() => {
            // 获取所有的楼层
            this.reset()
            this.initScrollDom()
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除工序
    delProcess (index) {
      this.list.splice(index, 1)
    },
    // 获取主副计量单位比值
    async getUnitList () {
      const { detail } = this
      if (detail.baseMaterialId) {
        const arg = { id: detail.baseMaterialId }
        const { status, data } = await this.A_GET_GLOBAL_MAT_UNIT_LIST(arg)
        if (status === 0 && data && data.length > 0) {
          this.list.forEach((it) => {
            this.$set(it, 'unit', data[0].unitName)
          })
        }
      }
    },
    // 提交保存
    submit () {
      const { list } = this
      if (list && list.length === 0) {
        this.$message.error('请维护报工工序')
        return
      }
      const proResult = list.map((it, i) => this.$refs.processItem[i].submit())
      if (proResult.includes(false)) return
      this.add()
    },
    // 设置请求参数
    setParams () {
      const { list, detail } = this
      const prodOrderSeqVoList = list.filter(
        it => it.prodOrderReportVoList.length > 0
      )
      return {
        ...detail,
        prodOrderSeqVoList
      }
    },
    // 添加报工
    add () {
      const arg = this.setParams()
      this.A_GET_PROD_ADD_REPORT_TASK(arg)
    }
  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getDetail()
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.content {
  overflow-y: auto;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -moz-scrollbar-track-color: transparent;
}
.main::-webkit-scrollbar {
  display: none;
}
.quickNav {
  width: 120px;
  position: fixed;
  right: 20px;
  top: 300px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  max-height: 460px;
  overflow-y: auto;
}
.quickNav::-webkit-scrollbar {
  display: none;
}
.nav-item {
  padding: 8px;
  cursor: pointer;
  .green1 {
    color: #7ca870;
  }
}
.nav-icon {
  box-sizing: border-box;
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
}
.round {
  border: 2px solid #1989fa;
  border-radius: 50%;
}
</style>
