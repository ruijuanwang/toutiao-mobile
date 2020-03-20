/***
 *
 *plugin.js 专门负责提供小函数以及vue中常用的过滤器及函数
 *
 */
import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间插件
import 'dayjs/locale/zh-cn' //  dayjs 不会自动引入语言包 默认只支持英文语言包
dayjs.extend(relativeTime) // 相当于 dayjs扩展 相对时间的方法 这个方法写完之后 dayjs就有了 form相对时间方法

export default {
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此代码时Vue.prototype.$notify 已经挂载完毕
    Vue.prototype.$wnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    //   给vue的原型属性赋值一个函数 自定义函数名$wnotify
    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有的组件都有了这个属性
    // 全局过滤器 Vue.filter('名称',函数)
    Vue.filter('relTime', relTime) // 注册一个全局过滤器 一旦注册任意位置都可以使用
  }
}

/***********
 * 休眠函数
 * time=500 如果传入了time 就用传来的time 如果没有传time 就用默认的参数值500
 */
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    // 成功执行 但是有一个延迟
    setTimeout(() => resolve(), time)
  })
}
/*********
 *
 * 此函数用来将 日期 转化成 相对时间
 *@param date 传入的日期
 * ******** */
function relTime (date) {
  // 还需要将dayjs 进行本地的语言包转化
  return dayjs().locale('zh-cn').from(date) // from(中的值是日期或者dayjs得到的日期) dayjs()是当前时间 dayjs().from(data)指当前时间距离传入时间有多远
}
