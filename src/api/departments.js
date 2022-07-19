import request from '@/utils/request'
/**
 *  获取组织列表
 * @returns
 */
export const getDepartmentsList = () => {
  return request({
    url: '/company/department'
  })
}
/**
 * 根据部门删除id
 * @param {*} id
 * @returns
 */
export const delDepartment = id => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
/**
 * 新增部门
 * @param code 编码
 * @returns
 */
export const addDepartment = ({ code, introduce, manager, name, pid }) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data: { code, introduce, manager, name, pid }
  })
}
/**
 * 编辑部门
 * @param {*} data
 * @returns
 */
export const editDepartment = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
