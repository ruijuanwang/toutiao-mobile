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
  <!-- 给图标添加点击事件 点击显示制频道面板 -->
  <span class="bar_btn" @click="showChannelEdit=true">
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
    <!-- 不喜欢文章 和 举报文章 用一个方法  -->
    <!-- $event 是事件参数 在h5标签中 dom元素的事件参数 自定义事件中$event 就是自定义事件传出的第一个参数 -->
    <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"></MoreAction>
  </van-popup>
  <!-- 放置弹出面板(上拉菜单)组件 用来包裹编辑频道组件 -->
  <van-action-sheet v-model="showChannelEdit" :round="false" title="频道管理">
    <!-- 放置编辑频道组件 -->
    <!-- 把父组件中的 用户频道数据 传给子组件 -->
    <!-- 接收子组件触发的自定义事件 -->
    <!-- 父组件应该把被激活的 索引传给 编辑频道组件 =>添加红色样式 -->
    <Channel-edit :activeIndex='activeIndex' @selectChannel="selectChannel" :channels='channels'></Channel-edit>
  </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list' // 引入文章列表组件
import { getMyChannels } from '@/api/channels' // 引入获取我的(匿名)频道接口
import MoreAction from './components/more-action' // 引入反馈内容组件
import { dislikeArticle, reportArticle } from '@/api/articles' // 引入对文章不感兴趣接口 和 举报文章接口
import eventbus from '@/utils/eventbus' // 引入公共事件处理器
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  components: {
    ArticleList, // 注册文章列表组件
    MoreAction, // 注册反馈内容组件
    ChannelEdit // 注册编辑频道组件
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈弹层的显示和隐藏  默认隐藏
      articleId: null, // 用来接收 被点击的文章id
      activeIndex: 0, // 被激活的tab页签 默认是0(索引) 也就是频道的第一个
      showChannelEdit: false // 用来控制频道列表的显示和隐藏

    }
  },
  methods: {
    // 方法 1
    // 当编辑频道子组件 触发selectChannels事件时 触发该方法
    // selectChannel (id) {
    //   // 拿到id 找到id对应的频道的索引
    //   const index = this.channels.findIndex(item => item.id === id) // 找到索引
    //   this.activeIndex = index // 把被点击的频道索引赋值给 当前被激活的 标签
    //   this.showChannelEdit = false // 关闭编辑频道的弹层
    // },
    // 方法 2
    // 当编辑频道子组件 触发selectChannels事件时 触发该方法
    selectChannel (index) {
      this.activeIndex = index // 把被点击的频道索引赋值给 当前被激活的 标签
      this.showChannelEdit = false // 关闭编辑频道的弹层
    },
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
    // operateType是操作类型 如果是dislike 就是不喜欢 如果是report 就是举报
    async dislikeOrReport (operateType, type) {
      // 调用对文章不感兴趣的接口 或者 举报文章的接口
      try {
        // 根据一个参数 operateType 来判断是举报还是不喜欢 来调用相对应的接口
        operateType === 'dislike' ? await dislikeArticle({ target: this.articleId }) : await reportArticle({ target: this.articleId, type }) // 这里的type 通过 $event传出来
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
          message: '操作失败'
        })
      }
    }
    // // 举报文章
    // async report (type) {
    //   // 调用举报文章接口
    //   try {
    //     await reportArticle({ target: this.articleId, type })
    //     // await下方的逻辑 是 resolve(成功)之后执行的
    //     // 弹出一个成功的提示
    //     this.$wnotify({
    //       type: 'success', // 成功颜色是绿色的
    //       message: '操作成功'
    //     })
    //     // 举报成功 同样也要将举报的文章删除
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 删除成功 应该关闭弹层
    //   } catch (error) {
    //     // 表示失败
    //     // 弹出一个失败的提示 type默认红色
    //     this.$wnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }

  },
  created () {
    // 直接获取频道数据
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
// 处理弹出编辑频道面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
