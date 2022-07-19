import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
// 白名单
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 开启进度效果
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    // 如果有token 再去登录就不能去了
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 当用户手里面有token并且访问的是不是登陆页面 是就请求个人资料
      // 解决BUG 判断是否id存在 如果存在就不在拿取数据
      if (!store.state.user.userInfo.id) {
        store.dispatch('user/getInfo')
      }
      next() // 放行
    }
  } else {
    // 判断是否去的路劲在白名单里面是否存在
    if (whiteList.includes(to.path)) {
      // 如果存在就放行
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach((to, from, next) => {
  // 结束进度效果
  NProgress.done()
})
