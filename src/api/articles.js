/*****
 * 处理文章模块的请求数据
 *
 */
import request from '@/utils/request'
/*****
 *
 *获取文章推荐数据
 需要传入 params
    timestamp 时间戳  channels_id 频道id
 */

export function MyArticles (params) {
  return request({
    // 这里写完整地址 因为之前的baseUrl是v1_1
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据
    //  with_top: 1 是写死的参数
  })
}
/*********
 *
 * 不感兴趣的文章接口
 *
 * ***********/
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes', // 地址
    method: 'post', // 请求类型
    data
    // body参数在data中
  })
}
/*********
 *
 * 举报文章接口
 *
 * ***********/
export function reportArticle (data) {
  return request({
    url: '/article/reports', // 地址
    method: 'post', // 接口类型
    data // body参数

  })
}
