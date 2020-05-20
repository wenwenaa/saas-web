
const platform = '/platform/'
const saas_mes = '/saas-mes/'
const manager = '/'
const dic = '/fs/'

const api = {
  // manager api
  manager: {
    template: `${manager}api/templates`, // 获取打印模板列表
    printers: `${manager}api/printers`, // 获取打印机列表
    print: `${manager}api/print` // 打印单据

  },
  // platform 接口
  platform: {
    users: `${platform}company/stuff/stuffByCompanyList`, // 用户列表
    userAll: `${platform}company/stuff/list/all` // 所有用户列表
  },
  // 打印获取的详情数据接口
  printDetailApi: {
    sale: `${saas_mes}sale/order/print/detail`, // 销售订单详情
    prod: `${saas_mes}prod/order/print/detail`, // 生产订单详情
    purchase: `${saas_mes}purchaseOrder/purchaseOrderQueryById`, // 采购订单详情
    outsourceOutProduct: `${saas_mes}supply/order/printDetail`, // 成品委外订单详情
    warehouseIn: `${saas_mes}stockIn/print/detail`, // 出库订单详情
    warehouseOut: `${saas_mes}stockOut/print/detail`, // 入库订单详情
    allocation: `${saas_mes}stock/exchange/printDetail`, // 调拨
    inventory: `${saas_mes}stock/taking/printDetail` // 盘点
  },
  importApi: {
    supplier: `${saas_mes}base/supplier/importExcel`, // 供应商
    bom: `${saas_mes}base/bom/import`, // bom
    customer: `${saas_mes}base/customer/importExcel`, // 客户
    prod: `${saas_mes}prod/order/importExcel`, // 生产订单
    ngType: `${saas_mes}base/notGood/importExcel`, // 不良类型
    material: `${saas_mes}base/baseMaterial/importExcel`, // 物料
    seq: `${saas_mes}base/seq/importExcel`, // 工序
    processGlobal: `${saas_mes}base/process/global/importExcel`, // 全局工艺路线
    processMaterial: `${saas_mes}base/process/material/importExcel`, // 物料工艺路线
    sale: `${saas_mes}sale/order/importSaleOrder`, // 销售
    supply: `${saas_mes}supply/order/import`, // 工序
    purchase: `${saas_mes}purchaseOrder/import`, // 采购
    stock: `${saas_mes}stock/material/import`, // 库存物料
    importStock: `${saas_mes}stock/material/importExcel` // 仓库导入
  },
  exportApi: {
    supplier: `${saas_mes}base/supplier/export`, // 供应商
    bom: `${saas_mes}base/bom/exportExcel`, // bom
    customer: `${saas_mes}base/customer/export`, // 客户
    prod: `${saas_mes}prod/order/export`, // 生产订单
    ngType: `${saas_mes}base/notGood/export`, // 不良类型
    material: `${saas_mes}base/baseMaterial/exportExcel`, // 物料
    seq: `${saas_mes}base/seq/exportExcel`, // 工序
    process: `${saas_mes}base/process/exportExcel`, // 工艺路线
    sale: `${saas_mes}sale/order/export`, // 销售
    supply: `${saas_mes}supply/order/exportExcel`, // 委外
    purchase: `${saas_mes}purchaseOrder/exportExcel`, // 采购
    outStock: `${saas_mes}stockOut/exportExcel`, // 出库
    inStock: `${saas_mes}stockIn/exportExcel`, // 入库
    exportStock: `${saas_mes}stock/material/exportExcel`, // 仓库下载模板导出
    exportWarehouse: `${saas_mes}stock/material/stockMaterialExportExcel` // 仓库导出库存模板
  },
  // 全局数据
  global: {
    upload: `${dic}submit`, // 上传接口
    matUnitList: `${saas_mes}base/baseMaterial/unit`, // 根据物料Id 获取主副计量比
    allBadType: `${saas_mes}base/notGood/list`, // 所有的不良类型
    allEquipment: `${saas_mes}base/equipment/find`, // 所有的设备
    userInfo: `${platform}account/getAccountCompany`, // 用户信息
    materialDic: `${saas_mes}base/materialType/find`, // 物料
    unitDic: `${saas_mes}base/unit/find`, // 计量单位
    houseDic: `${saas_mes}base/warehouse/find`, // 仓库主档
    processRoute: `${saas_mes}base/process/global/page`, // 全局工艺路线
    supplierList: `${saas_mes}base/supplier/find`, // 所有供应商
    customerList: `${saas_mes}base/customer/find`, // 所有客户
    materialList: `${saas_mes}base/baseMaterial/getBaseMaterialProcess`, // 物料和工艺路线查询
    bomList: `${saas_mes}base/bom/query/material/multiplex/page`, // bom复用分页列表
    censorShip: `${saas_mes}approve/sendApproved`, // 保存并送审
    recallAudit: `${saas_mes}approve/handle/revocation`, // 撤回审核
    history: `${saas_mes}approve/instance/order/history`, // 审核处理 - 处理历史列表
    approvalFlow: `${saas_mes}approve/order/instance/seqList`, // 审核处理 - 处理审批流
    encodingGeneration: `${saas_mes}config/code/generate` // 编码生成
  },
  // 登录
  login: {
    login: `${platform}account/login`, // 登录
    companyCode: `${saas_mes}saasMes/printCode/getCompanyCode` // 获取companyCode

  },
  base: {
    bom: {
      list: `${saas_mes}base/bom/query/material/page`, // 母件列表
      add: `${saas_mes}base/bom/add/parent/material`, // 母件新增
      update: `${saas_mes}update`, // 母件更新
      detail: `${saas_mes}base/bom/query/material/find`, // 母件详情
      childDetail: `${saas_mes}base/bom/sub/material/find`, // 子件详情
      del: `${saas_mes}base/bom/material/delete`, // 母件删除
      version: `${saas_mes}base/bom/version`, // bom版本
      serVersion: `${saas_mes}base/bom/default/set`, // 设置默认版本
      delVersion: `${saas_mes}base/bom/version/del`, // 版本删除
      updateVerName: `${saas_mes}base/bom/version/name/update`, // 更新版本名称
      enableFlag: `${saas_mes}base/bom/enable/set`, // 设置版本是否启用
      structure: `${saas_mes}base/bom/tree`, // bom结构
      childList: `${saas_mes}base/bom/sub/material/child/find`, // 子件列表
      childAdd: `${saas_mes}base/bom/sub/material/add`, // 子件新增
      childUpdate: `${saas_mes}base/bom/sub/material/edit`, // 子件更新
      childDel: `${saas_mes}base/bom/sub/material/deleted`, // 子件删除
      setDefault: `${saas_mes}base/bom/default/set`, // 设置默认版本
      verDel: `${saas_mes}base/bom/sub/material/deleted`, // 版本删除
      copy: `${saas_mes}base/bom/sub/material/copy`, // 复制出一个新的bom
      multiplex: `${saas_mes}base/bom/sub/material/multiplex` // bom复用
    },
    process: {
      page: `${saas_mes}base/seq/page`, // 工序分页列表
      add: `${saas_mes}base/seq/add`,
      edit: `${saas_mes}base/seq/edit`,
      delete: `${saas_mes}base/seq/delete`,
      deleteList: `${saas_mes}base/seq/delete/list`, // 批量删除
      seqCode: `${saas_mes}base/seq/seqCode`
    },
    routing: {
      page: `${saas_mes}base/process/page`, // 工艺路线列表
      list: `${saas_mes}base/seq/list`, // 查询所有工序（不分页）
      add: `${saas_mes}base/process/add`,
      edit: `${saas_mes}base/process/edit`,
      delete: `${saas_mes}base/process/delete`,
      deleteList: `${saas_mes}base/process/delete/list`, // 批量删除
      detail: `${saas_mes}base/process/detail`
    },
    material: {
      page: `${saas_mes}base/baseMaterial/page`, // 物料主档列表
      add: `${saas_mes}base/baseMaterial/add`,
      update: `${saas_mes}base/baseMaterial/update`,
      detail: `${saas_mes}base/baseMaterial/queryById`,
      delete: `${saas_mes}base/baseMaterial/delete`
    },
    drawNum: {
      page: `${saas_mes}base/baseMaterial/picNumPage`, // 图号主档列表
      update: `${saas_mes}base/baseMaterial/picNumEdit`,
      detail: `${saas_mes}base/baseMaterial/picNumDetail`,
      delete: `${saas_mes}base/baseMaterial/picNumDelete`
    },
    // 设备主档
    equipment: {
      equipmentList: `${saas_mes}base/equipment/page`, // 设备主档列表
      equipmentAdd: `${saas_mes}base/equipment/add`, // 新增设备列表
      equipmentDel: `${saas_mes}base/equipment/deleteBatch`, // 删除设备列表
      equipmentDetail: `${saas_mes}base/equipment/detail`, // 设备详情
      equipmentUpdate: `${saas_mes}base/equipment/edit` // 更新设备
    },
    // 物料类型编码
    materialtype: {
      materialtypeList: `${saas_mes}base/materialType/find`, // 物料主档列表
      materialtypeAdd: `${saas_mes}base/materialType/add`, // 新增物料列表
      materialtypeDel: `${saas_mes}base/materialType/delete` // 删除物料列表
    },
    // 计量单位编码
    metering: {
      meteringList: `${saas_mes}base/unit/find`, // 计量单位列表
      meteringAdd: `${saas_mes}base/unit/add`, // 新增计量单位
      meteringDel: `${saas_mes}base/unit/delete` // 删除计量单位
    },
    // 客户主档
    customer: {
      customerList: `${saas_mes}base/customer/page`, // 客户主档列表
      customerAdd: `${saas_mes}base/customer/add`, // 新增客户主档
      customerDel: `${saas_mes}base/customer/deleteBatch`, // 删除客户主档
      customerDetail: `${saas_mes}base/customer/detail`, // 客户详情
      customerUpdate: `${saas_mes}base/customer/edit` // 更新客户
    },
    // 供应商主档
    supplier: {
      supplierList: `${saas_mes}base/supplier/page`, // 供应商主档列表
      supplierAdd: `${saas_mes}base/supplier/add`, // 新增供应商主档
      supplierDel: `${saas_mes}base/supplier/deleteBatch`, // 删除供应商主档
      supplierDetail: `${saas_mes}base/supplier/detail`, // 供应商详情
      supplierUpdate: `${saas_mes}base/supplier/edit` // 更新供应商
    },
    // 仓库主档
    warehouse: {
      warehouseList: `${saas_mes}base/warehouse/find`, // 仓库主档列表
      warehouseAdd: `${saas_mes}base/warehouse/add`, // 新增仓库主档
      warehouseDel: `${saas_mes}base/warehouse/delete` // 删除仓库主档
    }
  },
  // 委外
  outsource: {
    process: {
      list: `${saas_mes}supply/seq/page`, // 工序委外列表
      add: `${saas_mes}supply/seq/add`, // 工序委外新增
      del: `${saas_mes}supply/seq/delete`, // 工序委外删除
      detail: `${saas_mes}supply/seq/detail`, // 工序委外详情
      update: `${saas_mes}supply/seq/edit`, // 工序委外更新
      check: `${saas_mes}supply/seq/check/save/send/approve`, // 保存并送审前校验
      listCheck: `${saas_mes}supply/seq/check/send/approve`, // 送审前校验
      open: `${saas_mes}supply/seq/open`, // 打开订单
      close: `${saas_mes}supply/seq/close`, // 关闭订单
      relevanceDoc: `${saas_mes}supply/seq/init/data`, // 工序委外关联生产订单
      takeBackInit: `${saas_mes}supply/seq/init/recall/data`, // 收回初始化数据
      takeBackAdd: `${saas_mes}supply/seq/confirm/recall`, // 收回新增
      takeBackCheck: `${saas_mes}supply/seq/check/confirm/recall`, // 收回校验
      takeBackDel: `${saas_mes}supply/seq/delete/recall` // 收回删除
    },
    outProduct: {
      addProduct: `${saas_mes}supply/order/add`, // 新增成品委外
      getSaleDetail: `${saas_mes}supply/order/push/down/list`, // 获取销售订单相关数据
      list: `${saas_mes}supply/order/page`, // 成品委外列表
      del: `${saas_mes}supply/order/del`, // 删除
      detail: `${saas_mes}supply/order/detail`, // 订单详情
      open: `${saas_mes}supply/order/openOrder`, // 打开订单
      close: `${saas_mes}supply/order/closeOrder`, // 关闭订单
      edit: `${saas_mes}supply/order/edit`, // 编辑
      saveCheck: `${saas_mes}supply/order/check/save/send/approve`, // 保存并送审前校验
      check: `${saas_mes}supply/order/check/send/approve`, // 送审校验
      orderPlan: `${saas_mes}supply/order/plan` // 订单进度
    }
  },
  // 生产
  product: {
    // 不良类型主档
    bad: {
      badList: `${saas_mes}base/notGood/page`, // 不良类型主档列表
      badAdd: `${saas_mes}base/notGood/add`, // 新增不良类型列表
      badDel: `${saas_mes}base/notGood/deleteBatch`, // 删除不良类型列表
      badDetail: `${saas_mes}base/notGood/detail`, // 不良类型详情
      badUpdate: `${saas_mes}base/notGood/edit` // 更新不良类型
    },
    // 下推列表
    pushDown: {
      list: `${saas_mes}sale/order/push/down/list`, // 下推列表
      saleOdSum: `${saas_mes}sale/order/total/push/down/list` // 销售订单汇总列表
    },
    // 生产订单
    prod: {
      list: `${saas_mes}prod/order/page`, // 生产订单列表
      task: `${saas_mes}prod/order/task`, // 获取生产任务数
      relevanceDoc: `${saas_mes}sale/order/list`, // 生产订单关联单据
      add: `${saas_mes}prod/order/save`, // 新增生产订单
      update: `${saas_mes}prod/order/edit`, // 编辑生产订单
      editDetail: `${saas_mes}prod/order/find`, // 编辑生产订单详情
      detail: `${saas_mes}prod/order/find`, // 生产订单详情
      reportTaskInit: `${saas_mes}prod/report/init/data`, // 报工初始化数据
      reportTaskAdd: `${saas_mes}prod/report/add`, // 新增报工
      reportTaskDetail: `${saas_mes}prod/order/detail`, // 生产订单报工详情
      del: `${saas_mes}prod/order/delete`, // 删除生产订单
      close: `${saas_mes}prod/order/close`, // 关闭生产订单
      open: `${saas_mes}prod/order/open`, // 关闭生产订单
      reportTaskDel: `${saas_mes}prod/report/delete`, // 删除报工
      saveCheck: `${saas_mes}prod/order/check/save/approve`, // 生产订单保存前添加送审校验
      listCheck: `${saas_mes}prod/order/check/approve`, // 生产订单列表前送审校验
      outsourceList: `${saas_mes}`, // 生产订单关联的成品委外订单
      processOutsourceList: `${saas_mes}supply/seq/detailed/page`, // 工序委外数据
      reportTaskList: `${saas_mes}prod/report/detailed/page`, // 报工数据
      qualityTestList: `${saas_mes}checkForm/checkFormProdPage`, // 质检数据
      outboundList: `${saas_mes}stockOut/refPage`, // 领料出库数据
      putStorageList: `${saas_mes}stockIn/refPage`, // 生产入库数据
      subHis: `${saas_mes}/approve/instance/orderSub/history` // 子件操作歷史
    }
  },
  // 销售
  sales: {
    singleSale: {
      getSystem: `${saas_mes}sale/order/gen/code`, // 获取销售订单
      addSalesOrder: `${saas_mes}sale/order/add`, // 新增销售订单
      listSalesOrder: `${saas_mes}sale/order/page`, // 销售订单列表
      listSingleOrder: `${saas_mes}sale/order/personal/page`, // 销售订单个人列表
      updateSalesOrder: `${saas_mes}sale/order/edit`, // 更新销售订单
      detailSalesOrder: `${saas_mes}sale/order/detail`, // 销售订单详情
      deleteSalesOrder: `${saas_mes}sale/order/delete`, // 删除销售订单
      relationProduct: `${saas_mes}sale/order/relation/prod/orders`, // 关联生产单
      relationOutStock: `${saas_mes}sale/order/relation/send/orders`, // 关联发货单
      relationReturnGoods: `${saas_mes}sale/order/relation/return/orders`, // 关联退货单
      relationOutsourcing: `${saas_mes}sale/order/relation/supply/orders`, // 关联委外单
      relationApply: `${saas_mes}sale/order/relation/purchase/apply`, // 关联采购申请
      relationPurchase: `${saas_mes}sale/order/relation/purchase/orders`, // 关联采购订单
      close: `${saas_mes}sale/order/close`, // 关闭订单
      open: `${saas_mes}sale/order/open` // 打开订单
    }
  },
  // 设置
  setting: {
    all: `${saas_mes}approve/define/queryApproveList`,
    add: `${saas_mes}approve/define/addSeq`,
    del: `${saas_mes}approve/define/deleteSeq`,
    stopCheck: `${saas_mes}approve/define/updateStatus`, // 启用暂停
    edit: `${saas_mes}approve/define/updateSeq`,
    addClass: `${saas_mes}light/config/add`
  },
  // 待办
  schedule: {
    allCheckers: `${saas_mes}approve/instance/seqList`, // 单据的审核人员
    waitCheck: `${saas_mes}approve/handle/waitList`, // 待处理列表
    finishCheck: `${saas_mes}approve/handle/history`, // 已处理的列表
    addCheck: `${saas_mes}approve/handle/approve` // 审核
  },
  // 采购
  purchase: {
    addNoSource: `${saas_mes}purchase/apply/add/none/type`, // 新增采购申请单（无来源）
    detailFinished: `${saas_mes}purchase/apply/init/sale/prod/data`, // 采购申请单-全部-成品
    addFinished: `${saas_mes}purchase/apply/add/sale/prod/type`, // 新增采购申请单（成品）
    allPage: `${saas_mes}purchase/apply/page`, // 采购申请单列表-全部
    personalPage: `${saas_mes}purchase/apply/personal/page`, // 采购申请单列表-个人
    detailSubpart: `${saas_mes}purchase/apply/init/sale/material/data`, // 采购申请单-全部-子件
    delApply: `${saas_mes}purchase/apply/delete`, // 删除采购申请
    addNonFinished: `${saas_mes}purchase/apply/add/sale/material/type`, // 新增采购申请单（非成品）
    applyDetail: `${saas_mes}purchase/apply/detail`, // 采购申请详情（无来源、成品、非成品）
    applyEdit: `${saas_mes}purchase/apply/edit`, // 编辑采购申请
    orderPage: `${saas_mes}purchaseOrder/purchaseOrderPage`, // 采购订单分页查询-全部
    orderPersonalPage: `${saas_mes}purchaseOrder/purchaseOrderPersonalPage`, // 采购订单分页查询-个人
    close: `${saas_mes}purchase/apply/close`, // 关闭采购申请
    open: `${saas_mes}purchase/apply/open`, // 打开采购申请
    addOrder: `${saas_mes}purchaseOrder/noneAdd`, // 新增无来源采购订单
    editOrder: `${saas_mes}purchaseOrder/noneEditById`, // 编辑无来源采购订单
    detailOrder: `${saas_mes}purchaseOrder/noneQueryById`, // 无来源采购订单查看详情
    deleteOrder: `${saas_mes}purchaseOrder/purchaseOrderDelete`, // 采购订单删除
    addDown: `${saas_mes}purchaseOrder/purchaseApplyAdd`, // 新增采购申请下推采购订单
    editDown: `${saas_mes}purchaseOrder/purchaseApplyEditById`, // 编辑采购申请下推采购订单
    detailDown: `${saas_mes}purchaseOrder/purchaseApplyJumpDetail`, // 采购申请页面跳转详情
    NonfinAdd: `${saas_mes}purchaseOrder/saleMaterialAdd`, // 新增销售非成品下推采购订单
    NonfinEdit: `${saas_mes}purchaseOrder/saleMaterialEditById`, // 编辑销售非成品下推采购订单
    finishedAdd: `${saas_mes}purchaseOrder/saleProdAdd`, // 新增销售成品下推采购订单
    finishedEdit: `${saas_mes}purchaseOrder/saleProdEditById`, // 编辑销售成品下推采购订单
    detailQuery: `${saas_mes}purchaseOrder/saleProdQueryById`, // 销售订单下推(采购申请下推)采购订单查看详情
    approveList: `${saas_mes}purchase/apply/check/send/approve`, // 送审数据校验（销售成品下推）
    approveSend: `${saas_mes}purchase/apply/check/save/send/approve`, // 保存并送审数据校验（销售成品下推）
    saleOrderCensor: `${saas_mes}purchaseOrder/saleOrderCensor`, // 销售订单送审校验
    saleOrderSave: `${saas_mes}purchaseOrder/saleOrderSaveAndCensor`, // 销售订单保存并送审时校验
    orderClose: `${saas_mes}purchaseOrder/closeOrder`, // 关闭采购订单
    orderOpen: `${saas_mes}purchaseOrder/openOrder`, // 打开采购订单
    saleOrderDown: `${saas_mes}purchaseOrder/applyOrderCensor`, // 采购申请单送审校验
    saleOrderSaveDown: `${saas_mes}purchaseOrder/applyOrderSaveAndCensor` // 采购申请单保存并送审时校验
  },
  wareIn: {
    list: `${saas_mes}stockIn/page`, // 获取入库单列表
    wareList: `${saas_mes}base/warehouse/find`, // 查询所有仓库
    addWareIn: `${saas_mes}stockIn/add`, // 新增其他入库
    detail: `${saas_mes}stockIn/detail`, // 详情
    orderDetail: `${saas_mes}stockIn/queryMaterial`, // 获取其他单据的物料信息
    materialDetail: `${saas_mes}stockIn/queryRefMaterialInfo`, // 获取单个物料的相关信息
    materialWareIn: `${saas_mes}stockIn/input` // 单个物料入库
  },
  wareOut: {
    list: `${saas_mes}stockOut/page`, // 获取出库单列表
    addWareOut: `${saas_mes}stockOut/add`, // 新增出库
    materialDetail: `${saas_mes}stockOut/queryRefMaterialInfo`, // 获取单个物料的相关信息
    materialWareOut: `${saas_mes}stockOut/output`, // 单个物料出库
    detail: `${saas_mes}stockOut/detail`, // 出库详情
    materialAmount: `${saas_mes}stockOut/queryRefMtrList` // 查询已领物料数量
  },
  allocation: {
    list: `${saas_mes}stock/exchange/page`, // 获取调拨列表
    add: `${saas_mes}stock/exchange/add`, // 新增调拨
    detail: `${saas_mes}stock/exchange/detail` // 调拨详情
  },
  report: {
    list: `${saas_mes}stock/material/materialPage`, // 获取库存报表
    detail: `${saas_mes}stock/material/detail`, // 获取库存详情
    record: `${saas_mes}stock/material/his/page` // 出入库记录分页
  },
  initialization: {
    list: `${saas_mes}stock/material/warehousePage`, // 获取初始化仓库
    detail: `${saas_mes}stock/material/detailByWarehouse`, // 初始化仓库详情
    download: `${saas_mes}stock/material/export`, // 下载模板
    init: `${saas_mes}stock/material/import` // 初始化库存
  },
  inventory: {
    list: `${saas_mes}stock/taking/page`, // 盘点列表
    add: `${saas_mes}stock/taking/add`, // 盘点新增
    detail: `${saas_mes}stock/taking/detail`, // 盘点详情
    allList: `${saas_mes}stock/material/warehouseList` // 全部盘点
  },
  globalQuality: {
    add: `${saas_mes}checkPlan/checkPlanGlobalAdd`, // 全局质检新增
    edit: `${saas_mes}checkPlan/checkPlanGlobalEdit`, // 全局质检编辑
    list: `${saas_mes}checkPlan/checkPlanGlobalPage`, // 全局质检列表
    del: `${saas_mes}checkPlan/checkPlanGlobalDel`, // 删除全局列表
    detail: `${saas_mes}checkPlan/checkPlanGlobalQueryById` // 删除全局列表
  },
  materialQuality: {
    list: `${saas_mes}checkPlan/checkPlanVoMaterialPage`, // 物料质检方案列表
    detail: `${saas_mes}checkPlan/checkPlanMaterialQueryById` // 物料质检详情
  },
  checkList: {
    list: `${saas_mes}checkForm/checkFormPage`, // 质检单列表
    globalNoPageList: `${saas_mes}checkPlan/checkPlanGlobaList`, // 全局质检单列表 无分页
    queryMaterialName: `${saas_mes}checkPlan/getPlanName`, // 查询物料质检方案
    inQualityGlobalInit: `${saas_mes}checkForm/globalStockInCheckAddQuery`, // 入库全局质检初始化
    inQualityMaterialInit: `${saas_mes}checkForm/materialStockInCheckAddQuery`, // 入库物料质检初始化
    qualityAllInit: `${saas_mes}checkForm/stockOutCheckAddQuery`, // 出库检全局和物料
    add: `${saas_mes}checkForm/StockInAndOutCheckAdd`, // 新增
    prodJump: `${saas_mes}checkForm/prodCheckQuery`, // 跳转详情
    prodWork: `${saas_mes}checkForm/prodCheckGetSeqs`, // 获取工序列表
    prodAdd: `${saas_mes}checkForm/prodCheckAdd`, // 新增生产过程检
    prodDetail: `${saas_mes}checkForm/prodCheckQueryById`, // 过程检详情
    inDetail: `${saas_mes}checkForm/stockInCheckQueryById`, // 过程检详情
    outDetail: `${saas_mes}checkForm/stockOutCheckQueryById` // 过程检详情
  },
  visualWatch: {
    workShops: `${saas_mes}base/equipment/workshop`, // 获取所有车间
    overview: `${saas_mes}light/home/data`, // 设备状态可视图
    currentClass: `${saas_mes}light/currentShift`, // 获取当前班次
    list: `${saas_mes}light/page`, // 所有设备监控接口
    singleData: `${saas_mes}light/detail`, // 单个设备监控接口
    runHistory: `${saas_mes}light/history`, // 历史运行
    oeeList: `${saas_mes}light/oee`, // oee分析列表
    singleOeeList: `${saas_mes}light/equipmentOEE`, // 单个oee分析列表
    qrcode: `${saas_mes}light/gen/qrcode` // 生成小程序二维码
  }
}
export default api
