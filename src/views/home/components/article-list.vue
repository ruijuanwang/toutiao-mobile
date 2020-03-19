<template>
  <!-- 封装一个文章列表组件 实现上拉加载 -->
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 组件可以帮助我们完成上拉加载  但是需要一些变量 -->
  <!-- 这里放置一个div的目的是 形成一个滚动条(style样式) 因为后期要做 阅读记忆 -->
  <!-- 阅读记忆：上次阅读到哪 回来之后还是哪 -->
  <div class="scroll-wrapper">
    <!-- 文章列表 组件 -->
    <!-- van-list组件 如果不干涉 初始化完毕 就会检测 自己距离底部的长度 如果超出了限定 就会执行 load事件 自动把绑定的loading 变成 true -->
    <!-- 下拉刷新组件 包裹 列表组件 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list v-model="upLoading" :finished="finished" finished-text="没有了哦" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <!-- 循环单元格 -->
          <!-- item.art_id 是一个大数字对象 v—for的key需要用字符串或者数字代理 -->
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置元素 文章列表的循环项 无图 单图 三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
            <!-- 根据当前的封面类型type决定显示单图 三图 或无图 -->
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图模式  单图模式暂时隐藏-->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image class="w100" fit="cover" src="item.cover.images[0]" />
              </div>

              <!-- 作者信息 -->
              <div class="info_box">
                <!-- 作者  -->
                <span>{{item.aut_name}}</span>
                <!-- 评论 -->
                <span>{{item.comm_count}}</span>
                <!-- 时间 -->
                <span>{{item.pubdate}}</span>
                <!-- 关闭按钮 -->
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { MyArticles } from '@/api/articles' // 获取文章列表方法
export default {
  // props:['channel_id'] //1. 数字符串组 接收方式
  // props 2.对象形式 可以约束传入的值 必填 传值类型
  props: {
    // key(props属性):value(对象 配置)
    channel_id: {
      required: true, // 必填项 此属性的含义是true 要求该props必须传
      type: Number, // 表示要传入的props属性的类型
      default: null // 表示默认值 假如没有传props属性 默认值 就会被采用
    }
  },
  data () {
    return {
      successText: '刷新成功', // 上拉刷新文案
      downLoading: false, // 下拉刷新
      upLoading: false, // 表示是否开启上拉加载 默认 false
      finished: false, // 表示是否已经完成 所有数据的加载
      articles: [], // 文章列表内容
      timestamp: null // 定义时间戳属性 用来存储 后端返回的历史时间戳
    }
  },
  methods: {
    // 1.上拉加载
    async onLoad () {
      console.log('开始请求文章列表数据')
      // 如果加载状态 检测机制 高度不够 还是会自动执行 load事件 开启上拉加载
      // 如果有数据 应该把数据加载到 list 中
      // 要想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示数据 已经全部加载完毕 没有数据了
      // }, 1000) // 等待1秒 然后关闭 加载状态
      // --------------------------------------------------------------------------------- 上拉加载 模拟数据
      // 如果你的数据已经加载完毕 应该把finished 设置为true 表示一切已经结束了 不在请求
      // 此时判断 如果条数大于50 说明数据加载完毕
      // vant-list组件 第一次加载 需要让list组件 出现滚动条 如果没有滚动条 就没办法继续往下拉
      // if (this.articles.length > 50) {
      //   // 如果此时数据已经大于50条
      //   this.finished = true // 关闭加载 onload就不会再自动触发执行
      // } else {
      //   // 1-60 ==>this.articles.length + index + 1
      //   var arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据 而是追加到数组队尾
      //   this.articles.push(...arr)
      //   // 添加完成之后 需要手动关闭loading
      //   this.upLoading = false
      // }
      // ----------------------------------------------------------------------------------------上拉加载 真实数据
      // this.timestamp || Date.now() 表示 如果有历史时间戳 就传入历史时间戳 否则用当前的时间戳
      var result = await MyArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // this.channel_id 是当前的频道id
      //  获取内容

      this.articles.push(...result.results) // 用... 把数据追加到队尾
      this.upLoading = false // 数据获取回来 关闭加载状态
      // 赋值历史时间戳的时候先 判断历史事件戳 是否为0
      // 如果为0 说明已经没有数据了 数据都已加载完毕 应该宣布结束 finished为true
      if (result.pre_timestamp) {
        // 如果有历史时间戳 表示还有数据可以继续进行加载
        this.timestamp = result.pre_timestamp // 把历史时间戳赋值给data中的变量
      } else {
        // 没有数据可以请求了
        this.finished = true
      }
    },
    // 2.下拉刷新
    onRefresh () {
      // ----------------------------------------------------------------------------------下拉刷新 模拟数据
      setTimeout(() => {
        // 下拉刷新 表示要读取最新的数据 而且最新的数据要添加到数据头部
        var arr = Array.from(Array(2), (value, index) => `追加${index + 1}`)
        // 数组添加到头部
        this.articles.shift(...arr)
        // 手动关闭正在刷新的状态
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据` // 刷新完毕提示文案
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
