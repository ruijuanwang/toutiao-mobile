/****
 * request.js 请求管理工具
 * create by wangrj 2020/03/16
 *
 */
import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象 相当于 组件中的 this.$store
import router from '@/router'
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

// 1. token的注入 应该在 请求之前 也就是请求拦截器
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

// 2.用响应拦截器 处理 返回结果的数据 将多嵌套的结构 解构出来
instance.interceptors.response.use(function (response) {
  // response实际上已经被axios 默认包了一层数据  data才是我们之前处理过的数据
//   几乎所有的数据都有data
  try {
    return response.data.data // 如果成功则返回 如果两层可以解开 就返回两层
  } catch (error) {
    //   如果失败 说明response.data 不存在 如果两层解不开 就返回一层
    return response.data
  }
}, async function (error) {
  // 如果 请求失败或者失效 或者其他错误 会进入 到响应拦截器的错误的区域
//   只要是401 就是token 失效 (应该用导航守卫将没有token的拦截在外面)
/***
 * error中有三个对象：
 *     config 出现这次错误请求的配置信息
 *     request 请求对象
 *     response 响应对象 status (状态码)
 *
 */
  if (error.response && error.response.status === 401) {
    // 抽提对象
    var path = {
      path: '/login', // 跳转地址
      query: {
        redirectUrl: router.currentRoute.fullPath// 表示登录页要跳转的地止
      } // 路由传参的两个写法 动态路由 和 query()
    }

    //   如果状态码是404的话 就认为token失效了  就需要处理token失效的问题
    // refresh_token 相当于续命的药
    if (store.state.user.refresh_token) {
      // 表示有 refresh_token 续命的药
    //   用refresh_token换取新的token
    // 需要调用刷新token的接口  调用接口用axios工具 还是instance工具?
    // 发送请求 这里必须用axios 因为现在token已经失效了 instance 的拦截器 还是会将失效的token注入到headers中 造成死循环
    // 需要没有拦截器的axios来发 刷新token(接口) 的请求
      try {
        const result = await axios({
          method: 'put', // 请求类型
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 请求完整地址
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}` // 在请求头中注入 refresh_token
          }
        })
        //   await 后面就是promise执行 成功 完成的逻辑
        //   如果请求成功 会返回一个新token ( result.data.token ) 用新token 去更新失效的token
        //   提交mutations 更新vuex数据
        store.commit('updateUser', {
        //   载荷数据
          user: {
            token: result.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token // 还是原来的refresh_token 14天之后过期
          }
        })
        //   之所以会来这个位置 是因为401 也意味着之前的请求是错误的
        // 换了新的token 需要把之前的请求再次发送出去  用instance
        return instance(error.config) // 相当于执行之前401错误的请求 返回这个请求的目的是 继续执行这个请求执行链下面的内容
      } catch (error) {
        // 如果失败意味着 尝试续命 续命失败  说明refresh_token 14天已过期
        // 应该重新登录 重新登陆之前 需要删掉 token 因为此时token失效 refresh_token也失效
        store.commit('delUser')
        // 重新回到登录页
        router.push(path)
      }
    } else {
      // 如果没有refresh 我们不能直接router.push('/login')跳到登录页 我们还要携带当前的地址
      // 如果token失效 直接跳到登录页 当前页面怎么办
      // 我们要实现 在 A 页面发送请求 结果失败了 也没有 refresh_token 只能回到登录页 登录成功之后 我们还在A页面中
      // 怎么做 我们需要在跳到登录页的过程中 把当前页面的地址 传给登录页面
    //   登录页面 登录成功之后 先判断 有没有要跳转的地址 如果没有跳到主页 如果有 跳到需要跳转的页面
    // router.currentRoute 表示当前路由的信息对象 里面包含了路由的地址和参数
    // 我们需要获取 当前路由 带参数的地址通过 router.currentRoute.fullPath来获取  fullPath表示带参数 path表示不带参数
      store.commit('delUser') // 也要删除token 因为token已经失效
      router.push(path)
    }
  }
  // 直接返回失败
  return Promise.reject(error) // 返回执行链的 catch
})
export default instance
