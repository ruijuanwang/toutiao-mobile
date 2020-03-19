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
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置元素 文章列表的循环项 无图 单图 三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
              <!-- 三图图片 -->
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图模式  单图模式暂时隐藏-->
              <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div> -->

              <!-- 作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
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
export default {
  data () {
    return {
      successText: '刷新成功', // 上拉刷新文案
      downLoading: false, // 下拉刷新
      upLoading: false, // 表示是否开启上拉加载 默认 false
      finished: false, // 表示是否已经完成 所有数据的加载
      articles: [] // 文章列表内容
    }
  },
  methods: {
    // 1.上拉加载
    onLoad () {
      console.log('开始请求数据')
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
      if (this.articles.length > 50) {
        // 如果此时数据已经大于50条
        this.finished = true // 关闭加载 onload就不会再自动触发执行
      } else {
        // 1-60 ==>this.articles.length + index + 1
        var arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        // 上拉加载 不是覆盖之前的数据 而是追加到数组队尾
        this.articles.push(...arr)
        // 添加完成之后 需要手动关闭loading
        this.upLoading = false
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
