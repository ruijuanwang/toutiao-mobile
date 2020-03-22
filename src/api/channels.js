import store from '@/store'

/****
 * 负责处理频道数据
 *
 */
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'toutiao-v' // 登录用户的key
const CACHE_CHANNEL_Y = 'toutiao-t'//  游客用户的key
/***
 * 获取我的频道数据 没有参数 匿名用户也可以获取数据
 * 要将此方法改造成 本地化频道
 *
 */
export function getMyChannels () {
  // 我们要对原来的方法 进行改造 但是不想 改造调用方式 所以用 new promise
  // 因为Python 端 编辑用户接口有问题
  return new Promise(function (resolve, reject) {
    // 要支持本地化缓存 要区分当前是 登录用户还是游客用户 如何判断登录还是游客 可以根据当前有没有token 来判断 是否是登录
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_Y // key=>根据当前的登录状态来判断
    // 读取缓存中 用户频道数据
    const str = localStorage.getItem(key)
    if (str) {
      // 说明有本地缓存数据 应该把本地缓存数据 释放给 后面的执行结果
      resolve({ channels: JSON.parse(str) }) // 这里的结构是和请求中的一致
    } else {
      // 说明没有本地缓存数据 应该调用接口 去线上拉取数据
      request({ url: '/user/channels' }).then(result => {
        // 获取请求的结果
        // 存入本地缓存
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 这里还需要 resolve我们的数据
        resolve(result) // 这里表示直接成功 执行了 获取用户频道数据
      })
    }
  })
  // return request({
  //   url: '/user/channels' // 地址
  // })
}
/*****
 *
 * 获取全部的频道
 *
 * ******/
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
