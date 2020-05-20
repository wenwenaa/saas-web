<template>
  <div>
    <el-header class="hd">
      <Header />
    </el-header>
    <div class="main">
      <div class="login">
        <p class="title">修改密码</p>
        <el-form
          label-position="left"
          label-width="100px"
          :model="form"
          :rules="rules"
          ref="form"
          class="form"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              class="input-item"
              v-model.trim="form.oldPassword"
              @input="checkCode"
              type="password"
              placeholder="请输入旧密码"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              class="input-item"
              v-model.trim="form.password"
              @input="checkCode"
              type="password"
              minlength="6"
              maxlength="21"
              placeholder="请输入新密码（不少于6位）"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="rePassword">
            <el-input
              class="input-item"
              v-model.trim="form.rePassword"
              minlength="6"
              maxlength="21"
              type="password"
              placeholder="请再次输入新密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" @click="close">取消</el-button>
            <el-button type="primary" class="login-btn" @click="submitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import Header from '../layout/component/Header.vue'
import * as urls from '../../router/routePath'

export default {
  name: 'password',
  components: { Header },
  data () {
    const checkCode = (rule, value, callback) => {
      const regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/
      const { password } = this.form
      if (password.length && (password.length < 6 || password.length > 20) && !regExp.test(password)) {
        callback(new Error('密码不能少于6位！'))
      } else {
        callback()
      }
    }
    const checkPwd = (rule, value, callback) => {
      if (this.form.rePassword !== this.form.password) {
        callback(new Error('确认新密码和新密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        rePassword: '',
        oldPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '密码不能少于6位！', trigger: 'change' },
          { required: true, trigger: 'change', validator: checkCode }
        ],
        rePassword: [
          { required: true, message: '确认密码不能为空', trigger: 'change' },
          { required: true, trigger: 'change', validator: checkPwd }
        ],
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['A_EDIT_PWD']),
    // 取消
    close () {
      this.$router.push({ path: urls.BASE_MATERIAL })
    },
    checkCode () {
      this.form.password = this.form.password.replace(/[\u4e00-\u9fa5]/ig, '')
    },
    submitForm (formName) {
      const { oldPassword, password } = this.form
      if (oldPassword === password) {
        this.$message({
          message: '新密码和旧密码不能一致！',
          type: 'error'
        })
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.A_EDIT_PWD(this.form)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.hd {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #dcdfe6;
  z-index: 10;
}
.main {
  padding: 40px;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #f8fafe;
  .login {
    width: 800px;
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .form {
      background-color: #fff;
      padding: 40px 180px;
    }
  }
  .input-item {
    width: 290px;
  }
  .login-btn {
    width: 120px;
  }
}
</style>
