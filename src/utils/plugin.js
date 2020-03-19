/***
 *
 *plugin.js 专门负责提供小函数以及vue中常用的过滤器及函数
 *
 */

export default {
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此代码时Vue.prototype.$notify 已经挂载完毕
    Vue.prototype.$wnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    //   给vue的原型属性赋值一个函数 自定义函数名$wnotify
    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有的组件都有了这个属性
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
