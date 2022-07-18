import request from '@/utils/request'

export function listSaler() {
  return request({
    url: '/saler/list',
    method: 'post',
  })
}

export function getSaler(data) {
  return request({
    url: '/saler/get',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}
