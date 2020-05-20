export const BASE_URL = '/'

export const LOGIN = `${BASE_URL}login` // 登录
export const REGISTER = `${BASE_URL}register` // 注册
export const EDIT_PWD = `${BASE_URL}editPwd` // 修改密码

// 基础数据
export const BASE = `${BASE_URL}base` // 基础数据

export const BASE_BOM = `${BASE}/bom` // 基础数据-bom
export const BASE_BOM_ADD = `${BASE_BOM}/add` // 基础数据-bom新增
export const BASE_BOM_CHILD_BOM = `${BASE_BOM}/detail` // 基础数据-bom详情
export const BASE_BOM_CHILD_BOM_ADD = `${BASE_BOM_CHILD_BOM}/add` // 基础数据-bom子件

export const BASE_MATERIAL = `${BASE}/material` // 基础数据-material
export const BASE_MATERIAL_DETAIL = `${BASE_MATERIAL}/detail` // 基础数据-detail

export const BASE_PROCESS = `${BASE}/process` // 基础数据-process
export const BASE_PROCESS_DETAIL = `${BASE_PROCESS}/detail` // 基础数据-detail

export const BASE_ROUTING = `${BASE}/routing` // 基础数据-routing
export const BASE_MATERIAL_ROUTING = `${BASE}/materialRouting` // 基础数据-routing
export const BASE_ROUTING_DETAIL = `${BASE_ROUTING}/detail` // 基础数据-detail

export const BASE_DRAW_NUM = `${BASE}/drawNum` // 基础数据-drawNum
export const BASE_DRAW_NUM_DETAIL = `${BASE_DRAW_NUM}/detail` // 基础数据-detail

export const BASE_EQUIPMENT = `${BASE}/equipment` // 设备主档
export const BASE_EQUIPMENT_ADD = `${BASE_EQUIPMENT}/add` // 新增设备主档

export const BASE_MATERIAL_TYPE = `${BASE}/materialtype` // 物料类型
export const BASE_MATERIAL_TYPE_ADD = `${BASE_MATERIAL_TYPE}/add` // 新增物料类型

export const BASE_METERING = `${BASE}/metering` // 计量单位
export const BASE_METERING_ADD = `${BASE_METERING}/add` // 新增计量单位

export const BASE_CUSTOMER = `${BASE}/customer` // 客户主档
export const BASE_CUSTOMER_ADD = `${BASE_CUSTOMER}/add` // 新增客户主档
export const BASE_CUSTOMER_DETAIL = `${BASE_CUSTOMER}/detail` // 新增客户主档

export const BASE_SUPPLIER = `${BASE}/supplier` // 供应商主档
export const BASE_SUPPLIER_ADD = `${BASE_SUPPLIER}/add` // 新增供应商主档
export const BASE_SUPPLIER_DETAIL = `${BASE_SUPPLIER}/detail` // 供应商主档详情

export const BASE_WAREHOUSE = `${BASE}/warehouse` // 仓库主档
export const BASE_WAREHOUSE_ADD = `${BASE_WAREHOUSE}/add` // 仓库主档

// 生产
export const BASE_PRO = `${BASE_URL}product` // 产品中心
export const BASE_PRO_BAD = `${BASE_PRO}/bad` // 不良原因
export const BASE_PRO_BAD_ADD = `${BASE_PRO_BAD}/add` // 新增不良原因
export const PROD_PRODUCTION = `${BASE_PRO}/production` // 生产列表
export const PROD_PRODUCTION_EDIT = `${PROD_PRODUCTION}/handle` // 生产新增修改
export const PROD_PRODUCTION_DETAIL = `${PROD_PRODUCTION}/detail` // 生产新增修改
export const PROD_REPORT_TASK = `${PROD_PRODUCTION}/reportTask` // 生产报工
export const PROD_PUSH_DOWN = `${BASE_PRO}/pushDown` // 生产下推列表

// 委外
export const BASE_OUTSOURCE = `${BASE_URL}outsource` // 委外
export const BASE_OUTSOURCE_PROCESS = `${BASE_OUTSOURCE}/process` // 工序委外
export const BASE_OUTSOURCE_PROCESS_TAKE_BACK = `${BASE_OUTSOURCE_PROCESS}/takeBack` // 工序委外
export const BASE_OUTSOURCE_PROCESS_ADD = `${BASE_OUTSOURCE_PROCESS}/handle` // 工序委外新增修改
export const BASE_OUTSOURCE_PROCESS_DETAIL = `${BASE_OUTSOURCE_PROCESS}/detail` // 工序委外详情
export const BASE_OUTSOURCE_PRODUCT = `${BASE_OUTSOURCE}/product` // 成品委外
export const BASE_OUTSOURCE_PRODUCT_ADD = `${BASE_OUTSOURCE_PRODUCT}/add` // 成品委外新增
export const BASE_OUTSOURCE_PRODUCT_DETAIL = `${BASE_OUTSOURCE_PRODUCT}/detail` // 成品委外详情
// 库存
export const WARES = `${BASE_URL}wares` // 库存
export const WAREHOUSE_IN = `${WARES}/warehouseIn` // 入库
export const WAREHOUSE_OUT = `${WARES}/warehouseOut` // 出库
export const WAREHOUSE_IN_ADD = `${WAREHOUSE_IN}/warehouseInAdd` // 新增入库
export const WAREHOUSE_IN_DETAIL = `${WAREHOUSE_IN}/warehouseDetail` // 入库单详情
export const WAREHOUSE_OUT_ADD = `${WAREHOUSE_OUT}/warehouseOutAdd` // 新增出库
export const WAREHOUSE_OUT_DETAIL = `${WAREHOUSE_OUT}/warehouseDetail` // 出库单详情
export const ALLOCATION = `${WARES}/allocation` // 调拨列表
export const ALLOCATION_ADD = `${ALLOCATION}/allocationadd` // 调拨列表
export const ALLOCATION_DETAIL = `${ALLOCATION}/allocationdetail` // 调拨详情
export const REPORT = `${WARES}/report` // 库存报表列表
export const REPORTDETAIL = `${REPORT}/reportdetail` // 库存报表详情
export const INITIALIZATION = `${WARES}/init` // 初始化库存报表
export const INITIALIZATION_DETAIL = `${INITIALIZATION}/initdetail` // 初始化库存报表
export const INVENTORY = `${WARES}/inventory` // 盘点
export const INVENTORY_ALL = `${WARES}/inventoryall` // 盘点
export const INVENTORY_ADD = `${INVENTORY}/inventoryadd` // 盘点
export const INVENTORY_DETAIL = `${INVENTORY}/inventorydetail` // 盘点详情

// 采购
export const PURCHASE = `${BASE_URL}purchase` // 采购
export const APPLY_ALL = `${PURCHASE}/applyAll` // 采购申请单全部
export const APPLY_PERSONAL = `${PURCHASE}/applyPersonal` // 采购申请单个人
export const APPLY_PERSONAL_ADD = `${APPLY_PERSONAL}/purchaseApplyAdd` // 新增采购申请单
export const APPLY_FINISHED_ADD = `${APPLY_ALL}/applyFinishedAdd` // 新增采购申请(成品)
export const ORDER_ALL = `${PURCHASE}/orderAll` // 采购订单全部
export const ORDER_PERSONAL = `${PURCHASE}/orderPersonal` // 采购订单个人
export const ORDER_PERSONAL_ADD = `${ORDER_PERSONAL}/orderPersonalAdd` // 新增订单
export const ORDER_FINISHED_ADD = `${ORDER_ALL}/orderFinishedAdd` // 新增订单(成品)

// 设置
export const SETTING = `${BASE_URL}setting` // 设置
export const CHECK = `${SETTING}/check` // 审核
export const CLASSSETTING = `${SETTING}/classsetting` // 班次设置

// 审核
export const ORDER_CHECK = `${BASE_URL}orderCheck` // 审核
export const SCHEDULE = `${ORDER_CHECK}/schedule` // 待办事项

// 销售
export const SALE_BASE = `${BASE_URL}sale` // 销售
export const SALE_LIST = `${SALE_BASE}/list` // 销售列表(个人)
export const SALE_LIST_ALL = `${SALE_BASE}/listall` // 销售列表(个人)
export const SALE_ADD = `${SALE_BASE}/add` // 销售新增
export const SALE_DETAIL = `${SALE_BASE}/detail` // 销售订单详情

// 质检
export const QUALITY_TEST = `${BASE_URL}quality` // 质检
export const GLOBAL_QUALITY = `${QUALITY_TEST}/global` // 全局质检方案
export const GLOBAL_QUALITY_ADD = `${QUALITY_TEST}/global/add` // 全局质检方案新增
export const GLOBAL_QUALITY_DETAIL = `${QUALITY_TEST}/global/detail` // 全局质检方案新增
export const MATERIAL_QUALITY = `${QUALITY_TEST}/material` // 局部质检方案
export const GLOBAL_MATERIAL_ADD = `${QUALITY_TEST}/material/add` // 局部质检方案新增
export const GLOBAL_MATERIAL_DETAIL = `${QUALITY_TEST}/material/detail` // 局部质检方案新增
export const CHECK_LIST = `${QUALITY_TEST}/checklist` // 全局质检方案
export const CHECK_LIST_ADD = `${QUALITY_TEST}/checklist/add` // 全局质检方案新增
export const CHECK_LIST_DETAIL = `${QUALITY_TEST}/checklist/detail` // 全局质检方案新增
export const CHECK_LIST_PROD_ADD = `${QUALITY_TEST}/checklist/prod/add` // 过程检新增
export const CHECK_LIST_PROD_DETAIL = `${QUALITY_TEST}/checklist/prod/detail` // 过程检新增

// 可视系统 三色灯
export const VISUAL_SSD = `${BASE_URL}ssd` // 三色灯
export const VISUAL_SSD_EQUIPMENT_STATUS = `${VISUAL_SSD}/equipmentstatus` // 设备状态可视图
export const VISUAL_SSD_EQUIPMENT_WATCH = `${VISUAL_SSD}/equipmentwatch` // 设备监控
export const VISUAL_SSD_EQUIPMENT_WATCH_DETAIL = `${VISUAL_SSD}/equipmentwatch/detail` // 单个监控详情
export const VISUAL_SSD_OEE_LIST = `${VISUAL_SSD}/oeelist` // oee分析(所有设备)
export const VISUAL_SSD_OEE_DETAIL = `${VISUAL_SSD}/oeedetail` // 单个oee分析
