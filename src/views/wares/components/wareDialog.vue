<template>
  <div class="ware-dialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="765px"
      :before-close="handleClose"
    >
      <div class="m-list">
        <div class="d-flex m-item">
          <div class="label80 flex-shrink-0">物料编码：</div>
          <tzToolTip :content="material.materialCode"></tzToolTip>
        </div>
        <div class="d-flex m-item">
          <div class="label80 flex-shrink-0">物料名称：</div>
          <tzToolTip :content="material.materialName"></tzToolTip>
        </div>
        <div class="d-flex m-item">
          <div class="label80 flex-shrink-0">物料规格：</div>
          <tzToolTip :content="material.spec"></tzToolTip>
        </div>
        <div class="d-flex m-item">
          <div class="label80 flex-shrink-0">物料图号：</div>
          <tzToolTip :content="material.picNum"></tzToolTip>
        </div>
      </div>
      <div v-if="checkList">
        <span class="check-head">质检结果</span>
        <span class="check-res">{{checkList.result|filterDic(dic.qualityResult,'type','name')}}</span>
      </div>
      <el-row class="mt20" v-if="checkList">
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor">检验数量：</div>
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              v-if="checkList.goodQuantity+checkList.ngQuantity"
            >
              <div slot="content">{{checkList.goodQuantity+checkList.ngQuantity}}</div>
              <div class="label100 ellipsis">{{checkList.goodQuantity+checkList.ngQuantity}}</div>
            </el-tooltip>
            <div v-else>0</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor">良品数：</div>
            <el-tooltip class="item" effect="dark" placement="top" v-if="checkList.goodQuantity">
              <div slot="content">{{checkList.goodQuantity}}</div>
              <div class="label100 ellipsis">{{checkList.goodQuantity}}</div>
            </el-tooltip>
            <div v-else>0</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor">不良品数：</div>
            <el-tooltip class="item" effect="dark" placement="top" v-if="checkList.ngQuantity">
              <div slot="content">{{checkList.ngQuantity}}</div>
              <div class="label100 ellipsis">{{checkList.ngQuantity}}</div>
            </el-tooltip>
            <div v-else>0</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="d-flex">
            <div class="labelColor flex-shrink-0" style="width:70px;">检验良率：</div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="checkList.goodQuantityRate"
              placement="top"
              v-if="checkList.goodQuantityRate"
            >
              <div class="label100 ellipsis">{{checkList.goodQuantityRate}}</div>
            </el-tooltip>
            <div v-else>0</div>
          </div>
        </el-col>
      </el-row>
      <div v-if="checkList&&checkList.checkFormNgList">
        <el-row v-for="(item,index) in checkList.checkFormNgList" :key="index" class="mt10">
          <el-col :span="6">
            <div class="d-flex">
              <div class="labelColor">不良类型：</div>
              <el-tooltip class="item" effect="dark" :content="item.ngType" placement="top">
                <div class="label100 ellipsis">{{item.ngType}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="d-flex">
              <div class="labelColor">不良原因：</div>
              <el-tooltip class="item" effect="dark" :content="item.ngReason" placement="top">
                <div class="label100 ellipsis">{{item.ngReason}}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="d-flex">
              <div class="labelColor">不良数：</div>
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">{{item.ngQuantity}}</div>
                <div class="label100 ellipsis">{{item.ngQuantity}}</div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="d-flex sug" v-if="checkList">
        <div class="sug-item">备注：</div>
        <div class="sug-content">{{checkList.remark}}</div>
      </div>
      <div class="d-flex" style="margin-top:20px;width:300px;" v-if="dialogTitle==='入库'">
        <div class="sug-item" style="line-height:40px;">入库仓库:</div>
        <el-select v-model="warehouseId" placeholder="请选择">
          <el-option
            v-for="item in houseList"
            :key="item.baseWarehouseId"
            :label="item.warehouseName"
            :value="item.baseWarehouseId"
          ></el-option>
        </el-select>
      </div>
      <div class="order">
        <el-table
          :data="orderDetail"
          style="width: 100%;margin-top:20px;"
          :header-cell-style="{'background-color': '#F9F9F9'}"
          border
        >
          <el-table-column
            :label="(material.outType||material.inType) | filterDic(dic.tipStatus,'type','name')"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              <div
                v-if="dialogTitle==='入库'"
              >{{material.inType==="OTHER_IN"?scope.row.inCode:scope.row.refCode}}</div>
              <div
                v-if="dialogTitle==='出库'"
              >{{material.outType==="OTHER_OUT"?scope.row.outCode:scope.row.refCode}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="dialogTitle==='入库'?'入库数量':'出库数量'" align="center">
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;justify-content:center;">
                <el-input-number
                  v-model="scope.row.quantity"
                  :controls="controls"
                  placeholder="请输入数量"
                  :min="min"
                  :precision="6"
                  :max="scope.row.maxQuantity"
                ></el-input-number>
                <i class="el-icon-edit"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button @click="handleClose" round size="medium" class="tz-staff-cancel">取 消</el-button>
          <el-button
            type="primary"
            round
            size="medium"
            class="tz-staff-submit"
            @click="dialogSubmit"
          >确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mix from '../../../mixins/dic'
import dic from '../../../global/dictionary'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '出库'
    },
    placeholder: {
      type: String,
      default: '请输入出库数量'
    },
    material: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [mix],
  data () {
    return {
      dic,
      min: 0,
      amount: '',
      warehouseId: '',
      controls: false,
      orderDetail: [],
      detail: [],
      checkList: []
    }
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.handleClose()
      }
      if (val) {
        this.warehouseId = this.material.defaultWarehouseId
        this.getDetail()
      }
    }
  },
  created () {},
  methods: {
    ...mapActions([
      'A_GET_WARE_MATERIAL_DETAIL',
      'A_GET_WARE_MATERIAL_IN',
      'A_GET_WARE_OUT_MATERIAL_DETAIL',
      'A_GET_WARE_MATERIAL_OUT'
    ]),
    handleClose (done) {
      this.$emit('cancle')
    },
    async dialogSubmit () {
      let params = {}
      if (this.dialogTitle === '出库') {
        this.warehouseId = this.material.baseWarehouseId
      }
      if (
        this.material.inType === 'OTHER_IN' ||
        this.material.outType === 'OTHER_OUT'
      ) {
        params = {
          stockInOutMaterialId:
            this.material.stockInMaterialId || this.material.stockOutMaterialId,
          warehouseId: this.warehouseId ? this.warehouseId : '',
          quantity: this.orderDetail[0].quantity
        }
        if (!params.quantity) {
          this.$message.warning(`${this.dialogTitle}数量不能为空`)
          return
        }
      } else {
        params = {
          stockInOutMaterialId:
            this.material.stockInMaterialId || this.material.stockOutMaterialId,
          warehouseId: this.warehouseId ? this.warehouseId : '',
          materialList: this.orderDetail.map(item => ({
            refMaterialId: item.refMaterialId,
            refCode: item.refCode,
            quantity: item.quantity,
            baseMaterialId: item.baseMaterialId
          }))
        }
        if (!params.materialList.every(item => item.quantity)) {
          this.$message.warning(`${this.dialogTitle}数量不能为空`)
          return
        }
      }
      if (this.dialogTitle === '入库') {
        const { status } = await this.A_GET_WARE_MATERIAL_IN(params)
        if (status === 0) {
          this.$emit('submit')
        }
      } else {
        const { status } = await this.A_GET_WARE_MATERIAL_OUT(params)
        if (status === 0) {
          this.$emit('submit')
        }
      }
    },
    async getDetail () {
      let params = {}
      if (this.dialogTitle === '入库') {
        params = {
          inType: this.material.inType,
          stockInId: this.material.stockInId,
          stockInMaterialId: this.material.stockInMaterialId
        }
        const { status, data } = await this.A_GET_WARE_MATERIAL_DETAIL(params)
        if (status === 0) {
          this.orderDetail = data.stockInOutMaterialVos.map(item => ({
            ...item,
            maxQuantity: item.quantity
          }))
          this.checkList = data.checkMaterialList
            ? data.checkMaterialList[0]
            : null
        }
      } else {
        params = {
          outType: this.material.outType,
          stockOutId: this.material.stockOutId,
          stockOutMaterialId: this.material.stockOutMaterialId
        }
        const { status, data } = await this.A_GET_WARE_OUT_MATERIAL_DETAIL(
          params
        )
        if (status === 0) {
          this.orderDetail = data.stockInOutMaterialVos.map(item => ({
            ...item,
            maxQuantity: item.quantity
          }))
          this.checkList = data.checkMaterialList
            ? data.checkMaterialList[0]
            : null
        }
      }
    }
  }
}
</script>
<style>
.ware-dialog .order .el-input__inner {
  border: none;
  text-align: center !important;
}
</style>
<style lang="scss" scoped>
.m-list {
  display: flex;
  flex-wrap: wrap;
}

.m-item {
  width: 204px;
  margin-bottom: 20px;
  color: #444444;
  margin-right: 20px;
  line-height: 16px;
}

.m-item-title {
  width: 70px;
}

.m-item-content {
  width: 134px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.check-head {
  font-size: 18px;
  color: #282828;
  font-weight: 600;
  margin-right: 20px;
}

.check-res {
  font-size: 18px;
  color: #7ca870;
  font-weight: 600;
}

.r-item {
  margin-right: 40px;
  margin-top: 20px;
  color: #999999;
  font-size: 14px;
}

.error-type {
  margin-right: 74px;
}

.error-reason {
  margin-top: 20px;
}

.error-res {
  margin-right: 20px;
}

.error-reason {
  color: #999999;
  font-size: 14px;
  line-height: 16px;
}

.error-item {
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.bol {
  color: #444444;
}

.type-content {
  width: 120px;
  line-height: 18px;
}

.res-content {
  width: 120px;
}

.sug {
  color: #282828;
  font-size: 14px;
  margin-top: 20px;
}

.sug-item {
  width: 80px;
  color: #999999;
}
</style>>
