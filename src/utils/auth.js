/**
 *  auth.js 专门处理 token的读写和删除
 *      creat by wangrj 2020/3/15
 */
const USER_TOKEN = 'toutiao-mobile' // 专门用来存储用户信息

// 1.设置用户的token信息
export function setUser (user) {
  // user 应该是一个对象
  // 对象需要转化成字符串存入本地
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 2.获取并且返回用户的token信息
export function getUser () {
  // 将字符串转化为对象再返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // 短路表达式
//   如果前面为true 则后面不执行 如果前面为false 后面才执行
}

// 3.删除用户的token
export function delUser () {
  // 删除token信息
  window.localStorage.removeItem(USER_TOKEN) // 删除用户信息
}
