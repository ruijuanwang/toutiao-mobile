<template>
  <!-- 封装一个文章列表组件 实现上拉加载 -->
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 组件可以帮助我们完成上拉加载  但是需要一些变量 -->
  <!-- 这里放置一个div的目的是 形成一个滚动条(style样式) 因为后期要做 阅读记忆 -->
  <!-- 阅读记忆：上次阅读到哪 回来之后还是哪 -->
  <!-- @scroll事件 记录滚动高度  -->
  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <!-- 文章列表 组件 -->
    <!-- van-list组件 如果不干涉 初始化完毕 就会检测 自己距离底部的长度 如果超出了限定 就会执行 load事件 自动把绑定的loading 变成 true -->
    <!-- 下拉刷新组件 包裹 列表组件 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list v-model="upLoading" :finished="finished" finished-text="没有了哦" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <!-- 循环单元格 -->
          <!-- item.art_id 是一个大数字对象 v—for的key需要用字符串或者数字代理 -->
          <!-- van-cell 组件有个 to 属性 同router-link 中的 to=>我们应该点击文章时跳转到 文章详情页 并且携带当前的 文章id -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置元素 文章列表的循环项 无图 单图 三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
            <!-- 根据当前的封面类型type决定显示单图 三图 或无图 -->
              <!-- 三图图片 -->
              <!-- 图片组件是vant组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
              <!-- lazy-load 表示开启懒加载但 必须配合 Lazyload 组件使用 该图片组件会进行懒加载 也就是只有当前屏幕出现的时候 才去加载对应的图片 -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图模式  单图模式暂时隐藏-->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" src="item.cover.images[0]" />
              </div>

              <!-- 作者信息 -->
              <div class="info_box">
                <!-- 作者  -->
                <span>{{item.aut_name}}</span>
                <!-- 评论 -->
                <span>{{item.comm_count}}</span>
                <!-- 时间 -->
                <span>{{item.pubdate | relTime}}</span>
                <!-- 关闭按钮 -->
                <!-- 此叉号显示 应该根据当前的登录状态来判断 如果登录了 就显示 没登录 不显示 -->
                <!-- 1.原始方式 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
                <!--2. 辅助函数的形式 -->
                <!-- 给叉号注册点击事件 触发自定义事件 子父传值 -->
                  <!-- @事件名="逻辑处理" 点击事件中触发一个 显示反馈的事件  并且传入当前被点击的文章id-->
                  <!-- stop 阻止冒泡 因为父组件 点击文章会跳转页面 -->
                <span @click.stop="$emit('showAction',item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { MyArticles } from '@/api/articles' // 获取文章列表方法
import { mapState } from 'vuex'
import eventbus from '@/utils/eventbus' // 公共事件处理器
export default {
  // 初始化函数
  created () {
    // 监听广播的事件 有多少个article-list实例 就监听多少次
    //  delArticle=> 假设有4个实例 就对应4个函数
    eventbus.$on('delArticle', (artId, channelId) => {
      // 这个位置 每个组件实例都会被触发
      // 这里要判断一下 传递过来的频道 是否等于 自生的频道
      if (channelId === this.channel_id) {
        // 说明当前的这个article-list实例 就是我们要去删除数据的实例
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        // 通过id查询对应文章数据所在的下标
        if (index > -1) {
          // 索引从0开始 所以应该大于-1
          this.articles.splice(index, 1) // 删除对应的下标
        }
        // 但是如果一直删除 就会将列表数据都删光 因为没有了滚动条 他不会自动触发load事件  所有我们应该手动触发事件 请求来新的数据
        if (this.articles.length === 0) {
          // 说明把数据删光了
          this.onLoad() // 手动触发onload事件 给页面加载数据
        }
      }
    })
    // 监听广播
    eventbus.$on('changeTab', (id) => {
      // 传入的id 就是当前激活的id
      // 要判断 当前文章列表 接收的id 是否等于此id 如果相等 表示 该文章列表实例 就是需要去滚动的 实例
      // 一个tab页下一个 article-list 实例
      if (id === this.channel_id) {
        // 为什么这里没有实现效果 因为tab页切换事件 执行之后 article-list组件渲染 是异步的 没有办法 立刻得出渲染结果
        // 如果相等 表示要执行 此 滚动条
        // 此时得不到 this.$refs.myScroll
        // 怎么才能保证 执行 该代码 已经完成了上一次的渲染
        // this.$nextTick() 因为vue是异步渲染 如果想要等到上一次结果 渲染完成 可以在 this.$nextTick中处理
        this.$nextTick(() => {
          // 此时可以保证 之前的上一次的异步渲染已经完成
          if (this.scrollTop && this.$refs.myScroll) {
            // 当滚动条距离不为0 并且滚动dom元素 存在的情况下 才去滚动
            this.$refs.myScroll.scrollTop = this.scrollTop // 滚动到固定位置
          }
        })
      }
    })
  },
  computed: {
    ...mapState(['user']) // 将user对象映射到计算属性中
  },
  // props:['channel_id'] //1. 数字符串组 接收方式
  // props 2.对象形式 可以约束传入的值 必填 传值类型
  props: {
    // key(props属性):value(对象 配置)
    channel_id: {
      required: true, // 必填项 此属性的含义是true 要求该props必须传
      type: Number, // 表示要传入的props属性的类型
      default: null // 表示默认值 假如没有传props属性 默认值 就会被采用
    }
  },
  data () {
    return {
      successText: '', // 上拉刷新文案
      downLoading: false, // 下拉刷新
      upLoading: false, // 表示是否开启上拉加载 默认 false
      finished: false, // 表示是否已经完成 所有数据的加载
      articles: [], // 文章列表内容
      timestamp: null, // 定义时间戳属性 用来存储 后端返回的历史时间戳
      scrollTop: 0 // 定义滚动的位置
    }
  },
  methods: {
    // 1.上拉加载
    async onLoad () {
      console.log('开始请求文章列表数据')
      // 如果加载状态 检测机制 高度不够 还是会自动执行 load事件 开启上拉加载
      // 如果有数据 应该把数据加载到 list 中
      // 要想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示数据 已经全部加载完毕 没有数据了
      // }, 1000) // 等待1秒 然后关闭 加载状态
      // --------------------------------------------------------------------------------- 上拉加载 模拟数据
      // 如果你的数据已经加载完毕 应该把finished 设置为true 表示一切已经结束了 不在请求
      // 此时判断 如果条数大于50 说明数据加载完毕
      // vant-list组件 第一次加载 需要让list组件 出现滚动条 如果没有滚动条 就没办法继续往下拉
      // if (this.articles.length > 50) {
      //   // 如果此时数据已经大于50条
      //   this.finished = true // 关闭加载 onload就不会再自动触发执行
      // } else {
      //   // 1-60 ==>this.articles.length + index + 1
      //   var arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据 而是追加到数组队尾
      //   this.articles.push(...arr)
      //   // 添加完成之后 需要手动关闭loading
      //   this.upLoading = false
      // }
      // ----------------------------------------------------------------------------------------上拉加载 真实数据
      // await 强制等待this.$sleep() 加载完毕 才执行下面的代码
      await this.$sleep() // 人为的控制了请求的事件
      // this.timestamp || Date.now() 表示 如果有历史时间戳 就传入历史时间戳 否则用当前的时间戳
      var result = await MyArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // this.channel_id 是当前的频道id
      //  获取内容

      this.articles.push(...result.results) // 用... 把数据追加到队尾
      this.upLoading = false // 数据获取回来 关闭加载状态
      // 赋值历史时间戳的时候先 判断历史事件戳 是否为0
      // 如果为0 说明已经没有数据了 数据都已加载完毕 应该宣布结束 finished为true
      if (result.pre_timestamp) {
        // 如果有历史时间戳 表示还有数据可以继续进行加载
        this.timestamp = result.pre_timestamp // 把历史时间戳赋值给data中的变量
      } else {
        // 没有数据可以请求了
        this.finished = true
      }
    },
    // 2.下拉刷新
    async onRefresh () {
      // ----------------------------------------------------------------------------------下拉刷新 模拟数据
      // setTimeout(() => {
      //   // 下拉刷新 表示要读取最新的数据 而且最新的数据要添加到数据头部
      //   var arr = Array.from(Array(2), (value, index) => `追加${index + 1}`)
      //   // 数组添加到头部
      //   this.articles.shift(...arr)
      //   // 手动关闭正在刷新的状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据` // 刷新完毕提示文案
      // }, 1000)
      // ----------------------------------------------------------------------------------下拉刷新 真实数据
      // await 强制等待this.$sleep() 加载完毕 才执行下面的代码
      await this.$sleep() // 人为的控制了请求的事件
      // 下拉刷新时间戳永远是最新的
      const result = await MyArticles({ timestamp: Date.now(), channel_id: this.channel_id })
      // 数据请求成功 手动关闭下拉刷新的状态
      this.downLoading = false // 下拉刷新数据已经加载完毕
      // 需要判断 最新的时间戳能否请求回来数据 如果能请求回来 把新数据替换旧数据 如果不能 提示用户 没有新的数据了
      if (result.results.length) {
        // 如果有返回值
        //  直接将整个articles替换 而不是追加
        this.articles = result.results // 历史数据全部被覆盖
        // 此时 已经将之前的数据全部覆盖了 假如 你之前把数据拉到了低端 也就意味着 之前的finished 已经是true了
        // 判断有无历史时间戳
        if (result.pre_timestamp) {
          // 因为下拉刷新 换来了新的数据 里面又有时间戳
          this.finished = false // 重新唤醒列表的上拉加载
          this.timestamp = result.pre_timestamp // 把历史时间戳赋值给当前数据
        }
        this.successText = `更新了${result.results.length}条数据`
      } else {
        // 如果没有换来最新的数据
        this.successText = '当前已是最新了'
      }
    },
    // 记录滚动事件的方法
    remember (event) {
    //  防抖 只执行一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 500毫秒后触发该函数
        this.scrollTop = event.target.scrollTop // 记录滚动的位置
      }, 500)
    }
  },
  //  激活  一个组件 从 睡眠 状态 到 被唤醒
  // activated  (钩子函数) 只会在 keep-alive包裹的情况下执行
  activated () {
    // console.log('唤醒')
    // 可以在激活函数中 去判读 当前是否 scrollTop 发生了变化
    if (this.$refs.myScroll && this.scrollTop) {
      // 判断滚动值是否大于0 有没有dom元素
      // 将div滚动到原来的位置
      this.$refs.myScroll.scrollTop = this.scrollTop // 将记录的位置 滚动到 对应位置
    }
  }

}
</script>

<style lang='less' scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
