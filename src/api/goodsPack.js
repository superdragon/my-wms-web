import request from '@/utils/request'

export function findGoodsPack() {
  return request({
    url: '/goodsPack/find',
    method: 'post',
    requestMethod: 'form',
  })
}

export function updateGoodsPack(data) {
  return request({
    url: '/goodsPack/update',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function saveGoodsPack(data) {
  return request({
    url: '/goodsPack/save',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

