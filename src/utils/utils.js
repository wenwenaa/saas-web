import echarts from 'echarts'
import api from '../global/api'

/* eslint-disable */
export const isMobile = (mobile) => { // 校验手机号
  const reg = /^1[356789]\d{9}$/
  return reg.test(mobile)
}
export const isNum = (val) => {
  const reg = /^\d*\.?\d+$/
  return reg.test(val)
}
export const isChinese = (val) => {
  const reg = new RegExp("[\\u4E00-\\u9FFF]+","g")
  return reg.test(val)
}

export const isPhone = (phone) => { // 校验固定电话号码
  const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  return reg.test(phone)
}

export const isEmail = (email) => { //校验邮箱
  const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
  return reg.test(email)
}

export const isCreditCode = (code) => { // 校验企业统一社会信用代码
  const reg = /[0-9]{13}$|[0-9]{13}-[0-9]{2}$/g
  return reg.test(code)
}

export const getBase64 = file => new Promise((resolve, reject) => { // 获取base64图片
  const reader = new FileReader()
  let img = ''
  reader.readAsDataURL(file)
  reader.onload = function () {
    img = reader.result
  }
  reader.onerror = function (error) {
    reject(error)
  }
  reader.onloadend = function () {
    resolve(img)
  }
})

export const getLocal = (key, value) => { // 获取 localStorage值
  const len = arguments.length
  if (len === 1 && localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key))
  }
  if (len === 2) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getSession = (key, value) => { // 获取 sessionStorage值
  const len = arguments.length
  if (len === 1 && sessionStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key))
  }
  if (len === 2) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}
// 拼接URL
export const jointUrl = (fid, fileName) => {
  const first = fileName.lastIndexOf(".")
  const len = fileName.length
  const fileSuffix = fileName.substring(first, len).toLowerCase()
  return fileName ? `${fid}${fileSuffix}` : `${fid}`
}

// 图片URL
export const picUrl = (fileName) => {
  const first = fileName.lastIndexOf("/")
  const len = fileName.length
  const fileSuffix = fileName.substring(first + 1, len).toLowerCase()
  return fileName ? `${fileSuffix}` : ''
}

// 下载模版
export const downloadFile = (fileName, name) => {
  // fileName 下载的文件名  name  下载的文件
  // console.log(name)
  // console.log('fileName', fileName)
  // const a = document.createElement('a')
  // a.setAttribute('href', `import/${name}`)
  // a.setAttribute('download', `${fileName}.xls`)
  // a.download = `${fileName}.xls`
  // a.setAttribute('target', '_blank')
  // const clickEvent = document.createEvent('MouseEvents')
  // clickEvent.initEvent('click', true, true)
  // a.dispatchEvent(clickEvent)
  a.download = `${fileName}.xls`
  a.href = `${process.env.BASE_URL}/import/${name}`
  a.click()
}

export const downloadLocalFile = (url, name = 'template.excel') => {
  if ('msSaveOrOpenBlob' in navigator) {
    window.navigator.msSaveOrOpenBlob(url, name);
    if (url.includes('import')) {
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', name)
      a.setAttribute('target', '_self')
      const clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent)
    }
  } else {
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', name)
    a.setAttribute('target', '_blank')
    const clickEvent = document.createEvent('MouseEvents')
    clickEvent.initEvent('click', true, true)
    a.dispatchEvent(clickEvent)
  }
}
// base64 转excel文件
export const dataURLtoBlob = (dataUrl) => {
  const raw = window.atob(dataUrl)
  const len = raw.length
  const uint8Array = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    uint8Array[i] = raw.charCodeAt(i)
  }
  const myBlob = new Blob([uint8Array], { type: 'application/vnd.ms-excel' })
  if ('msSaveOrOpenBlob' in navigator) {
    return myBlob
  } else {
    return URL.createObjectURL(myBlob)
  }

}
// 数组去重
export const unique = (arr) => {
  return Array.from(new Set(arr))
}
// 判断是否是对象
export const isObject = (val) => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

// 求和
export const sum = (arr, id) => {
  let sum = 0
  if (id) {
    sum = arr.map(item => item[id]).filter(i => i).reduce((prev, cur) => prev + cur, 0)
    return sum
  }
  sum = arr.filter(i => i).reduce((prev, cur) => prev + cur, 0)
  return sum
}
// 去除请求参数中空值
export const removeEmpty = (obj = {}) => {
  if (typeof obj !== 'object') { return }
  const result = Object.keys(obj).filter(it => obj[it] !== '')
  const temp = {}
  result.forEach(it => {
    temp[it] = obj[it]
  })
  return temp
}

// 设置baseUrl
export const setBaseUrl = (url) => {
  const apis = Object.values(api.manager || {})
  return !apis.includes(url) ? process.env.VUE_APP_BASE_URL : process.env.VUE_APP_PLATFORM_BASE_URL
}
// 
export const setHeaders = (url) => {
  const token = sessionStorage.getItem('token') || ''
  const CompanyCode = sessionStorage.getItem('companyCode') || ''
  const base =  { // eslint-disable-line
    'Content-Type': 'application/json',
    Authorization: token
  }
  const apis = Object.values(api.manager || {})
  return !apis.includes(url) ? base : { ...base, CompanyCode }
}

// 邮箱正则
export const checkEmail = e => {
  return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e)
}
// 传真正则
export const checkFax = e => {
  return /^(\d{3,4}-)?\d{7,8}$/.test(e)
}

// 校验中文
export const checkChinese = e => {
  return /[\u4e00-\u9fa5]/gm.test(e)
}

// 传递数据
// obj => string
export const becomeString = (obj) => {
  return encodeURIComponent(JSON.stringify(obj))
}

// string => obj
export const becomeObj = (string) => {
  return JSON.parse(decodeURIComponent(string))
}

// 获取当前日期
export const currentDate = () => {
  function addZero(num) {
    if (num < 10) {
      return `0${num}`
    } else {
      return num
    }
  }
  const date = new Date()
  const year = date.getFullYear()
  const month = addZero(date.getMonth() + 1)
  const day = addZero(date.getDate())
  return `${year}-${month}-${day}`
}

export const rowspan = (tableData = [], name = []) => {
  const spanArr = []
  let position = 0
  if (tableData) {
    tableData.forEach((item, index) => {
      if (index === 0) {
        spanArr.push(1)
        position = 0
      } else if (tableData[index][name] === tableData[index - 1][name]) {
        spanArr[position] += 1
        spanArr.push(0)
      } else {
        spanArr.push(1)
        position = index
      }
    })
  }
  return spanArr
}
export const spanMethod = ({ rowIndex, columnIndex }, spanArr = [], columns = []) => {
  if (columns.includes(columnIndex)) {
    const rows = spanArr[rowIndex]
    const cols = rows > 0 ? 1 : 0
    return { rowspan: rows, colspan: cols }
  }
  return { rowspan: 1, colspan: 1 }
}

// obj => string
export const becomString = (obj) => {
  return encodeURIComponent(JSON.stringify(obj))
}
// string => obj
export const becomObj = (string) => {
  return JSON.parse(decodeURIComponent(string))
}

export const drawEChart = (id, option) => {
  const echart = echarts.init(document.getElementById(id))
  echart.clear()
  echart.setOption(option)
}