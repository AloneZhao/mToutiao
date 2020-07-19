import Vue from 'vue'
import Vuex from 'vuex'

import {
  GetItem,
  SetItem
} from '@/utils/storage'

Vue.use(Vuex)


// 防止获取与存储的时名字不一致的问题
const USER_KEY = "TOUTIAO_USER"

export default new Vuex.Store({
  state: {
    /**
     * 获取用户登陆成功后的状态信息
     *   ==> 1. 当用户登陆成功后返回的token存到本地中
     *       2. 这里从本地中获取到vuex中供全局使用
     */
    user: GetItem(USER_KEY) || ""
  },
  mutations: {
    // 改变 state 中 user 的值
    setUser(state, data) {
      state.user = data

      // vuex中刷新页面数据将会丢失  所以要存到本地中持久化保存
      SetItem(USER_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
