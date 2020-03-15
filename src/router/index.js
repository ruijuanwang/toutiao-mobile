import Vue from 'vue'
import VueRouter from 'vue-router'

// 用按需加载的方式配置路由
const Layout = () => import('@/views/layout') // 布局组件layout 一级路由组件
const home = () => import('@/views/home') // 首页 二级路由组件
const question = () => import('@/views/question')// 问答 二级路由组件
const video = () => import('@/views/video')// 视频  二级路由组件
const user = () => import('@/views/user')// 个人中心 二级路由组件
// 其他的一级路由组件
const chat = () => import('@/views/user/chat') // 小智同学
const login = () => import('@/views/login') // 登录页
const profile = () => import('@/views/user/profile') // 编辑资料
const search = () => import('@/views/search') // 搜索中心
const searchresult = () => import('@/views/search/result') // 搜索结果
const article = () => import('@/views/article') // 文章详情

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    component: Layout, // 布局组件 一级路由组件
    children: [{
      path: '', // 如果二级路由地址path什么都不写 默认就是二级路由的默认组件
      component: home // 首页组件 二级路由组件
    }, {
      path: '/question',
      component: question // 问答组件 二级路由组件
    }, {
      path: '/video',
      component: video // 视频组件 二级路由组件
    }, {
      path: '/user',
      component: user // 个人中心 二级路由组件
    }]
  }, {
    path: '/user/chat',
    component: chat // 小智同学 一级路由组件
  }, {
    path: '/login',
    component: login // 登录页面 一级路由组件
  }, {
    path: '/user/profile',
    component: profile // 编辑资料 一级路由组件
  }, {
    path: '/search',
    component: search // 搜索中心 一级路由组件
  }, {
    path: '/result',
    component: searchresult // 搜索结果 一级路由组件
  }, {
    path: '/article',
    component: article // 文章详情 一级路由组件
  }

]

const router = new VueRouter({
  routes
})

export default router
