import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  // token
  token: getToken(),
  // 个人信息
  userInfo: {}
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  // 清除token
  removeToken (state) {
    state.token = null
    removeToken()
  },
  // 清除个人信息
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setToken(res)
    // 存放时间
    setTime(Date.now())
  },
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    // console.log(res1)
    // console.log(res)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res
  },
  // 点击退出清空removeToken removeUserInfo
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置
    resetRouter()
    // 子模块儿调用action 可以将 commit的第三个参数设置成  root: true
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
