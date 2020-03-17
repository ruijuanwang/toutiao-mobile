/****
 * 此文件专门用来做 导航守卫
 */
import router from '@/router' // 引入router实例
import store from '@/store' // 引入store对象
// 前置守卫 当路由发生变化 前置守卫就会执行
router.beforeEach(function (to, from, next) {
  // next是必须执行的函数
  // 需要判断请求地址 和 token
//   如果是/user 为起始 说明 需要进行token的判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    //   需要拦截请求 去登录页
    // 如果想去A页面 被拦截了 去了登录 登录成功之后应该回到A页面
    next({
      path: '/login', // 要跳转的地址
      query: {
        //   fullPath和path的区别是 fullPath会带?后面的参数 是一个完整的地址
        redirectUrl: to.fullPath // 告诉登录页 没有完成的访问 登录成功 要完成我想访问的页面
      }
    })
  } else {
    //  放行有两种情况  1.地址不是以 /user 开头 2.是以 /user 开头并且有token
    next()
  }
})
