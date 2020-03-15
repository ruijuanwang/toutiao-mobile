<template>
      <!-- 文章详情模块 -->
  <div class="container">
    <!-- 导航 left-arrow是返回箭头-->
    <!-- @click-left 点击左侧事件  $router.back()=$router.go(-1)-->
    <van-nav-bar @click-left='$router.back()' title="文章详情" left-arrow></van-nav-bar>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
