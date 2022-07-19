import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

const Timekey = 'hm_time_key'
// 存时间
export function setTime (time) {
  return Cookies.set(Timekey, time)
}
// 取时间
export function getTime (time) {
  return Cookies.get(Timekey)
}
