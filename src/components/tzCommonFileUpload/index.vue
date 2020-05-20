<!-- 上传组件 -->
<template>
  <div class="tzImgUpload">
    <div class="title" v-if="(fileTitleShow && (fileList.length > 0)) || applicationType === 'add'">{{applicationType === 'add' ? fileTitle : fileSubTitle}}</div>
    <div class="tip" v-if="fileTipShow && applicationType !== 'detail'">{{fileTip}}</div>
    <slot></slot>
    <div class="uploadFile">
      <div class="fileList">
        <div class="item" v-for="(item, index) in copyFileList" :key="index">
          <!-- 图片类型 -->
          <div class="img" v-if="imgType.includes(item.type)">
            <img class="img" :src="item.fileUrl" />
          </div>
          <!-- file类型 -->
          <div :class="`file ${item.type}`" v-if="fileType.includes(item.type)">
            <div class="fileName ellipsis">{{item.fileName}}</div>
          </div>
          <!-- 文件类型 -->
          <div class="mask">
            <i class="file_view list cursor" v-if="imgType.includes(item.type) || (previewNeed.includes(item.type) && applicationType === 'detail')" @click="handlePictureCardPreview(item)"></i>
            <i class="file_download list"  @click="fileDownload(item)" v-if="applicationType === 'detail' && fileType.includes(item.type) && !previewNeed.includes(item.type)" />
            <i class="file_delete list cursor" v-if="applicationType === 'add'" @click="fileDelete(index)"></i>
          </div>
        </div>
        <el-upload
          style="margin-top:10px;"
          multiple
          :action="url"
          :accept="accept"
          :limit="limitNum"
          :on-exceed="onExceed"
          :on-error="handleError"
          list-type="picture-card"
          :file-list="copyFileList"
          :on-success="handleSuccess"
          v-if="applicationType==='add' && copyFileList && copyFileList.length < limitNum"
          :before-upload="beforeUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </div>
    <el-image
      ref="refImg"
      :src="previewUrl"
      :preview-src-list="previewList">
    </el-image>
  </div>
</template>

<script>
import api from '../../global/api'

export default {
  name: 'tzImgUpload',
  props: {
    // 标题名称
    fileTitle: {
      type: String,
      default: '上传图片或者附件'
    },
     // 标题名称 详情展示
    fileSubTitle: {
      type: String,
      default: '图片或者附件'
    },
    // 标题显示
    fileTitleShow: {
      type: Boolean,
      default: true
    },
    // 提示显示
    fileTipShow: {
      type: Boolean,
      default: true
    },
    // 标题显示
    fileTip: {
      type: String,
      default: '支持上传图片和文件，图片支持jpg、png格式，上传的图片和文件数量总和不能超过10个，每张图片或文件不得大于2M'
    },
    // 限制数量
    limitNum: {
      default: 10,
      type: Number
    },
    // 限制大小
    limitSize: {
      default: 2,
      type: Number
    },
    // 文件复写
    fileList: {
      type: Array,
      default: () => []
    },
    // 上传文件类型 图片(img) 附件(file) 默认所有文件all
    type: {
      type: String,
      default: 'all'
    },
    // 应用类型 编辑和新增(add) 详情(detail)
    applicationType: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      accept: '', // 过滤上传文件
      checkSuffixs: [], // 检测后缀
      copyFileList: [], // 要上传的数据
      previewUrl: '', // 预览大图
      previewList: [], // 预览数组
      previewNeed: ['txt', 'pdf'],
      url: `${process.env.VUE_APP_BASE_URL}${api.global.upload}`, // 上传地址
      imgType: ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'], // 图片类型
      fileType: ['docx', 'doc', 'pptx', 'ppt', 'txt', 'xls', 'xlsx', 'pdf', 'DOCX', 'DOC', 'PPTX', 'PPT', 'TXT', 'XLS', 'XLSX', 'PDF'] // 附件类型
    }
  },
  mounted () {
    // 初始化类型
    this.initialization()
    this.copyFileList = (this.fileList && this.fileList.map((item) => {
      const fileTypeList = item.fileType.split('.')
      const type = item.fileType && `${fileTypeList[fileTypeList.length - 1]}`
      return {
        ...item,
        type,
        fileName: item.fileType,
        fileUrl: `${process.env.VUE_APP_BASE_URL}/fs/${item.fileAddress}`
      }
    })) || []
  },
  watch: {
    fileList () {
      this.copyFileList = (this.fileList && this.fileList.map((item) => {
        const fileTypeList = item.fileType.split('.')
        const type = item.fileType && `${fileTypeList[fileTypeList.length - 1]}`
        return {
          ...item,
          type,
          fileName: item.fileType,
          fileUrl: `${process.env.VUE_APP_BASE_URL}/fs/${item.fileAddress}`
        }
      })) || []
    }
  },
  methods: {
    // 初始化类型
    initialization () {
      if (this.type === 'img') {
        this.checkSuffixs = this.imgType
      } else if (this.type === 'file') {
        this.checkSuffixs = this.fileType
      } else {
        this.checkSuffixs = [...this.imgType, ...this.fileType]
      }
      this.accept = this.checkSuffixs.map(item => `.${item}`).join(',')
    },
    // 通过type 获取上传图片类型
    beforeUpload ({ name, size }) {
      // 上传格式限制
      const array = name && name.split('.')
      const suffix = name && array[array.length - 1]
      const isName = this.checkSuffixs.includes(suffix)
      if (!isName) {
        this.$message.error(`不支持.${suffix}格式`)
      }
      // 上传大小限制
      const isSize = size / 1024 / 1024 < this.limitSize
      if (!isSize) {
        this.$message.error(`限制大小${this.limitSize}M以内`)
      }
      return isName && isSize
    },
    // 超出个数
    onExceed () {
      this.$message.error(`限制上传${this.limitNum}个文件`)
    },
    // 上传成功
    handleSuccess (res) {
      this.$message.success('文件上传成功')
      const array = res.fileName && res.fileName.split('.')
      const copyRes = {
        ...res,
        fileName: res.fileName,
        type: array[array.length - 1],
        fileUrl: `${process.env.VUE_APP_BASE_URL}/fs/${res.fid}`
      }
      this.copyFileList = [...this.copyFileList, copyRes]
      this.outData()
    },
    // 上传失败
    handleError () {
      this.$message.error('文件上传失败')
    },
    // 删除图片
    fileDelete (index) {
      this.copyFileList.splice(index, 1)
      this.outData()
    },
    // 传出去的数据
    outData () {
      // 通过fid判断 编辑返回 or 最新上传（fid）
      const files = this.copyFileList.map(item => ({
        fileAddress: item.fid ? item.fid : item.fileAddress,
        fileType: item.fid ? item.fileName : item.fileType,
        fileSize: item.size,
        fileName: item.fileName,
        type: item.type
      }))
      this.$emit('handleUploadFile', { files })
    },
    // 预览图片/PDF
    handlePictureCardPreview (e) {
      if (this.previewNeed.includes(e.type)) {
        window.open(e.fileUrl, '名称')
        return
      }
      this.previewUrl = e.fileUrl
      const imgList = this.copyFileList.filter(item => this.imgType.includes(item.type))
      this.previewList = imgList.map(item => item.fileUrl)
      this.$refs.refImg.clickHandler()
    },
    // 下载文件DOC/PPT/EXCEL/
    fileDownload (e) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = e.fileUrl
      link.setAttribute('download', e.fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    }
  }
}
</script>

<style scoped>
.uploadFile {
  display: flex;
}
.fileList {
  display: flex;
  flex-wrap: wrap;
}
.fileList .item {
  width: 160px;
  height: 160px;
  overflow: hidden;
  margin-right: 20px;
  border-radius: 6px;
  position: relative;
  box-sizing: border-box;
  border: 1px dashed #c0ccda;
  margin-top:10px;
}
.fileList .item .img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fileList .item .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 666;
  visibility: hidden;
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
}
.fileList .item:hover .mask {
  visibility: visible;
}
.tzImgUpload /deep/ ul.el-upload-list {
  display: none;
}
.tzImgUpload /deep/ .el-upload--picture-card {
  width: 160px;
  height: 160px;
  line-height: 160px;
}
.title {
  height: 16px;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  margin-bottom: 8px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: rgba(68, 68, 68, 1);
}
.tip {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  margin-bottom: 8px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: rgba(153, 153, 153, 1);
}
.fileList .item .mask {
  display: flex;
  align-items: center;
  justify-content: center;
}
.fileList .item .mask i {
  display: block;
}
.fileList .item .mask i:nth-child(2) {
  margin-left: 20px;
}
.fileList .item .file {
  width: 100%;
  height: 100%;
  padding-top: 110px;
  box-sizing: border-box;
  background-size: 65px 80px;
}
.fileList .item .pdf {
  background: url('./images/file_pdf.png') no-repeat center 15px;
}
.fileList .item .txt {
  background: url('./images/file_txt.png') no-repeat center 15px;
}
.fileList .item .docx,.fileList .item .doc {
  background: url('./images/file_word.png') no-repeat center 15px;
}
.fileList .item .pptx,.fileList .item .ppt {
  background: url('./images/file_ppt.png') no-repeat center 15px;
}
.fileList .item .xls,.fileList .item .xlsx {
  background: url('./images/file_xls.png') no-repeat center 15px;
}
.fileList .item .file .fileName {
  width: 140px;
  height: 40px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 400;
  line-height: 40px;
  color:rgba(68,68,68,1);
}
.mask .list {
  width: 32px;
  height: 32px;
  background-size: 32px;
}
.file_delete {
  background: url('./images/file_delete.png') no-repeat center center;
}
.file_download {
  background: url('./images/file_download.png') no-repeat center center;
}
.file_view {
  background: url('./images/file_view.png') no-repeat center center;
}
.tzImgUpload /deep/ .el-image>img {
  display: none;
}
.tzImgUpload /deep/ .el-image__error {
  display: none;
}
.cursor{
  cursor:pointer;
}
</style>
