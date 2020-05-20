<template>
  <el-dialog title="复用BOM" :visible="visible" width="800px" @close="close">
    <el-row :gutter="16">
      <el-col :span="12">
        <el-input
          class="search"
          clearable
          placeholder="查询母件物料名称或编号"
          @keyup.enter.native="search"
          v-model.trim="queryParam"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <el-row class="table-h" :gutter="16">
          <el-col class="text-c" :span="10">母件名称</el-col>
          <el-col class="text-c" :span="12">物料编码</el-col>
           <el-col :span="2" />
        </el-row>
        <div
          v-infinite-scroll="more"
          infinite-scroll-disabled="disabled"
          style="height: 500px;overflow-y:auto;padding: 1px 0;"
        >
          <div
            class="table-item"
            v-for="(item, i) in bomList"
            :key="item.id"
            :class="{'active':isActive === i}"
            @click="switchBom(item, i)"
          >
            <el-row style="margin: 0" :gutter="16">
              <el-col class="text-c" :span="10">
                <el-tooltip :disabled="!item.materialName || (item.materialName && item.materialName.length <= 6)" effect="dark" :content="item.materialName" placement="top">
                  <span>{{ item.materialName && item.materialName.length > 6 ? `${item.materialName.substring(0, 6)}...` : item.materialName }}</span>
                </el-tooltip>
                <!--{{item.materialName}}-->
              </el-col>
              <el-col class="text-c" :span="12">
                <span>
                  <el-tooltip :disabled="!item.materialCode || (item.materialCode && item.materialCode.length <= 6)" effect="dark" :content="item.materialCode" placement="top">
                    <span>{{ item.materialCode && item.materialCode.length > 6 ? `${item.materialCode.substring(0, 6)}...` : item.materialCode }}</span>
                  </el-tooltip>
                 <!-- {{item.materialCode}}-->
                </span>
              </el-col>
              <el-col :span="2" :class="{'code':isActive === i}"></el-col>
            </el-row>
          </div>
          <p class="text-c" v-if="bomList.length === 0 && !loading">暂无数据</p>
          <p class="text-c" v-if="loading">加载中...</p>
          <p class="text-c" v-if="noMore">没有更多了</p>
        </div>
      </el-col>
      <el-col :span="12">
        <h2 style="font-size: 16px;font-weight: 500">BOM结构</h2>
        <el-select style="margin: 16px 0" v-model.trim="baseBomVersionId" placeholder="请选择" @change="switchVer">
          <el-option
            v-for="item in versionList"
            :key="item.baseBomVersionId"
            :label="item.name"
            :value="item.baseBomVersionId">
          </el-option>
        </el-select>
        <div style="height: 520px;overflow-y:auto">
          <el-tree
            :data="bomTree"
            node-key="code"
            accordion
            ref="tree"
            icon-class="el-icon-caret-right"
            highlight-current
            default-expand-all
            :expand-on-click-node="true"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div>
                <el-tooltip :disabled="!data.materialName || (data.materialName && data.materialName.length <= 8)" effect="dark" :content="data.materialName" placement="top">
                  <span>{{ data.materialName && data.materialName.length > 8 ? `${data.materialName.substring(0, 8)}...` : data.materialName }}</span>
                </el-tooltip>
                <p>
                  <!--{{ data && data.materialCode }}-->
                  <el-tooltip :disabled="!data.materialCode || (data.materialCode && data.materialCode.length <= 8)" effect="dark" :content="data.materialCode" placement="top">
                    <span>{{ data.materialCode && data.materialCode.length > 8 ? `${data.materialCode.substring(0, 8)}...` : data.materialCode }}</span>
                  </el-tooltip>
                </p>
              </div>
              <span>{{ data && data.nodeNum }}</span>
            </span>
          </el-tree>
        </div>
        <div class="r-footer">
          <el-button round size="medium" type="primary" class="tz-staff-submit" @click="submit">确认复用</el-button>
          <!-- <el-button size="medium" type="primary" @click="submit">确认复用</el-button> -->
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    targetBomParam: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isActive: 0,
      queryParam: '',
      bomList: [],
      total: 0,
      bomTree: [],
      loading: false,
      pageIndex: 1,
      pageSize: 20,
      sourceBomParamList: [],
      versionList: [],
      baseBomVersionId: null
    }
  },
  computed: {
    noMore () {
      return this.total === this.bomList.length && this.total !== 0
    },
    disabled () {
      return this.bomList.length >= this.total || this.loading
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.pageIndex = 1
        this.bomList = []
        this.isActive = 0
        this.bomTree = []
        this.getData()
      }
    }
  },
  methods: {
    ...mapActions(['A_GET_GLOBAL_BOM_LIST', 'A_GET_BOM_VERSION_LIST_V2', 'A_GET_BOM_STRUCTURE_LIST_V2']),
    // 查询
    search () {
      this.pageIndex = 1
      this.bomList = []
      this.getData()
    },
    // 切换bom
    switchBom (item, i) {
      this.isActive = i
      this.getBomVer({ baseBomId: item.baseBomId })
    },
    async getBomTree (groupId) {
      try {
        const { baseBomId, baseBomVersionId } = this.curVerData
        const arg = { baseBomId, baseBomVersionId }
        const { status, data } = await this.A_GET_BOM_STRUCTURE_LIST_V2(arg)
        if (status === 0) {
          this.bomTree = data
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭
    close () {
      this.queryParam = ''
      this.$emit('close')
    },
    // 确认
    async submit () {
      this.$emit('submit', this.curVerData)
    },
    // 获取重复的id
    // setIds (result = []) {
    //   let temp = []
    //   result.forEach((ele) => {
    //     if (ele.children && ele.children.length > 0) {
    //       temp = [...temp, ...ele.children]
    //       this.setIds(ele.children)
    //     }
    //   })
    //   return temp
    // },
    // 切换版本
    switchVer (val) {
      const [result = {}] = this.versionList.filter(it => it.baseBomVersionId === val)
      this.curVerData = result
      this.getBomTree()
    },
    // 加载 bom
    async getData () {
      try {
        const params = {
          queryParam: this.queryParam,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        this.loading = true
        const { status, data } = await this.A_GET_GLOBAL_BOM_LIST(params)
        this.loading = false
        if (status === 0) {
          const result = data.records
          this.bomList = [...this.bomList, ...result]
          this.total = data.total
          if (result && result.length > 0) {
            this.getBomVer({ baseBomId: result[0].baseBomId })
          }
        }
      } catch (e) {
        this.loading = false
      }
    },
    // 获取版本
    async getBomVer (arg) {
      try {
        const { status, data } = await this.A_GET_BOM_VERSION_LIST_V2(arg)
        if (status === 0 && data.length > 0) {
          this.versionList = data.map(it => ({ ...it, name: `${it.versionName || '未命名'}（${it.versionNum}）` }))
          const [temp] = data
          this.baseBomVersionId = temp.baseBomVersionId
          this.curVerData = temp
          this.getBomTree()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 加载更多 bom
    async more () {
      try {
        if (this.bomList.length >= this.total) {
          return
        }
        this.pageIndex = this.pageIndex + 1
        this.getData()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
.el-tree-node__expand-icon {
  color: #409EFF
}
</style>
<style lang="less" scoped>
.search {
  margin-bottom: 16px;
}
.text-c {
  text-align: center;
  font-size: 14px;
}
.table-h {
  line-height: 50px;
  background-color: #F9F9F9;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
}
.table-item {
  padding: 12px 8px;
  margin: 0;
  font-size: 14px;
  font-family: PingFang SC;
  color: #595959;
  font-weight: 400;
  border-bottom: 1px solid #EBEEF5;
}
.code::after {
    content: "";
    display: inline-block;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: #7CA870;
}
.table-item:hover {
  box-sizing: border-box;
  background-color: #F5F7FA;
  color: #7CA870;
}
.active {
  box-sizing: border-box;
  background-color: #F5F7FA;
  border-bottom: 1px solid #EBEEF5;
  border-top: 1px solid #EBEEF5;
  margin-top: -1px;
  color: #7CA870;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.r-footer {
  width: 100%;
  text-align: right;
  padding: 16px 0 0 16px;
  border-top: 1px solid #dcdfe6;
}
</style>
<style>
.el-dialog__body {
  padding-bottom: 6px;
}
.el-tree-node__content {
  height: 100% !important;
  padding: 4px 0;
}
</style>
