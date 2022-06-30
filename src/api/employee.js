import request from '@/utils/request'

export function addEmp(data) {
  return request({
    url: '/emp/add',
    method: 'post',
    data,
  })
}

export function updateEmp(data) {
  return request({
    url: '/emp/update',
    method: 'post',
    data,
  })
}

export function pageEmp(data) {
  return request({
    url: '/emp/page',
    method: 'post',
    data,
  })
}

export function listEmp(data) {
  return request({
    url: '/emp/list',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

