import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      badTypeList: state => state.global.badTypeList, // 不良类型
      equipmentList: state => state.global.equipmentList, // 所有的设备
      unitList: state => state.global.unitList, // 单位
      materialTypeList: state => state.global.materialTypeList, // 物料类型
      houseList: state => state.global.houseList, // 仓库
      customerList: state => state.global.customerList, // 客户
      supplierList: state => state.global.supplierList, // 供应商
      staffList: state => state.global.staffList // 员工
    })
  },
  created () {
    const {
      badTypeList, equipmentList, unitList, materialTypeList, houseList, customerList, supplierList, staffList
    } = this
    if (!badTypeList.length) {
      this.A_GET_GLOBAL_BAD_TYPE_LIST()
    }
    if (!equipmentList.length) {
      this.A_GET_GLOBAL_EQUIPMENT_LIST()
    }
    if (!materialTypeList.length) {
      this.A_GET_MATERIAL_TYPE_DIC_LIST()
    }
    if (!unitList.length) {
      this.A_GET_UNIT_DIC_LIST()
    }
    if (!houseList.length) {
      this.A_GET_HOUSE_DIC_LIST()
    }
    if (!customerList.length) {
      this.GET_GLOBAL_CUSTOMER_LIST()
    }
    if (!supplierList.length) {
      this.A_GET_GLOBAL_SUPPLIER_LIST()
    }
    if (!staffList.length) {
      this.A_GET_GLOBAL_STAFF_LIST()
    }
  },
  methods: {
    ...mapActions([
      'A_GET_GLOBAL_BAD_TYPE_LIST',
      'A_GET_GLOBAL_EQUIPMENT_LIST',
      'A_GET_MATERIAL_TYPE_DIC_LIST',
      'A_GET_UNIT_DIC_LIST',
      'A_GET_HOUSE_DIC_LIST',
      'GET_GLOBAL_CUSTOMER_LIST',
      'A_GET_GLOBAL_STAFF_LIST',
      'A_GET_GLOBAL_SUPPLIER_LIST'
    ])
  }

}
