import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门放置需要共享的状态
    // user对象有两个属性 { token:'', refresh_token:''} //现在还没有设置 预设
    user: auth.getUser() // 就是我们的token信息的对象 如果要做持久化 如果缓存有token 读取缓存的token
  },
  // 要修改token 就是state中的数据 就要通过 mutations
  mutations: {
    // 修改token 的方法
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷对象中的user数据给state
      // 更新vuex的时候 也应该将 最新的数据 存入 本地缓存
      auth.setUser(payload.user) // 相当于 保持 vuex 和 本地存储的同步
    },
    // 删除token 的方法
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空对象
      auth.delUser() // 删除本地缓存中的token 实现同步
    }

  },
  actions: {
  },
  modules: {
  }
})
