<template>
  <div class="tzImgUpload">
    <!-- 一、接收参数 -->
    <!-- fileTitle 默认 显示标题 -->
    <!-- limitNum 默认 六张 -->
    <!-- limitSize 默认 2M -->
    <!-- filelist 默认 回写数据 -->
    <!-- 二、返回方法 -->
    <!-- 暴露出去的方法 handleUploadImg -->
    <!-- 暴露出去的数据 uploadImgs -->
    <!-- 三、插槽 -->
    <!-- 插槽中有个样式tip -->
    <!-- 四、解释说明 -->
    <!-- 此处不用:limit="limitNum"，是因为上传超过六张后，不能提示错误 -->
    <div class="title" v-if="fileTitle">上传图片</div>
    <slot></slot>
    <el-upload
      multiple
      :action="url"
      :accept="accept"
      :limit="limitNum"
      :file-list="fileList"
      :on-exceed="onExceed"
      :on-error="handleError"
      list-type="picture-card"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="80%" style="display: block;margin: 0 auto;" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import api from '../../global/api'

export default {
  name: 'tzImgUpload',
  props: {
    // 标题显示
    fileTitle: {
      type: Boolean,
      default: true
    },
    // 限制数量
    limitNum: {
      default: 6,
      type: Number
    },
    // 限制大小
    limitSize: {
      default: 2,
      type: Number
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      limitFileList: [], // 暴露出去的数据
      dialogImageUrl: '',
      dialogVisible: false,
      accept: '.jpg, .jpeg, .png',
      url: `${process.env.VUE_APP_BASE_URL}${api.global.upload}` || ''
    }
  },
  methods: {
    // 图片之前限制
    beforeUpload ({ name, size }) {
      const isSize = size / 1024 / 1024 < this.limitSize
      const isName = name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg')
      if (!isName) {
        this.$message.error('图片只支持png, jpg, jpeg格式')
      }
      if (!isSize) {
        this.$message.error(`图片大小限制${this.limitSize}M以内`)
      }
      return isName && isSize
    },
    // 图片超出个数
    onExceed (e) {
      this.$message.error(`图片上传限制${this.limitNum}张以内`)
    },
    // 图片成功
    handleSuccess (res) {
      this.$message.success('图片上传成功')
      this.limitFileList = [...this.limitFileList, res]
      this.$emit('handleUploadImg', { uploadImgs: this.limitFileList })
    },
    // 图片失败
    handleError () {
      this.$message.error('图片上传失败')
    },
    // 删除图片
    handleRemove (file, fileList) {
      // 判断如果有responese返回 抛出responese 否则直接抛出
      this.limitFileList = fileList.map((item) => {
        if (item.response) return item.response
        return item
      })
      this.$emit('handleRemoveImg', { uploadImgs: this.limitFileList })
    },
    // 查看图片
    handlePictureCardPreview (res) {
      this.dialogVisible = true
      this.dialogImageUrl = res.url
    }
  }
}
</script>

<style scoped>
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
</style>
