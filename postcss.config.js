// 此文件专门处理postcss插件
module.exports = {
  // 所有postcss插件
  plugins: {
    // 自动给css样式加前缀的属性 如:display:flex=>自动添加其他浏览器前缀
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // (37.5是以iphone6的十分之一为基准值) 基准值 font-size:30px / 37.5 => 30 / rootValue=rem
      propList: ['*']// 包括哪些文件所有的文件都转化rem
    }

  }

}
