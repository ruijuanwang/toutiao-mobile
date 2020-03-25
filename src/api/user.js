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
/********
 *
 * 获取用户自己的个人信息
 *
 * **********/
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/********
 *
 * 获取用户的个人资料 (编辑资料时获取的)
 *
 * **********/
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
/*******
 * 修改用户头像的
 * formData类型的
 * **********/
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data // body参数
  })
}
/******
 *
 * 编辑用户个人资料 保存时调用该接口
 *
 * **********/
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null } // 直接将头像置为空
  })
}
