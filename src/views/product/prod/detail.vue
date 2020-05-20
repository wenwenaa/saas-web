<!-- 详情 -->
<template>
  <div>
    <tzHeadline
      :title="`生产${detail.rootNode ? '' : '子'}订单详情`"
      isShowBack
      :customBack="false"
      @back="headBack"
    >
      <template slot="btn">
        <el-button
          class="tz-search-submit"
          round
          size="medium"
          @click="openPrint"
        >打印</el-button>
        <el-button
          v-if="detail.status === 'DRAFT'"
          round
          size="medium"
          class="tz-btn-add"
          @click="goEdit"
        >编辑</el-button>
      </template>
    </tzHeadline>
    <h1 class="head-title">基本信息</h1>
    <el-row :gutter="16" style="line-height: 30px">
      <el-col :span="6">
        <div class="d-flex">
          <span class="labelColor label100 flex-shrink-0">生产订单号：</span>
          <tzToolTip :content="detail.prodCode"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="d-flex">
          <span class="labelColor label100 flex-shrink-0">生产负责人：</span>
          <tzToolTip :content="detail.managerStuff"></tzToolTip>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="d-flex">
          <span class="labelColor label80 flex-shrink-0">计划时间：</span>
          <span
            class="contentColor f15"
          >{{detail.planStartDate | momentTime('YYYY-MM-DD')}}~{{detail.planEndDate | momentTime('YYYY-MM-DD')}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="line-height: 30px">
      <el-col v-if="detail.rootNode" :span="6">
        <div class="d-flex">
          <span class="labelColor flex-shrink-0">税率：</span>
          <span class="contentColor">{{detail.taxPercent ? `${detail.taxPercent}%` : '-'}}</span>
        </div>
      </el-col>
      <el-col v-if="detail.rootNode" :span="6">
        <div class="d-flex">
          <span class="labelColor label80 flex-shrink-0">含税单价：</span>
          <span class="contentColor">{{detail.unitPrice || '-'}}</span>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="d-flex">
          <span class="labelColor flex-shrink-0">备注：</span>
          <span class="contentColor wordWrap">{{detail.remark}}</span>
        </div>
      </el-col>
    </el-row>
    <tzCommonFileUpload class="mt10" applicationType="detail" :fileList="fileList" />
    <h1 class="head-title">产品信息{{detail.rootNode ? '·生产母件' : ''}}</h1>
    <!-- :span-method="objectSpanMethod" -->
    <el-table
      v-if="detail.rootNode"
      size="medium"
      :data="copyPartData"
      border
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column prop="processRoute" label="工艺路线" align="center" show-overflow-tooltip />
      <el-table-column prop="quantityDisplay" label="库存数量" align="center">
        <template slot-scope="scope">{{scope.row.quantityDisplay || 0}}</template>
      </el-table-column>
      <el-table-column prop="prodQuantity" label="已完成数量" align="center">
        <template slot-scope="scope">{{scope.row.prodQuantity || 0}}</template>
      </el-table-column>
      <el-table-column prop="stockInQuantity" label="已入库数量" align="center">
        <template slot-scope="scope">{{scope.row.stockInQuantity || 0}}</template>
      </el-table-column>
      <el-table-column
        v-if="saleOrders && saleOrders.length > 0"
        prop="saleOrderCode"
        label="销售单号"
        align="center"
      >
        <template slot-scope="scope">
          <span class="yellow" @click="goSales(scope.row)">{{scope.row.saleOrderCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="计划数量" align="center">
        <template slot-scope="scope">{{scope.row.quantity || 0}}</template>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column
        v-if="detail.status === 'DRAFT' && detail.baseBomId"
        prop="versionNum"
        label="BOM版本"
        align="center"
      >
        <template slot-scope="scope">
          <span class="yellow" @click="viewBom(scope.row)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <h1 v-if="detail.rootNode" class="head-title">产品信息·生产子件</h1>
    <el-table
      size="medium"
      :data="subData"
      border
      :header-cell-style="{'background-color': '#F9F9F9'}"
    >
      <el-table-column prop="typeName" label="物料类型" align="center" show-overflow-tooltip />
      <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
      <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip />
      <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
      <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
      <el-table-column prop="processRoute" label="工艺路线" align="center" show-overflow-tooltip />
      <el-table-column prop="quantityDisplay" label="库存数量" align="center">
        <template slot-scope="scope">{{scope.row.quantityDisplay || 0}}</template>
      </el-table-column>
      <el-table-column prop="quantity" label="计划数量" align="center" width="140">
        <template slot-scope="scope">{{scope.row.quantity || 0}}</template>
      </el-table-column>
      <el-table-column prop="prodQuantity" label="已完成数量" align="center" />
      <el-table-column prop="unitName" label="单位" align="center">
        <template slot-scope="scope">{{scope.row.unitName}}</template>
      </el-table-column>
      <el-table-column prop="pushStatus" label="入库状态" align="center">
        <template slot-scope="scope">{{scope.row.pushStatus | filterDic(dic.completionStatus1)}}</template>
      </el-table-column>
      <el-table-column
        v-if="detail.rootNode && (detail.status === 'APPROVED' || detail.status === 'CLOSED')"
        prop="prodCode"
        label="单号"
        align="center"
      >
        <template slot-scope="scope">
          <span class="yellow" @click="goChild(scope.row)">{{scope.row.prodCode}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-else prop="prodCode" label="单号" align="center">
        <template slot-scope="scope">
          <span class="yellow" @click="viewBom(scope.row)">查看</span>
        </template>
      </el-table-column>-->
    </el-table>
    <h1 class="head-title">
      订单状态
      <!-- v-if="detail.rootNode" -->
      <el-button
        class="green ml10"
        icon="el-icon-document"
        type="text"
        @click="recordVisible = true"
      >查看记录</el-button>
    </h1>
    <tzSteps2 :stepsList="dic.auditStatus" titleName="name" :activeVal="detail.status">
      <template v-slot:desc="slotProp">
        <div v-if="slotProp.step.type==='DRAFT'">
          <el-button
            v-if="detail.status === 'DRAFT'"
            round
            size="mini"
            @click="checkReview"
            class="tz-search-transparent mt5"
          >送审</el-button>
          <br />
          <el-button
            v-if="detail.status === 'DRAFT'"
            round
            size="mini"
            class="tz-search-transparent"
            @click="delOrder"
          >删除订单</el-button>
        </div>
        <div v-else-if="slotProp.step.type==='SUBMIT'">
          <el-button
            v-if="detail.status === 'SUBMIT' && detail.rootNode"
            round
            size="mini"
            class="tz-search-transparent"
            @click="recallAudit"
          >撤销</el-button>
        </div>
        <div v-else-if="slotProp.step.type==='CLOSED'">
          <el-button
            v-if="detail.status === 'APPROVED'"
            round
            size="mini"
            class="tz-search-transparent"
            @click="closeOrder"
          >关闭订单</el-button>
          <el-button
            v-if="detail.status === 'CLOSED'"
            round
            size="mini"
            class="tz-search-transparent"
            @click="openOrder"
          >打开订单</el-button>
        </div>
      </template>
    </tzSteps2>
    <h1 class="head-title">入库状态</h1>
    <tzSteps2 :stepsList="dic.completionStatus1" titleName="name" :activeVal="detail.pushStatus" />
    <h1 class="head-title">
      生产进度
      <el-button
        class="green ml10"
        icon="el-icon-document"
        type="text"
        @click="scheduleVisible = true"
      >查看详情</el-button>
    </h1>
    <section v-if="detail.rootNode">
      <p class="progress-main" v-for="(it, index) in partSub" :key="index">
        {{it.rootNode ? '母件' : '子件'}}
        <el-progress
          :show-text="false"
          :class="[it.rootNode ? '' : 'progressSize', 'progress']"
          :stroke-width="it.rootNode ? 16 : 10"
          :percentage="(it.rateProgress && it.rateProgress > 100) ? 100 : it.rateProgress < 0 ? 0 : it.rateProgress"
        />
        {{`${it.rateProgress || 0}%`}}
      </p>
    </section>
    <section v-else>
      <p class="progress-main">
        子件
        <el-progress
          :show-text="false"
          class="progress"
          :stroke-width="10"
          :percentage="(detail.rateProgress && detail.rateProgress > 100) ? 100 : detail.rateProgress < 0 ? 0 : detail.rateProgress"
        />
        {{`${detail.rateProgress || 0}%`}}
      </p>
    </section>
    <h1 v-if="detail.status === 'CLOSED' || detail.status === 'APPROVED'" class="head-title">订单进度</h1>
    <section v-if="detail.status === 'CLOSED' || detail.status === 'APPROVED'">
      <section class="tabs" :style="{'width': dic.prodRelevanceDoc.length*130 + 'px'}">
        <section
          v-for="(doc, i) in dic.prodRelevanceDoc"
          :key="i"
          class="tab-item pointer ellipsis"
          @click="typeSwitch(doc.type, i)"
          :class="docType === doc.type ? 'tab-item-active' : ''"
        >{{doc.name}}</section>
      </section>
      <!-- 工序委外 -->
      <el-table
        height="300"
        v-show="docType === 'processOutsource'"
        size="medium"
        :data="processOutsourceList"
        border
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="baseSeqName" label="工序名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.baseSeqName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplyOrderQuantity" label="委外数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.supplyOrderQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="委外价格" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.unitPrice || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" align="center" />
        <el-table-column prop="managerStuff" label="创建人" align="center" />
        <el-table-column prop="createTime" label="添加时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | momentTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <tzStatus
              :status="scope.row.status"
              :content="scope.row.status | filterDic(dic.auditStatus)"
            />
          </template>
        </el-table-column>
        <el-table-column label="收回数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.recallQuantity || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="委外单号" width="140" align="center">
          <template slot-scope="scope">
            <span
              class="yellow"
              @click="jumpDetail('processOutsource', scope.row)"
            >{{scope.row.supplyCode }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 报工 -->
      <el-table
        v-show="docType === 'reportTask'"
        size="medium"
        :data="reportTaskList"
        border
        height="300"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="seqName" label="工序名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.seqName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reportStuff" label="员工姓名" align="center" />
        <el-table-column prop="equipmentName" label="设备名称" align="center" />
        <el-table-column prop="goodQuantity" label="良品数" align="center" />
        <el-table-column prop="ngQuantity" label="不良品数" align="center" />
        <el-table-column prop="discardQuantity" label="报废数" align="center" />
        <el-table-column prop="unitName" label="单位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ngReason" label="不良原因" align="center" show-overflow-tooltip />
        <el-table-column prop="unitPrice" label="计件单价" width="140" align="center" />
        <el-table-column prop="workHours" label="工时" align="center" />
        <el-table-column prop="completedNum" label="本次完工" align="center" />
        <el-table-column prop="managerStuff" label="报工人" align="center" />
        <el-table-column prop="createTime" label="报工时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | momentTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <span class="yellow" @click="delReport(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 质检 -->
      <el-table
        v-show="docType === 'qualityTest'"
        size="medium"
        :data="qualityTestList"
        border
        height="300"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="seqName" label="工序名称" align="center" />
        <el-table-column prop="totalQuantity" label="报检数" align="center" />
        <el-table-column prop="goodQuantity" label="良品数" align="center" />
        <el-table-column prop="ngQuantity" label="不良品数" align="center" />
        <el-table-column prop="ngReason" label="不良原因" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p
              v-for="(item, i) in scope.row.checkFormNgList || []"
              :key="i"
            >{{item.ngType}}:{{item.ngQuantity}}({{item.ngReason}})</p>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="检验结果" align="center">
          <template slot-scope="scope">
            <tzStatus
              :status="scope.row.result"
              :content="scope.row.result | filterDic(dic.qualityResult)"
            ></tzStatus>
          </template>
        </el-table-column>
        <el-table-column prop="managerStuff" label="质检员" width="140" align="center" />
        <el-table-column prop="checkTime" label="质检时间" align="center" />
        <el-table-column label="质检单号" align="center" fixed="right">
          <template slot-scope="scope">
            <span
              class="yellow"
              @click="jumpDetail('qualityTest', scope.row)"
            >{{scope.row.formCode }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 领料出库 -->
      <el-table
        v-show="docType === 'outbound'"
        size="medium"
        :data="outboundList"
        border
        height="300"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="materialCode" label="物料编码" align="center" show-overflow-tooltip />
        <el-table-column prop="materialName" label="物料名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.materialName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="物料规格" align="center" show-overflow-tooltip />
        <el-table-column prop="picNum" label="物料图号" align="center" show-overflow-tooltip />
        <el-table-column prop="quantity" label="领料数量" align="center" />
        <el-table-column prop="unitName" label="单位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="操作人员" align="center" />
        <el-table-column prop="createTime" label="操作时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | momentTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outFlag" label="状态" width="140" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.outFlag === 'Y'? '已出库' : '未出库'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outCode" label="出库单号" align="center" fixed="right">
          <template slot-scope="scope">
            <span class="yellow" @click="jumpDetail('outbound', scope.row)">{{scope.row.outCode }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 生产入库 -->
      <el-table
        v-show="docType === 'putStorage'"
        size="medium"
        :data="putStorageList"
        border
        height="300"
        :header-cell-style="{'background-color': '#F9F9F9'}"
      >
        <el-table-column prop="quantity" label="入库数量" align="center" />
        <el-table-column prop="unitName" label="单位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.unitName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="操作人员" align="center" />
        <el-table-column prop="createTime" label="操作时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | momentTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inFlag" label="状态" width="140" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.inFlag === 'Y'? '已入库' : '未入库'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inCode" label="入库单号" align="center" fixed="right">
          <template slot-scope="scope">
            <span class="yellow" @click="jumpDetail('putStorage', scope.row)">{{scope.row.inCode }}</span>
          </template>
        </el-table-column>
      </el-table>
      <footer class="d-flex justify-between align-items mt10">
        <div v-if="detail.status === 'APPROVED'">
          <!-- <el-button
            round
            v-if="docType === 'processOutsource'"
            size="mini"
            class="tz-search-submit-plain"
            @click="jumpPage('processOutsource')"
          >添加委外订单</el-button>-->
          <el-button
            round
            v-if="docType === 'reportTask'"
            size="mini"
            class="tz-search-submit-plain"
            @click="jumpPage('reportTaskSelf')"
          >添加自制报工</el-button>
          <!--  <el-button
            round
            v-if="docType === 'reportTask'"
            size="mini"
            class="tz-search-submit-plain"
            @click="jumpPage('reportTask')"
          >添加委外报工</el-button>-->
          <el-button
            round
            v-if="docType === 'qualityTest'"
            size="mini"
            class="tz-search-submit-plain"
            @click="jumpPage('qualityTest')"
          >添加质检</el-button>
          <el-button
            round
            v-if="docType === 'outbound'"
            size="mini"
            class="tz-search-submit-plain"
            @click="jumpPage('outbound')"
          >领料出库</el-button>
          <el-button
            round
            v-if="docType === 'putStorage'"
            size="mini"
            class="tz-search-submit-plain"
            @click="jumpPage('putStorage')"
          >生产入库</el-button>
        </div>
        <div v-else />
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page="pageIndex"
          :page-size="pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </footer>
    </section>
    <el-dialog title="bom结构" :visible.sync="bomVisible" width="600px" @close="bomVisible = false">
      <div class="tree-main">
        <el-tree :data="treeData" :props="defaultProps" node-key="code" highlight-current>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <div>
              <span>{{ data && data.materialName }}</span>
              <p>{{ data && data.materialCode }}</p>
            </div>
            <span>{{ data && data.nodeNum }}</span>
          </span>
        </el-tree>
      </div>
    </el-dialog>
    <el-dialog
      title="生产进度"
      :visible.sync="scheduleVisible"
      width="600px"
      @close="scheduleVisible = false"
    >
      <section v-if="detail.rootNode">
        <p v-for="(it, index) in partSub" :key="index">
          <span class="schedule-title">{{it.rootNode ? '母件' : '子件'}}</span>
          <span v-for="(sub, index) in it.prodOrderProcessSeqs || []" :key="index">
            <p class="progress-main">
              <el-tooltip effect="dark" :content="sub.seqName" placement="top">
                <span
                  style="display:inline-block; width:40px"
                >{{sub.seqName && sub.seqName.length > 2 ? sub.seqName.substring(0, 2) + '...' : sub.seqName}}</span>
              </el-tooltip>
              <!--{{sub.seqName}}-->
              <el-progress
                :show-text="false"
                :class="[it.rootNode ? '' : 'progressSize', 'progress']"
                :stroke-width="it.rootNode ? 16 : 10"
                :percentage="sub.rateProgressDetails && sub.rateProgressDetails > 100 ? 100 : sub.rateProgressDetails  < 0 ? 0 : sub.rateProgressDetails"
              />
              {{`${sub.rateProgressDetails || 0}%`}}
            </p>
          </span>
        </p>
      </section>
      <section v-else>
        <span class="schedule-title">{{detail.rootNode ? '母件' : '子件'}}</span>
        <span v-for="(sub, index) in detail.prodOrderProcessSeqs || []" :key="index">
          <p class="progress-main">
            {{sub.seqName}}
            <el-progress
              :show-text="false"
              class="progress"
              :stroke-width="10"
              :percentage="sub.rateProgressDetails && sub.rateProgressDetails > 100 ? 100 : sub.rateProgressDetails  < 0 ? 0 : sub.rateProgressDetails"
            />
            {{`${sub.rateProgressDetails || 0}%`}}
          </p>
        </span>
      </section>
    </el-dialog>
    <tzView
      :visible="recordVisible"
      @close="recordVisible = false"
      paramsType="PROD"
      :partParamsCode="partDetail.prodCode"
      :paramsCode="detail.prodCode"
      :rootNode="detail.rootNode"
    />
    <tzTipDialog
      :visible="tipVisible"
      content="您提交的订单中，以下物料已超出生产参考量"
      @submit="review"
      @close="tipVisible = false"
    >
      <template slot="tipTable">
        <el-table size="mini" :data="orderList">
          <el-table-column property="saleOrderCode" label="销售单号" align="center"></el-table-column>
        </el-table>
      </template>
    </tzTipDialog>
    <!-- 打印组件 -->
    <tzPrint
      :orders="[{ code: detail.prodCode, id: detail.prodOrderId }]"
      :visible="printVisible"
      type="ProdOrder"
      @cancle="closePrint"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapState, mapMutations, mapActions } from 'vuex'
import dic from '../../../global/dictionary'
import print from '../../../mixins/print'

export default {
  name: 'prodDetail',
  mixins: [print],
  data () {
    // 这里存放数据
    return {
      dic,
      docType: '',
      orderList: [],
      tipVisible: false,
      bomVisible: false,
      recordVisible: false,
      scheduleVisible: false,
      detail: {},
      fileList: [],
      partSub: [], // 子件母件数据合集 母件数据排最前边
      partData: [], // 母件数据
      copyPartData: [], // 母件数据与关联单据
      saleOrders: [], // 关联的销售订单
      subData: [], // 子件数据
      treeData: [], // bom结构
      defaultProps: {
        children: 'children',
        label: 'materialName'
      },
      typeIndex: {
        processOutsourceIndex: 1,
        reportTaskIndex: 1,
        qualityTestIndex: 1,
        outboundIndex: 1,
        putStorageIndex: 1
      },
      partDetail: {},
      subHisPageIndex: 1,
      subHisPageSize: 5,
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  destroyed () {
    this.clearTable()
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      processOutsourceTotal: state => state.product.prod.processOutsource.total, // 工序委外数据
      processOutsourceList: state => state.product.prod.processOutsource.list, // 工序委外数据
      reportTaskTotal: state => state.product.prod.reportTask.total, // 报工数据
      reportTaskList: state => state.product.prod.reportTask.list, // 报工数据
      qualityTestTotal: state => state.product.prod.qualityTest.total, // 质检数据
      qualityTestList: state => state.product.prod.qualityTest.list, // 质检数据
      outboundTotal: state => state.product.prod.outbound.total, // 领料出库数据
      outboundList: state => state.product.prod.outbound.list, // 领料出库数据
      putStorageTotal: state => state.product.prod.putStorage.total, // 生产入库数据
      putStorageList: state => state.product.prod.putStorage.list // 生产入库数据
    })
  },
  // 监控data中的数据变化
  watch: {
    $route (val) {
      if (val.name === 'prodDetail') {
        this.clearTable()
        this.getDetail().then(() => {
          this.typeSwitch('reportTask')
        })
      }
    },
    docType (type) {
      const { typeIndex } = this
      this.total = this[`${type}Total`]
      this.pageIndex = typeIndex[`${type}Index`]
    }
  },
  // 方法集合
  methods: {
    ...mapMutations([
      'SET_PROD_RELEVANCE_DOC',
      'M_SET_RELEVANCE_REPORT_TASK_LIST',
      'M_SET_RELEVANCE_REPORT_TASK_LIST_TOTAL',
      'M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST',
      'M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST_TOTAL',
      'M_SET_RELEVANCE_QUALITY_TEST_LIST',
      'M_SET_RELEVANCE_QUALITY_TEST_LIST_TOTAL',
      'M_SET_RELEVANCE_OUTBOUND_LIST',
      'M_SET_RELEVANCE_OUTBOUND_LIST_TOTAL',
      'M_SET_RELEVANCE_PUT_STORAGE_LIST',
      'M_SET_RELEVANCE_PUT_STORAGE_TOTAL'
    ]),
    ...mapActions([
      'A_GET_PROD_DETAIL',
      'A_GET_RELEVANCE_PROCESS_OUTSOURCE_LIST',
      'A_GET_RELEVANCE_REPORT_TASK_LIST',
      'A_GET_RELEVANCE_QUALITY_TEST_LIST',
      'A_GET_RELEVANCE_OUTBOUND_LIST',
      'A_GET_RELEVANCE_PUT_STORAGE_LIST',
      'A_GET_BOM_STRUCTURE_LIST',
      'POST_GLOBAL_AUDITOR',
      'POST_GLOBAL_RECALL_AUDIT',
      'A_GET_PROD_DEL',
      'PROD_LIST_CHECK_APPROVE',
      'A_GET_PROD_CLOSE',
      'A_GET_PROD_OPEN',
      'REPORT_TASK_DEL',
      'A_GET_PROD_SUB_HIS'
    ]),
    clearTable () {
      this.M_SET_RELEVANCE_REPORT_TASK_LIST()
      this.M_SET_RELEVANCE_REPORT_TASK_LIST_TOTAL()
      this.M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST()
      this.M_SET_RELEVANCE_PROCESS_OUTSOURCE_LIST_TOTAL()
      this.M_SET_RELEVANCE_QUALITY_TEST_LIST()
      this.M_SET_RELEVANCE_QUALITY_TEST_LIST_TOTAL()
      this.M_SET_RELEVANCE_OUTBOUND_LIST()
      this.M_SET_RELEVANCE_OUTBOUND_LIST_TOTAL()
      this.M_SET_RELEVANCE_PUT_STORAGE_LIST()
      this.M_SET_RELEVANCE_PUT_STORAGE_TOTAL()
    },
    // 跳转销售订单
    goSales (row) {
      const arg = {
        path: `${this.$urls.SALE_DETAIL}/detail`,
        query: { id: row.saleOrderId }
      }
      this.$router.push(arg)
    },
    // 返回列表
    headBack () {
      const { type } = this.$route.query
      if (type && type === 'reportTask') {
        this.$router.push({ name: 'prod' })
        return
      }
      this.$router.back()
    },
    // 跳转对应的新增页面
    jumpPage (type) {
      const { prodOrderId } = this.detail
      switch (type) {
        case 'processOutsource': // 添加委外订单(工序)
          this.$message.warning('暂不支持此功能')
          break
        case 'reportTaskSelf': // 添加自制报工
          this.$router.push({
            name: 'reportTask',
            params: { id: prodOrderId }
          })
          break
        case 'reportTask': // 添加委外报工
          this.$message.warning('暂不支持此功能')
          break
        case 'qualityTest': // 添加质检
          this.$router.push({
            name: 'checkListProdAdd',
            query: { id: prodOrderId }
          })
          break
        case 'outbound': // 添加领料出库
          this.$router.push({
            name: 'warehouseOutAdd',
            params: { type: 'add' },
            query: { orderIds: prodOrderId, type: 'PROD_MATERIAL' }
          })
          break
        case 'putStorage': // 添加生产入库
          this.$router.push({
            name: 'warehouseInAdd',
            params: { type: 'add' },
            query: { orderIds: prodOrderId, type: 'PROD' }
          })
          break
        default:
          break
      }
    },
    // 跳转对应的新增页面
    jumpDetail (type, row) {
      const {
 stockInId, storageOutId, supplySeqId, checkFormId
} = row
      switch (type) {
        case 'processOutsource': // 委外订单详情(工序)
          this.$router.push({
            name: 'outsourceProcessDetail',
            params: { id: supplySeqId }
          })
          break
        case 'qualityTest': // 添加质检
          this.$router.push({
            name: 'checkListProdDetail',
            query: {
              type: 'detail',
              id: checkFormId
            }
          })
          break
        case 'outbound': // 添加领料出库
          this.$router.push({
            name: 'warehouseOutDetail',
            params: { id: storageOutId },
            query: { type: 'PROD_MATERIAL' }
          })
          break
        case 'putStorage': // 添加生产入库
          this.$router.push({
            name: 'warehouseInDetail',
            params: { id: stockInId },
            query: { type: 'PROD' }
          })
          break
        default:
          break
      }
    },
    // 送审前校验
    async checkReview () {
      try {
        const { prodOrderId } = this.detail
        const { status, data } = await this.PROD_LIST_CHECK_APPROVE([
          prodOrderId
        ])
        if (status === 0) {
          if (data && data.length > 0) {
            this.orderList = data.map(it => ({ saleOrderCode: it }))
            this.tipVisible = true
          } else {
            this.review()
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 送审
    async review () {
      try {
        this.tipVisible = false
        const { prodOrderId, prodCode } = this.detail
        const arg = {
          targetId: prodOrderId,
          targetCode: prodCode,
          targetType: 'PROD'
        }
        const { status } = await this.POST_GLOBAL_AUDITOR([arg])
        if (status === 0) {
          this.$message.success('送审成功')
          this.getDetail()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 撤销审核
    async recallAudit () {
      try {
        const { id } = this.$route.params
        const arg = { targetType: 'PROD', targetId: id }
        const { status } = await this.POST_GLOBAL_RECALL_AUDIT(arg)
        if (status === 0) {
          this.detail = { ...this.detail, status: 'DRAFT' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除订单
    delOrder () {
      this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delAction()
        })
        .catch(() => {})
    },
    // 删除请求接口
    async delAction () {
      try {
        const { id } = this.$route.params
        const { status } = await this.A_GET_PROD_DEL({ prodOrderId: id })
        if (status === 0) {
          this.$message.success('删除成功')
          this.$router.back()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭订单
    async closeOrder () {
      try {
        const { prodOrderId, prodCode } = this.detail
        const { status } = await this.A_GET_PROD_CLOSE({
          prodOrderId,
          prodOrderCode: prodCode
        })
        if (status === 0) {
          this.detail = { ...this.detail, status: 'CLOSED' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 打开订单
    async openOrder () {
      try {
        const { prodOrderId, prodCode } = this.detail
        const { status } = await this.A_GET_PROD_OPEN({
          prodOrderId,
          prodOrderCode: prodCode
        })
        if (status === 0) {
          this.detail = { ...this.detail, status: 'APPROVED' }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 合并单元格
    objectSpanMethod ({ rowIndex, columnIndex }) {
      let arr = [9, 10]
      const len = this.saleOrders.length
      if (len <= 1) {
        arr = []
      }
      if (!arr.includes(columnIndex)) {
        if (rowIndex === 0) {
          return { rowspan: len, colspan: 1 }
        }
        return { rowspan: 0, colspan: 0 }
      }
      return { rowspan: 1, colspan: 1 }
    },
    // 查看BOM
    async viewBom (row) {
      try {
        const { baseBomId, baseBomVersionId, versionNum } = row
        const arg = {
          baseBomId,
          baseBomVersionId,
          versionNum
        }
        const { status, data } = await this.A_GET_BOM_STRUCTURE_LIST(arg)
        if (status === 0) {
          this.treeData = data
          this.bomVisible = true
        }
      } catch (e) {
        console.log(e)
      }
    },
    delReport (row) {
      const { prodOrderReportId } = row
      this.$confirm('此操作将永久删除该次报工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.reportTaskDel(prodOrderReportId)
        })
        .catch(() => {})
    },
    // 删除报工
    async reportTaskDel (prodOrderReportId) {
      try {
        const { status } = await this.REPORT_TASK_DEL({ prodOrderReportId })
        if (status === 0) {
          this.M_SET_RELEVANCE_REPORT_TASK_LIST()
          this.M_SET_RELEVANCE_REPORT_TASK_LIST_TOTAL()
          this.getDetail()
          // this.getTableData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 跳转子件详情
    goChild (row) {
      const { id } = this.$route.params
      if (id === row.prodOrderId) {
        return
      }
      this.$router.push({
        name: 'prodDetail',
        params: { id: row.prodOrderId }
      })
    },
    // 获取详情数据
    async getDetail () {
      try {
        const { id } = this.$route.params
        const { status, data } = await this.A_GET_PROD_DETAIL({
          prodOrderId: id
        })
        if (status === 0) {
          const { prodOrderDtos, baseFileDtos, prodOrderSales } = data
          this.saleOrders = prodOrderSales
          this.fileList = baseFileDtos
          const partData =
            prodOrderDtos &&
            prodOrderDtos.filter(it => it.prodOrderId === Number(id))
          const tempDetail =
            prodOrderDtos && prodOrderDtos.filter(it => it.rootNode)
          this.partDetail =
            tempDetail && tempDetail.length > 0 ? tempDetail[0] : {}
          const [materialInfo = {}] = partData
          this.detail = materialInfo
          if (
            materialInfo.status === 'APPROVED' ||
            materialInfo.status === 'CLOSED'
          ) {
            this.typeSwitch('reportTask')
          }
          if (materialInfo.rootNode) {
            this.partData = partData
            this.copyPartData = partData
            if (prodOrderSales.length > 0) {
              this.copyPartData = prodOrderSales.map(it => ({
                ...partData[0],
                quantity: it.quantity,
                saleOrderCode: it.saleCode,
                saleOrderId: it.saleOrderId,
                saleOrderMaterialId: it.saleOrderMaterialId
              }))
            }
          } else {
            this.subData = partData
          }
          const subData =
            (prodOrderDtos && prodOrderDtos.filter(it => !it.rootNode)).map(
              it => ({
                ...it,
                quantity: it.quantity ? Number(it.quantity) : undefined,
                display: it.prodOrderProcessSeqs
                  ? it.prodOrderProcessSeqs.map(item => item.seqName).join()
                  : '',
                baseProcessSeqDtos: it.prodOrderProcessSeqs
              })
            ) || []
          this.subData = subData
          this.partSub = [...partData, ...subData]
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 跳转修改
    goEdit () {
      const { id } = this.$route.params
      this.$router.push({
        name: 'addProd',
        params: { type: 'edit' },
        query: { prodOrderId: id }
      })
    },
    // 切换关联数据类型
    typeSwitch (type) {
      this.docType = type
      this.getTableData()
    },
    // 获取表格数据
    async getTableData () {
      try {
        const {
          docType,
          typeIndex,
          pageSize,
          detail
        } = this
        const arg = {
          pageIndex: typeIndex[`${docType}Index`],
          pageSize,
          prodOrderId: detail.prodOrderId,
          refCode: detail.prodCode,
          refMaterialId: detail.prodOrderId,
          refId: detail.prodOrderId
        }
        if (docType === 'processOutsource') {
          const { status } = await this.A_GET_RELEVANCE_PROCESS_OUTSOURCE_LIST(
            arg
          )
          if (status === 0) {
            this.total = this[`${docType}Total`]
            this.pageIndex = typeIndex[`${docType}Index`]
          }
        }
        if (docType === 'reportTask') {
           const { status } = await this.A_GET_RELEVANCE_REPORT_TASK_LIST(arg)
           if (status === 0) {
            this.total = this[`${docType}Total`]
            this.pageIndex = typeIndex[`${docType}Index`]
          }
        }
        if (docType === 'qualityTest') {
           const { status } = await this.A_GET_RELEVANCE_QUALITY_TEST_LIST(arg)
            if (status === 0) {
            this.total = this[`${docType}Total`]
            this.pageIndex = typeIndex[`${docType}Index`]
          }
        }
        if (docType === 'outbound') {
           const { status } = await this.A_GET_RELEVANCE_OUTBOUND_LIST(arg)
            if (status === 0) {
            this.total = this[`${docType}Total`]
            this.pageIndex = typeIndex[`${docType}Index`]
          }
        }
        if (docType === 'putStorage') {
           const { status } = await this.A_GET_RELEVANCE_PUT_STORAGE_LIST(arg)
            if (status === 0) {
            this.total = this[`${docType}Total`]
            this.pageIndex = typeIndex[`${docType}Index`]
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 切换页码
    currentChange (index) {
      console.log(index)
      this.pageIndex = index
      this.typeIndex[`${this.docType}Index`] = index
      console.log(this.typeIndex)
      this.getTableData()
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getDetail()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {}
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.tree-main {
  height: 600px;
  overflow-y: scroll;
  padding: 16px 0;
}
.progress-main {
  display: flex;
  align-items: center;
  line-height: 30px;
}
.progress {
  display: inline-block;
  width: 440px;
  margin: 0 8px;
}
.tabs {
  display: flex;
  margin: 0 1px;
  border: 1px solid #dcdfe6;
  box-sizing: content-box;
  border-radius: 4px;
}
.tab-item {
  display: inline-block;
  padding: 10px 16px;
  border-right: 1px solid #dcdfe6;
  text-align: center;
  width: 131px;
  font-weight: 500;
  background-color: #f0f2f5;
}
.tab-item:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.tab-item:last-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.tab-item:hover {
  background-color: #fff;
  color: #7ca870;
}
.tab-item-active {
  background-color: #fff;
  color: #7ca870;
}
.custom-tree-node {
  width: 600px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.schedule-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 30px;
}
</style>
<style>
.progressSize .el-progress__text {
  font-size: 14px !important;
}
</style>
