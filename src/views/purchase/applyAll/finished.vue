<template>
  <div class="addPage">
    <tzHeadline :title="title" backText="返回" :isShowBack="isShowBack">
      <template slot="btn">
        <div v-if="routeParame.type!='detail'">
          <el-button round size="medium" class="tz-search-submit tz-btn-add" @click="submitForm('ruleForm','none')">保存</el-button>
          <el-button round size="medium" class="tz-search-submit tz-btn-add" @click="submitForm('ruleForm','auditor')" v-if="routeParame.type!='edit'">保存并送审</el-button>
        </div>
        <div v-else>
          <div v-if="detailObj.status !== 'SUBMIT' && detailObj.status !== 'APPROVED' && detailObj.status !== 'CLOSED'">
            <el-button round size="medium" class="tz-btn-add" @click="applySave(routeParame.type,routeParame.page)">编辑</el-button>
            <el-button round size="medium" class="tz-search-submit tz-btn-add" @click="approveBtn(detailObj)">送审</el-button>
          </div>
        </div>
      </template>
    </tzHeadline>
    <el-form label-position="top" ref="ruleForm" label-width="80px" :rules="rules" :inline="true" :model="ruleForm" v-if="routeParame.type!='detail'">
      <el-col>
        <el-col :span="5">
          <el-form-item label="负责人" prop="managerStuffId">
            <el-select v-model="ruleForm.managerStuffId" placeholder="默认账号获取可修改" filterable clearable>
              <el-option  v-for="(item,index) in employeeList" :key="index" :label="item.val" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
    <div v-if="routeParame.type=='detail'">
      <div class="section-label">基本信息</div>
      <span class="mr50"><label class="gray">采购申请单号：</label>{{detailObj.applyCode}}</span>
      <span class="mr20"><label class="gray">负责人：</label>{{detailObj.managerStuff}}</span>
      <p class="mr20 mt10 wordWrap"><label class="gray">备注：</label>{{detailObj.remark}}</p>
    </div>
    <div class="section2 mt20" v-if="routeParame.page !== 'none'">
      <div class="section-label">关联单据</div>
      <div class="order-list" v-if="routeParame.type === 'detail' || routeParame.type === 'edit'">
        <div class="order-item" v-for="(item,index) in detailObj.saleOrderVoList" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">销售订单号：</span>
            <span class="order-item-detail">{{item.saleCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.salerStuff}}</span>
          </div>
        </div>
      </div>
      <div class="order-list" v-else>
        <div class="order-item" v-for="(item,index) in finishedObj.associateData" :key="index">
          <div class="left-order-item">
            <span class="order-item-title">销售订单号：</span>
            <span class="order-item-detail">{{item.saleCode}}</span>
          </div>
          <div class="right-order-item">
            <span class="order-item-title">创建人：</span>
            <span class="order-item-detail">{{item.salerStuff}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section-label mt20" v-if="routeParame.type=='add' && routeParame.page=='finished'">
      <span class="lf-title">产品信息</span>
      <span class="rf-material">
        <!-- <el-button round size="medium" class="tz-search-submit mr20" @click="visibleMaterial = true">添加物料</el-button> -->
        <el-button round size="medium" class="tz-search-submit mr20" @click="resetProductInfo">重置</el-button>
        <el-date-picker type="date" v-model="deliveryTime" placeholder="设置默认交期" @change="setDate"></el-date-picker>
      </span>
    </div>
    <el-table
      border
      :span-method="cellMerge1"
      :data="finishedObj.productData"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="routeParame.type=='add' && routeParame.page=='finished'">
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column prop="materialType" label="物料类型" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="minSafetyStockQuantity" label="最小安全库存" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.minSafetyStockQuantity}}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="库存数量" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column prop="saleCode" label="销售订单号" width="180" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyQuantity" label="订单数量" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.buyQuantity}}
        </template>
      </el-table-column>
      <el-table-column prop="referenceDisplay" label="采购参考数量" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.referenceDisplay}}
        </template>
      </el-table-column>
      <el-table-column prop="quantityDisplay" label="申请数量" width="220" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.quantityDisplay" :controls="controls" :precision="6" :min="0" :max="99999999" maxlength="5" placeholder="请输入"></el-input-number>
           <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column label="交期" width="220" align="center" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            clearable
            type="date"
            @change="checkTime(scope.row)"
            :editable="false"
            format="yyyy-MM-dd"
            :picker-options="currentDate"
            value-format="yyyy-MM-dd"
            v-model="scope.row.sendDate"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <div class="btn">
            <el-button size="small" type="text" class="yellow f14" @click="delBtn(routeParame.type,scope.$index)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 成品 编辑 无来源 -->
    <!-- 使用 -->
    <div class="section-label mt20" v-if="routeParame.type=='edit'&&routeParame.page=='finished'||routeParame.type!='detail'&&routeParame.page=='none'">
      <span class="lf-title">产品信息</span>
      <span class="rf-material">
        <!-- <el-button round size="medium" class="tz-search-submit mr20" @click="visibleMaterial = true">添加物料</el-button> -->
        <el-button round size="medium" class="tz-search-submit mr20" @click="resetEditInfo">重置</el-button>
        <el-date-picker type="date" v-model="deliveryTime" placeholder="设置默认交期" @change="setDate(routeParame.type,deliveryTime)"></el-date-picker>
      </span>
    </div>
    <el-table
      border
      :span-method="cellMerge1"
      style="width: 100%; margin-top: 20px"
      :data="detailObj.purchaseApplyMaterialVoList"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="routeParame.type === 'edit' && routeParame.page === 'finished' || routeParame.type !== 'detail' && routeParame.page === 'none'">
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left">
      </el-table-column>
      <el-table-column prop="typeName" label="物料类型" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="minSafetyStockQuantity" label="最小安全库存" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.minSafetyStockQuantity}}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="库存数量" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column prop="saleCode" label="销售订单号" width="180" align="center" v-if="routeParame.page !== 'none'">
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyQuantity" label="订单数量" width="180" align="center" v-if="routeParame.page !== 'none'">
        <template slot-scope="scope">
          {{scope.row.buyQuantity}}
        </template>
      </el-table-column>
      <el-table-column prop="referenceDisplay" label="采购参考数量" width="180" align="center" v-if="routeParame.page !== 'none'">
        <template slot-scope="scope">
          {{scope.row.referenceDisplay}}
        </template>
      </el-table-column>
      <el-table-column prop="quantityDisplay" label="申请数量" width="220" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.quantityDisplay" :controls="controls" :precision="6" :min="0" :max="99999999" maxlength="5" placeholder="请输入">
          </el-input-number>
           <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column label="交期" width="220" align="center" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            clearable
            type="date"
            :editable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="currentDate"
            @change="checkTime(scope.row)"
            v-model="scope.row.sendDate"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <div class="btn">
            <el-button size="small" type="text" class="yellow f14" @click="delBtn(routeParame.type,scope.$index)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="section-label" v-if="routeParame.type === 'add' && routeParame.page === 'subpart'">
      <span class="lf-title">产品信息·源物料</span>
    </div>
    <el-table
      border
      :span-method="cellMerge"
      :data="finishedObj.productData"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}"
      v-if="routeParame.type === 'add' && routeParame.page === 'subpart'">
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left">
        <template slot-scope="scope">
          0{{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName"  label="物料名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center"   show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center"   show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="saleCode" label="销售订单号" align="center">
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyQuantity" label="订单数量" align="center">
      </el-table-column>
    </el-table>
    <div class="section-label mt20" v-if="(routeParame.type === 'add' || routeParame.type === 'edit') && routeParame.page === 'subpart'">
      <span class="lf-title">产品信息<span v-if="routeParame.page!='finished'">·所需物料</span></span>
      <span class="rf-material">
        <el-button round size="medium" class="tz-search-submit mr20" @click="setReset">重置</el-button>
        <el-date-picker v-model="deliveryTime" type="date" placeholder="设置默认交期" @change="setDate(routeParame.type,deliveryTime)"></el-date-picker>
      </span>
    </div>
    <el-table :data="finishedObj.needData" border style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="(routeParame.type === 'add' || routeParame.type === 'edit') && routeParame.page === 'subpart'">
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left">
        <template slot-scope="scope">
          0{{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="materialType" label="物料类型" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="minSafetyStockQuantity" label="最小安全库存" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.minSafetyStockQuantity}}
        </template>
      </el-table-column>
      <el-table-column prop="stockQuantity" label="库存数量" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.stockQuantity}}
        </template>
      </el-table-column>
      <el-table-column prop="referenceDisplay" label="采购参考数量" width="180" align="center" v-if="routeParame.type !== 'edit' && routeParame.page === 'subpart'">
        <template slot-scope="scope">
          {{scope.row.referenceDisplay}}
        </template>
      </el-table-column>
      <el-table-column label="采购申请数量" width="220" align="center" class-name="required-red addEdit">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.quantityDisplay" :controls="controls" :precision="6" :min="0" :max="99999999" maxlength="5" placeholder="请输入">
          </el-input-number>
           <i class="el-icon-edit edit-icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column label="交期" width="220" align="center" class-name="required-red">
        <template slot-scope="scope">
          <el-date-picker
            clearable
            type="date"
            :editable="false"
            format="yyyy-MM-dd"
            :picker-options="currentDate"
            value-format="yyyy-MM-dd"
            v-model="scope.row.sendDate"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" v-if="routeParame.page!=='detail'">
        <template slot-scope="scope">
          <div class="btn">
            <el-button size="small" type="text" class="yellow f14" @click="delBtn(routeParame.type,scope.$index)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="remark" v-if="routeParame.type!='detail'">
      <div style="margin-bottom:20px;">备注</div>
      <el-input type="textarea" placeholder="请输入内容" :disabled="routeParame.page==='detail'" v-model="ruleForm.remark" maxlength="100" show-word-limit :autosize="{ minRows: 5}">
      </el-input>
    </div>
    <div class="pic-box" v-if="routeParame.page!='detail'">
      <!--<div class="title f16 mb5">图片和附件</div>-->
      <!-- <div class="gray mb10">附件支持上传图片和文件，大小不超过2M</div> -->
      <tzCommonFileUpload type="all" :applicationType="applicationType" :fileList="fileList" @handleUploadFile="uploadSuccess"></tzCommonFileUpload>
    </div>
      <div class="step-box mt20" v-if="routeParame.type=='detail'">
        <p class="mb10">
          <span class="f16 mr50">订单状态</span>
          <tzBtn icon="tz-icon-view" cls="blue" @click="viewBtn('APPLY',detailObj.applyCode)">查看记录</tzBtn>
        </p>
        <tzSteps2 :stepsList="dictionary.auditStatus" titleName="name" :activeVal="detailObj.status">
          <template v-slot:desc="slotProp">
            <div v-if="slotProp.step.type==='DRAFT'" class="desc-item">
              <el-button round size="medium" class="tz-search-transparent" v-if="detailObj.status === 'DRAFT'" @click="approveBtn(detailObj)">送审</el-button>
              <el-button round size="medium" class="tz-search-transparent" v-if="detailObj.status === 'DRAFT'" @click="delAuditBtn(detailObj.purchaseApplyId)">删除订单</el-button>
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
                @click="setClose(detailObj.purchaseApplyId)"
              >关闭订单</el-button>
              <el-button
                v-if="detailObj.status === 'CLOSED'"
                round
                size="mini"
                class="tz-search-transparent mt8"
                @click="setOpen(detailObj.purchaseApplyId)"
              >打开订单</el-button>
            </div>
          </template>
        </tzSteps2>
      </div>
      <div class="step-box mt20" v-if="routeParame.type=='detail' && detailObj.pushStatus">
        <p class="mb10">
          <span class="f18 mr50">转单状态</span>
        </p>
        <tzSteps2 :stepsList="dictionary.completionStatus2" titleName="name" :activeVal="detailObj.pushStatus"></tzSteps2>
      </div>
      <tzView :visible="dialogVisible" @close="dialogClose" :paramsType="dialogType" :paramsCode="dialogCode"/>
    <div class="section-label mt20" v-if="routeParame.type=='detail'&&routeParame.page=='none'">
      <span class="lf-title">产品信息·无来源</span>
    </div>
    <el-table :data="detailObj.purchaseApplyMaterialVoList" border style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="routeParame.type=='detail'&&routeParame.page=='none'">
      <el-table-column type="index" label="序号" width="50" align="center" fixed="left">
        <template slot-scope="scope">
          0{{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="materialType" label="物料类型" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="quantityDisplay" label="采购申请数量" width="180" align="center">
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column prop="sendDate" label="交期" width="180" align="center">
      </el-table-column>
      <el-table-column label="转单情况" width="180" align="center" :formatter="transferFn">
      </el-table-column>
      <el-table-column prop="processQuantity" label="转单数量" width="180" align="center">
      </el-table-column>
    </el-table>
    <!-- 详情 无来源 -->
    <!-- 使用 -->
    <div class="section-label mt20" v-if="routeParame.type=='detail'&&routeParame.page!='none'">
      <span class="lf-title">产品信息<span>{{routeParame.page!='finished'?'·子件':'·成品'}}</span></span>
    </div>
    <el-table
      border
      :span-method="cellMergeFinished"
      :data="detailObj.purchaseApplyMaterialVoList"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="routeParame.type=='detail'&&routeParame.page!='none'">
      <el-table-column type="index" label="序号" width="50" align="center">
        <template slot-scope="scope">
          0{{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName"  label="物料名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center"   show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center"   show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="saleCode" label="销售订单号" width="180" align="center" v-if="routeParame.page !== 'subpart'">
        <template slot-scope="scope">
          <div class="yellow" @click="goSale(scope.row.saleOrderId)">{{scope.row.saleCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantityDisplay" label="采购申请数量" align="center">
        <template slot-scope="scope">
          {{scope.row.quantityDisplay}}
        </template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
      <el-table-column prop="sendDate" label="交期" align="center">
      </el-table-column>
      <el-table-column label="转单情况" align="center" :formatter="transferFn">
      </el-table-column>
      <el-table-column prop="processQuantity" label="转单数量" align="center">
      </el-table-column>
    </el-table>
    <div class="section-label mt20" v-if="routeParame.type=='detail'&&routeParame.page!='none'">
      <span class="lf-title">转单单据</span>
    </div>
    <el-table :data="detailObj.relationPurchaseOrderList" border style="width: 100%; margin-top: 20px"
      :header-cell-style="{'background-color': '#F9F9F9'}" v-if="routeParame.type=='detail'&&routeParame.page!='none'">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="materialType" label="物料类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialCode" label="物料编码" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="materialName"  label="物料名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spec" label="物料规格" align="center"   show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="picNum" label="物料图号" align="center"   show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="quantityDisplay" label="转单数量" align="center">
      </el-table-column>
      <el-table-column prop="status" label="订单状态" align="center">
        <template slot-scope="scope">{{scope.row.status | filterDic(dictionary.auditStatus)}}</template>
      </el-table-column>
      <el-table-column prop="pushStatus" label="入库状态" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.pushStatus | filterDic(dictionary.completionStatus1)}}</template>
      </el-table-column>
      <el-table-column prop="purchaseCode" label="采购订单号" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" class="yellow" @click="goTo(scope.row.purchaseOrderId)">{{scope.row.purchaseCode}}
            </el-button>
          </template>
      </el-table-column>
    </el-table>
    <material
      isDisabled
      :visible="visibleMaterial"
      @close="close"
      @submit="materialSubmit"
      :defaultData="finishedObj.productData"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下物料已超出采购参考数量"
      @submit="tipSubmit"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" border :header-cell-style="{'background-color': '#F9F9F9'}" :data="orderList">
          <el-table-column property="materialName"  label="物料名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column property="saleCode" label="销售单号" align="center"></el-table-column>
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

export default {
  name: 'applyFinishedAdd',
  mixins: [dic],
  data () {
    return {
      dictionary,
      title: '新增采购申请(成品)',
      controls: false,
      isShowBack: true,
      customBack: false,
      applicationType: 'add',
      fileList: [],
      deliveryTime: '',
      ruleForm: {
        managerStuff: '',
        managerStuffId: '',
        saleCodeList: '',
        baseFileVoList: [],
        purchaseApplyMaterialVoList: [],
        remark: ''
      },
      rules: {
        managerStuffId: [
          { required: true, message: '请输入负责人', trigger: 'change' }
        ]
      },
      tableData: [],
      routeParame: {},
      dialogVisible: false,
      finishedObj: {
        associateData: [],
        productData: [],
        needData: []
      },
      detailObj: {},
      dialogType: '',
      dialogCode: '',
      orderList: [],
      saveSubmit: '',
      tipVisible: false,
      visibleMaterial: false,
      currentDate: this.beginDate(),
      resetProductList: [],
      spanArr: []
    }
  },
  created () {
    this.routeParame = this.$route.params
    // finished 是成品 subpart 是子件
    if (this.routeParame.type === 'add' && this.routeParame.page === 'finished') {
      this.title = '新增采购申请(成品)'
      document.title = '新增采购申请(成品)'
      this.getDetailFinished()
    } else if (this.routeParame.type === 'detail' && this.routeParame.page === 'finished') {
      this.title = '详情采购申请(成品)'
      document.title = '详情采购申请(成品)'
    } else if (this.routeParame.type === 'add' && this.routeParame.page === 'subpart') {
      // 销售下推非成品 新增
      this.title = '新增采购申请(子件)'
      document.title = '新增采购申请(子件)'
      this.getDetailSubpart()
    } else if (this.routeParame.type === 'detail' && this.routeParame.page === 'subpart') {
      this.title = '详情采购申请(子件)'
      document.title = '详情采购申请(子件)'
      // this.getDetailSubpart()
    } else if (this.routeParame.type === 'add' && this.routeParame.page === 'none') {
      this.title = '新增采购申请(无来源)'
      document.title = '新增采购申请(无来源)'
    } else if (this.routeParame.type === 'detail' && this.routeParame.page === 'none') {
      this.title = '详情采购申请(无来源)'
      document.title = '详情采购申请(无来源)'
    } else if (this.routeParame.type === 'add') {
      this.title = '新增采购申请'
      document.title = '新增采购申请'
      this.getDetailFinished()
    } else if (this.routeParame.type === 'detail') {
      this.title = '采购申请详情'
      document.title = '采购申请详情'
      this.getDetailFinished()
    }

    if (this.routeParame.type === 'add') {
      this.backText = '返回销售列表'
      this.applicationType = 'add'
    } else {
      this.backText = '返回采购申请单全部'
      this.applicationType = 'detail'
    }
    if (this.routeParame.type === 'detail') {
      this.getFinisheDetail()
      this.applicationType = 'detail'
    }
    // 默认当前员工
    this.ruleForm.managerStuffId = this.userInfo.stuffId
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo
    }),
    ...mapGetters(['employeeList'])
  },
  methods: {
    // 所有异步请求
    ...mapActions(['DETAIL_FINISHED_TYPE', 'ADD_PURCHASE_FINISHED_TYPE', 'POST_GLOBAL_AUDITOR', 'APPROVESEND_PURCHASE_TYPE', 'DETAIL_SUBPART_TYPE', 'ADD_PURCHASE_NON_FINISHED_TYPE', 'DETAIL_APPLY_TYPE', 'EDIT_APPLY_TYPE', 'OPEN_PURCHASE_TYPE', 'CLOSE_PURCHASE_TYPE', 'APPROVELIST_PURCHASE_TYPE', 'POST_GLOBAL_RECALL_AUDIT', 'DELETE_PURCHASE_TYPE']),
    // 同步vuex数据
    ...mapMutations([]),
    // 设置请求参数
    setParams () {
      let newArr = []
      if (this.routeParame.page === 'subpart') {
        newArr = this.finishedObj.needData
      } else if (this.routeParame.page === 'finished' && this.routeParame.type === 'add') {
        newArr = this.finishedObj.productData
      } else if (this.routeParame.page === 'finished' && this.routeParame.type === 'edit') {
        newArr = this.detailObj.purchaseApplyMaterialVoList
      } else if (this.routeParame.page === 'none') {
        newArr = this.detailObj.purchaseApplyMaterialVoList
      }
      const materialList = newArr.map(item => ({
        ...item,
        sendDate: item.sendDate ? moment(item.sendDate).format('YYYY-MM-DD') : ''
      }))
      const saleCode = this.finishedObj.associateData.map(code => code.saleCode)

      this.employeeList.forEach((v) => {
        if (v.id === this.ruleForm.managerStuffId) {
          this.ruleForm.managerStuff = v.val
        }
      })

      return {
        ...this.ruleForm,
        managerStuff: this.ruleForm.managerStuff,
        saleCodeList: this.routeParame.page === 'subpart' ? saleCode.toString() : '',
        purchaseApplyMaterialVoList: materialList
      }
    },
    beginDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      }
    },
    // 获取转单情况
    transferFn (item) {
      if (item.processQuantity === 0) {
        return '未转单'
      } if (item.processQuantity > 0 && item.processQuantity < item.quantityDisplay) {
        return '部分转单'
      } if (item.processQuantity >= item.quantityDisplay) {
        return '全部转单'
      }
      return '-'
    },
    // 获取采购成品详情
    async getDetailFinished () {
      const arg = {
        saleOrderMaterialIdStr: this.routeParame.id
      }
      const { status, data } = await this.DETAIL_FINISHED_TYPE(arg)
      if (status === 0) {
        const arr = data.purchaseVoList.map(item => ({
          ...item,
          quantity: item.stockQuantity,
          quantityDisplay: undefined
        }))
        this.resetProductList = JSON.parse(JSON.stringify(arr))
        this.finishedObj = {
          associateData: data.saleOrderVoList,
          productData: arr
        }
        this.spanArr = []
        this.getSpanArr(this.finishedObj.productData)
      }
    },
    // 采购申请详情（无来源、成品、非成品）
    async getFinisheDetail () {
      const arg = {
        purchaseApplyId: this.routeParame.id
      }
      const { status, data } = await this.DETAIL_APPLY_TYPE(arg)
      if (status === 0) {
        data.purchaseApplyMaterialVoList = data.purchaseApplyMaterialVoList.map(item => ({
          ...item,
          minSafetyStockQuantity: item.minSafetyStock,
          quantity: item.totalQuantity,
          stockQuantity: item.totalQuantity,
          typeName: item.materialType
        }))
        this.detailObj = data
        this.ruleForm = data
        this.fileList = data.baseFileDtoList
        this.ruleForm.baseFileVoList = data.baseFileDtoList
        if (this.routeParame.page === 'subpart' && this.routeParame.type === 'edit') {
          this.finishedObj.needData = data.purchaseApplyMaterialVoList
        }
        this.spanArr = []
        this.getSpanArr(this.detailObj.purchaseApplyMaterialVoList)
        // 重置数据
        this.resetProductList = JSON.parse(JSON.stringify(data.purchaseApplyMaterialVoList))
      }
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
          quantityDisplay: undefined
        }))
        this.finishedObj = {
          associateData: data.saleOrderVoList,
          productData: data.purchaseVoList,
          needData: arr
        }
        this.getSpanArr(this.finishedObj.productData)
        this.resetProductList = JSON.parse(JSON.stringify(arr))
      }
    },
    // 新增销售下推采购（成品）申请单
    async getAdd (type) {
      for (let index = 0; index < this.finishedObj.productData.length; index += 1) {
        const item = this.finishedObj.productData[index]
        if (item.quantityDisplay === undefined || !item.sendDate) {
          this.$message.error('申请数量或者交期必填')
          return
        }
      }
      const arg = this.setParams()
      const { status, data } = await this.ADD_PURCHASE_FINISHED_TYPE(arg)
      if (status === 0 && type === 'auditor') {
        this.approveFn(data)
      }
    },
    // 新增采购申请单（无来源）
    async getNoneAdd (type) {
      // 判断物料申请数量或者交期必填否则无法保存
      for (let index = 0; index < this.finishedObj.productData.length; index += 1) {
        const item = this.finishedObj.productData[index]
        if (item.quantityDisplay === undefined || !item.sendDate) {
          this.$message.error('申请数量或者交期必填')
          return
        }
      }
      const arg = this.setParams()
      const { status, data } = await this.ADD_PURCHASE_NON_FINISHED_TYPE(arg)
      if (status === 0) {
        this.approveFn(data)
      }
    },
    // 修改采购申请单
    async getEdit (type) {
      // 判断物料申请数量或者交期必填否则无法保存
      for (let index = 0; index < this.finishedObj.productData.length; index += 1) {
        const item = this.finishedObj.productData[index]
        if (item.quantityDisplay === undefined || !item.sendDate) {
          this.$message.error('申请数量或者交期必填')
          return
        }
      }
      for (let index = 0; index < this.finishedObj.needData.length; index += 1) {
        const item = this.finishedObj.needData[index]
        if (item.quantityDisplay === undefined || !item.sendDate) {
          this.$message.error('申请数量或者交期必填')
          return
        }
      }
      for (let index = 0; index < this.detailObj.purchaseApplyMaterialVoList.length; index += 1) {
        const item = this.detailObj.purchaseApplyMaterialVoList[index]
        if (item.quantityDisplay === undefined || !item.sendDate) {
          this.$message.error('申请数量或者交期必填')
          return
        }
      }

      const arg = this.setParams()
      this.EDIT_APPLY_TYPE(arg)
    },
    // 新增采购申请单（非成品）
    async getNonAdd (type) {
      // 判断物料申请数量或者交期必填否则无法保存
      if (this.routeParame.type === 'add' && this.routeParame.page === 'subpart') {
        for (let index = 0; index < this.finishedObj.needData.length; index += 1) {
          const item = this.finishedObj.needData[index]
          if (item.quantityDisplay === undefined || !item.sendDate) {
            this.$message.error('申请数量或者交期必填')
            return
          }
        }
      } else {
        for (let index = 0; index < this.finishedObj.productData.length; index += 1) {
          const item = this.finishedObj.productData[index]
          if (item.quantityDisplay === undefined || !item.sendDate) {
            this.$message.error('申请数量或者交期必填')
            return
          }
        }
      }
      const arg = this.setParams()
      const { status, data } = await this.ADD_PURCHASE_NON_FINISHED_TYPE(arg)
      if (status === 0) {
        if (type !== 'none') {
          this.approveFn(data)
        }
      }
    },
    // 设置物料交期
    setDate (type, val) {
      if (type === 'edit') {
        const arr = this.detailObj.purchaseApplyMaterialVoList.map(item => ({
          ...item,
          sendDate: this.deliveryTime ? moment(this.deliveryTime).format('YYYY-MM-DD') : ''
        }))
        this.detailObj.purchaseApplyMaterialVoList = arr
      }

      if ((type === 'add' || type === 'edit') && this.routeParame.page === 'subpart') {
        const arr = this.finishedObj.needData.map(item => ({
          ...item,
          sendDate: this.deliveryTime ? moment(this.deliveryTime).format('YYYY-MM-DD') : ''
        }))
        this.finishedObj.needData = arr
      }

      const arr = this.finishedObj.productData.map(item => ({
        ...item,
        sendDate: this.deliveryTime ? moment(this.deliveryTime).format('YYYY-MM-DD') : ''
      }))
      this.finishedObj.productData = arr
    },
    // 打开采购申请
    async setOpen (id) {
      const arg = {
        purchaseApplyId: id
      }
      const { status } = await this.OPEN_PURCHASE_TYPE(arg)
      if (status === 0) {
        this.$message.success('打开成功')
        this.getFinisheDetail()
      }
    },
    // 关闭采购申请
    async setClose (id) {
      const arg = {
        purchaseApplyId: id
      }
      const { status } = await this.CLOSE_PURCHASE_TYPE(arg)
      if (status === 0) {
        this.$message.success('关闭成功')
        this.getFinisheDetail()
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
    // 送审方法
    async approveFn (item) {
      const arg = {
        targetType: 'APPLY',
        targetCode: item.applyCode,
        targetId: item.purchaseApplyId ? item.purchaseApplyId : item.applyId
      }
      const { status } = await this.POST_GLOBAL_AUDITOR([arg])
      if (status === 0) {
        this.detailObj = { ...this.detailObj, status: 'SUBMIT' }
      }
    },
    // 送审
    async approveBtn (item) {
      if (item.applyType === 'SALE_PROD') {
        const { status, data } = await this.APPROVELIST_PURCHASE_TYPE([item.purchaseApplyId])
        if (status === 0 && data.length === 0) {
          this.approveFn(item)
        } else {
          this.tipVisible = true
          this.orderList = data
        }
      } else {
        this.approveFn(item)
      }
    },
    // 保存送审校验
    async sendCheck (item) {
      const materialList = item.purchaseApplyMaterialVoList ? item.purchaseApplyMaterialVoList : item.productData.map(it => ({
        quantityDisplay: it.quantityDisplay,
        saleOrderMaterialId: it.saleOrderMaterialId,
        saleOrderCode: it.saleCode,
        materialName: it.materialName,
        materialCode: it.materialCode,
        saleOrderId: it.saleOrderId
      }))
      const arg = {
        saleOrderMaterialVoList: materialList
      }

      for (let index = 0; index < materialList.length; index += 1) {
        const it = materialList[index]
        if (it.quantityDisplay === undefined) {
          this.$message.error('申请数量或者交期必填')
          return
        }
      }
      if (this.routeParame.page === 'finished') {
        const { status, data } = await this.APPROVESEND_PURCHASE_TYPE(arg)
        if (status === 0 && data.length === 0) {
          this.getAdd('auditor')
        } else {
          this.saveSubmit = 'auditor'
          this.tipVisible = true
          this.orderList = data
        }
      } else {
        this.approveFn(item)
      }
    },
    // 保存
    submitForm (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.routeParame.page === 'finished' && this.routeParame.type === 'add' && type !== 'auditor') {
            // 销售下推成品保存
            this.getAdd(type)
          } else if (this.routeParame.page === 'subpart' && this.routeParame.type === 'add' && type !== 'auditor') {
            // 销售下推非成品保存
            this.getNonAdd(type)
          } else if ((this.routeParame.page === 'finished' || this.routeParame.page === 'subpart' || this.routeParame.page === 'none') && type !== 'auditor') {
            this.getEdit(type)
          } else if (this.routeParame.page === 'finished' && type === 'auditor') {
            this.sendCheck(this.finishedObj)
          } else if (this.routeParame.page === 'subpart' && type === 'auditor') {
            this.getNonAdd(this.detailObj)
          }
        }
      })
    },
    // 返回
    back () {
      if (this.routeParame.type === 'add') {
        this.$router.push({
          name: 'sale'
        })
      } else {
        this.$router.push({
          name: 'applyAll'
        })
      }
    },
    // 图片上传成功方法
    uploadSuccess ({ files }) {
      this.ruleForm.baseFileVoList = files
    },
    // 删除
    delBtn (type, index) {
      if (type === 'add' && this.routeParame.page === 'finished') {
        this.spanArr = []
        this.finishedObj.productData.splice(index, 1)
        this.getSpanArr(this.finishedObj.productData)
      } else if (type === 'edit' && this.routeParame.page === 'finished') {
        this.spanArr = []
        this.detailObj.purchaseApplyMaterialVoList.splice(index, 1)
        this.getSpanArr(this.detailObj.purchaseApplyMaterialVoList)
      } else {
        this.finishedObj.needData.splice(index, 1)
      }
    },
    // 编辑保存
    applySave (type, page) {
      if (type === 'detail' && page === 'finished') {
        this.title = '修改采购申请(成品)'
        document.title = '修改采购申请(成品)'
        // this.getDetailOrder()
      } else if (type === 'detail' && page === 'subpart') {
        this.title = '修改采购申请(子件)'
        document.title = '修改采购申请(子件)'
        // this.getDetailSubpart()
      } else if (type === 'detail' && page === 'none') {
        this.title = '修改采购申请(无来源)'
        document.title = '修改采购申请(无来源)'
      } else {
        this.title = '修改采购申请'
        document.title = '修改采采购申请'
        // this.getDetailOrder()
      }
      this.getFinisheDetail()
      this.routeParame.type = 'edit'
      this.applicationType = 'add'
    },
    // 提示继续提交
    tipSubmit () {
      this.tipVisible = false
      if (this.routeParame.type === 'add') {
        this.getAdd('auditor')
        return
      }
      this.approveFn(this.detailObj)
    },
    // 撤销审核
    async recallAudit () {
      const arg = { targetType: 'APPLY', targetId: this.routeParame.id }
      const { status } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
      if (status === 0) {
        this.detailObj = { ...this.detailObj, status: 'DRAFT' }
      }
    },
    // 删除方法
    async delFn (val) {
      const { status } = await this.DELETE_PURCHASE_TYPE(val)
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
      }).catch((e) => {
        console.log(e)
      })
    },
    // 查看记录
    viewBtn (type, id) {
      this.dialogType = type
      this.dialogCode = id ? id.toString() : ''
      this.dialogVisible = true
    },
    // 关闭查看记录
    dialogClose () {
      this.dialogVisible = false
    },
    // 关闭物料
    close () {
      this.visibleMaterial = false
    },
    // 选择物料
    async materialSubmit (val) {
      try {
        this.finishedObj.productData = val
        this.close()
      } catch (e) {
        this.$message.error('新增失败')
      }
    },
    // 重置产品信息
    resetProductInfo () {
      this.spanArr = []
      this.finishedObj.productData = JSON.parse(JSON.stringify(this.resetProductList))
      this.getSpanArr(this.finishedObj.productData)
    },
    // 编辑重置产品信息
    resetEditInfo () {
      this.spanArr = []
      this.detailObj.purchaseApplyMaterialVoList = JSON.parse(JSON.stringify(this.resetProductList))
      this.getSpanArr(this.detailObj.purchaseApplyMaterialVoList)
    },
    // 重置非成品(编辑)
    setReset () {
      this.finishedObj.needData = JSON.parse(JSON.stringify(this.resetProductList))
    },
    goTo (id) {
      this.$router.push({
        name: 'orderFinishedAdd',
        params: {
          type: 'detail',
          page: 'down',
          id
        }
      })
    },
    getSpanArr (data) {
      for (let i = 0; i < data.length; i += 1) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else if (data[i].baseMaterialId === data[i - 1].baseMaterialId) {
          this.spanArr.push(0)
          this.spanArr[this.pos] += 1
        } else {
          this.spanArr.push(1)
          this.pos = i
        }
      }
    },
    // 成品详情合并
    cellMergeFinished ({ rowIndex, columnIndex }) {
      if (columnIndex < 6 || columnIndex > 8) {
        const newRow = this.spanArr[rowIndex]
        const newCol = newRow > 0 ? 1 : 0
        return {
          rowspan: newRow,
          colspan: newCol
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    cellMerge ({ rowIndex, columnIndex }) {
      if (columnIndex < 6 || columnIndex === 13) {
        const newRow = this.spanArr[rowIndex]
        const newCol = newRow > 0 ? 1 : 0
        return {
          rowspan: newRow,
          colspan: newCol
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    cellMerge1 ({ rowIndex, columnIndex }) {
      if (columnIndex < 8 || columnIndex === 13) {
        const newRow = this.spanArr[rowIndex]
        const newCol = newRow > 0 ? 1 : 0
        return {
          rowspan: newRow,
          colspan: newCol
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    checkTime (e) {
      if (this.routeParame.type === 'add' && this.routeParame.page === 'finished') {
        const list = this.finishedObj.productData.filter(item => item.baseMaterialId === e.baseMaterialId)
        if (list.length === 1) return
        this.finishedObj.productData = this.finishedObj.productData.map((item) => {
          if (item.baseMaterialId === list[0].baseMaterialId) {
            return {
              ...item,
              sendDate: list[0].sendDate
            }
          }
          return item
        })
      } else {
        const list = this.detailObj.purchaseApplyMaterialVoList.filter(item => item.baseMaterialId === e.baseMaterialId)
        if (list.length === 1) return
        this.detailObj.purchaseApplyMaterialVoList = this.detailObj.purchaseApplyMaterialVoList.map((item) => {
          if (item.baseMaterialId === list[0].baseMaterialId) {
            return {
              ...item,
              sendDate: list[0].sendDate
            }
          }
          return item
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
.section-label{
  display: flex;
  width: 100%;
  line-height: 40px;
  .lf-title{
    flex: 1
  }
}
.pic-box{
  .title{
    color:#444;
  }
}
.gray{
  color: #999;
}
.f16{
  font-weight: 600;
}
.desc-item{
  margin-top: 10px;
  button{
    margin: 0 0 6px
  }
}
.step-box{
  .f18{
    font-weight: bold;
  }
  .tz-icon-view{
    color: #7CA870;
  }
}
.el-date-editor.el-input{
  width: auto;
}
.order-list{
  max-height: 110px;
  overflow-y: auto;
}
</style>
