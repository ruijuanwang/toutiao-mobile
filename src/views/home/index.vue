<template>
    <!-- 首页模块home -->
  <div class="container">
   <!-- 放置tabs组件 -->
  <van-tabs >
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
    <MoreAction></MoreAction>
  </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article-list' // 引入文章列表组件
import { getMyChannels } from '@/api/channels'
import MoreAction from './components/more-action' // 引入反馈内容组件
export default {
  components: {
    ArticleList, // 注册文章列表组件
    MoreAction // 注册反馈内容组件
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false // 控制反馈弹层的显示和隐藏  默认隐藏
    }
  },
  methods: {
    // 获取频道数据方法
    async getMyChannels () {
      const ruselt = await getMyChannels() // 接收返回的数据结果
      this.channels = ruselt.channels // 将数据赋值给data中的变量
    },
    // 此方法会在 article-list组件触发  showAction的时候触发 显示弹层
    openAction () {
      // 此时应该弹出反馈的层
      this.showMoreAction = true
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
