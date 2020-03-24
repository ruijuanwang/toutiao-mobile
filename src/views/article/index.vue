<template>
      <!-- 文章详情模块 -->
  <div class="container">
    <!-- 导航 left-arrow是返回箭头-->
    <!-- @click-left 点击左侧事件  $router.back()=$router.go(-1)-->
    <van-nav-bar fixed @click-left='$router.back()' title="文章详情" left-arrow></van-nav-bar>
     <div class="detail">
       <!-- 文章标题 -->
      <h3 class="title">{{ article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <!-- 作者名字 -->
          <p class="name">{{ article.aut_name }}</p>
          <!-- 时间 使用过滤器=>转相对时间 -->
          <p class="time">{{ article.pubdate  | relTime }}</p>
        </div>
        <!-- 关注 需要判断一下 根据 is_followed 判断 他是一个布尔值 -->
        <van-button round size="small" type="info">{{ article.is_followed ? "关注" : "+ 关注" }}</van-button>
      </div>
      <div class="content">
        <!-- 文章内容 是带标签 带属性 带样式的 将标签设置到对应的元素中 用 v-html-->
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <!-- 需要根据 当前的态度 决定谁拥有 active 样式 -->
        <!-- 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 -->
        <van-button round size="small" :class="{ active: article.attitude ===1}"  plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{ active: article.attitude ===0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles' // 引入获取文章详情接口
export default {
  data () {
    return {
      article: {} // 用来接收文章详情数据
    }
  },
  methods: {
    // 获取文章详情数据的方法
    async  getArticleInfo () {
      // 获取地址参数
      const { artId } = this.$route.query // 从当前页的路由信息对象 解构出 query参数
      this.article = await getArticleInfo(artId) // 调用文章详情接口 并把 得到的文章详情数据 直接 赋值给 data变量中
    }
  },
  created () {
    // 钩子函数中 去调用文章详情
    this.getArticleInfo()
  }

}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
