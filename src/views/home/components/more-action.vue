<template>
<!-- 弹层中 反馈内容组件 -->
<!-- 外层元素 -->
  <div class="more-action">
      <!-- 单元格组 1 -->
      <!-- v-if 前面满足 前面显示==>前面不满足 后面显示 v-else -->
    <van-cell-group v-if="!isReport">
        <!-- 不感兴趣注册事件 触发事件 子传父 去调用不感兴趣接口 -->
        <!-- 点击事件 实际上是调用父组件的方法 来触发接口 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <!-- 单元格组 2 -->
    <van-cell-group v-else>
        <!-- 举报文章 注册举报项的点击事件 并且传入举报类型对应的value -->
      <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value" icon="arrow-left">{{ item.label }}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants' // 引入常量变量
import eventbus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false, // 是否举报的意思
      reports // 常量数组 相当于定义了一个reports变量 初始值来源于 constants中的reports变量
    }
  },
  //   初始化函数
  created () {
    //   一初始化就要开始监听
    eventbus.$on('delArticle', () => {
      this.isReport = false // 只要一删除举报文章 就把弹层中的反馈组件重置为初始状态
    })
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
