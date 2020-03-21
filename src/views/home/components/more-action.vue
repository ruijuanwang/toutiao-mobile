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
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isReport: false
    }
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
