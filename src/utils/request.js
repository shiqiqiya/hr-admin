import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime()
    // 判断token是不是有2个小时
    // 如果有就需要重新登录
    if (time > 7200000) {
      // 退出到登录页面
      store.dispatch('user/logout')
      router.push('/login')
    }

    config.headers['Authorization'] = 'Bearer ' + token
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
request.interceptors.response.use(function (response) {
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 判断error.response是否存在error.response.data是否存在
  // error.response.data.code === 10002 是否等于 10002
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 退出到登录页面
    store.dispatch('user/logout')
    router.push('/login')
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
