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
  }
}
