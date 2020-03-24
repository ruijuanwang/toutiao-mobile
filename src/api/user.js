/****
 * 专门处理用户相关的请求
 *
 */
import request from '@/utils/request' // 引入请求模块
// request 相当于 axios的一个实例 和axios有同样的方法和属性

/***
 * 登录方法
 */
export function login (data) {
  return request({
    //   配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // 接收传入的data
    // axios中的body参数放置在data中
  })
//   返回一个promise对象
}
/***********
 *
 * 关注用户
 *
 * ************/
export function followUser (data) {
  return request({
    url: '/user/followings', // 地址
    method: 'post', // 请求类型
    data // body 参数 用户的 id
  })
}
/***********
 *
 * 取消关注用户
 *
 * ************/
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`, // 地址 携带参数 用户的id
    method: 'delete' // 请求类型
  })
}
