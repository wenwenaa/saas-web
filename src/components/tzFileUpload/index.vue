<template>
  <el-upload
    :accept="fileAccept"
    class="tzFileUpload"
    :data="data"
    :headers="uploadHeaders"
    :action="`${baseActions}${api}`"
    :before-upload="importBeforeUpload"
    :on-error="importFileError"
    :on-success="handleSuccess"
  >
    <tzBtn v-show="isShow" :icon="icon">{{content}}</tzBtn>
    <slot></slot>
  </el-upload>
</template>

<script>
export default {
  name: 'tzFileUpload',
  props: {
    // 是否显示默认按钮
    isShow: {
      type: Boolean,
      default: true
    },
     // btn class
    icon: {
      type: String,
      default: ''
    },
    // 显示文案
    content: {
      type: String,
      default: '导入'
    },

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
    // 请求地址
    api: {
      type: String,
      default: ''
    },
    // 导入携带参数
    data: {
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
      showFileList: false
    }
  },
  methods: {
    importBeforeUpload (file) {
      const fileName = file.name || ''
      const type =
        file.type ===
        'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isType =
        fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || type
      if (!isType) {
        this.$message.error('请上传.xls,.xlsx, excel格式文件')
      }
      const isLt5M = file.size / 1024 / 1024 < 10
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt5M && isType
    },
    importFileError () {
      this.$message.error('上传失败')
    },
    // 图片成功
    handleSuccess (res) {
      this.$emit('success', res)
    }
  }
}
</script>

<style scoped>
.tzFileUpload {
  display: inline-block;
}
</style>
