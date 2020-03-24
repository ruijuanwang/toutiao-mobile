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
        <!-- 注册 关注或者取消关注的 点击事件 -->
        <!-- loading : 是否显示加载状态 -->
        <van-button :loading="followLoading" @click="follow"  round size="small" type="info">{{ article.is_followed ? "关注" : "+ 关注" }}</van-button>
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
    <!-- 文章评论组件 为何放这里 因为这里有 padding -->
    <Comment></Comment>
    </div>
    <!-- 放一个遮罩层 获取文章详情时应该打开 获取完毕应该关闭-->
    <van-overlay class="loading-container" :show="loading">
      <!-- 加载组件 -->
      <van-loading />
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles' // 引入获取文章详情接口
import { followUser, unfollowUser } from '@/api/user' // 关注用户 和 取消关注用户的接口
import Comment from './components/comment' // 引入文章评论的组件
export default {
  components: {
    Comment // 注册文章评论组件
  },
  data () {
    return {
      article: {}, // 用来接收文章详情数据
      followLoading: false, // 点击关注或取消关注时的 加载状态
      loading: false // 用来控制遮罩层的显示和关闭
    }
  },
  methods: {
    // 获取文章详情数据的方法
    async  getArticleInfo () {
      this.loading = true // 打开遮罩层
      // 获取地址参数
      const { artId } = this.$route.query // 从当前页的路由信息对象 解构出 query参数
      this.article = await getArticleInfo(artId) // 调用文章详情接口 并把 得到的文章详情数据 直接 赋值给 data变量中
      this.loading = false // 关闭遮罩层
    },
    // 关注用户或者取消关注用户
    async follow () {
      this.followLoading = true //  打开加载状态
      try {
        // 可以通过 this.article.is_followed 来判断 我们调 关注用户的接口 还是取消关注用户的接口
        // 关注=>取消关注
        // 未关注=>关注
        if (this.article.is_followed) {
        // 取消关注用户接口
          await unfollowUser(this.article.aut_id) // 传入当前作者id
        } else {
        // 关注用户接口
          await followUser({ target: this.article.aut_id }) // 传入当前作者id
        }
        // 如果成功了
        // pc端 是重新 加载数据
        // 移动端 不会重新加载 只会修改对应的数据状态
        this.article.is_followed = !this.article.is_followed // 将状态改为 相反 状态
        this.$wnotify({ type: 'success', message: '操作成功' })
      } catch (error) {
        // 失败会进入catch
        // error.message 是报错的信息 就可以知道哪里出问题 这个错误哪里抛出的
        // 现在写的是中间代码 => 编译的 => 报错指示是编译之后的代码 => 推导出哪里出问题了
        this.$wnotify({ message: '操作失败' }) // 提示消息
      } finally {
        //  不论你写的执行 是成功的还是失败的  不论是走 try  catch 最终都会进入 finally
        this.followLoading = false // 关闭加载状态
      }
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
    z-index: 2;
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
// 弹层样式
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
</style>
