import request from '@/utils/request'

export function findAllRoles() {
  return request({
    url: '/role/findAll',
    method: 'get',
  })
}

export function getPermission(data) {
  return request({
    url: '/role/getPermission',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data,
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data,
  })
}

export function removeRole(data) {
  return request({
    url: '/role/remove',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function getRolesByAccountId(data) {
  return request({
    url: '/role/getByAccountId',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function saveAccountRoles(data) {
  return request({
    url: '/role/saveAccountRoles',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}
