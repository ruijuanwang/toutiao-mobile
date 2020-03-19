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
