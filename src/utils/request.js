/****
 * request.js 请求管理工具
 * create by wangrj 2020/03/16
 *
 */
import axios from 'axios'
// axios.defaults 是对原有默认值进行了修改
// axios.create()  相当于new了一个新的axios实例

var instance = axios.create({
  // 构造参数 传入一些配置 和default一样

}) // 创建了一个axios的新实例

export default instance
