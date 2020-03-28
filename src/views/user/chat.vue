<template>
  <!-- 小智同学 -->
 <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <!-- 把list消息循环渲染到视图上 -->
      <!-- 小智同学说的话在左边 我说的话在右边 -->
      <!-- name : xz =>小智 左边 name !=xz =>我 =>右边 -->
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <!-- 小智同学 头像-->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <!-- 聊天内容 -->
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 我的头像 -->
        <van-image v-if="item.name!=='xz'"  fit="cover" round :src="photo" />

      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <!-- trim 修饰符去除两边空格 -->
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
 </div>
</template>

<script>
import Vue from 'vue'
import XZImg from '@/assets/xz.jpg' // 引入小智头像
import { mapState } from 'vuex' // 用户头像
import io from 'socket.io-client'// 引入socke.io的客户端
export default {
  data () {
    return {
      value: '', // 绑定输入框内容
      loading: false, // 加载状态
      XZImg, // 小智头像
      list: [] // 存放 小智和我的聊天记录
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 映射vuex中的公共变量 到计算属性中 (用户头像 )
  },
  // 初始化钩子函数
  created () {
    // 建立与服务器的连接
    // new WebSocket (原生)
    // io 需要穿参数 接口规定
    // 初始化WebSocket连接
    // 这里的this.socket 接收的目的是 在其他方法 依然可以 用this.socket 获取对象实例
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token // vuex中的token
      }
    })
    // 如果连接成功 ws.onopen(原生)
    this.socket.on('connect', () => {
      // 此时执行connect事件 表示 已经和服务器 打通了电话
      // 模拟一条数据 让用户看到 服务器和用户说话了 表示和服务器连接成功
      this.list.push({ msg: 'hello,胤娟小可爱', name: 'xz' })// 加name的原因 是想区分 这句话是谁说的
    })
    // 在此监听回复的消息  接收和发送的类型均为 message 接口规定
    this.socket.on('message', data => {
      // data就是 客户服务器 回复的消息 接收的消息都是小智回复的
      this.list.push({ ...data, name: 'xz' }) // 追加聊天记录
      this.scrollBottom() // 收到消息后 调用滚动条方法
    })
  },
  methods: {
    // 滚动条滚动到最底部
    scrollBottom () {
      // vuejs 数据变化=> 异步的 => 视图更新
      // vuejs 内部的渲染 是异步的 不是同步的
      // 我们需要等到 异步更新 完毕之后 才去执行滚动
      // this.$nextTick 次函数 会在上一次数据 更新 并且完成 页面渲染之后执行
      // 第1种方式 组件实例方式
      // this.$nextTick(() => {
      //   // 在这个回调函数中 上一次的数据 更新结果 已经 反映到了视图上 视图已经更新了
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      //   // 此时表示 滚动条滚动的时候 视图上数据已经是最新的了
      // })
      // 第2种方式 全局对象的方式 也表示上一次数据更新 完成页面渲染之后执行该函数
      Vue.nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 将滚动条滚动到最底部
      })
    },
    // 发送消息
    async send () {
      // 调用websocket 发出一个消息
      // 发消息前 要判断 有没输入内容
      if (!this.value) return false //  如果为空 就return
      // 说明不为空 有内容 打开状态 发送消息
      this.loading = true // 打开发送状态 防止多次重复提交发送
      await this.$sleep(500) // 休眠函数
      // 使用websocket发送消息
      // 使用 socket.emit('消息类型',消息内容)
      const obj = {
        msg: this.value, // 我要发送的内容
        timestamp: Date.now() // 时间戳 表示是从当前时间发送的
      }
      this.socket.emit('message', obj) // 发送消息 obj里面的内容是接口规定
      this.list.push(obj) // 将发出的消息追加到聊天列表中
      // 发完消息之后
      this.value = '' // 清空输入框
      this.loading = false// 关闭状态
      this.scrollBottom() // 发消息后 调用滚动条方法
    }
  },
  // 钩子函数  组件实例销毁前
  beforeDestroy () {
    // 需要在实例销毁前 把websocket 连接给关掉
    // ws.close() 原生   socket.io = > close
    this.socket.close() // 关闭连接
  }

}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
