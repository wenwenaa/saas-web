!<!-- 报工 -->
<template>
  <div ref="mainContainer">
    <!-- 头部 -->
    <tzHeadline title="委外确认收回" isShowBack>
      <template slot="btn">
        <el-button class="tz-btn-add" round size="medium" @click="back">取消</el-button>
        <el-button class="tz-btn-add" round size="medium" :loading="btnLoading" @click="submit">保存</el-button>
      </template>
    </tzHeadline>
    <main class="main">
      <h1 class="head-title">基础信息</h1>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="d-flex">
            <span class="labelColor mr5">委外订单号:</span>
            <tzToolTip :content="detail.supplySeqCode"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <span class="labelColor mr5">委外工序:</span>
            <tzToolTip :content="detail.baseSeqName"></tzToolTip>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <span class="labelColor mr5">供应商:</span>
            <tzToolTip :content="detail.baseSupplierName"></tzToolTip>
          </div>
        </el-col>
      </el-row>
      <h1 class="head-title">委外明细</h1>
      <div v-for="(item, i) in list" :key="i" class="mt10">
        <el-row :gutter="16" class="mb10 d-flex align-items">
          <el-col :span="5">
            <div class="d-flex align-items">
              <span style="color: #333" class="font-bold f16">物料编码:</span>
              <tzToolTip class="f16 font-bold ml5" :content="item.materialCode"></tzToolTip>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="d-flex align-items">
              <span style="color: #333" class="font-bold f16">物料名称:</span>
              <tzToolTip class="f16 font-bold ml5" :content="item.materialName"></tzToolTip>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="d-flex align-items">
              <span style="color: #333" class="font-bold f16">物料规格:</span>
              <tzToolTip class="f16 font-bold ml5" :content="item.spec"></tzToolTip>
            </div>
          </el-col>
          <el-col :span="5">
            <span style="color: #333" class="font-bold f16">委外进度:</span>
            <span class="contentColor font-bold">
              <span class="f16 yellow1 font-normal ml5">{{item.totalRecallQuantity}}</span>/
              <span class="f16">{{item.totalSupplyOrderQuantity}}</span>
            </span>
          </el-col>
          <el-col :offset="2" :span="2" class="text-right">
            <el-button class="tz-search-submit" round size="medium" @click="reset(i)">重置</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="item.detailVoList || []"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
        >
          <el-table-column label="生产订单号" align="center">
            <template slot-scope="scope">
              <span
                class="yellow"
                @click="goProd(scope.row.prodOrderId)"
              >{{scope.row.prodOrderCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="委外数量" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.supplyOrderQuantity}}</span>
            </template>
          </el-table-column>
          <el-table-column label="本次收回数量" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.recallQuantity || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="良品数" align="center" class-name="required-red">
            <template slot-scope="scope">
              <el-input-number
                style="width: 100px"
                v-model.trim.number="scope.row.goodQuantity"
                :controls="false"
                :min="0"
                :max="99999999"
                size="medium"
                placeholder="数量"
                :precision="6"
                @change="() => recallQuantityRes(scope.row, i, scope.$index)"
              />
              <i class="el-icon-edit ml5"></i>
            </template>
          </el-table-column>
          <el-table-column label="报废数" align="center">
            <template slot-scope="scope">
              <el-input-number
                style="width: 100px"
                v-model.trim.number="scope.row.discardQuantity"
                :controls="false"
                :min="0"
                :max="99999999"
                size="medium"
                placeholder="数量"
                :precision="6"
                @change="() => recallQuantityRes(scope.row, i, scope.$index)"
              />
              <i class="el-icon-edit ml5"></i>
            </template>
          </el-table-column>
          <el-table-column label="不良品数" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.ngQuantity || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="不良原因" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.badName || '点击维护'" placement="top">
                <span @click="handleBad(i, scope.$index, scope.row.ngVoList)" class="green pointer">
                  {{scope.row.badName && scope.row.badName.length > 8 ? scope.row.badName.substring(0, 8) + '...' : (scope.row.badName || '点击维护')}}
                  <i
                    v-if="scope.row.badName"
                    class="el-icon-circle-close icon"
                    @click.stop.prevent="delBad(i, scope.$index, scope.row)"
                  />
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="单位" align="center" width="80">
            <template>
              <span>{{item.unitName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" class="yellow" @click="del(i, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="list && list.length === 0" class="noData">暂无数据</div>
    </main>
    <badReasons
      :defaultData="defaultData"
      :visible="badVisible"
      @cancel="cancelBad"
      @submit="selectBad"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下单据已超出工序委外参考量"
      @submit="add"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column
            property="materialName"
            label="物料名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            property="materialCode"
            label="物料编码"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapActions, mapState } from 'vuex'
import { sum } from '../../../utils/utils'

export default {
  name: 'takeBack',
  // import引入的组件需要注入到对象中才能使用
  data () {
    // 这里存放数据
    return {
      badVisible: false, // 不良添加
      tipVisible: false, // 提示校验
      orderList: [], // 提示数据
      detail: {}, // 详情数据
      list: [], // 列表
      copyList: '', // 负责初始数据
      defaultData: [], // 不良原因
      curI: 0,
      curIndex: 0
    }
  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getDetail()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      btnLoading: state => state.global.btnLoading
    })
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    ...mapActions([
      'A_GET_OUTSOURCE_PROCESS_TAKE_BACK_INIT',
      'A_GET_OUTSOURCE_PROCESS_TAKE_BACK_ADD',
      'A_GET_OUTSOURCE_PROCESS_TAKE_BACK_CHECK'
    ]),
    // 重置
    reset (i) {
      const res = this.list.map((it, subI) => {
        if (subI === i) {
          return JSON.parse(this.copyList)[i]
        }
        return it
      })
      this.list = res
    },
    //  数量改变修改收回数量
    recallQuantityRes (row, i, index) {
      const { goodQuantity, ngQuantity, discardQuantity } = row
      const temp = {
        goodQuantity,
        ngQuantity,
        discardQuantity
      }
      const sumVal = Object.values(temp)
      const sumTotal = sum(sumVal)
      this.$set(this.list[i].detailVoList[index], 'recallQuantity', sumTotal)
    },
    back () {
      this.$router.back()
    },
    goProd (id) {
      this.$router.push({
        name: 'prodDetail',
        params: { id }
      })
    },
    handleBad (i, subI) {
      this.curI = i
      this.curIndex = subI
      const ngList = this.list[i].detailVoList[subI].ngVoList
      this.defaultData = ngList && ngList.length > 0 ? ngList : [{}]
      this.badVisible = true
    },
    // 关闭选择不良
    cancelBad () {
      this.badVisible = false
    },
    // 重置提示信息
    resetTipVal () {
      this.tipVisible = false
      this.orderList = []
    },
    // 删除
    del (i, index) {
      this.list[i].detailVoList.splice(index, 1)
      this.curI = 0
      this.curIndex = 0
    },
    // 获取详情
    async getDetail () {
      try {
        const { id } = this.$route.params
        const {
          status,
          data
        } = await this.A_GET_OUTSOURCE_PROCESS_TAKE_BACK_INIT({
          supplySeqId: id
        })
        if (status === 0 && data) {
          this.detail = data || {}
          this.list =
            data.listVo.map(it => ({
              ...it,
              detailVoList: it.detailVoList.map(sub => ({
                ...sub,
                ngQuantity: 0,
                discardQuantity: undefined,
                goodQuantity: undefined,
                recallQuantity: 0
              }))
            })) || []
          this.copyList = this.list ? JSON.stringify(this.list) : ''
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 不良确认之后回调
    selectBad (val) {
      const { goodQuantity, discardQuantity } = this.list[
        this.curI
      ].detailVoList[this.curIndex]
      const badName = val
        .map(it => `${it.ngType}-${it.ngReason}-${it.ngQuantity}`)
        .join()
      const ngNumSum = sum(val, 'ngQuantity')
      const temp = {
        ngQuantity: ngNumSum,
        goodQuantity,
        discardQuantity
      }
      const recallQuantityTotal = sum(Object.values(temp))
      this.$set(
        this.list[this.curI].detailVoList[this.curIndex],
        'ngVoList',
        val
      )
      this.$set(
        this.list[this.curI].detailVoList[this.curIndex],
        'badName',
        badName
      )
      this.$set(
        this.list[this.curI].detailVoList[this.curIndex],
        'ngQuantity',
        ngNumSum
      )
      this.$set(
        this.list[this.curI].detailVoList[this.curIndex],
        'recallQuantity',
        recallQuantityTotal
      )
      this.cancelBad()
    },
    // 删除不良原因
    delBad (index, subIndex, row) {
      const { goodQuantity, discardQuantity } = row
      const temp = {
        goodQuantity,
        discardQuantity
      }
      const recallQuantityTotal = sum(Object.values(temp))
      this.$set(this.list[index].detailVoList[subIndex], 'ngVoList', [])
      this.$set(this.list[index].detailVoList[subIndex], 'badName', undefined)
      this.$set(
        this.list[index].detailVoList[subIndex],
        'ngQuantity',
        undefined
      )
      this.$set(
        this.list[index].detailVoList[subIndex],
        'recallQuantity',
        recallQuantityTotal
      )
    },
    // 提交保存
    async submit () {
      try {
        const arg = this.setParams()
        const {
          status,
          data
        } = await this.A_GET_OUTSOURCE_PROCESS_TAKE_BACK_CHECK(arg)
        if (status === 0) {
          if (data && data.length > 0) {
            this.orderList = data
            this.tipVisible = true
          } else {
            this.add()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 设置请求参数
    setParams () {
      const { list, detail } = this
      const listVo = list
        .map((it) => {
          const temp = it.detailVoList.filter(
            sub => sub.recallQuantity && sub.recallQuantity !== 0
          )
          return { ...it, detailVoList: temp }
        })
        .filter(fil => fil.detailVoList && fil.detailVoList.length > 0)
      return {
        ...detail,
        listVo
      }
    },
    // 添加收回
    async add () {
      try {
        const arg = this.setParams()
        const { status } = await this.A_GET_OUTSOURCE_PROCESS_TAKE_BACK_ADD(
          arg
        )
        if (status === 0) {
          this.resetTipVal()
           const { id } = this.$route.params
          this.$router.push({
            name: 'outsourceProcessDetail',
            params: { id },
            query: {
              type: 'takeBack'
            }
          })
          // this.$router.back()
        }
      } catch (e) {
        console.log(e)
        this.$message.error('新增失败，请稍后再试')
      }
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.yellow1 {
  color: #e9a763;
}
</style>
