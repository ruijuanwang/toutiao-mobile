<template>
  <!-- 搜索结果组件 -->
  <div class="container">
    <!-- 导航 left-arrow是返回箭头-->
    <!-- @click-left 点击左侧事件  $router.back()=$router.go(-1)-->
    <!-- fixed 将导航栏 固定到顶部 -->
    <van-nav-bar fixed @click-left='$router.back()' title="搜索结果" left-arrow></van-nav-bar>
    <!-- 放置搜素结果列表 实现上拉加载 -->
    <van-list v-model="upLoading" :finished="finished" @load="onLoad">
      <van-cell-group>
    <!-- 文章列表结构 -->
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ item.title }}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{item.comm_count}}</span>
              <!-- 用过滤器处理时间格式 -->
              <span>{{item.pubdate | relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>

    </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/articles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载的状态
      finished: false, // 表示当前加载是否全部完成了 如果全部加载完成 应该finished 设置为 true
      articles: [], // 放置搜索结果文章
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页多少条
      }
    }
  },
  methods: {
    // 滚动条滚动到底部的时候执行该方法
    async onLoad () {
      // 调用搜索文章的借接口
      const { q } = this.$route.query // 获取路由中query参数
      const result = await searchArticle({ ...this.page, q }) // 传参数
      this.articles.push(...result.results) // 得到的数据应该追加到 articles中
      this.upLoading = false // 关闭上拉加载状态
      // 如何判断 上拉加载已经把所有的数据请求过来了
      // 接口没有告诉我们 什么时候结束 可以根据当前返回的数据 是否有记录
      // 如果返回的查询结果为0 说明 没有下一页数据了
      if (result.results.length) {
        // 下一页有数据
        this.page.page++ // 如果有下一页 请求页码 应该切换到下一页
      } else {
        // 否则没有下一页
        this.finished = true // 数据加载完了
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
