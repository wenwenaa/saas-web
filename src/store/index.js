import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import global from './module/global'
import login from './module/login'
import base from './module/base'
import webSetting from './module/webSetting'
import product from './module/product'
import orderCheck from './module/orderCheck'
import purchase from './module/purchase'
import sales from './module/sales'
import ware from './module/ware'
import outsource from './module/outsource'
import quality from './module/quality'
import visualWatch from './module/visualWatch'

Vue.use(Vuex)
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'prod',
  getters,
  modules: {
    global,
    login,
    base,
    product,
    webSetting,
    orderCheck,
    purchase,
    sales,
    ware,
    outsource,
    quality,
    visualWatch
  }
})
export default store
