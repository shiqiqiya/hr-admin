import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {当前页,每页数量} param0
 * @returns
 */
export const getRoleList = ({ page, pagesize }) => {
  return request({
    url: '/sys/role',
    params: { page, pagesize }
  })
}
