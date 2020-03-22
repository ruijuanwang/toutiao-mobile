<template>
<!-- 频道编辑组件 -->
  <div class="channel-edit">
      <!-- 1.我的频道  -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <!-- 循环渲染我的频道-->
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <span class="f12">{{ item.name }}</span>
          <!-- 叉号标签应该在 进入编辑状态的时候才显示 在退出编辑状态(也就是在完成状态)的时候不显示 -->
          <!-- 因为第一个永远不显示叉号 因为推荐不能被删除 所以说条件应该加一个 索引不能等于0-->
          <van-icon v-if='index!==0 && editing' class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 2.可选频道 -->
    <!-- 我的频道数据是 当前用户自己的频道(两种情况:1.在登录情况下用户自己的频道 2.匿名情况下用户自己的频道) -->
    <!-- 可选频道 = 全部的频道 - 用户自己的频道   -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <!-- 循环渲染可选频道 -->
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{ item.name }}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels' // 引入获取全部频道接口
export default {
  // props接收频道数据
  // props:['channels'] // 1.字符串数组接收 用户频道数据
  // 2.对象形式 接收 用户频道数据
  props: {
    channels: {
      // 三个配置项: 1.required 必传  2.type 类型  3.default 默认值
      required: true, // 表示必须填channels
      type: Array, // 接收数组类型
      default: () => [] // 默认值 给一个空数组 此函数表示 默认返回一个空数组
    }

  },
  data () {
    return {
      editing: false, // 正在编辑状态 用这个状态来控制 是否显示删除图标
      allChannels: [] // 用来接收所有的频道数据
    }
  },
  methods: {
    async getAllChannels () {
      // 调用获取全部频道接口
      var result = await getAllChannels()
      this.allChannels = result.channels // 将数据赋值到data中
    }
  },
  computed: {
    // 这里用计算属性的原因是: 可选频道是一个动态的结果 全部频道数据(data中的 allChannels) - 用户频道数据(props接收的channels) =>重新计算频道数据 =>计算属性有缓存机制
    optionalChannels () {
      // 计算属性必须要有返回值
      // 可选频道 = 全部频道 - 我的频道
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels() // 调用组件方法=>获取全部频道
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
