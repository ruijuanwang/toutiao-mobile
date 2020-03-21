<template>
    <!-- 首页模块home -->
  <div class="container">
   <!-- 放置tabs组件 -->
   <!-- v-model绑定的是被激活页签的索引 -->
  <van-tabs v-model="activeIndex" >
    <!-- 内部需要放置子标签 title值为标签当前显示的内容 -->
    <!-- van-tab 是vant的组件 -->
    <!-- 拿到channels频道数据之后 循环 -->
    <van-tab :title="item.name" v-for="item in channels" :key="item.id">
       <!-- 生成若干个单元格 -->
      <!-- scroll-wrapper 样式设置-->
      <!-- <div class="scroll-wrapper">
        <van-cell-group>
          <van-cell v-for="item in 20" :key="item" title="标题" value="内容" />
        </van-cell-group>
      </div> -->
      <!-- 有多少个van-tab标签  就有多少个article-list组件 相当于多个article-list实例 -->
      <!-- 需要将频道id传给每一个列表组件 父传子 props -->
      <!--监听 article-list 触发的ArticleList事件 接收子组件自定义事件 并且显示弹层 -->
      <ArticleList @showAction="openAction" :channel_id='item.id'></ArticleList>
    </van-tab>
  </van-tabs>
  <!-- 在tabs下放置图标 编辑频道的图标 -->
  <span class="bar_btn">
    <!-- 放置 vant图标 -->
    <van-icon name="wap-nav"></van-icon>
  </span>
  <!-- 放置一个弹层组件 van-popup -->
  <!-- 用单层组件 popup 来包裹我们的反馈内容组件 -->
  <!-- 绑定一个布尔值 来控制弹层的显示隐藏 -->
  <van-popup v-model="showMoreAction" style="width:80%">
    <!-- 反馈内容组件 -->
    <!-- 监听谁触发的自定义事件 就在谁的标签上写监听 -->
    <!-- 监听 more-action 组件触发的事件 并且去调用不感兴趣接口  -->
    <MoreAction @dislike='dislikeArticle' ></MoreAction>
  </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article-list' // 引入文章列表组件
import { getMyChannels } from '@/api/channels' // 引入获取我的(匿名)频道接口
import MoreAction from './components/more-action' // 引入反馈内容组件
import { dislikeArticle } from '@/api/articles' // 引入对文章不感兴趣接口
import eventbus from '@/utils/eventbus' // 引入公共事件处理器
export default {
  components: {
    ArticleList, // 注册文章列表组件
    MoreAction // 注册反馈内容组件
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈弹层的显示和隐藏  默认隐藏
      articleId: null, // 用来接收 被点击的文章id
      activeIndex: 0 // 被激活的tab页签 默认是0(索引) 也就是频道的第一个

    }
  },
  methods: {
    // 获取频道数据方法
    async getMyChannels () {
      const ruselt = await getMyChannels() // 接收返回的数据结果
      this.channels = ruselt.channels // 将数据赋值给data中的变量
    },
    // 此方法会在 article-list组件触发  showAction的时候触发 显示弹层
    openAction (artId) {
      // 此时应该弹出反馈的层
      this.showMoreAction = true
      // 把传过来 当前被点击的文章 id 存起来 调用接口的时候要传出去
      this.articleId = artId
    },
    // 此方法会在 more-action组件触发  dislike的时候触发 去调用接口
    async dislikeArticle () {
      // 调用对文章不感兴趣的接口
      try {
        await dislikeArticle({
          target: this.articleId // 传入不感兴趣的文章id
        })
        // await下方的逻辑 是 resolve(成功)之后执行的
        // 弹出一个成功的提示
        this.$wnotify({
          type: 'success', // 成功颜色是绿色的
          message: '操作成功'
        })
        // 应该触发一个自定义事件 利用事件广播机制 通知对应的 tab 来删除文章数据
        // 除了要传入一个文章的id之外 还要告诉监听事件的人 现在处于哪个频道 传入频道id 也就是被激活的频道id
        // this.channels[this.activeIndex].id //当前被激活的频道id
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 监听了这个事件组件 就要根据id来删除数据 应该在article-list文章列表去监听$.on
        this.showMoreAction = false // 删除成功 应该关闭弹层
      } catch (error) {
        // 表示失败
        // 弹出一个失败的提示 type默认红色
        this.$wnotify({
          message: '操作成功'
        })
      }
    }

  },
  created () {
    // 直接获取频道数据
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
