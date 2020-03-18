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
     <!-- error-message 底部错误提示文案，为空时不展示 -->
     <!-- v-model:当前输入的值 他有一个trim修饰符 自动去除左右空格 -->
     <!-- input 和 blur 事件都可以 -->
      <van-field  @blur="checkMobile" v-model.trim="loginForm.mobile" :error-message="errorMessage.mobile" label="手机号" placeholder="手机号"></van-field >
      <!-- 验证码 -->
      <van-field @blur="checkCode" v-model.trim="loginForm.code" :error-message="errorMessage.code" label="验证码" placeholder="验证码">
          <!-- 具名插槽 发送验证码 -->
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field >
    </van-cell-group>
    <!-- 登录按钮 -->
    <div style="margin: 16px;">
    <van-button @click="login" size="small" round block type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 次对象专门放置 错误提示消息
      errorMessage: {
        mobile: '', // 手机号错误提示信息
        code: '' // 验证码错误提示信息
      }
    }
  },
  methods: {
    // 定义校验手机号的方法 此方法会返回一个布尔值
    checkMobile () {
      // 获取手机号 判断 1.是否为空  2.满足手机号格式
      // 第一轮 判断是否为空
      if (!this.loginForm.mobile) {
        // 表示为空
        this.errorMessage.mobile = '手机号不能为空'
        // 手机号为空 就没必要往下进行了
        return false // 返回false false表示 此校验没通过 如果通过 返回true
      }
      // 第二轮 判断是否满足手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 如果手机号不满足正则表达式
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 如果到了这个位置 表示校验通过
      this.errorMessage.mobile = '' // 校验通过 就没有提示消息了
      return true
    },
    // 定义校验 验证码的方法  此方法会返回一个布尔值
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码格式不正确'
        return false
      }
      // 验证通过
      this.errorMessage.code = ''
      return true
    },
    // 登录校验 整体表单检验
    login () {
      // 校验手机号和验证码
      var validateMobile = this.checkMobile() // 值是 true/false
      var validateCode = this.checkCode() // 值是 true/false
      if (validateMobile && validateCode) {
        // 如果两个都是true 就表示校验通过
        // 校验通过 就要调用接口 判断手机号和验证码正确与否
        alert('校验通过')
      }
    }
  }

}
</script>

<style>

</style>
