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
// 引入login方法 1
// import * as user from '@/api/user'
import { login } from '@/api/user' // 引入login方法 2
import { mapMutations } from 'vuex' // 辅助函数 可以把mutations方法映射到methods方法中
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      // 次对象专门放置 错误提示消息
      errorMessage: {
        mobile: '', // 手机号错误提示信息
        code: '' // 验证码错误提示信息
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 可以导入需要的方法 直接把updataUser方法映射到当前的methods方法中
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
    async login () {
      // 校验手机号和验证码
      var validateMobile = this.checkMobile() // 值是 true/false
      var validateCode = this.checkCode() // 值是 true/false
      if (validateMobile && validateCode) {
        // 如果两个都是true 就表示校验通过
        // 校验通过 就要调用接口 判断手机号和验证码正确与否
        // alert('校验通过')
        // axios是后端接口 不论成功或者失败 返回的结果都是200
        try {
          const result = await login(this.loginForm)// 调用接口方法
          // 验证成功返回result  后端把所有的手机号都认为是成功
          // 返回的结果就是token 应该吧token 设置成vuex中的state
          // 修改vuex中的state必须通过 mutations
          // this.commit('updateUser', { user: result })  //1.原始方式
          this.updateUser({ user: result }) // 相当于更新当前的token和 refresh_token (方式2映射到方法中 this直接取)
          //  应该跳转到主页 但是 如果此时 这个登录是别人401之后跳转过来的 你就应该回到那个跳转过来的页面
          // 判断是否有需要跳转的页面 有就跳转 没有就跳转 主页
          const { redirectUrl } = this.$route.query // query是查询参数 也就是?后面的参数表
          this.$router.push(redirectUrl || '/') // 短路表达式
        } catch (error) {
          // 提示消息 提示用户 登录失败
          // this.$notify({ message: '用户名或者验证码错误', duration: 800 })
          this.$wnotify({ message: '用户名或者密码错误' })
          // 这里使用一个自己封装的方法
        }
      }
    }
  }

}
</script>

<style>

</style>
