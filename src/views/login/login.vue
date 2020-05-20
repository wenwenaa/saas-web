<template>
  <div class="login">
    <div class="logo"></div>
    <p class="name">天智云智造SaaS云平台</p>
    <div class="login-wrap">
      <div class="welcome-box">
        <p class="p1">欢迎您！</p>
        <p class="p2">登录天智云制造，让您对工厂生产了如指掌。</p>
      </div>
      <el-tabs v-model.trim="activeName">
        <el-tab-pane label="密码登录" name="first">
          <el-form label-position="top" :model="loginForm" :rules="rules" ref="loginForm">
            <h1 class="login-left-babel">手机号</h1>
            <el-form-item prop="phoneNumber" class="input-item">
              <el-input type="text" v-model.trim="loginForm.phoneNumber" width="100%" placeholder="请输入登录手机号码"
                @keyup.enter.native="submitForm('loginForm')"/>
            </el-form-item>
            <h1 class="login-left-babel">密码</h1>
            <el-form-item prop="password" class="input-item" width="100%">
              <el-input v-model.trim="loginForm.password" type="password" autocomplete="off" placeholder="请输入登录密码"
                @keyup.enter.native="submitForm('loginForm')"/>
            </el-form-item>
            <el-form-item class="text-center">
              <el-button type="primary" @click="submitForm('loginForm')" class="btn-w">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import './login.less'
import {
  mapActions
} from 'vuex'

import {
  checkPhone,
  checkPassword
} from '../../utils/validator'
import keepAlive from '../../mixins/keepAlive'

export default {
  name: 'login',
  mixins: [keepAlive],
  data () {
    return {
      activeName: 'first',
      loginForm: {
        code: '',
        loginType: 0,
        phoneNumber: '',
        password: ''
      },
      rules: {
        phoneNumber: [{
          trigger: 'change',
          validator: checkPhone
        }],
        password: [{
          trigger: 'change',
          validator: checkPassword
        }]
      }
    }
  },
  methods: {
    ...mapActions(['A_LOGIN']),
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.A_LOGIN(this.loginForm)
        }
      })
    }
  }
}

</script>
<style scoped>
  .login {
    background-color: #154566;
    background-image: url("../../assets/images/user/bg.png");
    background-repeat: no-repeat;
    background-position: center;
    height: 609px;
    box-sizing: border-box;
  }

  .logo {
    width: 160px;
    height: 169px;
    background: url("../../assets/images/user/logo.png") no-repeat top;
    background-size: 100%;
  }

  .name {
    font-size: 2rem;
    color: white;
    font-weight: 500;
    text-align: center;
    margin-top: -100px;
  }

  .login-wrap {
    padding: 40px 50px 0px;
    width: 600px;
    margin: 0 auto;
    background-color: white;
    border-radius: 2px;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.4);
    position: relative;
    top: 30px;
  }

  @media screen and (min-width: 1024px) and (max-width: 1440px) {
    .login-wrap {
      max-height: 450px;
      overflow-x: auto;
    }
  }

  .login-tip {
    position: absolute;
    right: 0;
    top: 0;
  }

  .login-tip img:nth-of-type(1) {
    position: absolute;
    right: 60px;
    top: 26px;
  }

  .login-tip img:nth-of-type(2) {
    cursor: pointer;
  }

  .ewm-box {
    width: 100%;
    text-align: center;
  }

  .ewm-box .p1 {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
  }

  .ewm-box .p2 {
    margin-top: 20px;
    font-size: 18px;
    color: #333;
  }

  .ewm-box .blue {
    color: #2a7bfc;
    margin-right: 5px;
  }

  .ewm {
    width: 220px;
    height: 220px;
    background: url("../../assets/images/user/inp-bg.png") no-repeat center;
    background-size: 100%;
    margin: 0 auto;
  }

  .welcome-box {
    width: 380px;
  }

  .welcome-box .p1 {
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .welcome-box .p2 {
    font-size: 18px;
    margin-bottom: 50px;
  }

</style>
<style>
  .login .input-item .el-input__inner {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 0 0 20px;
    background: #f6f6f6 !important;
    opacity: 1;
    border-radius: 6px;
    border-bottom: 0px;
  }

  .login-fl {
    width: 270px;
  }

  .login-fr {
    width: 120px;
    margin-left: 10px;
    height: 50px !important;
    font-size: 18px;
    padding: 0px;
    border-radius: 4px;
  }

  .login .btn-w {
    background: #2a7bfc;
    width: 100%;
    height: 50px;
    margin: 40px auto;
    font-size: 20px;
  }

  .el-tabs__item {
    width: 120px;
    text-align: center;
    font-size: 18px;
  }

  .el-tabs__active-bar {
    height: 3px;
  }

  .login-left-babel {
    font-size: 18px;
    font-weight: normal;
    line-height: 40px;
  }

</style>
