<template>
    <!-- 首页模块home -->
  <div class="container">
   <!-- 放置tabs组件 -->
  <van-tabs >
    <!-- 内部需要放置子标签 title值为标签当前显示的内容 -->
    <!-- van-tab 是vant的组件 -->
    <van-tab :title="`标签${item}`" v-for="item in 10" :key="item">
       <!-- 生成若干个单元格 -->
      <!-- scroll-wrapper 样式设置-->
      <!-- <div class="scroll-wrapper">
        <van-cell-group>
          <van-cell v-for="item in 20" :key="item" title="标题" value="内容" />
        </van-cell-group>
      </div> -->
      <!-- 有多少个van-tab标签  就有多少个article-list组件 相当于多个article-list实例 -->
      <ArticleList></ArticleList>
    </van-tab>
  </van-tabs>
  <!-- 在tabs下放置图标 编辑频道的图标 -->
  <span class="bar_btn">
    <!-- 放置 vant图标 -->
    <van-icon name="wap-nav"></van-icon>
  </span>
  </div>
</template>

<script>
import ArticleList from './components/article-list' // 引入文章列表组件
export default {
  components: {
    ArticleList // 注册文章列表组件
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
