import Vue from 'vue'
import Router from 'vue-router'

import * as urls from './routePath'

import other from './other'
import menuRouter from './menuRouter'

const NotFound = () => import('../views/error/404.vue')
const Layout = () => import('../views/layout/index.vue')
const Login = () => import('../views/login/login.vue')
const editPwd = () => import('../views/login/editPwd.vue')
const register = () => import('../views/login/register.vue')

Vue.use(Router)

const vueRouter = new Router({
  mode: 'hash',
  routes: [
    {
      path: urls.BASE_URL,
      redirect: urls.LOGIN
    },
    {
      name: 'login',
      path: urls.LOGIN,
      component: Login,
      meta: { title: '登录' }
    },
    {
      name: 'register',
      path: urls.REGISTER,
      component: register,
      meta: { title: '注册' }
    },
    {
      name: 'editPwd',
      path: urls.EDIT_PWD,
      component: editPwd,
      meta: { title: '修改密码' }
    },
    {
      path: urls.BASE_URL,
      meta: { title: '主页' },
      component: Layout,
      children: [...menuRouter, ...other]
    },
    {
      path: '*',
      name: 'err',
      component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (from.meta.keepAlive) {
      from.meta.savedPosition = document.body.scrollTop
    }
    return {
      x: 0,
      y: to.meta.savedPosition || 0
    }
  }
})

vueRouter.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // next()
  const whiteList = [urls.LOGIN, urls.REGISTER]// 不重定向白名单
  const accessToken = sessionStorage.getItem('token') // 获取浏览器缓存的用户信息
  if (accessToken) {
    next()
  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next(urls.LOGIN)
  }
})

export default vueRouter
