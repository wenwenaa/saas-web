// 全局的计算属性，每一个store需要转化的在此属性中进行转化
const getters = {
  keepAlive: state => state.global.keepAlive,
  title: state => state.webSetting.title,
  versionList: state => state.base.bom.versionList.map(it => ({ ...it, name: `${it.versionName || '未命名'}（${it.versionNum}）` })),
  employeeList: state => state.global.staffList.map(it => ({ ...it, val: `(${it.stuffNo})|${it.realname}` }))
}
export default getters
