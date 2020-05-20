
// 数组形式的字典项
const isDefault = [
  { label: '否', value: 'N' },
  { label: '是', value: 'Y' }
]
// 数组形式的字典项
const processType = [
  { name: '全局工艺路线', type: 'Y' },
  { name: '编辑物料工艺路线', type: 'N' }
]
const moduleName = [
  { type: 'SALE', name: '销售模块', orderName: '销售订单' },
  { type: 'PROD', name: '生产模块', orderName: '生产订单' },
  { type: 'APPLY', name: '采购申请模块', orderName: '采购申请订单' },
  { type: 'PURCHASE', name: '采购模块', orderName: '采购订单' },
  { type: 'SUPPLY', name: '成品委外模块', orderName: '成品委外订单' },
  { type: 'SUPPLY_SEQ', name: '工序委外模块', orderName: '工序委外订单' }
]
const processName = [
  { type: 'SELF', name: '自制' },
  { type: 'SUPPLY', name: '委外' }
]
const routingName = [
  { type: '', name: '全部' },
  { type: 'GLOBAL', name: '全局' },
  { type: 'MATERIAL', name: '物料' }
]

const suggestion = [
  { type: 'ACCEPT', name: '同意' },
  { type: 'REJECT', name: '拒绝' }
]

const suggestionHistory = [
  { type: 'ACCEPT', name: '同意' },
  { type: 'REJECT', name: '拒绝' },
  { type: 'CREATE', name: '创建' },
  { type: 'SUBMIT', name: '提交审核' },
  { type: 'REVOKE', name: '撤回' },
  { type: 'CLOSE', name: '关闭' },
  { type: 'OPEN', name: '打开' }
]

const checkStatus = [
  { type: 'DRAFT', name: '草稿状态' },
  { type: 'SUBMIT', name: '审核中' },
  { type: 'APPROVED', name: '审核通过' }
]
// 审核状态
const auditStatus = [
  { type: 'DRAFT', name: '未送审' },
  { type: 'SUBMIT', name: '审核中' },
  { type: 'APPROVED', name: '审核通过' },
  { type: 'CLOSED', name: '关闭' }
]
// 完成状态 适用于销售详情
const completionSale = [
  { type: 'NONE', name: '未完成' },
  { type: 'PARTIAL', name: '部分完成' },
  { type: 'FULL', name: '全部完成' }
]
// 完成状态 适用于生产 入库 采购
const completionStatus1 = [
  { type: 'NONE', name: '未入库' },
  { type: 'PARTIAL', name: '部分入库' },
  { type: 'FULL', name: '全部入库' }
]
const completionStatus6 = [
  { type: 'NONE', name: '未出库' },
  { type: 'PARTIAL', name: '部分出库' },
  { type: 'FULL', name: '全部出库' }
]
// 完成状态 适用于采购申请
const completionStatus2 = [
  { type: 'NONE', name: '未转单' },
  { type: 'PARTIAL', name: '部分转单' },
  { type: 'FULL', name: '全部转单' }
]
// 完成状态 适用于采购申请
const completionStatus5 = [
  { type: 'SALE_PROD', name: '销售成品采购' },
  { type: 'SALE_MATERIAL', name: '销售下推非成品' },
  { type: 'NONE', name: '无来源' }
]
// 完成状态 适用于采购订单
const completionStatus7 = [
  { type: 'SALE_PROD', name: '销售成品采购' },
  { type: 'SALE_MATERIAL', name: '销售下推非成品' },
  { type: 'APPLY', name: '采购申请单下推' },
  { type: 'NONE', name: '无来源' }
]
// 完成状态 适用于生产
const completionStatus3 = [
  { type: 'NONE', name: '未采购' },
  { type: 'PARTIAL', name: '部分采购' },
  { type: 'FULL', name: '全部采购' }
]
// 完成状态 适用于销售
const completionStatus4 = [
  { type: 'NONE', name: '未发货' },
  { type: 'PARTIAL', name: '部分发货' },
  { type: 'FULL', name: '全部发货' }
]
// 完成状态 适用于销售
const completionStatus8 = [
  { type: 'NONE', name: '未收回' },
  { type: 'PARTIAL', name: '部分收回' },
  { type: 'FULL', name: '全部收回' }
]
// 生产关联单据
const prodRelevanceDoc = [
  { type: 'processOutsource', name: '工序委外' },
  { type: 'reportTask', name: '报工' },
  { type: 'qualityTest', name: '质检' },
  { type: 'outbound', name: '领料出库' },
  { type: 'putStorage', name: '生产入库' }
]
// 质检状态
const qualityStatus = [
  { type: 'NOT', name: '无需质检' },
  { type: 'NONE', name: '未质检' },
  { type: 'PARTIAL', name: '部分质检' },
  { type: 'FULL', name: '全部质检' }
]
const qualityStatus2 = [
  { type: 'NONE', name: '未质检' },
  { type: 'PARTIAL', name: '部分质检' },
  { type: 'FULL', name: '全部质检' }
]
const wareInStatus = [
  {
    type: 'PURCHASE',
    name: '采购入库',
    order: '采购入库详情'
  },
  {
    type: 'PROD',
    name: '生产入库',
    order: '生产入库详情'
  },
  {
    type: 'SUPPLY',
    name: '委外入库',
    order: '委外入库详情'
  },
  {
    type: 'SALE_RETURN',
    name: '销售退货入库',
    order: '销售退货入库详情'
  },
  {
    type: 'OTHER_IN',
    name: '其他入库',
    order: '其他入库详情'
  },
  {
    type: 'EXCHANGE_IN',
    name: '调仓入库',
    order: '调仓入库详情'
  },
  {
    type: 'INIT',
    name: '初始化库存入库',
    order: '初始化库存入库详情'
  }
]
const wareInTypes = [
  {
    type: 'PURCHASE',
    name: '新增采购入库',
    order: '采购订单',
    material: '采购入库'
  },
  {
    type: 'PROD',
    name: '新增生产入库',
    order: '生产订单',
    material: '生产入库'
  },
  {
    type: 'SUPPLY',
    name: '新增成品委外入库',
    order: '委外订单',
    material: '成品委外入库'
  },
  {
    type: 'SALE',
    name: '新增销售退货入库',
    order: '销售订单',
    material: '销售退货入库'
  },
  {
    type: 'OTHER_IN',
    name: '新增其他入库',
    order: '',
    material: '其他入库'
  },
  {
    type: 'EXCHANGE_IN',
    name: '新增调仓入库'
  }
]
const wareOutTypes = [
  {
    type: 'PURCHASE',
    name: '新增采购退货',
    order: '采购订单',
    material: '采购退货出库'
  },
  {
    type: 'PROD_MATERIAL',
    name: '新增生产领料',
    order: '生产订单',
    material: '所需物料明细'
  },
  {
    type: 'SUPPLY_MATERIAL',
    name: '新增委外发料单',
    order: '委外订单',
    material: '所需物料明细'
  },
  {
    type: 'SUPPLY',
    name: '新增委外退货单',
    order: '委外订单',
    material: '委外退货出库'
  },
  {
    type: 'SALE',
    name: '新增销售发货出库',
    order: '销售订单',
    material: '销售发货出库'
  },
  {
    type: 'OTHER_OUT',
    name: '新增其他出库',
    order: '',
    material: '其他出库'
  }
]
const wareOutStatus = [
  {
    type: 'PURCHASE_RETURN',
    name: '采购退货出库',
    order: '采购退货出库详情'
  },
  {
    type: 'PROD_MATERIAL',
    name: '生产领料出库',
    order: '生产领料出库详情'
  },
  {
    type: 'SUPPLY_RETURN',
    name: '委外退货出库',
    order: '委外退货出库详情'
  },
  {
    type: 'SUPPLY_MATERIAL',
    name: '委外发料出库',
    order: '委外发料出库详情'
  },
  {
    type: 'SALE',
    name: '销售发货出库',
    order: '销售发货出库详情'
  },
  {
    type: 'OTHER_OUT',
    name: '其他出库',
    order: '其他出库详情'
  },
  {
    type: 'EXCHANGE_OUT',
    name: '调仓出库',
    order: '调仓出库详情'
  }
]
const wareRoutes = [{
  name: '新增采购入库单',
  route: 'orderAll',
  type: 'PURCHASE'
},
{
  name: '新增生产入库单',
  route: 'prod',
  type: 'PROD'
},
{
  name: '新增销售退货单',
  route: 'sale',
  type: 'SALE_RETURN'
},
{
  name: '新增其他入库单',
  route: 'warehouseInAdd',
  type: 'OTHER_IN'
},
{
  name: '新增委外成品入库单',
  route: 'outsourceProduct',
  type: 'SUPPLY'
}
]
const wareOutRoutes = [{
  name: '新增采购退货单',
  route: 'orderAll',
  type: 'PURCHASE_RETURN'
},
{
  name: '新增领料出库单',
  route: 'prod',
  type: 'PROD_MATERIAL'
},
{
  name: '新增销售发货单',
  route: 'sale',
  type: 'SALE'
},
{
  name: '新增其他出库单',
  route: 'warehouseOutAdd',
  type: 'OTHER_OUT'
},
{
  name: '新增委外发料出库单',
  route: 'outsourceProduct',
  type: 'SUPPLY_MATERIAL'
},
{
  name: '新增委外退货出库单',
  route: 'outsourceProduct',
  type: 'SUPPLY'
}
]
const tipStatus = [
  {
    type: 'PURCHASE_RETURN',
    name: '采购单号'
  },
  {
    type: 'PURCHASE',
    name: '采购单号'
  },
  {
    type: 'PROD',
    name: '生产单号'
  },
  {
    type: 'PROD_MATERIAL',
    name: '生产单号'
  },
  {
    type: 'SALE',
    name: '销售单号'
  },
  {
    type: 'SALE_RETURN',
    name: '销售单号'
  },
  {
    type: 'OTHER_OUT',
    name: '其他出库单号'
  },
  {
    type: 'OTHER_IN',
    name: '其他入库单号'
  },
  {
    type: 'SUPPLY',
    name: '委外订单号'
  },
  {
    type: 'SUPPLY_RETURN',
    name: '委外订单号'
  },
  {
    type: 'SUPPLY_MATERIAL',
    name: '委外订单号'
  }
]

const inventoryResult = [
  {
    name: '盘盈',
    type: 'SURPLUS'
  },
  {
    name: '盘亏',
    type: 'LOSS'
  },
  {
    name: '账实相符',
    type: 'BALANCE'
  }
]

// 销售关联 出库
const outRelation = [
  {
    name: '已出库',
    type: 'Y'
  },
  {
    name: '未出库',
    type: 'N'
  }
]
// 销售关联 入库
const inRelation = [
  {
    name: '已入库',
    type: 'Y'
  },
  {
    name: '未入库',
    type: 'N'
  }
]
const outSourceTypes = [
  {
    detail: '成品委外详情',
    add: '新增成品委外单',
    origin: '无来源',
    type: 'NONE',
    name: '无来源',
    typeName: '成品委外',
    edit: '编辑成品委外'
  },
  {
    detail: '销售成品委外详情',
    add: '新增销售成品委外单',
    origin: '销售订单',
    type: 'SALE',
    name: '销售',
    typeName: '销售成品委外',
    edit: '编辑销售成品委外'
  }
]

// 质检类型
const qualityCheck = [
  {
    name: '入库检',
    type: 'IN'
  },
  {
    name: '出库检',
    type: 'OUT'
  },
  {
    name: '过程检',
    type: 'PROD'
  }
]
// 质检结果
const qualityResult = [
  {
    name: '未质检',
    type: 'U'
  },
  {
    name: '合格',
    type: 'Y'
  },
  {
    name: '不合格',
    type: 'N'
  }
]
// 选中结果
const qualityResults = [
  {
    id: 1,
    name: '合格',
    type: 'Y'
  },
  {
    id: 2,
    name: '不合格',
    type: 'N'
  }
]

export default {
  prodRelevanceDoc,
  isDefault,
  moduleName,
  processName,
  routingName,
  suggestion,
  checkStatus,
  auditStatus,
  completionStatus1,
  completionStatus2,
  completionStatus3,
  completionStatus4,
  completionStatus5,
  completionStatus6,
  completionStatus7,
  completionStatus8,
  processType,
  qualityStatus,
  wareInStatus,
  qualityStatus2,
  wareInTypes,
  wareOutStatus,
  wareRoutes,
  wareOutRoutes,
  wareOutTypes,
  suggestionHistory,
  inventoryResult,
  tipStatus,
  completionSale,
  outRelation,
  inRelation,
  outSourceTypes,
  qualityCheck,
  qualityResult,
  qualityResults
}
