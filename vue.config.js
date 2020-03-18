/****
 *  需要导出一个对象
 * 用来修改vant组件库的主题颜色
 *
 */
module.export = {
  // 需要更改less中变量的配置
  css: {
    // css相关
    loaderOptions: {
      // 所有的关于样式 loader相关的选项
      less: {
        // modifyVars 是less-loader的一个选项 通过这个选项可以改变 变量的值
        modifyVars: {
          // 直接覆盖变量 变量名blue不需要写@
          blue: '#3296fa'
        }
      }

    }
  }
}
