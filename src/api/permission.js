import request from '@/utils/request'

export function findAllPermissions() {
  return request({
    url: '/permission/findAll',
    method: 'get',
  })
}

export function getPermissionsByPid(data) {
  return request({
    url: '/permission/getByPid',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function addPermission(data) {
  return request({
    url: '/permission/add',
    method: 'post',
    data,
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission/update',
    method: 'post',
    data,
  })
}


export function removePermission(data) {
  return request({
    url: '/permission/remove',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}
