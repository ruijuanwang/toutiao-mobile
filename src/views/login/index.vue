<template>
      <!-- 登录模块 -->
  <div class="container">
    <!-- 导航 left-arrow是返回箭头-->
    <!-- @click-left 点击左侧事件  $router.back()=$router.go(-1)-->
    <van-nav-bar @click-left='$router.back()' title="登录模块" left-arrow></van-nav-bar>

  <!-- 登录布局 -->
   <!-- cell-group 作为容器来提供外边框 -->
   <van-cell-group>
     <!-- 手机号 -->
      <van-field label="手机号" placeholder="手机号"></van-field >
      <!-- 验证码 -->
      <van-field label="验证码" placeholder="验证码">
          <!-- 具名插槽 发送验证码 -->
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field >
    </van-cell-group>
    <!-- 登录按钮 -->
    <div style="margin: 16px;">
    <van-button size="small" round block type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
