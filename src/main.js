import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 权限拦截模式
import store from './store'
import vant, { Lazyload } from 'vant' // 引入vant组件库 和 Lazyload
import plugin from '@/utils/plugin' // 引入自己封装的插件
import 'vant/lib/index.less' // 引入vant组件的样式  这里改成less 是因为我们想修改变量
import '@/styles/index.less' // 引入自定义全局样式 覆盖vant的样式
import 'amfe-flexible' // 改变基准值

Vue.use(vant) // 全局注册vant的所有组件 一旦注册任意位置都可以使用vant组件 相当于调用了vant导出的对象方法 install方法
// 以上是完整导入模式 还可以按需导入
Vue.use(plugin) // 注册组件 需要放置在Vue.use(vant) 之后 因为我们要在 plugin中用vant的内置函数,必须等到vant注册完毕
Vue.use(Lazyload) // 注册懒加载的指令 图片就可以搭配这个指令进行懒加载了
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
