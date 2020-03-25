<template>
  <!-- 编辑资料组件 -->
 <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <!-- 用户头像 -->
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <!-- 用户昵称 点击用户昵称 弹出层 双向绑定-->
      <van-cell @click="showName=true" is-link title="名称" :value="user.name" />
      <!-- 性别 -->
      <van-cell @click="showGender=true" is-link title="性别" :value="user.gender === 0 ? '男':'女'"/>
      <!-- 生日 -->
      <van-cell @click="showDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 弹层组件 -->
    <!-- 1.用户头像 弹层 -->
    <!-- a.本地照片  b.拍照 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <van-cell is-link title="本地照片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 2.用户昵称 弹层  禁用点击遮罩自动关闭弹层-->
    <van-popup v-model="showName" :close-on-click-overlay='false' style="width:80%">
      <!-- 编辑用户的昵称 双向绑定 去除空格 -->
       <van-field v-model.trim="user.name" :error-message="nameMsg" type="textarea" rows='4' placeholder="请输入昵称" />
       <!-- 放置一个按钮 用来控制弹层的关闭 -->
       <van-button @click="btnName" size="normal" type="info" block>确定</van-button>
    </van-popup>
    <!-- 3.用户性别 弹层 -->
    <!-- 使用上拉菜单组件 actions绑定一个数组-->
    <!-- select 方法 选中选项时触发 -->
    <van-action-sheet @select="selectItem" v-model="showGender" :actions="actions" cancel-text="取消"/>
    <!-- 4.用户生日 弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date='maxDate'
      @cancel="showBirthDay=false"
      @confirm="confirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs' // 引入dayjs插件
import { getUserProfile } from '@/api/user' // 引入获取个人资料的方法
export default {
  data () {
    return {
      showPhoto: false, // 控制头像弹层 的显示关闭
      showName: false, // 控制昵称弹层 的显示关闭
      showGender: false, // 控制性别弹层 的显示和关闭
      actions: [{ name: '男' }, { name: '女' }], // 绑定性别弹层 的选项
      showBirthDay: false, // 控制出生日期弹层 的显示和关闭
      minDate: new Date(1900, 1, 1), // 选择最小日期 生日组件
      maxDate: new Date(), // 选择最大日期  当前时间
      currentDate: new Date(), // 当前弹出层 显示的事件
      user: {
        name: '', // 用户昵称 双向绑定
        gender: 1, // 性别 0男  1女
        birthday: '', // 出生日期
        photo: '' // 用户头像
      },
      nameMsg: '' // 昵称的提示信息
    }
  },
  methods: {
    // 关闭昵称弹层事件
    btnName () {
    // 判断 输入内容 1-7位
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 说明长度不够
        this.nameMsg = '昵称的长度应为1-7位' // 提示消息
        return false // 直接return
      }
      // 说明满足要求
      this.nameMsg = '' // 错误提示消息置为空
      this.showName = false // 关闭弹层
    },
    // 选择性别时触发 该方法
    selectItem (item, index) {
      // 有两个参数 item 每一项 index 索引 通过index就可以知道点击是男是女
      this.user.gender = index // 索引赋值到当前数据中 0是男 1是女
      this.showGender = false // 关闭性别弹层
    },
    // 显示生日日期弹层
    showDate () {
      this.showBirthDay = true // 显示日期弹层
      // 将当前的生日 设置到 选择日期的当前时间 将生日字符串current 装化成 Date对象 绑定到日期组件上 (日期组件的类型是Date)
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日日期时触发
    confirmDate () {
      // 当前选择的生日就是 currentDate
      // 要把选择的 Date格式的新日期 设置到 data数据中 user.birthday(字符串格式) 中
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将Date类型转化 字符串
      this.showBirthDay = false // 关闭弹层
    },
    // 获取用户个人资料
    async getUserProfile () {
      this.user = await getUserProfile()
    }
  },
  created () {
    this.getUserProfile() // 获取用户个人资料
  }

}
</script>

<style>

</style>
