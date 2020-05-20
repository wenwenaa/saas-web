<template>
  <div class="login-wrap">
    <div class="slogan">
      <p>让天下没有难管的生产</p>
      <p>超过1000家在用的ERP/MES/WMS云平台</p>
    </div>
    <div class="login">
      <div class="register">
        <p class="title">注册</p>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" class="form">
          <el-form-item prop="accountNo" class="input-item">
            <i class="ico"></i>
            <el-input
              v-model.trim="registerForm.accountNo"
              type="text"
              autocomplete="off"
              placeholder="请输入注册或登录手机号码"
            />
          </el-form-item>
          <el-form-item prop="verificationCode" class="input-item">
            <i class="ico verify"></i>
            <el-input
              type="text"
              :readonly="isReadOnly"
              @focus="setReadonly"
              v-model.trim="registerForm.verificationCode"
              autocomplete="off"
              placeholder="请输入验证码"
            />
            <span class="code" @click.stop="send">
              <count-down
                ref="countDown"
                v-model.trim="regStart"
                storageKey="regTime"
                runStr="{%s}秒后重新获取"
              ></count-down>
            </span>
          </el-form-item>
          <el-form-item prop="password" class="input-item">
            <i class="ico pwd"></i>
            <el-input
              v-model.trim="registerForm.password"
              type="password"
              autocomplete="off"
              placeholder="请输入密码（字母加数字组合6`20位）"
            />
          </el-form-item>
          <el-form-item prop="rePassword" class="input-item">
            <i class="ico pwd"></i>
            <el-input
              v-model.trim="registerForm.rePassword"
              type="password"
              autocomplete="off"
              placeholder="请再次输入新密码"
            />
          </el-form-item>
          <div class="tip">
            <span @click="toGo" class="fr" title="立即注册">登录</span>
          </div>
          <el-form-item class="btn-wrap">
            <el-button type="primary" class="login-btn" @click="submitForm('registerForm')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import './login.less'
import { isMobile } from '../../utils/utils'

export default {
  name: 'login',
  data () {
    const checkMobile = (rule, value, callback) => {
      if (this.registerForm.accountNo && !isMobile(this.registerForm.accountNo)) {
        callback(new Error('手机号格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      activeTab: 'first',
      handleTab: '',
      regStart: false,
      isReadOnly: true,
      registerForm: {
        accountNo: this.$route.query.phone || '',
        verificationCode: '',
        password: '',
        rePassword: ''
      },
      rules: {
        accountNo: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { required: true, trigger: 'change', validator: checkMobile }
        ],
        verificationCode: [
          { required: true, message: '验证码不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码为6`20位字母加数字组合', trigger: 'change' }
        ],
        rePassword: [
          { required: true, message: '确认密码不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    toGo () {
      this.$router.push({ path: this.$urls.LOGIN })
    },
    setReadonly () {
      this.isReadOnly = false
    },
    sendSms () {
      this.$refs.countDown.disable = true
      // const param = { accountNo: this.registerForm.accountNo }
    },
    send () {
      // const param = { accountNo: this.registerForm.accountNo }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        // if (valid) {
        // }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.form {
  padding: 10px;
}
</style>
