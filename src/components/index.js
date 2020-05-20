import tzPagination from './tzPagination'
import tzStatus from './tzStatus'
import tzListEvents from './tzListEvents'
import tzCountDown from './tzCountDown'
import tzSearch from './tzSearch'
import tzEnable from './tzEnable'
import tzHeadline from './tzHeadline'
import tzImgUpload from './tzImgUpload'
import tzFileUpload from './tzFileUpload'
import tzBtn from './tzBtn'
import material from './material'
import tzDialog from './tzDialog'
import tzStaff from './tzStaff'
import gloProcessRoute from './gloProcessRoute'
import tzSteps from './tzSteps'
import tzSteps2 from './tzSteps2'
import badReasons from './badReasons'
import tzCommonFileUpload from './tzCommonFileUpload'
import tzView from './tzView'
import tzWare from './tzWare'
import tzTipDialog from './tzTipDialog'
import tzToolTip from './tzToolTip'
import tzImport from './tzImport'
import tzPrint from './tzPrint'

const loadComponents = {
  install (Vue) {
    Vue.component('tzPagination', tzPagination)
    Vue.component('tzStatus', tzStatus)
    Vue.component('tzListEvents', tzListEvents)
    Vue.component('tzCountDown', tzCountDown)
    Vue.component('tzSearch', tzSearch)
    Vue.component('tzEnable', tzEnable)
    Vue.component('tzHeadline', tzHeadline)
    Vue.component('tzImgUpload', tzImgUpload)
    Vue.component('tzFileUpload', tzFileUpload)
    Vue.component('tzBtn', tzBtn)
    Vue.component('material', material)
    Vue.component('tzDialog', tzDialog)
    Vue.component('tzStaff', tzStaff)
    Vue.component('gloProcessRoute', gloProcessRoute)
    Vue.component('tzSteps', tzSteps)
    Vue.component('tzSteps2', tzSteps2)
    Vue.component('badReasons', badReasons)
    Vue.component('tzCommonFileUpload', tzCommonFileUpload)
    Vue.component('tzView', tzView)
    Vue.component('tzWare', tzWare)
    Vue.component('tzTipDialog', tzTipDialog)
    Vue.component('tzToolTip', tzToolTip)
    Vue.component('tzImport', tzImport)
    Vue.component('tzPrint', tzPrint)
  }
}
export default loadComponents
