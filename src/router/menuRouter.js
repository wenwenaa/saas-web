import * as urls from './routePath'

const bom = () => import('../views/base/bom/index.vue')
const material = () => import('../views/base/material/index.vue')
const process = () => import('../views/base/process/index.vue')
const drawNum = () => import('../views/base/drawNum/index.vue')
const routing = () => import('../views/base/routing/index.vue')
const materialRouting = () => import('../views/base/routing/materialIndex.vue')
const equipment = () => import('../views/base/equipment/index.vue') // 设备组件
const materialType = () => import('../views/base/materialtype/index.vue') // 物料类型
const metering = () => import('../views/base/metering/index.vue') // 计量单位
const customer = () => import('../views/base/customer/index.vue') // 客户主档
const supplier = () => import('../views/base/supplier/index.vue') // 供应商主档
const warehouse = () => import('../views/base/warehouse/index.vue') // 供应商主档

// 生产
const bad = () => import('../views/product/bad/index.vue') // 不良类型主档
const prod = () => import('../views/product/prod/index.vue') // 生产列表
const prodPushDown = () => import('../views/product/pushDown/index.vue') // 下推列表

// 销售
const sale = () => import('../views/sales/sale/index.vue') // 销售列表
const saleAll = () => import('../views/sales/sale/saleAll.vue') // 销售列表

// 库存
const warehouseIn = () => import('../views/wares/warehouseIn/index.vue') // 入库
const warehouseOut = () => import('../views/wares/warehouseOut/index.vue') // 出库
const allocation = () => import('../views/wares/allocation/index.vue') // 调拨
const report = () => import('../views/wares/report/index.vue') // 库存报表
const initialization = () => import('../views/wares/initialization/index.vue') // 库存报表
const inventory = () => import('../views/wares/inventory/index.vue') // 盘点
const inventoryall = () => import('../views/wares/inventory/inventoryall.vue') // 盘点

// 采购
const applyAll = () => import('../views/purchase/applyAll/index.vue') // 采购申请单全部
const applyPersonal = () => import('../views/purchase/applyPersonal/index.vue') // 采购申请单个人
const orderAll = () => import('../views/purchase/orderAll/index.vue') // 采购订单个人
const orderPersonal = () => import('../views/purchase/orderPersonal/index.vue') // 采购订单个人

// 委外
const outsourceProcess = () => import('../views/outsource/process/index.vue') // 工序委外
const outsourceProduct = () => import('../views/outsource/outProduct/index.vue') // 成品委外

// 质检
// 全局质检方案
const globalQualityComponent = () => import('../views/quality/globalQuality/index.vue')
// 物料质检方案
const materialQualityComponent = () => import('../views/quality/materialQuality/index.vue')
// 质检列表
const checkListComponent = () => import('../views/quality/checkList/index.vue')

// 可视系统 三色灯
const equipmentStatus = () => import('../views/visualSystem/statusPanel/index.vue') // 设备状态可视图
const equipmentWatchPanel = () => import('../views/visualSystem/watchPanel/index.vue') // 设备监控
const oeeList = () => import('../views/visualSystem/oeePanel/index.vue') // OEE分析列表

// 设置
const check = () => import('../views/webSetting/check/index.vue')
const classSetting = () => import('../views/webSetting/classSetting/index.vue')

// 待办事项
const schedule = () => import('../views/orderCheck/schedule/index.vue')
// 中转页
const transferPage = () => import('../views/transferPage.vue')

const menu = [
  {
    path: urls.BASE,
    meta: {
      title: '基础数据',
      icon: 'icon-nav-base'
    },
    component: transferPage,
    children: [
      {
        name: 'material',
        path: `${urls.BASE_MATERIAL}`,
        meta: {
          title: '物料主档'
        },
        component: material
      },
      {
        name: 'drawNum',
        path: `${urls.BASE_DRAW_NUM}`,
        meta: {
          title: '图号主档'
        },
        component: drawNum
      },
      {
        name: 'process',
        path: `${urls.BASE_PROCESS}`,
        meta: {
          title: '工序主档'
        },
        component: process
      },
      {
        name: 'routing',
        path: `${urls.BASE_ROUTING}`,
        meta: {
          title: '全局工艺路线'
        },
        component: routing
      },
      {
        name: 'materialRouting',
        path: `${urls.BASE_MATERIAL_ROUTING}`,
        meta: {
          title: '物料工艺路线'
        },
        component: materialRouting
      },
      {
        name: 'bom',
        path: `${urls.BASE_BOM}`,
        meta: {
          title: '多阶BOM'
        },
        component: bom
      },
      {
        name: 'equipmentList',
        path: `${urls.BASE_EQUIPMENT}`,
        meta: {
          title: '设备主档'
        },
        component: equipment
      },
      {
        name: 'materialtypeList',
        path: `${urls.BASE_MATERIAL_TYPE}`,
        meta: {
          title: '物料类型'
        },
        component: materialType
      },
      {
        name: 'meteringList',
        path: `${urls.BASE_METERING}`,
        meta: {
          title: '计量单位'
        },
        component: metering
      },
      {
        name: 'customerList',
        path: `${urls.BASE_CUSTOMER}`,
        meta: {
          title: '客户主档'
        },
        component: customer
      },
      {
        name: 'supplierList',
        path: `${urls.BASE_SUPPLIER}`,
        meta: {
          title: '供应商主档'
        },
        component: supplier
      },
      {
        name: 'warehouseList',
        path: `${urls.BASE_WAREHOUSE}`,
        meta: {
          title: '仓库主档'
        },
        component: warehouse
      }
    ]
  },
  {
    path: urls.SALE_BASE,
    meta: {
      title: '销售订单',
      icon: 'icon-nav-sale'
    },
    component: transferPage,
    children: [
      {
        name: 'saleAll',
        path: `${urls.SALE_LIST_ALL}`,
        meta: {
          title: '销售列表'
        },
        component: saleAll
      },
      {
        name: 'sale',
        path: `${urls.SALE_LIST}`,
        meta: {
          title: '销售列表(个人)'
        },
        component: sale
      }
    ]
  },
  {
    path: urls.BASE_PRO,
    meta: {
      title: '生产管理',
      icon: 'icon-nav-product'
    },
    component: transferPage,
    children: [
      {
        name: 'badList',
        path: `${urls.BASE_PRO_BAD}`,
        meta: {
          title: '不良类型主档'
        },
        component: bad
      },
      {
        name: 'prod',
        path: `${urls.PROD_PRODUCTION}`,
        meta: {
          title: '生产订单列表'
        },
        component: prod
      },
      {
        name: 'prodPushDown',
        path: `${urls.PROD_PUSH_DOWN}`,
        meta: {
          title: '下推列表'
        },
        component: prodPushDown
      }
    ]
  },
  {
    path: urls.WARES,
    meta: {
      title: '库存',
      icon: 'icon-nav-order-check'
    },
    component: transferPage,
    children: [
      {
        name: 'warehouseIn',
        path: `${urls.WAREHOUSE_IN}`,
        meta: {
          title: '入库'
        },
        component: warehouseIn
      },
      {
        name: 'warehouseOut',
        path: `${urls.WAREHOUSE_OUT}`,
        meta: {
          title: '出库'
        },
        component: warehouseOut
      },
      {
        name: 'allocation',
        path: `${urls.ALLOCATION}`,
        meta: {
          title: '调拨'
        },
        component: allocation
      },
      {
        name: 'inventory',
        path: `${urls.INVENTORY}`,
        meta: {
          title: '盘点'
        },
        component: inventory
      },
      {
        name: 'inventoryall',
        path: `${urls.INVENTORY_ALL}`,
        meta: {
          title: '盘点(全)'
        },
        component: inventoryall
      },
      {
        name: 'report',
        path: `${urls.REPORT}`,
        meta: {
          title: '库存报表'
        },
        component: report
      },
      {
        name: 'initialization',
        path: `${urls.INITIALIZATION}`,
        meta: {
          title: '仓库管理'
        },
        component: initialization
      }
    ]
  },
  {
    path: urls.PURCHASE,
    meta: {
      title: '采购',
      icon: 'icon-nav-purchase'
    },
    component: transferPage,
    children: [
      {
        name: 'applyAll',
        path: `${urls.APPLY_ALL}`,
        meta: {
          title: '采购申请单全部'
        },
        component: applyAll
      },
      {
        name: 'applyPersonal',
        path: `${urls.APPLY_PERSONAL}`,
        meta: {
          title: '采购申请单个人'
        },
        component: applyPersonal
      },
      {
        name: 'orderAll',
        path: `${urls.ORDER_ALL}`,
        meta: {
          title: '采购订单全部'
        },
        component: orderAll
      },
      {
        name: 'orderPersonal',
        path: `${urls.ORDER_PERSONAL}`,
        meta: {
          title: '采购订单个人'
        },
        component: orderPersonal
      }
    ]
  },
  {
    path: urls.BASE_OUTSOURCE,
    meta: {
      title: '委外管理',
      icon: 'icon-nav-outsource'
    },
    component: transferPage,
    children: [
      {
        name: 'outsourceProcess',
        path: `${urls.BASE_OUTSOURCE_PROCESS}`,
        meta: {
          title: '工序委外列表'
        },
        component: outsourceProcess
      },
      {
        name: 'outsourceProduct',
        path: `${urls.BASE_OUTSOURCE_PRODUCT}`,
        meta: {
          title: '成品委外列表'
        },
        component: outsourceProduct
      }
    ]
  },
  {
    path: urls.ORDER_CHECK,
    meta: {
      title: '审核',
      icon: 'icon-nav-order-check'
    },
    component: transferPage,
    children: [
      {
        name: 'schedule',
        path: `${urls.SCHEDULE}`,
        meta: {
          title: '待办事项'
        },
        component: schedule
      }
    ]
  },
  {
    path: urls.QUALITY_TEST,
    meta: {
      title: '质检',
      icon: 'icon-nav-quality'
    },
    component: transferPage,
    children: [
      {
        name: 'globalQuality',
        path: `${urls.GLOBAL_QUALITY}`,
        meta: {
          title: '全局质检方案'
        },
        component: globalQualityComponent
      },
      {
        name: 'materialQuality',
        path: `${urls.MATERIAL_QUALITY}`,
        meta: {
          title: '物料质检方案'
        },
        component: materialQualityComponent
      },
      {
        name: 'checkList',
        path: `${urls.CHECK_LIST}`,
        meta: {
          title: '检验单列表'
        },
        component: checkListComponent
      }
    ]
  },
  {
    path: urls.VISUAL_SSD,
    meta: {
      title: '设备状态可视系统',
      icon: 'icon-nav-quality'
    },
    component: transferPage,
    children: [
      {
        name: 'equipmentStatus',
        path: `${urls.VISUAL_SSD_EQUIPMENT_STATUS}`,
        meta: {
          title: '设备状态可视图'
        },
        component: equipmentStatus
      },
      {
        name: 'equipment',
        path: `${urls.VISUAL_SSD_EQUIPMENT_WATCH}`,
        meta: {
          title: '设备监控'
        },
        component: equipmentWatchPanel
      },
      {
        name: 'oee',
        path: `${urls.VISUAL_SSD_OEE_LIST}`,
        meta: {
          title: 'OEE分析'
        },
        component: oeeList
      }
    ]
  },
  {
    path: urls.SETTING,
    meta: {
      title: '设置',
      icon: 'icon-nav-setting'
    },
    component: transferPage,
    children: [
      {
        name: 'check',
        path: `${urls.CHECK}`,
        meta: {
          title: '审核流设置'
        },
        component: check
      },
      {
        name: 'class setting',
        path: `${urls.CLASSSETTING}`,
        meta: {
          title: '班次设置'
        },
        component: classSetting
      }
    ]
  }
]
export default menu
