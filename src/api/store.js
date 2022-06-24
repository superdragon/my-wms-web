import request from '@/utils/request'

export function addStore(data) {
  return request({
    url: '/store/add',
    method: 'post',
    data,
  })
}

export function updateStore(data) {
  return request({
    url: '/store/update',
    method: 'post',
    data,
  })
}

export function pageStore(data) {
  return request({
    url: '/store/page',
    method: 'post',
    data,
  })
}

export function listStore(data) {
  return request({
    url: '/store/list',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function getStore(data) {
  return request({
    url: '/store/get',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

