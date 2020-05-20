import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      cacheList: [
        'bom',
        'material',
        'equipmentList',
        'materialtypeList',
        'meteringList',
        'customerList',
        'supplierList',
        'warehouseList',
        'badList',
        'drawNum',
        'process',
        'routing',
        'prod',
        'pushDown',
        'warehouseIn',
        'warehouseOut',
        'applyAll',
        'orderAll',
        'applyPersonal',
        'orderPersonal',
        'sale',
        'allocation',
        'inventory',
        'report',
        'initialization',
        'saleAll',
        'schedule',
        'outsourceProcess',
        'globalQuality',
        'outsourceProduct',
        'checkList',
        'globalQuality',
        'materialQuality',
        'materialRouting'
      ]
    }
  },
  computed: {},
  beforeRouteLeave (to, from, next) {
    this.keepAlive(to.name)
    next()
  },
  methods: {
    ...mapMutations(['SET_KEEP_ALIVE']),
    // 缓存列表页面
    keepAlive (name) {
      if (this.cacheList.includes(name)) {
        this.SET_KEEP_ALIVE([name])
        sessionStorage.setItem('keepAlive', [name])
      }
    }
  }
}
