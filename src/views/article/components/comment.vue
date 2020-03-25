<template>
<!-- 文章评论的组件 -->
  <div class="comment">
      <!-- 列表组件 上拉加载 评论不能是一次性加载完的 -->
      <!-- onLoad 滚动条距离底部超过一定距离 会触发 -->
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
        <!-- 评论列表  -->
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
   <!-- 用户头像 -->
    <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
              <!-- 用户名称 -->
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <!-- 评论内容 -->
          <p>{{ comment.content }}</p>
          <p>
              <!-- 时间  过滤 -->
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <!-- 点击回复标签 弹出面板 传出当前评论的id 而且要处理很多业务 -->
            <van-tag plain @click="openReply(comment.com_id.toString())">{{ comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框  用来输入评论的-->
    <div class="reply-container van-hairline--top">
        <!-- v-model="value" 绑定了评论的内容   不论是 对文章评论还是对评论评论 都是用的一个输入框  输入内容去掉两边的空格 -->
      <van-field v-model.trim="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 要么显示提交 如果点击了提交 首先 先把 提交按钮隐藏 这样做的目的是 防止重复提交 -->
        <!-- 由于点击过快 会连续触发 两次事件 接口是异步的 会造成两次评论 -->
        <span @click="submit" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 放置 评论的回复的组件 弹出面板 用 van-action-sheet上拉组件 包裹 -->
    <!-- v-model 用来控制 弹出面板的显示和关闭 -->
    <!-- 关闭面板时 应该把评论的commintId 设置为空 因为我们要用它来判断 此时是要对文章评论 还是对评论回复 因为他们两个用了同一个 输入框 -->
    <van-action-sheet @close='reply.commentId=null' v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
        <!-- 列表组件 -->
        <!-- :immediate-check 关闭第一次自动加载load的事件 -->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
          <!-- 循环评论回复 列表 -->
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <!-- 头像 -->
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
              <!-- 作者 -->
            <p><span class="name">{{ item.aut_name }}</span></p>
            <!-- 评论的回复内容 -->
            <p>{{ item.content }}</p>
            <!-- 评论时间 过滤器 显示相对时间 -->
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles' // 引入获取评论的接口  和 提交评论的接口
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 存放评论列表的数据
      offset: null, // 偏移量 分页依据 第一页数据的offset为null 第二页数据的offset 是第一页的最后一个id
      showReply: false, // 控制面板的显示 和 关闭 里面是评论的回复
      reply: {
        //   此对象专门放置 面板的加载信息
        loading: false, // 评论的回复 加载的状态
        finished: false, // 评论的回复是否加载完成
        offset: null, // 偏移量 作为评论的回复 分页加载的 时候 查询的依据
        list: [], // 存放评论的回复 数据
        commentId: null // 用来存放评论的id 用这个id来去查询 这个评论的回复评论
      }
    }
  },
  methods: {
    // 提交评论的方法
    async  submit () {
      // 点击提交的时候需要判断 用户有没有登录 如果没有登录 不能评论
      if (this.$store.state.user.token) {
        // 1.有token 说明用户登录了
        // 判断输入框有没有输入内容 没有内容 直接返回
        if (!this.value) return false// 没有内容 直接return
        this.submiting = true // 打开提交状态 表示正在提交中 避免重复多次提交 只有当提交完毕之后 才关闭状态
        // 休眠函数 来控制执行的速度
        await this.$sleep(500)// 强制休眠800毫秒
        try {
          // 提交评论的核心内容
          // 说明有输入的评论内容 需要调用接口
        // 需要 通过this.reply.commentId 来判断当前 接口中target 参数 要传入哪个id
          const result = await commentOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 判断 要传入的是文章id 还是评论的的id
            content: this.value, // 评论的内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 如果是评论的回复 就需要传出文章的id 需要穿该评论属于哪个文章 如果是对文章评论 不传此参数
          })
          // 调用成功之后 添加评论数据 直接添加到我们的 data中的 评论列表数据中
          // 两种状态 1.文章评论 2.评论的回复
          if (this.reply.commentId) {
            // 如果id存在
            // 说明提交的是评论的回复 我们要添加到评论数据中 从前添加
            this.reply.list.unshift(result.new_obj) // 后端会返回一条我们刚刚添加进去的 评论数据对象 new_obj 我们应该添加到数据中
            //  如果是对评论的回复我们应该 找到对应的评论id 将评论id的 回复数 +1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)// 寻找 文章评论中 等于当前 评论id的id
            comment && comment.reply_count++ // 如果找到了 就将恢复数量 +1
          } else {
            // 说明是对文章的评论 我们也应该 从前追加进去
            this.comments.unshift(result.new_obj) // 后端会返回一条我们刚刚添加进去的 评论数据对象 new_obj 我们应该添加到数据中
          }
          // 清空输入框
          this.value = ''
        } catch (error) {
          this.$wnotify({ message: '评论失败' })
        }
        this.submiting = false // 关闭提交状态
      } else {
        try {
          // 2.否则用户没登录
        // 告诉用户 要评论 应该去登录 如果放弃 那就点击取消
          await this.$dialog.confirm({
            message: '如果要评论，请先登录'
          })
          // fullPath 是完整地址 /article?artId=123   path是不带参数的地址 /article
          // 表示用户点击了确定 我们应该 跳到登录页 并且传入当前的地址 当用户登录成功时 直接跳转回当前页
          this.$router.push({
            path: '/login', // 登录页地址
            query: {
              redirectUrl: this.$route.fullPath // 当前页的完整地址 带参数 用于登录成功跳转的
            }
          })
        } catch (error) {
          // 表示点击了取消
        }
      }
    },
    //   点击回复 打开面板的方法
    openReply (commentId) {
      this.showReply = true // 打开评论的回复面板
      //   处理
      this.reply.commentId = commentId // 当前评论的id
      //   在弹出面板的时候 重置数据
      this.reply.list = [] // 清空之前 回复的评论数据
      this.reply.offset = null // 偏移量 为空 因为希望点击弹出 回复面板的时候 是新的数据 从第一页开始
      this.reply.finished = false // 新的数据 finished 应还没加载完
      this.reply.loading = true // 主动打开加载的状态 因为此时没有数据 主动检查
      this.getReply() // 获取评论的回复数据
    },
    // 获取评论的回复 数据
    // 此方法会在第一次时被 openReply方法 调用执行 也会在加载第二页 第三页...时执行
    async getReply () {
      // 调用接口
      const result = await getComments({
        type: 'c', //  c是评论的回复  a是文章的评论
        source: this.reply.commentId, // 评论的id
        offset: this.reply.offset // 偏移量 评论的回复数据的分页依据
      })
      // 得到回复的评论数据 要追加到 this.reply.list 队尾
      this.reply.list.push(...result.results)
      this.reply.loading = false // 关闭上拉加载状态
      // 需要判断最后一条评论的id 是否等于 当前页的最后一条评论 如果相等 表示评论数据加载完了
      this.reply.finished = result.end_id === result.last_id // 判断回复评论数据是否加载完成
      if (!this.reply.finished) {
        //  如果不相等 说明还有下一页数据
        this.reply.offset = result.last_id // 最后一条评论的id 设置给当前偏移量 作为请求下一页数据的分页依据
      }
    },
    //   加载方法 滚动条距离底部距离超过一定的距离时 会触发
    async  onLoad () {
      //   调用获取评论数据接口
      const { artId } = this.$route.query // 解构地址中传来的 文章id
      const result = await getComments({
        type: 'a', // 类型 a是文章评论  c是评论的回复
        source: artId, // 文章id 表示查询谁的评论
        offset: this.offset // 偏移量
      })
      this.comments.push(...result.results) // 评论数据追加到data中的评论列表尾部
      this.loading = false // 应该关闭上拉加载状态
      //   需要判断还有没有下一页评论数据
      //   需要判断最后一条评论的id 是否等于 当前页的最后一条评论 如果相等 表示评论数据加载完了
      //   result.end_id === result.last_id  是一个布尔值   this.finished为true 表示没有下一页数据 false 有下一页数据
      this.finished = result.end_id === result.last_id // 判断评论还有没有可以加载的数据
      if (!this.finished) {
        //   表示 还有评论数据 还没加载完毕
        //  result.last_id 是当前页的最后一个评论的 id
        this.offset = result.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
// 评论的回复 面板样式
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}

</style>
