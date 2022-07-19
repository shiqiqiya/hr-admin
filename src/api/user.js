import request from '@/utils/request'
/**
 * 登录接口
 */
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
/**
 * 获取个人资料
 * @returns
 */
export function getInfo () {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 *  获取用户的基本信息  现在写它 完全是为了显示头像
 * @param {*} id
 * @returns
 */
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
/**
 * 退出
 * @returns
 */
export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
// 获取简单列表
export const getSimpleUserList = () => {
  return request({
    url: '/sys/user/simple'
  })
}
