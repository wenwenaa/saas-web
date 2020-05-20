<template>
  <div class="addPage">
    <tzHeadline :title="title" isShowBack :customBack="false" @back="goBack">
      <template slot="btn">
        <div v-if="routeParame.type!='detail'">
          <el-button
            round
            size="medium"
            class="tz-search-submit tz-btn-add"
            @click="submitForm('ruleForm','none')"
            :loading="status==='none'&&modalLoading"
          >保存</el-button>
          <el-button
            round
            size="medium"
            class="tz-search-submit tz-btn-add"
            @click="submitForm('ruleForm','auditor')"
            v-if="routeParame.type!='edit'"
            :loading="status==='auditor'&&modalLoading"
          >保存并送审</el-button>
        </div>
        <div v-else>
          <div v-if="detailObj.status === 'DRAFT'">
            <el-button
              round
              size="medium"
              class="tz-btn-add"
              @click="editBtn(routeParame.type,routeParame.page)"
            >编辑</el-button>
            <el-button
              round
              size="medium"
              class="tz-search-submit tz-btn-add"
              @click="approveBtn(detailObj)"
            >送审</el-button>
          </div>
        </div>
      </template>
    </tzHeadline>
    <el-form
      label-position="top"
      ref="ruleForm"
      label-width="80px"
      :rules="rules"
      :inline="true"
      :model="ruleForm"
      v-if="routeParame.type!='detail'"
    >
      <el-row>
        <div class="section-label">基本信息</div>
        <el-col :span="3" class="pd-zero">
          <el-form-item label="供应商" prop="baseSupplierId" ref="baseSupplierId">
            <el-select v-model="ruleForm.baseSupplierId" placeholder="请选择" filterable clearable>
              <el-option
                v-for="(item,index) in supplierList"
                :key="index"
                :label="item.supplierName"
                :value="item.baseSupplierId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3" class="pd-zero">
          <el-form-item label="负责人" prop="managerStuffId" ref="managerStuffId">
            <el-select
              v-model="ruleForm.managerStuffId"
              placeholder="默认账号获取可修改"
              filterable
              clearable
            >
              <el-option
                v-for="(item,index) in employeeList"
                :key="index"
                :label="item.val"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="routeParame.type=='detail'">
      <div class="section-label">基本信息</div>
      <span class="mr50">
        <label class="gray">采购订单号：</label>
        {{detailObj.purchaseCode}}
      </span>
      <span class="mr50">
        <label class="gray">供应商：</label>
        {{detailObj.supplierName}}
      </span>
      <span class="mr20">
        <label class="gray">负责人：</label>
        {{detailObj.managerStuff}}
      </span>
      <p class="mr20 mt10 wordWrap">
        <label class="gray">备注：</label>
        {{detailObj.remark}}
      </p>
    </div>
    <div class="pic-box mt20" v-if="routeParame.type==='detail'">
      <tzCommonFileUpload
        type="all"
        applicationType="detail"
        :fileList="fileList||[]"
        @handleUploadFile="uploadSuccess"
      ></tzCommonFileUpload>
    </div>
    <material
      isDisabled
      :visible="visible"
      @close="close"
      @submit="materialSubmit"
      :defaultData="tableData"
    />
    <div class="section2 mt20">
      <div class="section-label">关联单据</div>
      <div class="order-list" v-if="routeParame.page ==='down'">
        <div class="order-item" v-for="(item,index) in ruleForm.saleCodeList" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">采购申请订单号：</span>
            <span class="order-item-detail">{{item.applyCode||item.refCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.managerStuff||item.stuff}}</span>
          </div>
        </div>
      </div>
      <div class="order-list" v-if="routeParame.page ==='finished'||routeParame.page ==='subpart'">
        <div class="order-item" v-for="(item,index) in finishedObj.associateData" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">销售订单号：</span>
            <span class="order-item-detail">{{item.saleCode||item.refCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.salerStuff||item.stuff}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="step-box mt20" v-if="routeParame.type=='detail'">
      <p class="mb10">
        <span class="f16 mr50">订单状态</span>
        <tzBtn
          icon="tz-icon-view"
          cls="blue"
          @click="dialogVisible = true"
        >查看记录</tzBtn>
      </p>
      <tzSteps2 :stepsList="dictionary.auditStatus" titleName="name" :activeVal="detailObj.status">
        <template v-slot:desc="slotProp">
          <div v-if="slotProp.step.type==='DRAFT'" class="desc-item">
            <el-button
              round
              size="medium"
              class="tz-search-transparent"
              v-if="detailObj.status === 'DRAFT'"
              @click="approveBtn(detailObj)"
            >送审</el-button>
            <el-button
              round
              size="medium"
              class="tz-search-transparent"
              v-if="detailObj.status === 'DRAFT'"
              @click="delAuditBtn(detailObj.purchaseOrderId)"
            >删除订单</el-button>
          </div>
          <div v-else-if="slotProp.step.type==='SUBMIT'" class="desc-item">
            <el-button
              v-if="detailObj.status === 'SUBMIT'"
              round
              size="mini"
              @click="recallAudit"
              class="tz-search-transparent mt8"
            >撤销</el-button>
          </div>
          <div v-else-if="slotProp.step.type==='CLOSED'" class="desc-item">
            <el-button
              v-if="detailObj.status === 'APPROVED'"
              round
              size="mini"
              class="tz-search-transparent mt8"
              @click="setClose(detailObj.purchaseOrderId)"
            >关闭订单</el-button>
            <el-button
              v-if="detailObj.status === 'CLOSED'"
              round
              size="mini"
              class="tz-search-transparent mt8"
              @click="setOpen(detailObj.purchaseOrderId)"
            >打开订单</el-button>
          </div>
        </template>
      </tzSteps2>
    </div>
    <div class="step-box" v-if="routeParame.type=='detail'">
      <p class="mb10">
        <span class="f16 mr50">入库状态</span>
      </p>
      <tzSteps2
        :stepsList="dictionary.completionStatus1"
        titleName="name"
        :activeVal="detailObj.pushStatus"
      ></tzSteps2>
    </div>
    <div
      class="section-label"
      v-if="(routeParame.page==='down'&&(routeParame.type==='add'||routeParame.type==='edit'))"
    >
      <span class="lf-title">产品信息</span>
      <span class="rf-material">
        <el-button round size="medium" class="tz-search-submit mr20" @click="setReset">重置</el-button>
        <el-date-picker type="date" v-model="deliveryTime" placeholder="设置默认交期" @change="setDate"></el-date-picker>
      </span>
    </div>
    <el-table
      :data="tableData"
      border
      class="mb20"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod"
      v-if="routeParame.page==='down'&&(routeParame.type==='add'||routeParame.type==='edit')"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="minSafetyStock" label="最低安全库存数量" align="center"></el-table-column>
      <el-table-column prop="totalQuantity" label="库存数量" align="center">
        <template slot-scope="scope">{{scope.row.totalQuantity||'-'}}</template>
      </el-table-column>
      <el-table-column label="采购申请单" width="180" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goApply(scope.row)">{{scope.row.applyCode||scope.row.refCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantityDisplay" label="申请数量" align="center">
        <template slot-scope="scope">{{scope.row.quantityDisplay}}</template>
      </el-table-column>
      <el-table-column label="采购参考数量" align="center">
        <template slot-scope="scope">
          <div
            v-if="Number(scope.row.quantityDisplay)>Number(scope.row.processQuantity)"
          >{{Number(scope.row.quantityDisplay)-Number(scope.row.processQuantity)}}</div>
          <div v-else>0</div>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" width="200" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.displayQuantity"
            :controls="controls"
            :precision="6"
            :min="0"
            :max="99999999"
            placeholder="请输入"
          ></el-input-number>
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column label="交期" width="200" align="center" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.sendDate"
            type="date"
            placeholder="请选择"
            @change="priceChange(scope.row,'sendDate')"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" width="200" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.unitPrice "
            :controls="controls"
            :min="0"
            :precision="6"
            :max="99999999"
            placeholder="请输入"
            @change="priceChange(scope.row,'unitPrice')"
          ></el-input-number>
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="含税总价" align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.displayTotalPrice = (scope.row.displayQuantity * scope.row.unitPrice)||0).toFixed(6) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <div class="btn">
            <el-button
              size="small"
              type="text"
              class="yellow f14"
              @click="delBtn(scope.row,scope.$index)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="section-label mt20"
      v-if="(routeParame.page==='finished'&&(routeParame.type==='add'||routeParame.type==='edit'))"
    >
      <span class="lf-title">
        产品信息
        <span>·成品</span>
      </span>
      <span class="rf-material">
        <el-button round size="medium" class="tz-search-submit mr20" @click="setReset">重置</el-button>
        <el-date-picker type="date" v-model="deliveryTime" placeholder="设置默认交期" @change="setDate"></el-date-picker>
      </span>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod"
      v-if="routeParame.page==='finished'&&(routeParame.type==='add'||routeParame.type==='edit')"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="minSafetyStockQuantity" label="最小安全库存" align="center"></el-table-column>
      <el-table-column prop="stockQuantity" label="库存数量" align="center">
        <template slot-scope="scope">{{scope.row.stockQuantity||0}}</template>
      </el-table-column>
      <el-table-column prop="saleCode" label="销售订单号" align="center" :resizable="resizable">
        <template slot-scope="scope">
          <div
            class="yellow"
            @click="goSale(scope.row.refId||scope.row.saleOrderId)"
          >{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyQuantity" label="订单数量" align="center">
        <template slot-scope="scope">{{scope.row.buyQuantity}}</template>
      </el-table-column>
      <el-table-column prop="referenceDisplay" label="采购参考数量" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.referenceDisplay>0">{{scope.row.referenceDisplay}}</div>
          <div v-else>0</div>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" align="center" width="260" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.displayQuantity"
            :controls="controls"
            :precision="6"
            :min="0"
            :max="99999999"
            placeholder="请输入"
          ></el-input-number>
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column label="交期" align="center" width="200" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.sendDate"
            type="date"
            placeholder="请选择"
            @change="priceChange(scope.row,'sendDate')"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" align="center" width="200" class-name="required-red  addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.unitPrice "
            :controls="controls"
            :precision="6"
            :min="0"
            :max="99999999"
            placeholder="请输入"
            @change="priceChange(scope.row,'unitPrice')"
          ></el-input-number>
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="含税总价" align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.displayTotalPrice = (scope.row.displayQuantity * scope.row.unitPrice)||0).toFixed(6) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <div class="btn">
            <el-button
              size="small"
              type="text"
              class="yellow f14"
              @click="delBtn(scope.row,scope.$index)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="section-label mt20" v-if="routeParame.page==='subpart'&&routeParame.type==='add'">
      <span class="lf-title">产品信息·源物料</span>
    </div>
    <el-table
      :data="finishedObj.productData"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod2"
      v-if="(routeParame.page==='subpart'&&routeParame.type==='add')"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售订单号" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyQuantity" label="订单数量" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
    </el-table>
    <div
      class="section-label mt20"
      v-if="routeParame.page==='subpart'&&(routeParame.type==='add'||routeParame.type==='edit')"
    >
      <span class="lf-title">产品信息·所需物料</span>
      <span class="rf-material">
        <el-button round size="medium" class="tz-search-submit mr20" @click="setReset">重置</el-button>
        <el-date-picker
          v-model="deliveryTime"
          type="date"
          placeholder="设置默认交期"
          @change="setDate(routeParame.type,deliveryTime)"
        ></el-date-picker>
      </span>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod"
      v-if="routeParame.page==='subpart'&&(routeParame.type==='add'||routeParame.type==='edit')"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="minSafetyStockQuantity" label="最小安全库存" align="center">
        <template slot-scope="scope">{{scope.row.minSafetyStockQuantity||'-'}}</template>
      </el-table-column>
      <el-table-column prop="stockQuantity" label="库存数量" align="center">
        <template slot-scope="scope">{{scope.row.stockQuantity||0}}</template>
      </el-table-column>
      <el-table-column
        prop="referenceDisplay"
        label="采购参考数量"
        align="center"
        v-if="routeParame.page==='subpart'&&routeParame.type==='add'"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.referenceDisplay>0">{{scope.row.referenceDisplay}}</div>
          <div v-else>0</div>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" align="center" class-name="required-red  addEdit" width="200">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.displayQuantity"
            :controls="controls"
            :precision="6"
            :min="0"
            :max="99999999"
            placeholder="请输入"
          ></el-input-number>
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column label="交期" align="center" width="200" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.sendDate"
            type="date"
            placeholder="请选择"
            @change="priceChange(scope.row,'sendDate')"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" align="center" width="230" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.unitPrice "
            :controls="controls"
            :min="0"
            :precision="6"
            :max="99999999"
            placeholder="请输入"
            @change="priceChange(scope.row,'unitPrice')"
          ></el-input-number>
          <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="含税总价" align="center" width="200">
        <template
          slot-scope="scope"
        >{{(scope.row.displayTotalPrice = (scope.row.displayQuantity * scope.row.unitPrice)||0).toFixed(6) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <div class="btn">
            <el-button
              size="small"
              type="text"
              class="yellow f14"
              @click="delBtn(scope.row,scope.$index)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="section-label"
      v-if="(routeParame.page==='subpart'||routeParame.page==='finished'||routeParame.page==='down')&&(routeParame.type==='detail')"
    >
      <span class="lf-title">产品信息·{{routeParame.page=='none'?'无来源':'汇总'}}</span>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod1"
      v-if="(routeParame.page==='subpart'||routeParame.page==='finished'||routeParame.page==='down')&&(routeParame.type==='detail')"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
      <el-table-column
        prop="typeName"
        label="物料类型"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="materialCode"
        label="物料编码"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="materialName"
        label="物料名称"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="quantity" label="采购数量" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column prop="sendDate" label="交期" align="center">
        <template slot-scope="scope">{{scope.row.sendDate | momentTime('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="含税单价" align="center"></el-table-column>
      <el-table-column prop="displayTotalPrice" label="含税总价" align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.displayTotalPrice = (scope.row.quantity * scope.row.unitPrice)||0).toFixed(6) }}</template>
      </el-table-column>
      <el-table-column prop="stockQuantity" label="已入库数量" align="center">
        <template slot-scope="scope">{{scope.row.stockQuantity||0}}</template>
      </el-table-column>
      <el-table-column prop="returnQuantity" label="退货数量" align="center">
        <template slot-scope="scope">{{scope.row.returnQuantity||0}}</template>
      </el-table-column>
      <!-- <el-table-column prop="amount3" label="最后入库日期" align="center">
      </el-table-column>-->
    </el-table>
    <div class="total" v-if="routeParame.type=='none'">合计：{{detailObj.totalPrice||0}}元</div>
    <div
      class="section-label mt20"
      v-if="(routeParame.page==='finished'||routeParame.page==='down')&&(routeParame.type==='detail')"
    >
      <span class="lf-title">产品信息·明细</span>
    </div>
    <el-table
      :data="recordDetail"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      :span-method="objectSpanMethod1"
      v-if="(routeParame.page==='finished'||routeParame.page==='down')&&(routeParame.type==='detail')"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left"></el-table-column>
      <el-table-column
        prop="typeName"
        label="物料类型"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="materialCode"
        label="物料编码"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="materialName"
        label="物料名称"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="quantity" label="采购数量" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column prop="sendDate" label="交期" align="center">
        <template slot-scope="scope">{{scope.row.sendDate | momentTime('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="含税单价" align="center"></el-table-column>
      <el-table-column prop="displayTotalPrice" label="含税总价" align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.displayTotalPrice = (scope.row.quantity * scope.row.unitPrice)||0).toFixed(6) }}</template>
      </el-table-column>
      <el-table-column prop="refCode" label="采购申请单" align="center" v-if="routeParame.page==='down'">
        <template slot-scope="scope">
          <div class="yellow" @click="goApply(scope.row)">{{scope.row.refCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refCode"
        label="销售订单"
        align="center"
        v-if="detailObj.purchaseType==='SALE_PROD'"
      >
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.refId)">{{scope.row.refCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="displayQuantity"
        label="订单数量"
        align="center"
        v-if="detailObj.purchaseType==='SALE_PROD'"
      ></el-table-column>
      <el-table-column
        prop="displayQuantity"
        label="采购申请数量"
        align="center"
        v-if="routeParame.page==='down'"
      ></el-table-column>
    </el-table>
    <div class="remark" v-if="routeParame.type!=='detail'">
      <div style="margin-bottom:20px;">备注</div>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="ruleForm.remark"
        :disabled="routeParame.type=='detail'"
        maxlength="100"
        show-word-limit
        style="width:1020px;"
        :autosize="{ minRows: 5}"
      />
    </div>
    <div class="pic-box mt20" v-if="routeParame.type!=='detail'">
      <tzCommonFileUpload
        type="all"
        applicationType="add"
        :fileList="fileList||[]"
        @handleUploadFile="uploadSuccess"
      ></tzCommonFileUpload>
    </div>
    <div class="section-label mt20" v-if="routeParame.type==='detail'">
      <span class="lf-title">入库记录</span>
    </div>
    <el-table
      :data="recordData"
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="routeParame.type=='detail'"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column
        prop="typeName"
        label="物料类型"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="materialCode"
        label="物料编码"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="materialName"
        label="物料名称"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="defaultWarehouseName" label="入库仓库" align="center"></el-table-column>
      <el-table-column prop="quantity" label="入库数量" align="center"></el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column prop="managerStuff" label="入库人" align="center">
        <template slot-scope="scope">{{scope.row.managerStuff||'-'}}</template>
      </el-table-column>
      <el-table-column label="入库时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.inTime | momentTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkFlag" label="质检状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.checkFlag | qualityTestStatus(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库单号" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goInOrder(scope.row)">{{scope.row.inCode}}</div>
        </template>
      </el-table-column>
    </el-table>

    <tzView
      :visible="dialogVisible"
      @close="dialogVisible = false"
      paramsType="PURCHASE"
      :paramsCode="detailObj.purchaseCode"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下物料已超出采购参考数量"
      @submit="tipSubmit"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table
          size="mini"
          border
          :header-cell-style="{'background-color': '#F9F9F9'}"
          :data="orderList"
        >
          <el-table-column
            property="materialName"
            label="物料名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            property="saleCode"
            :label="routeParame.page==='finished'?'销售单号':'采购申请单号'"
            align="center"
          ></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
  </div>
</template>

<script>
import {
 mapActions, mapState, mapMutations, mapGetters
} from 'vuex'
import moment from 'moment'
import dic from '../../../mixins/dic'
import dictionary from '../../../global/dictionary'
import { isObject, spanMethod, rowspan } from '../../../utils/utils'

const dicAll = {
  add_finished: '新增采购订单(成品)',
  add_down: '新增采购订单（下推）',
  add_subpart: '新增采购订单（子件）',
  edit_finished: '修改订单详情(成品)',
  edit_down: '修改订单详情（下推）',
  edit_subpart: '修改订单详情（子件）',
  detail_finished: '采购订单详情(成品)',
  detail_down: '采购订单详情（下推）',
  detail_subpart: '采购订单详情（子件）'
}
export default {
  name: 'orderFinishedAdd',
  mixins: [dic],
  data () {
    return {
      dictionary,
      title: '',
      textarea: '',
      controls: false,
      fileList: [],
      visible: false, // 物料选择
      ruleForm: {
        baseSupplierId: '',
        managerStuff: '',
        managerStuffId: '',
        baseFileVos: [],
        purchaseOrderMaterialVos: [],
        saleCodeList: [],
        remark: ''
      },
      rules: {
        baseSupplierId: [
          {
            required: true,
            message: '请输入供应商',
            trigger: 'change'
          }
        ],
        managerStuffId: [
          {
            required: true,
            message: '请输入负责人',
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      recordDetail: [],
      routeParame: {},
      detailObj: {},
      finishedObj: {
        associateData: [],
        productData: [],
        needData: []
      },
      dialogVisible: false,
      orderList: [],
      recordData: [],
      tipVisible: false,
      deliveryTime: '',
      spanArr1: [],
      spanArr2: [],
      spanArr3: [],
      resizable: false,
      status: ''
    }
  },
  created () {
    this.routeParame = this.$route.params
    const { type, page } = this.routeParame
    this.title = dicAll[`${type}_${page}`]
    document.title = dicAll[`${type}_${page}`]
    if (type === 'add' && page === 'finished') {
      this.getDetailFinished()
    } else if (
      (type === 'detail' || type === 'edit') &&
      (page === 'finished' || page === 'subpart' || page === 'down')
    ) {
      this.getDetailOrder()
    } else if (type === 'add' && page === 'subpart') {
      this.getDetailSubpart()
    } else if (type === 'add' && page === 'down') {
      this.getOrderDetail()
    }
    this.ruleForm.managerStuffId = this.userInfo.stuffId
  },

  computed: {
    ...mapState({
      supplierList: state => state.global.supplierList, // 供应商
      userInfo: state => state.global.userInfo,
      modalLoading: state => state.global.modalLoading
    }),
    ...mapGetters(['employeeList'])
  },
  watch: {
    employeeList (val, oldVal) {
      if (val.length || oldVal.length) {
        this.ruleForm.managerStuffId = this.userInfo.stuffId
      }
    }
  },
  filters: {
    qualityTestStatus (val, row) {
      const { inFlag, inCheckFlag } = row
      if (val === 'Y' && inFlag === 'Y' && inCheckFlag === 'Y') return '已入库'
      if (val === 'Y' && inFlag === 'N' && inCheckFlag === 'Y') return '未入库'
      if (val === 'N' && inFlag === 'N' && inCheckFlag === 'Y') return '未质检'
      if (inFlag === 'Y' && inCheckFlag === 'N') return '已入库'
      if (inFlag === 'N' && inCheckFlag === 'N') return '未入库'
      return ''
    }
  },
  methods: {
    // 所有异步请求
    ...mapActions([
      'DETAILQUERY_PURCHASE_TYPE',
      'POST_GLOBAL_AUDITOR',
      'DETAIL_FINISHED_TYPE',
      'ADDDOWN_PURCHASE_TYPE',
      'DETAILDOWN_PURCHASE_TYPE',
      'DETAILQUERY_PURCHASE_TYPE',
      'EDITDOWN_PURCHASE_TYPE',
      'FINISHEDADD_PURCHASE_TYPE',
      'NONFINADD_PURCHASE_TYPE',
      'FINISHEDEDIT_PURCHASE_TYPE',
      'NONFINEDIT_PURCHASE_TYPE',
      'DETAIL_SUBPART_TYPE',
      'SALEORDERSAVE_PURCHASE_TYPE',
      'ORDEROPEN_PURCHASE_TYPE',
      'ORDERCLOSE_PURCHASE_TYPE',
      'POST_GLOBAL_RECALL_AUDIT',
      'ORDERSAVEDOWN_PURCHASE_TYPE',
      'SALEORDERCENSOR_PURCHASE_TYPE',
      'DELETEORDER_PURCHASE_TYPE',
      'ORDERCENSOR_PURCHASE_TYPE'
    ]),
    // 同步vuex数据
    ...mapMutations(['MODAL_LOADING']),
    goInOrder (row) {
      this.$router.push({
        name: 'warehouseInDetail',
        params: {
          id: row.refId
        },
        query: {
          type: row.inType
        }
      })
    },
    // 设置请求参数
    setParams () {
      const materialList = this.tableData.map(item => ({
        ...item,
        quantity: item.displayQuantity,
        displayUnitPrice: item.unitPrice,
        refMaterialId:
          item.refMaterialId ||
          item.purchaseApplyMaterialId ||
          item.saleOrderMaterialId,
        refCode: item.refCode ? item.refCode : item.applyCode,
        sendDate: moment(item.sendDate).format('YYYY-MM-DD')
      }))
      // 重新选择负责人赋值操作
      this.staffList.forEach((element) => {
        if (element.id === this.ruleForm.managerStuffId) {
          this.ruleForm.managerStuff = element.realname
        }
      })
      let saleCode = ''
      if (this.routeParame.type === 'add' || this.routeParame.type === 'edit') {
        saleCode = this.ruleForm.saleCodeList.map(
          code => code.applyCode || code.saleCode || code.refCode
        )
      }
      if (this.routeParame.page === 'subpart') {
        return {
          ...this.ruleForm,
          saleCodeList: saleCode.toString(),
          purchaseOrderMaterialVos: materialList
        }
      }
      return {
        ...this.ruleForm,
        saleCodeList: '',
        // refCode: saleCode.toString(),
        purchaseOrderMaterialVos: materialList
      }
    },
    goBack () {
      this.$router.back()
    },
    priceChange (row, name) {
      this.tableData.forEach((i, index) => {
        if (i.baseMaterialId === row.baseMaterialId) {
          this.tableData[index][name] = row[name]
        }
      })
    },
    // 新增成品采购订单-获取销售订单相关数据
    async getDetailFinished () {
      const arg = {
        saleOrderMaterialIdStr: this.routeParame.id
      }
      const { status, data } = await this.DETAIL_FINISHED_TYPE(arg)
      if (status === 0) {
        const arr = data.purchaseVoList.map(item => ({
          ...item,
          refCode: item.saleCode,
          unitPrice: item.unitPrice ? item.unitPrice : undefined,
          displayQuantity: undefined
        }))
        this.tableData = arr
        this.ruleForm.saleCodeList = data.saleOrderVoList
        this.finishedObj = {
          associateData: data.saleOrderVoList
        }
        this.resetSpan()
      }
    },
    // 新增采购单（成品）
    async getFinishedAdd (type) {
      if (!this.check(this.tableData)) return
      const arg = this.setParams()
      const { status, data } = await this.FINISHEDADD_PURCHASE_TYPE(arg)
      if (status === 0) {
        if (type !== 'none') {
          this.approveFn(data)
        } else {
          this.$router.push({
            name: 'orderAll'
          })
        }
      }
    },
    // 获取采购订单（成品,子件，申请单）详情
    async getDetailOrder () {
      const { id, page, type } = this.routeParame
      const { status, data } = await this.DETAILQUERY_PURCHASE_TYPE([id])
      if (status === 0) {
        this.detailObj = data
        this.ruleForm = {
          baseSupplierId: data.baseSupplierId,
          managerStuff: data.managerStuff,
          managerStuffId: data.managerStuffId,
          saleCodeList: data.purchaseOrderRefsVos,
          remark: data.remark
        }
        this.fileList = data.baseFileDtos
        this.recordData = data.stockInMaterialDtos
        this.recordDetail = data.purchaseOrderMaterialVoDetais
        this.finishedObj = {
          associateData: data.purchaseOrderRefsVos,
          productData: data.purchaseVoList
        }
        // this.tableData = data.purchaseOrderMaterialVoDetais || data
        //   .purchaseOrderMaterialVos
        if ((page === 'finished' || page === 'down') && type === 'detail') {
          this.tableData = data.purchaseOrderMaterialVos
        }
        if ((page === 'finished' || page === 'down') && type === 'edit') {
          this.tableData = data.purchaseOrderMaterialVoDetais
        }
        if (page === 'subpart') {
          this.tableData = data.purchaseOrderMaterialVos
        }
        if (type === 'edit' && page !== 'down') {
          this.tableData = this.tableData.map(item => ({
            ...item,
            materialType: item.typeName,
            saleCode: item.refCode,
            minSafetyStockQuantity: item.minSafetyStock,
            buyQuantity: item.displayQuantity,
            displayQuantity: item.quantity,
            stockQuantity: item.displayTotalQuantity,
            referenceDisplay: item.displayQuantity - item.processQuantity || 0
          }))
        } else {
          this.tableData = this.tableData.map(item => ({
            ...item,
            materialType: item.typeName,
            totalQuantity: item.displayTotalQuantity,
            quantityDisplay: item.displayQuantity,
            displayQuantity: item.quantity
          }))
        }
        this.resetSpan()
      }
    },
    // 修改采购申请单成品
    getFinishedEdit () {
      if (!this.check(this.tableData)) return
      const arg = this.setParams()
      this.FINISHEDEDIT_PURCHASE_TYPE({
        purchaseOrderId: Number(this.routeParame.id),
        ...arg
      })
    },
    // 获取采购子件详情
    async getDetailSubpart () {
      const arg = {
        saleOrderMaterialIdStr: this.routeParame.id
      }
      const { status, data } = await this.DETAIL_SUBPART_TYPE(arg)
      if (status === 0) {
        const arr = data.needDetailList.map(item => ({
          ...item,
          unitPrice: Number(item.unitPrice) === 0 ? undefined : item.unitPrice,
          displayQuantity: undefined
        }))
        this.finishedObj = {
          associateData: data.saleOrderVoList,
          productData: data.purchaseVoList
        }
        this.ruleForm.saleCodeList = data.saleOrderVoList
        this.tableData = arr
        this.resetSpan()
      }
    },
    // 新增采购订单-获取采购申请单详情
    async getOrderDetail () {
      const { status, data } = await this.DETAILDOWN_PURCHASE_TYPE(
        this.routeParame.id.split(',')
      )
      if (status === 0) {
        this.ruleForm = {
          baseSupplierId: data.baseSupplierId || '',
          baseFileVos: data.baseFileVos,
          managerStuff: data.managerStuff,
          managerStuffId: data.managerStuffId,
          purchaseOrderMaterialVos: data.purchaseOrderMaterialVos,
          saleCodeList: data.purchaseApplyCodeStuffs,
          remark: data.remark
        }
        if (this.routeParame.type === 'add') {
          this.ruleForm.managerStuffId = this.userInfo.stuffId
          this.ruleForm.managerStuff = this.userInfo.realname
        }
        this.tableData = data.purchaseApplyMaterialVos.map(i => ({
          ...i,
          displayQuantity: undefined,
          sendDate: undefined,
          unitPrice: Number(i.unitPrice) ? Number(i.unitPrice) : undefined
        }))
        this.resetSpan()
      }
    },
    // 销售订单下推(采购申请下推)采购订单查看详情

    // 新增销售非成品下推采购订单
    async getSubpartAdd (type) {
      if (!this.check(this.tableData)) return
      const arg = this.setParams()
      const { status, data } = await this.NONFINADD_PURCHASE_TYPE(arg)
      if (status === 0) {
        if (type === 'auditor') {
          this.approveFn(data)
        } else {
          this.$router.push({
            name: 'orderAll'
          })
        }
      }
    },
    // 新增采购申请下推采购订单
    async getDownAdd (type) {
      if (!this.check(this.tableData)) return
      const arg = this.setParams()
      const { status, data } = await this.ADDDOWN_PURCHASE_TYPE(arg)
      if (status === 0) {
        if (type === 'auditor') {
          this.approveFn(data)
        } else {
          this.$router.push({
            name: 'orderAll'
          })
        }
      }
    },
    // 跳转销售列表
    goSale (id) {
      this.$router.push({
        path: '/sale/detail/detail',
        query: {
          id
        }
      })
    },
    // 跳转采购申请订单
    goApply (item) {
      const dicType = {
        SALE_PROD: 'finished',
        SALE_MATERIAL: 'subpart',
        NONE: 'none'
      }
      this.$router.push({
        name: 'applyFinishedAdd',
        params: {
          type: 'detail',
          page: dicType[item.applyType],
          id: item.refId || item.purchaseApplyId
        }
      })
    },
    // 修改采购申请单
    async getEdit () {
      if (!this.check(this.tableData)) return
      const arg = this.setParams()
      this.EDITDOWN_PURCHASE_TYPE({
        purchaseOrderId: this.routeParame.id,
        ...arg
      })
    },

    check (list, type) {
      if (!list.length && type) {
        this.$message.error('产品信息不能为空')
        return false
      }
      const checkDisplayQuantity = list.filter(item => item.displayQuantity === undefined || item.displayQuantity === 0)
      if (checkDisplayQuantity && checkDisplayQuantity.length > 0) {
        this.$message.error('采购数量必填且必须大于0')
        return false
      }
      const checkSendDate = list.filter(item => item.sendDate === undefined || item.sendDate === null)
      if (checkSendDate && checkSendDate.length > 0) {
        this.$message.error('交期必填')
        return false
      }
      const checkUnitPrice = list.filter(item => item.unitPrice === undefined || item.unitPrice === 0)
      if (checkUnitPrice && checkUnitPrice.length > 0) {
        this.$message.error('含税单价必填且必须大于0')
        return false
      }
      return true
    },
    // 修改采购申请单子件
    async getSubpartEdit () {
      if (!this.check(this.tableData)) return
      const arg = this.setParams()
      this.NONFINEDIT_PURCHASE_TYPE({
        purchaseOrderId: Number(this.routeParame.id),
        ...arg
      })
    },
    // 新增采购申请单（非成品）
    async getNonAdd (type) {
      if (!this.check(this.finishedObj.productData, 1)) return
      const arg = this.setParams()
      const { status, data } = await this.ADD_PURCHASE_Non_FINISHED_TYPE(arg)
      if (status === 0) {
        this.approveFn(data)
      }
    },
    // 送审
    async approveBtn (item) {
      if (item.purchaseType === 'SALE_PROD') {
        const { status, data } = await this.SALEORDERCENSOR_PURCHASE_TYPE([
          item.purchaseOrderId
        ])
        if (status === 0) {
          if (data.length) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.approveFn(item)
          }
        }
      } else if (item.purchaseType === 'APPLY') {
        const { status, data } = await this.ORDERCENSOR_PURCHASE_TYPE([
          item.purchaseOrderId
        ])
        if (status === 0) {
          if (data.length) {
            this.tipVisible = true
            this.orderList = data
          } else {
            this.approveFn(item)
          }
        }
      } else {
        this.approveFn(item)
      }
    },
    // 送审
    async approveFn (item) {
      const arg = {
        targetType: 'PURCHASE',
        targetCode: item.purchaseCode,
        targetId: item.purchaseOrderId
      }
      const { status } = await this.POST_GLOBAL_AUDITOR([arg])
      if (status === 0) {
        this.detailObj = {
          ...this.detailObj,
          status: 'SUBMIT'
        }
        if (this.routeParame.type !== 'detail') {
          this.$router.push({
            name: 'orderAll'
          })
        }
      }
    },
    // 撤销审核
    async recallAudit () {
      const arg = {
        targetType: 'PURCHASE',
        targetId: this.routeParame.id
      }
      const { status } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
      if (status === 0) {
        this.detailObj = {
          ...this.detailObj,
          status: 'DRAFT'
        }
      }
    },
    // 保存送审校验
    async sendCheck (item) {
      const materialList = item.purchaseOrderMaterialVos
        ? item.purchaseOrderMaterialVos
        : item.map(it => ({
            ...it,
            baseMaterialId: it.baseMaterialId,
            quantity: it.displayQuantity,
            refMaterialId: it.saleOrderMaterialId || it.purchaseApplyMaterialId,
            refCode: it.saleCode || it.applyCode,
            materialName: it.materialName,
            materialCode: it.materialCode
          }))
      const arg = {
        purchaseOrderMaterialVos: materialList
      }
      this.tableData.forEach((items) => {
        if (!items.sendDate) {
          const arr = this.tableData.filter(
            i => i.baseMaterialId === items.baseMaterialId
          )
          if (arr.length) {
            this.$set(items, 'sendDate', arr[0].sendDate)
          }
        }
        if (!items.unitPrice) {
          const arr1 = this.tableData.filter(
            i => i.baseMaterialId === items.baseMaterialId
          )
          if (arr1.length) {
            this.$set(items, 'unitPrice', arr1[0].unitPrice)
          }
        }
      })
      if (!this.check(this.tableData)) return
      try {
        this.MODAL_LOADING(true)
        if (
          this.routeParame.page === 'finished' &&
          this.routeParame.type === 'add'
        ) {
          const { status, data } = await this.SALEORDERSAVE_PURCHASE_TYPE(arg)
          this.MODAL_LOADING()
          if (status === 0) {
            if (data.length) {
              this.tipVisible = true
              this.orderList = data
            } else {
              this.getFinishedAdd('auditor')
            }
          }
        } else if (
          this.routeParame.page === 'down' &&
          this.routeParame.type === 'add'
        ) {
          const { status, data } = await this.ORDERSAVEDOWN_PURCHASE_TYPE(arg)
          this.MODAL_LOADING()
          if (status === 0) {
            if (data.length) {
              this.tipVisible = true
              this.orderList = data
            } else {
              this.getDownAdd('auditor')
            }
          }
        } else {
          this.getSubpartAdd('auditor')
        }
      } catch (e) {
        this.MODAL_LOADING()
        console.log(e)
      }
    },
    // 保存
    submitForm (formName, status) {
      this.status = status
      const { page, type } = this.routeParame
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (page === 'down' && type === 'add' && status !== 'auditor') {
            this.getDownAdd(status)
          } else if (
            page === 'finished' &&
            type === 'add' &&
            status !== 'auditor'
          ) {
            this.getFinishedAdd(status)
          } else if (
            page === 'subpart' &&
            type === 'add' &&
            status !== 'auditor'
          ) {
            this.getSubpartAdd(status)
          } else if (page === 'down' && type === 'edit') {
            this.getEdit()
          } else if (page === 'finished' && type === 'edit') {
            this.getFinishedEdit()
          } else if (page === 'subpart' && type === 'edit') {
            this.getSubpartEdit()
          } else if (
            (page === 'finished' || page === 'down' || page === 'subpart') &&
            status === 'auditor'
          ) {
            this.sendCheck(this.tableData)
          }
        } else {
          let dom = null
          if (isObject(object) && Object.keys(object).length > 0) {
            dom = this.$refs[Object.keys(object)[0]]
            dom.$el.scrollIntoView({
              // 滚动到指定节点
              block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
              behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
            })
          }
        }
      })
    },
    // 详情页编辑
    editBtn (type, page) {
      this.routeParame.type = 'edit'
      this.title = dicAll[`${type}_${page}`]
      document.title = dicAll[`${type}_${page}`]
      if (
        type === 'detail' &&
        (page === 'finished' || page === 'subpart' || page === 'down')
      ) {
        this.getDetailOrder()
      }
    },
    // 提示继续提交
    tipSubmit () {
      this.tipVisible = false
      if (this.routeParame.type === 'detail') {
        this.approveFn(this.detailObj)
      } else if (this.routeParame.page === 'finished') {
        this.getFinishedAdd('auditor')
      } else {
        this.getDownAdd('auditor')
      }
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.ruleForm.baseFileVos = files
    },
    // 删除
    delBtn (item, index) {
      this.tableData.splice(index, 1)
      this.resetSpan()
    },
    // 打开采购申请
    async setOpen (id) {
      const arg = {
        purchaseOrderId: id
      }
      const { status } = await this.ORDEROPEN_PURCHASE_TYPE(arg)
      if (status === 0) {
        this.$message.success('打开成功')
        this.detailObj.status = 'APPROVED'
      }
    },
    // 关闭采购申请
    async setClose (id) {
      const arg = {
        purchaseOrderId: id
      }
      const { status } = await this.ORDERCLOSE_PURCHASE_TYPE(arg)
      if (status === 0) {
        this.$message.success('关闭成功')
        this.detailObj.status = 'CLOSED'
      }
    },
    // 关闭物料
    close () {
      this.visible = false
    },
    // 选择物料
    async materialSubmit (val) {
      try {
        this.tableData = [...this.tableData, ...val]
        this.close()
      } catch (e) {
        console.log(e)
        this.$message.error('新增失败')
      }
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.DELETEORDER_PURCHASE_TYPE(val)
      if (status === 0) {
        this.$message.success('删除成功')
        this.$router.back()
      }
    },
    // 删除
    delAuditBtn (val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示').then((res) => {
        if (res === 'confirm') {
          this.delFn(val)
        }
      }).catch(() => {})
    },
    // 设置物料交期
    setDate (type, val) {
      const arr = this.tableData.map(item => ({
        ...item,
        sendDate: this.deliveryTime ? moment(this.deliveryTime).format('YYYY-MM-DD') : null
      }))
      this.tableData = arr
    },
    // 重置产品信息
    setReset () {
      const { page, type } = this.routeParame
      if (page === 'down' && (type === 'add' || type === 'edit')) {
        this.tableData = []
        this.getOrderDetail()
      }
      if (page === 'subpart' && type === 'add') {
        this.getDetailSubpart()
      }
      if (page === 'finished' && type === 'add') {
        this.getDetailFinished()
      }
      if (type === 'edit') {
        this.getDetailOrder()
      }
    },
    // 合并单元格
    objectSpanMethod ({ rowIndex, columnIndex }) {
      return spanMethod({ rowIndex, columnIndex }, this.spanArr1, [1, 2, 3, 4, 5, 6, 7, 13, 14])
    },
    objectSpanMethod1 ({ rowIndex, columnIndex }) {
      return spanMethod({ rowIndex, columnIndex }, this.spanArr3, [1, 2, 3, 4, 5, 8, 9])
    },
    objectSpanMethod2 ({ rowIndex, columnIndex }) {
      return spanMethod({ rowIndex, columnIndex }, this.spanArr2, [1, 2, 3, 4, 5])
    },
    // 数据排序
    sortList (list = []) {
      return ((list && list.sort((a, b) => b.baseMaterialId - a.baseMaterialId)) || [])
    },
    resetSpan () {
      const { tableData = [], recordDetail = [], finishedObj = {}} = this
      this.spanArr1 = (tableData && rowspan(this.sortList(tableData), 'baseMaterialId')) || []
      this.spanArr2 = (finishedObj.productData && rowspan(this.sortList(finishedObj.productData), 'baseMaterialId')) || []
      this.spanArr3 = (recordDetail && rowspan(this.sortList(recordDetail), 'baseMaterialId')) || []
    }
  }
}
</script>

<style lang="less" scoped>
.section-label {
  display: flex;
  width: 100%;
  line-height: 40px;

  .lf-title {
    flex: 1;
  }
}

.pic-box {
  .title {
    color: #444;
  }
}

.gray {
  color: #999;
}

.f16 {
  font-weight: 600;
}

.desc-item {
  margin-top: 10px;

  button {
    margin: 0 0 6px;
  }
}

.step-box {
  .f18 {
    font-weight: bold;
  }

  .tz-icon-view {
    color: #7ca870;
  }
}

.el-date-editor.el-input {
  width: auto;
}

.yellow-bg {
  background: rgba(233, 167, 99, 0.2);
}

.blue-bg {
  background: rgba(124, 168, 112, 0.2);
}
</style>
