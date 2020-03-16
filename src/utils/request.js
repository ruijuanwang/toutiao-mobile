/****
 * request.js 请求管理工具
 * create by wangrj 2020/03/16
 *
 */
import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象 相当于 组件中的 this.$store
// axios.defaults 是对原有默认值进行了修改
// axios.create()  相当于new了一个新的axios实例

var instance = axios.create({
  // 构造参数 传入一些配置 和default一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础的请求地址
  // 是后端响应回来 但还没有进入到axios的响应拦截器的时候 执行次函数 也就是响应拦截器之前执行 数组里可以有多个处理函数
  transformResponse: [function (data) {
    //   data是后端响应过来的字符串
    // 替代原来的JSON.parse()
    return data ? JSONBig.parse(data) : {}
  }]

}) // 创建了一个axios的新实例

// token的注入 应该在 请求之前 也就是请求拦截器
// instance是一个新的axios实例
instance.interceptors.request.use(function (config) {
  // 成功的时候
  // 读取配置信息 给配置信息中注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token 统一注入到headers中
  }
  //   不用ifelse写法
  //   store.state.user.token && (config.headers.Authorization = `Bearer ${store.state.user.token}`) // 将token 统一注入到headers中
  return config // 返回配置
}, function (error) {
  // 直接返回 promise的错误
  return Promise.reject(error) // 返回错误 这样的话会直接进入到axios的catch中
})

// 用响应拦截器 处理 返回结果的数据 将多嵌套的结构 解构出来
instance.interceptors.response.use(function (response) {
  // response实际上已经被axios 默认包了一层数据  data才是我们之前处理过的数据
//   几乎所有的数据都有data
  try {
    return response.data.data // 如果成功则返回 如果两层可以解开 就返回两层
  } catch (error) {
    //   如果失败 说明response.data 不存在 如果两层解不开 就返回一层
    return response.data
  }
}, function (error) {
  // 直接返回失败
  return Promise.reject(error) // 返回执行链的 catch
})
export default instance
