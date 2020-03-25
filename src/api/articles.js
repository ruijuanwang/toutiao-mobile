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
/*****
 *
 * 获取联想搜索建议
 *@params 参数 搜索内容
 *
 * *****/
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 地址
    params // query 参数放在 params中
  })
}
/**********
 *
 * 搜素文章的方法
 *
 * **********/
export function searchArticle (params) {
  return request({
    url: '/search',
    params // 关键词 和 分页信息
  })
}
/**********
 *
 * 获取文章详情
 *
 * *************/
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}` // 地址
  })
}
/******
 *
 * 获取文章评论 或者 文章评论的回复
 *
 * @params 参数
 *  type  表示 获取 a文章的评论  还是 c评论的回复
 *  source 表示 获取a文章的id还是 c评论的id
 *  offset 偏移量=>分页依据, 要获取下一页的数据 要传上一页的最后一个id...
 *
 * ********/
export function getComments (params) {
  return request({
    url: '/comments', // 地址
    params // query参数 包括 type  source  offset
  })
}
/********
 *
 * 评论 或者 回复评论的接口  支持两种场景 1.文章评论 2.评论的回复
 *
 * ************/
export function commentOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data // body参数  评论的id  评论的内容 conent  对评论回复时要传art_id (对文章评论不用传此参数)
  })
}
