import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: []
}
// 只能写同步
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}
// 同步异步都可以
const actions = {
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    // 静态+动态路由汇总
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
    return newRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
