<template>
  <div>
    <el-dialog  :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <div class="success-head">
        <i class="el-icon-warning" style="color:#F9D65D;font-size:24px;"></i>
        <span class="tip">温馨提示</span>
      </div>
      <div class="tip-title" v-if="tipType==='入库'&&type==='SALE'">您提交的订单中，以下单据已超出实际可退数量</div>
      <div class="tip-title" v-if="tipType==='入库'&&type!=='SALE'">您提交的订单中，以下单据已超出实际所需入库数量</div>
      <div class="tip-title" v-if="tipType==='发货'">您提交的订单中，以下单据已超出实际所需发货量</div>
      <div class="tip-title" v-if="tipType==='库存'">您提交的订单中，以下物料库存不足</div>
      <el-table :data="tipData" style="width: 100%" :header-cell-style="{'background-color': '#F9F9F9'}" border>
        <el-table-column prop="materialName" label="物料名称"  align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="refCode" :label="type |filterDic(dic.tipStatus,'type','name')" v-if="tipType==='发货'||tipType==='入库'">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div class="tip-footer">
          <el-button type="primary" round size="medium" class="tz-staff-submit" @click="handleClose" v-if="tipType==='库存'||tipType==='入库'&&type==='SALE'">知道了</el-button>
          <el-button @click="handleClose" round size="medium" class="tz-staff-cancel" v-if="tipType==='发货'||tipType==='入库'&&type!=='SALE'">取 消</el-button>
          <el-button type="primary" round size="medium" class="tz-staff-submit" @click="dialogSubmit" v-if="tipType==='发货'||tipType==='入库'&&type!=='SALE'">继续提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dic from '../../../global/dictionary'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tipData: {
      type: Array,
      default: () => []
    },
    tipType: {
      type: String,
      default: '发货'
    },
    type: {
      type: String,
      default: 'SALE'
    }
  },
  data () {
    return {
      dic
    }
  },
  methods: {
    handleClose () {
      this.$emit('cancle')
    },
    dialogSubmit (v) {
      this.$emit('dialogSubmit', v)
    }
  }
}

</script>

<style lang="scss" scoped>
  .success-head{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .tip{
    color:#282828;
    font-size:18px;
    font-weight: bold;
    margin-left:10px;
    line-height: 24px;
  }
  .tip-title{
    color:#444444;
    text-align: center;
    font-size:14px;
    margin-bottom: 20px;
  }
  .tip-footer{
    text-align: center;
  }
</style>>

