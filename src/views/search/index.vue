<template>
  <!-- 搜索模块 -->
  <div class="container">
    <!-- 导航 left-arrow是返回箭头-->
    <!-- @click-left 点击左侧事件  $router.back()=$router.go(-1)-->
    <van-nav-bar @click-left="$router.back()" title="搜索中心" left-arrow></van-nav-bar>
      <!-- 搜索组件 -->
    <van-search v-model="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容  有输入内容时 显示联想  没有输入内容时 显示历史记录-->
    <van-cell-group class="suggest-box"  v-if="q" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分  你搜索的内容 会在这里记录 -->
    <!-- <div class="history-box" v-if="!q"> -->
    <div class="history-box" v-else>
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell>
          <a class="word_btn">电脑</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      q: '' // 搜索关键字的内容
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
