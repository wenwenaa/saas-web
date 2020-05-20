import * as urls from './routePath'

const materialDetail = () => import('../views/base/material/detail.vue')
const processDetail = () => import('../views/base/process/detail.vue')
const routingDetail = () => import('../views/base/routing/detail.vue')
const drawNumDetail = () => import('../views/base/drawNum/detail.vue')

// BOM
const bomAdd = () => import('../views/base/bom/add.vue')
const bomDetail = () => import('../views/base/bom/childBom.vue')
// const childBomAdd = () => import('../views/base/bom/childBomAdd.vue')
const equipmentAdd = () => import('../views/base/equipment/add.vue') // 新增设备主档
const materialTypeAdd = () => import('../views/base/materialtype/add.vue') // 新增物料类型
const addMetering = () => import('../views/base/metering/add.vue') // 新增计量单位
const customerAdd = () => import('../views/base/customer/add.vue') // 新增客户主档
const customerDetail = () => import('../views/base/customer/detail.vue') // 客户主档详情
const supplierAdd = () => import('../views/base/supplier/add.vue') // 新增客户主档
const supplierDetail = () => import('../views/base/supplier/detail.vue') // 客户主档详情
const warehouseAdd = () => import('../views/base/warehouse/add.vue') // 新增仓库

// 生产
const badAdd = () => import('../views/product/bad/add.vue') // 不良类型主档
const reportTask = () => import('../views/product/reportTask/index.vue') // 生产报工
const addProd = () => import('../views/product/prod/add.vue') // 生产新增
const prodDetail = () => import('../views/product/prod/detail.vue') // 生产详情

// 委外
const outsourceProcessAdd = () => import('../views/outsource/process/add.vue') // 工序委外新增
const outsourceProcessDetail = () => import('../views/outsource/process/detail.vue') // 工序委外详情
const takeBack = () => import('../views/outsource/process/takeBack.vue') // 工序委外收回
const outsourceProductAdd = () => import('../views/outsource/outProduct/add.vue') // 成品委外新增
const outsourceProductDetail = () => import('../views/outsource/outProduct/detail.vue') // 成品委外详情

// 入库
const warehouseInAdd = () => import('../views/wares/warehouseIn/addWare.vue') // 新增入库
const warehouseInDetail = () => import('../views/wares/warehouseIn/otherDetail.vue')

// 出库
const warehouseOutAdd = () => import('../views/wares/warehouseOut/addWare.vue') // 新增出库
const warehouseOutDetail = () => import('../views/wares/warehouseOut/detail.vue')

// 库存
const allocationAdd = () => import('../views/wares/allocation/add.vue') // 调拨新增
const allocationDetail = () => import('../views/wares/allocation/detail.vue') // 调拨详情
const inventoryAdd = () => import('../views/wares/inventory/add.vue') // 盘点新增
const inventoryDetail = () => import('../views/wares/inventory/detail.vue') // 盘点详情
const reportDetail = () => import('../views/wares/report/detail.vue') // 库存详情  物料
const initDetail = () => import('../views/wares/initialization/detail.vue') // 初始化详情

// 采购
const applyPersonalAdd = () => import('../views/purchase/applyPersonal/detail.vue')
const applyFinishedAdd = () => import('../views/purchase/applyAll/finished.vue')
const orderPersonalAdd = () => import('../views/purchase/orderPersonal/detail.vue')
const orderFinishedAdd = () => import('../views/purchase/orderAll/finished.vue')

// 销售
const salesAdd = () => import('../views/sales/sale/add.vue') // 销售新增、编辑
const salesDetail = () => import('../views/sales/sale/detail.vue') // 销售详情

// 质检
const globalQualityAdd = () => import('../views/quality/globalQuality/add.vue') // 全局方案新增、编辑
const globalQualityDetail = () => import('../views/quality/globalQuality/detail.vue') // 全局方案详情
const materialQualityAdd = () => import('../views/quality/materialQuality/add.vue') // 物料方案新增、编辑
const materialQualityDetail = () => import('../views/quality/materialQuality/detail.vue') // 物料方案详情
const checkListAdd = () => import('../views/quality/checkList/add.vue') // 物料方案新增
const checkListDetail = () => import('../views/quality/checkList/detail.vue') // 物料方案详情
const checkListProdAdd = () => import('../views/quality/checkList/prodAdd.vue') // 新增过程检
const checkListProdDetail = () => import('../views/quality/checkList/prodDetail.vue') // 过程检详情

// 设备状态可视系统
const equipmentWatchDetail = () => import('../views/visualSystem/watchPanel/detail.vue') // 设备监控详情
const oeeDetail = () => import('../views/visualSystem/oeeDetail/index.vue') // 单个OEE分析列表

// 中转页
const transferPage = () => import('../views/transferPage.vue')
const other = [
  {
    path: urls.BASE,
    meta: {
      title: '基础数据',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'bomAdd',
        path: urls.BASE_BOM_ADD,
        component: bomAdd,
        meta: {
          title: '新增BOM'
        }
      },
      {
        name: 'bomDetail',
        path: `${urls.BASE_BOM_CHILD_BOM}/:id`,
        component: bomDetail,
        meta: {
          title: 'BOM详情'
        }
      },
      // {
      //   name: 'childBomAdd',
      //   path: `${urls.BASE_BOM_CHILD_BOM_ADD}/:baseBomId/:baseMaterialId`,
      //   component: childBomAdd,
      //   meta: {
      //     title: '新增BOM子件'
      //   }
      // },
      {
        name: 'materialDetail',
        path: `${urls.BASE_MATERIAL_DETAIL}/:type/:id`,
        component: materialDetail,
        meta: {
          title: '新增物料主档'
        }
      },
      {
        name: 'equipmentAdd',
        path: urls.BASE_EQUIPMENT_ADD,
        component: equipmentAdd,
        meta: {
          title: '新增设备主档'
        }
      },
      {
        name: 'materialTypeAdd',
        path: urls.BASE_MATERIAL_TYPE_ADD,
        component: materialTypeAdd,
        meta: {
          title: '新增物料类型'
        }
      },
      {
        name: 'addMetering',
        path: urls.BASE_METERING_ADD,
        component: addMetering,
        meta: {
          title: '新增计量单位'
        }
      },
      {
        name: 'customerAdd',
        path: urls.BASE_CUSTOMER_ADD,
        component: customerAdd,
        meta: {
          title: '新增客户主档'
        }
      },
      {
        name: 'customerDetail',
        path: urls.BASE_CUSTOMER_DETAIL,
        component: customerDetail,
        meta: {
          title: '客户详情'
        }
      },
      {
        name: 'supplierAdd',
        path: urls.BASE_SUPPLIER_ADD,
        component: supplierAdd,
        meta: {
          title: '新增供应商'
        }
      },
      {
        name: 'supplierDetail',
        path: urls.BASE_SUPPLIER_DETAIL,
        component: supplierDetail,
        meta: {
          title: '供应商详情'
        }
      },
      {
        name: 'warehouseAdd',
        path: urls.BASE_WAREHOUSE_ADD,
        component: warehouseAdd,
        meta: {
          title: '新增仓库'
        }
      },
      {
        name: 'processDetail',
        path: `${urls.BASE_PROCESS_DETAIL}/:type`,
        component: processDetail,
        meta: { title: '详情工序主档' }
      },
      {
        name: 'routingDetail',
        path: `${urls.BASE_ROUTING_DETAIL}/:type/:direction/:id`,
        component: routingDetail,
        meta: { title: '详情工艺路线' }
      },
      {
        name: 'drawNumDetail',
        path: `${urls.BASE_DRAW_NUM_DETAIL}/:type/:id`,
        component: drawNumDetail,
        meta: { title: '详情图号主档' }
      }
    ]
  },
  {
    path: urls.SALE_BASE,
    meta: {
      title: '销售订单',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'salesAdd',
        path: `${urls.SALE_ADD}/:type`,
        component: salesAdd,
        meta: {
          title: '新增销售订单'
        }
      },
      {
        name: 'salesDetail',
        path: `${urls.SALE_DETAIL}/:type`,
        component: salesDetail,
        meta: {
          title: '销售订单详情'
        }
      }
    ]
  },
  {
    path: urls.GLOBAL_QUALITY,
    meta: {
      title: '全局质检方案',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'globalQualityAdd',
        path: `${urls.GLOBAL_QUALITY_ADD}`,
        component: globalQualityAdd,
        meta: {
          title: '新增全局质检方案'
        }
      },
      {
        name: 'globalQualityDetail',
        path: `${urls.GLOBAL_QUALITY_DETAIL}`,
        component: globalQualityDetail,
        meta: {
          title: '全局质检方案详情'
        }
      }
    ]
  },
  {
    path: urls.MATERIAL_QUALITY,
    meta: {
      title: '物料质检方案',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'materialQualityAdd',
        path: `${urls.GLOBAL_MATERIAL_ADD}`,
        component: materialQualityAdd,
        meta: {
          title: '新增物料质检方案'
        }
      },
      {
        name: 'materialQualityDetail',
        path: `${urls.GLOBAL_MATERIAL_DETAIL}`,
        component: materialQualityDetail,
        meta: {
          title: '物料质检方案详情'
        }
      }
    ]
  },
  {
    path: urls.VISUAL_SSD_EQUIPMENT_WATCH,
    meta: {
      title: '设备状态可视系统',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'equipmentWatchDetail',
        path: `${urls.VISUAL_SSD_EQUIPMENT_WATCH_DETAIL}`,
        component: equipmentWatchDetail,
        meta: {
          title: '设备状态可视系统详情'
        }
      },
      {
        name: 'oeeDetail',
        path: `${urls.VISUAL_SSD_OEE_DETAIL}`,
        component: oeeDetail,
        meta: {
          title: '单个OEE分析列表'
        }
      }
    ]
  },
  {
    path: urls.CHECK_LIST,
    meta: {
      title: '检验单列表',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'checkListAdd',
        path: `${urls.CHECK_LIST_ADD}`,
        component: checkListAdd,
        meta: {
          title: '新增物料质检方案'
        }
      },
      {
        name: 'checkListProdAdd',
        path: `${urls.CHECK_LIST_PROD_ADD}`,
        component: checkListProdAdd,
        meta: {
          title: '新增过程检验单'
        }
      },
      {
        name: 'checkListDetail',
        path: `${urls.CHECK_LIST_DETAIL}`,
        component: checkListDetail,
        meta: {
          title: '物料质检方案详情'
        }
      },
      {
        name: 'checkListProdDetail',
        path: `${urls.CHECK_LIST_PROD_DETAIL}`,
        component: checkListProdDetail,
        meta: {
          title: '物料质检方案详情'
        }
      }
    ]
  },
  {
    path: urls.BASE_PRO,
    meta: {
      title: '生产管理',
      icon: ''
    },
    component: transferPage,
    children: [
      {
        name: 'badAdd',
        path: urls.BASE_PRO_BAD_ADD,
        component: badAdd,
        meta: {
          title: '不良计量单位主档'
        }
      },
      {
        name: 'addProd',
        path: `${urls.PROD_PRODUCTION_EDIT}/:type`,
        component: addProd,
        meta: {
          title: '生产订单新增'
        }
      },
      {
        name: 'prodDetail',
        path: `${urls.PROD_PRODUCTION_DETAIL}/:id`,
        component: prodDetail,
        meta: {
          title: '生产订单详情'
        }
      },
      {
        name: 'reportTask',
        path: `${urls.PROD_REPORT_TASK}/:id`,
        component: reportTask,
        meta: {
          title: '新增报工'
        }
      }
    ]
  },
  {
    path: urls.WAREHOUSE_IN,
    meta: {
      title: '委外管理',
      icon: ''
    },
    component: transferPage,
    children: [{
      name: 'outsourceProcessAdd',
      path: `${urls.BASE_OUTSOURCE_PROCESS_ADD}/:type`,
      component: outsourceProcessAdd,
      meta: {
        title: '新增工序委外'
      }
    },
    {
      name: 'outsourceProcessDetail',
      path: `${urls.BASE_OUTSOURCE_PROCESS_DETAIL}/:id`,
      component: outsourceProcessDetail,
      meta: {
        title: '工序委外详情'
      }
    }, {
      name: 'takeBack',
      path: `${urls.BASE_OUTSOURCE_PROCESS_TAKE_BACK}/:id`,
      component: takeBack,
      meta: {
        title: '工序委外收回'
      }
    }, {
      name: 'outsourceProductAdd',
      path: `${urls.BASE_OUTSOURCE_PRODUCT_ADD}`,
      component: outsourceProductAdd,
      meta: {
        title: '新增成品委外'
      }
    },
    {
      name: 'outsourceProductDetail',
      path: `${urls.BASE_OUTSOURCE_PRODUCT_DETAIL}`,
      component: outsourceProductDetail,
      meta: {
        title: ''
      }
    }]
  },
  {
    path: urls.WAREHOUSE_IN,
    meta: {
      title: '入库',
      icon: ''
    },
    component: transferPage,
    children: [{
      name: 'warehouseInAdd',
      path: `${urls.WAREHOUSE_IN_ADD}/:type`,
      component: warehouseInAdd,
      meta: {
        title: '新增其他入库'
      }
    },
    {
      name: 'warehouseInDetail',
      path: `${urls.WAREHOUSE_IN_DETAIL}/:id`,
      component: warehouseInDetail,
      meta: {
        title: ''
      }
    }]
  },
  {
    path: urls.WAREHOUSE_OUT,
    meta: {
      title: '出库',
      icon: ''
    },
    component: transferPage,
    children: [{
      name: 'warehouseOutAdd',
      path: `${urls.WAREHOUSE_OUT_ADD}/:type`,
      component: warehouseOutAdd,
      meta: {
        title: '新增其他出库'
      }
    },
    {
      name: 'warehouseOutDetail',
      path: `${urls.WAREHOUSE_OUT_DETAIL}/:id`,
      component: warehouseOutDetail,
      meta: {
        title: ''
      }
    }]
  },
  {
    path: urls.ALLOCATION,
    meta: {
      title: '调拨列表',
      icon: ''
    },
    component: transferPage,
    children: [{
      name: 'allocationAdd',
      path: `${urls.ALLOCATION_ADD}/:type`,
      component: allocationAdd,
      meta: {
        title: '新增调拨'
      }
    },
    {
      name: 'allocationDetail',
      path: `${urls.ALLOCATION_DETAIL}/:id`,
      component: allocationDetail,
      meta: {
        title: '调拨详情'
      }
    },
    {
      name: 'inventoryadd',
      path: `${urls.INVENTORY_ADD}/:type`,
      component: inventoryAdd,
      meta: {
        title: '盘点新增'
      }
    },
    {
      name: 'inventorydetail',
      path: `${urls.INVENTORY_DETAIL}/:type`,
      component: inventoryDetail,
      meta: {
        title: '盘点详情'
      }
    },
    {
      name: 'reportDetail',
      path: `${urls.REPORTDETAIL}/:type`,
      component: reportDetail,
      meta: {
        title: '库存报表详情'
      }
    },
    {
      name: 'initDetail',
      path: `${urls.INITIALIZATION_DETAIL}/:type`,
      component: initDetail,
      meta: {
        title: '初始化库存'
      }
    }]
  },
  {
    path: urls.APPLY_PERSONAL,
    meta: {
      title: '采购',
      icon: ''
    },
    component: transferPage,
    children: [{
      name: 'applyPersonalAdd',
      path: `${urls.APPLY_PERSONAL_ADD}/:type/:page/:id`,
      component: applyPersonalAdd,
      meta: {
        title: '新增采购申请'
      }
    }, {
      name: 'applyFinishedAdd',
      path: `${urls.APPLY_FINISHED_ADD}/:type/:page/:id`,
      component: applyFinishedAdd,
      meta: {
        title: '新增采购申请详情'
      }
    }, {
      name: 'orderPersonalAdd',
      path: `${urls.ORDER_PERSONAL_ADD}/:type/:page/:id`,
      component: orderPersonalAdd,
      meta: {
        title: '新增订单'
      }
    }, {
      name: 'orderFinishedAdd',
      path: `${urls.ORDER_FINISHED_ADD}/:type/:page/:id`,
      component: orderFinishedAdd,
      meta: {
        title: '新增订单(成品)'
      }
    }]
  }
]
export default other
