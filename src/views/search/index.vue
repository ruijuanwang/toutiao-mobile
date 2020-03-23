<template>
  <!-- 搜索模块 -->
  <div class="container">
    <!-- 导航 left-arrow是返回箭头-->
    <!-- @click-left 点击左侧事件  $router.back()=$router.go(-1)-->
    <van-nav-bar @click-left="$router.back()" title="搜索中心" left-arrow></van-nav-bar>
      <!-- 搜索组件 -->
      <!--  @search 确定搜索时触发事件 -->
    <van-search @search='onSearch' v-model="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容  有输入内容时 显示联想  没有输入内容时 显示历史记录-->
    <van-cell-group class="suggest-box"  v-if="q" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分  你搜索的内容 会在这里记录 -->
    <!-- <div class="history-box" v-if="!q"> -->
    <div class="history-box" v-else>
      <!-- 有历史记录的数据时才显示 头部 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 注册清空历史记录事件 -->
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要变成动态的 循环渲染历史记录 -->
        <!-- 绑定点击历史记录事件 跳搜索结果页  -->
        <van-cell @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <!-- 显示循环内容 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 注册点击叉号删除历史记录的事件 -->
        <!--此时冒泡了 因为父组件也有点击事件  vue 中可以使用 修饰符 .stop 阻止冒泡 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'toutiao-history' // 此 key 作为历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 搜索关键字的内容
      // 当data初始化的时候 会读取后面的数据
      historyList: JSON.parse(localStorage.getItem(key) || '[]') // 接收搜索历史记录数据
    }
  },
  methods: {
    // 删除历史记录
    delHistory (index) {
      // 删除要先在data中删除数据 然后把data中的 数据同步到 本地缓存中
      this.historyList.splice(index, 1) // 删除对应索引的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 存入本地缓存
    },
    // 点击历史记录 跳转到搜索结果页
    toSearchResult (text) {
      // this.$router 路由对象的实例
      // this.$route 当前的路由页面对象信息 有当前的地址 params参数 query参数 fullPath 完整地址 等
      // 路由传参 params query
      // this.$router.push('/search/result?q=' + text) // 1.采用query传参 地址拼接参数
      this.$router.push({ path: '/search/result', query: { q: text } }) // 2.采用 query 对象传参
    },
    // 清空历史记录
    async  clear () {
    // dialog 函数 也支持promise
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要全部删除吗'
        })
        // 成功 会执行下面代码
        this.historyList = [] // 将data中的历史数据置为空
        localStorage.setItem(key, '[]') // 历史记录为空 同步到本地缓存中
      } catch (error) {
        // 失败不需要处理
      }
    },
    // 确定搜索时触发该事件
    onSearch () {
    // 判断有没搜索内容 为空就return
      if (!this.q) return
      // 应该在跳转搜索结果之前 把搜索的内容 this.q 添加到历史记录中
      // 这里需要去重
      this.historyList.push(this.q) // 将搜索内容追加历史记录
      this.historyList = Array.from(new Set(this.historyList)) // 数组去重
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 历史记录同步本地缓存中
      // 搜索事件触发的时候 应该跳到 搜索结果页 并且携带参数(搜索内容)
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
  // created () {
  // 钩子函数 实例初始化之后
  // 获取本地历史记录方法1
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 获取本地缓存历史记录
  // }
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
