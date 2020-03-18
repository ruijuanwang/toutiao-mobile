<template>
  <!-- 封装一个文章列表组件 实现上拉加载 -->
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 组件可以帮助我们完成上拉加载  但是需要一些变量 -->
  <!-- 这里放置一个div的目的是 形成一个滚动条(style样式) 因为后期要做 阅读记忆 -->
  <!-- 阅读记忆：上次阅读到哪 回来之后还是哪 -->
  <div class="scroll-wrapper">
      <!-- 文章列表 组件 -->
      <!-- van-list组件 如果不干涉 初始化完毕 就会检测 自己距离底部的长度 如果超出了限定 就会执行 load事件 自动把绑定的loading 变成 true -->
    <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 表示是否开启上拉加载 默认 false
      finished: false // 表示是否已经完成 所有数据的加载
    }
  },
  methods: {
    onLoad () {
      // 如果加载状态 检测机制 高度不够 还是会自动执行 load事件 开启上拉加载
      // 如果有数据 应该把数据加载到 list 中
      // 要想关掉
      setTimeout(() => {
        this.finished = true // 表示数据 已经全部加载完毕 没有数据了
      }, 1000) // 等待1秒 然后关闭 加载状态
    }
  }

}
</script>

<style>

</style>
