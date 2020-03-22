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
/**********
 *
 * 删除频道数据
 * @params  id作为删除的依据
 * ***********/
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 有了id 就可以直接在缓存中删除对应的id数据
    // 删除频道时 无论如何都有数据
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_Y // key=>根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key)) // 直接将将本利缓存中的字符串转化成 对象
    // 第一种删除方法
    // filter方法 返回一个新的数组 返回不等于 id 的所有数据
    // channels = channels.filter(item => item.id !== id)
    // // 删除完 应该直接写入缓存
    // localStorage.setItem(key, JSON.stringify(channels))
    // resolve()
    // 第二种方法
    const index = channels.findIndex(item => item.id === id) // 找到对应频道的索引
    if (index > -1) {
      // 因为下标从0开始
      channels.splice(index, 1) // 删除对应的下标预元素
      localStorage.setItem(key, JSON.stringify(channels)) // 删除成功 存入缓存中
      // 如果执行成功了 我们直接resolve
      resolve() // resolve 可以传参数 也可以不传参数
    } else {
      // 如果没有找到对应的下标
      reject(new Error('没有找到对应的频道'))
    }
  })
}
/*************
 *
 * 添加频道的方法
 * @params channel 是 {id :1 , name :'c++'}  参数是个对象
 *
 * ***************/
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 根据当前的token判断哪个key
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_Y // key=>根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key)) // 转化数组 得到缓存中的数据
    channels.push(channel) // 将添加的频道数据追加到队尾
    localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
    resolve() // 执行这一步 相当于 告诉我们 使用 promise的方法 执行成功了
  })
}
