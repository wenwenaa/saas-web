<template>
  <el-dialog :visible.sync="visible" width="600px" :before-close="handleClose" :title="title">
    <div class="content">
      <div class="side-circle mr20 mt5">
        <img src="../../assets/images/new/circle-lis.png" alt />
      </div>
      <ul class="steps">
        <li :style="{'margin-bottom': (isWarehouse ? 28 : 47) + 'px'}">
          <div class="steps-title mb10">1.下载模版</div>
          <div v-if="!isWarehouse">
            点击下载模版
            <span class="green pointer" @click="downloadFiles">{{`《${curInfo.templateName}》`}}</span>
          </div>
          <div v-else>
            <p class="green pointer" @click="downloadFiles('single')">《当前仓库初始化模板》</p>
            <p class="green pointer" @click="downloadFiles('allWarehouse')">《所有仓库初始化模板》</p>
          </div>
        </li>
        <li style="margin-bottom:47px;">
          <div class="steps-title mb10">2.填写信息</div>
          <div>根据模版要求内容填写，并保存。为了能够正常保存请填写纯文本或数字。</div>
        </li>
        <li>
          <div class="steps-title mb10">3.上传文件</div>
          <div>上传文件，文件支持xlsx格式，最大不超过20M</div>
          <el-upload
            ref="upload"
            :accept="fileAccept"
            :data="data"
            :headers="uploadHeaders"
            :action="`${baseActions}${curInfo.importApi}`"
            :before-upload="importBeforeUpload"
            :on-error="importFileError"
            :on-success="handleSuccess"
            :limit="limit"
            :auto-upload="false"
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-exceed="importFileExceed"
          >
            <el-button class="tz-staff-upload mt10" round size="mini">
              <div class="d-flex align-items">
                <div class="btn-head"></div>
                <div>点击上传</div>
              </div>
            </el-button>
          </el-upload>
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="tip-footer">
        <el-button @click="handleClose" round size="medium" class="tz-staff-cancel">取 消</el-button>
        <el-button
          type="primary"
          round
          size="medium"
          class="tz-staff-submit"
          @click="dialogSubmit"
        >确认导入</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions } from 'vuex'
import { dataURLtoBlob, downloadLocalFile, isChinese } from '../../utils/utils'
import api from '../../global/api'
import download from '../../mixins/download'

const mesList = [
  {
    type: 'material', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.material, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '物料导入模板' // 下载
  },
  {
    type: 'bom', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.bom, // 导入接口 api.importApi.bom
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: 'bom导入模板' // 下载
  },
  {
    type: 'prod', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.prod, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '生产订单导入模板' // 下载
  },
  {
    type: 'ng-type', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.ngType, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '不良类型导入模板' // 下载
  },
  {
    type: 'customer', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.customer, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '客户导入模板' // 下载
  },
  {
    type: 'supplier', // 模块  对应传进来的type 也对应本地的文件名称
    sucMes: '导入成功', // 导入成功提示
    importApi: api.importApi.supplier, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '供应商导入模板' // 下载
  },
  {
    type: 'process-global', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.processGlobal, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '全局工艺路线导入模板', // 下载
    moduleType: 'processGlobal'
  },
  {
    type: 'process-material', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.processMaterial, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '物料工艺路线导入模板', // 下载
    moduleType: 'processMaterial'
  },
  {
    type: 'purchase', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.purchase, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '采购导入模板' // 下载
  },
  {
    type: 'sale', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.sale, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '销售导入模板' // 下载
  },
  {
    type: 'supply', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.supply, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '委外导入模板' // 下载
  },
  {
    type: 'seq', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.seq, // 导入接口
    downloadType: 'local', // 下载类型 local 本地 remote 远程
    templateName: '工序导入模板' // 下载
  },
  {
    type: 'warehouse', // 模块  对应传进来的type 也对应本地的文件名称
    importApi: api.importApi.importStock, // 导入接口
    downloadType: 'remote', // 下载类型 local 本地 remote 远程
    templateName: '仓库初始化下载模板', // 下载
    moduleType: 'exportStock'
  }
]
export default {
  mixins: [download],
  props: {
    limit: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'material'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导入物料'
    },
    // 上传请求参数（请求头）
    uploadHeaders: {
      type: Object,
      default () {
        return {
          Authorization: sessionStorage.getItem('token') || '',
          Accept: 'application/json'
          // 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8'
        }
      }
    },
    // 导入携带参数
    data: {
      type: Object,
      default: () => ({})
    },
    // 是否是仓库管理
    isWarehouse: {
      type: Boolean,
      default: false
    },
    // 导出携带参数
    exportData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      baseActions: process.env.VUE_APP_BASE_URL,
      downloadUrl: process.env.VUE_APP_DOWNLOAD_URL,
      fileAccept:
        '.xls,.xlsx, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileList: [],
      fileName: ''
    }
  },
  computed: {
    curInfo () {
      return mesList.filter(it => it.type === this.type)[0]
    }
  },
  methods: {
    ...mapActions([
      'A_GET_GLOBAL_EXPORT'
    ]),
    // 下载文件
    downloadFiles (e) {
      const {
        downloadType, type, templateName, moduleType
      } = this.curInfo
      const { baseWarehouseId, exportName } = this.exportData
      if (downloadType === 'local') {
        downloadLocalFile(`import/import-${type}.xls`, `${templateName}.xls`)
        return
      }
      if (e === 'allWarehouse' || e === 'single') {
        const arg = {
          moduleType,
          baseWarehouseId: e === 'allWarehouse' ? undefined : baseWarehouseId,
          exportName: e === 'allWarehouse' ? '所有库存初始化模板' : exportName
        }
        this.A_GET_GLOBAL_EXPORT(arg)
        return
      }
      const arg = {
        moduleType,
        ...this.exportData,
        exportName: `${templateName}.xls`
      }
      this.A_GET_GLOBAL_EXPORT(arg)
    },
    // 关闭弹窗
    handleClose () {
      this.fileList = []
      this.$emit('close')
    },
    // 超出上傳限制
    importFileExceed () {
      this.$message.error(`最多上传${this.limit}个文件`)
    },
    // 确认导入
    dialogSubmit () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error('请选择需要导入的文件')
        return
      }
      this.$refs.upload.submit()
    },
    // 导入前校验
    importBeforeUpload (file) {
      const fileName = file.name || ''
      this.fileName = fileName
      const type = file.type === 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isType = fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || type
      if (!isType) {
        this.$message.error('请上传.xls,.xlsx, excel格式文件')
      }
      const isLt5M = file.size / 1024 / 1024 < 10
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt5M && isType
    },
    // 导入失败
    importFileError () {
      this.$message.error('上传失败')
    },
    // 导入成功
    handleSuccess (res) {
      const { templateName, type } = this.curInfo
      if (res.status === 0) {
        if (!res.data) {
          this.handleClose()
          this.$message.success(`${templateName}成功`)
          this.$emit('success', res)
        } else {
          this.errConfirm(res.data)
        }
      } else if (res.status === 1 && type === 'bom') {
        if (isChinese(res.message)) {
          this.$message.error(res.message)
          return
        }
        this.errConfirm(res.message)
      } else {
        this.$message.error(res.message)
        this.fileList = []
      }
    },
    // 导入有错误信息提示
    errConfirm (data) {
      const { templateName } = this.curInfo
      const { fileName } = this
      const first = fileName.lastIndexOf('.')
      const len = fileName.length
      const fileSuffix = fileName.substring(first, len).toLowerCase()
      const tip =
        '您导入的Excel表格里存在格式错误，需要重新检查并导入，您可以通过点击下方的“错误原因“查看错误条目及原因'
      const config = {
        confirmButtonText: '下载错误模版',
        cancelButtonText: '我知道了',
        cancelButtonClass: 'tz-staff-cancel',
        confirmButtonClass: 'tz-staff-submit',
        roundButton: true,
        center: true,
        type: 'warning'
      }
      this.$confirm(tip, '导入失败', config)
        .then(() => {
          const myUrl = dataURLtoBlob(data)
          downloadLocalFile(myUrl, `${templateName}（错误原因分析）${fileSuffix || '.xls'}`)
          this.fileList = []
          this.fileName = ''
        })
        .catch(() => {
          this.fileList = []
          this.fileName = ''
        })
    },
    // 删除暂存文件
    handleRemove (file, fileList) {
      this.fileList.splice(0, 1)
    }
  }
}
</script>
<style scoped>
.circle {
  width: 10px;
  height: 10px;
  background: #7ca870;
  border-radius: 50%;
}

.content {
  /* height: 300px; */
  padding: 10px;
  display: flex;
}

.steps-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(40, 40, 40, 1);
}

.side-circle {
  height: 200px;
}

.side-circle img {
  width: 100%;
  height: 100%;
}

.btn-head {
  width: 16px;
  height: 16px;
  background: url("../../assets/images/new/upload.png") no-repeat center;
  background-size: 100% 100%;
  margin-right: 8px;
}

.tz-staff-upload:hover,
.tz-staff-upload:focus {
  color: #ffffff !important;
  background: #7ca870 !important;
  border-color: #7ca870 !important;
}

.tz-staff-upload:hover .btn-head {
  background: url("../../assets/images/new/upload2.png") no-repeat center;
  background-size: 100% 100%;
}

.tz-staff-upload:focus .btn-head {
  background: url("../../assets/images/new/upload2.png") no-repeat center;
  background-size: 100% 100%;
}
</style>
